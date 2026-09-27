// Automated Delivery Engine for WhatsApp & Email Receipts
import { supabase } from './supabaseClient'

/**
 * Replace placeholders like {name}, {orderId}, {amount}, {productName}, {driveLink}
 */
export function interpolate(template, data) {
  if (!template || typeof template !== 'string') return ''
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match
  })
}

/**
 * Clean phone number to standard international format (e.g. 919876543210)
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return ''
  let cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1)
  }
  // If 10 digits (standard Indian mobile), prepend 91
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`
  }
  return cleaned
}

/**
 * Send automated WhatsApp delivery via Green API, UltraMsg, or Webhook
 */
export async function sendWhatsAppDelivery(orderData, waConfig) {
  if (!waConfig || !waConfig.enabled) {
    return { success: false, reason: 'disabled', message: 'WhatsApp automation is turned off' }
  }

  const phone = cleanPhoneNumber(orderData.whatsapp || orderData.phone)
  if (!phone || phone.length < 10) {
    return { success: false, reason: 'invalid_phone', message: 'Invalid phone number' }
  }

  const messageText = interpolate(
    waConfig.messageTemplate ||
      `Hi {name}! 🎉 Welcome to SAN SHIFT VIP Vault!\n\nThank you for purchasing *{productName}*.\n\n📦 Order ID: {orderId}\n💰 Amount Paid: ₹{amount}\n\n🚀 *YOUR VIP GOOGLE DRIVE ACCESS LINK:*\n{driveLink}\n\n⭐ Please bookmark or add shortcut to your Google Drive for lifetime access.\n\nNeed any help? Just reply to this message anytime!`,
    {
      name: orderData.customerName || orderData.name || 'Valued Creator',
      orderId: orderData.orderId,
      amount: orderData.amount,
      productName: orderData.product || orderData.productName || "World's Biggest Editing Bundle",
      driveLink: orderData.driveLink,
    }
  )

  // 1. GREEN API
  if (waConfig.provider === 'green-api') {
    const { instanceId, apiToken } = waConfig
    if (!instanceId || !apiToken) {
      return { success: false, reason: 'unconfigured', message: 'Green API Instance ID and Token are required' }
    }

    try {
      const url = `https://api.green-api.com/waInstance${instanceId.trim()}/sendMessage/${apiToken.trim()}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${phone}@c.us`,
          message: messageText,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.idMessage) {
        return { success: true, provider: 'green-api', messageId: data.idMessage }
      }
      const quotaExceeded =
        data?.correspondentsStatus?.status === 'CORRESPONDENTS_QUOTE_EXCEEDED' ||
        data?.description?.includes('Monthly quota has been exceeded')
      return {
        success: false,
        reason: quotaExceeded ? 'quota_exceeded' : 'api_error',
        message: quotaExceeded
          ? 'Green API free sandbox limit reached (max 3 numbers). Upgrade tariff for unlimited bot delivery.'
          : data?.message || data?.description || 'Green API request failed',
      }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  // 2. ULTRAMSG
  if (waConfig.provider === 'ultramsg') {
    const { instanceId, apiToken } = waConfig
    if (!instanceId || !apiToken) {
      return { success: false, reason: 'unconfigured', message: 'UltraMsg Instance ID and Token are required' }
    }

    try {
      const url = `https://api.ultramsg.com/${instanceId.trim()}/messages/chat`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: apiToken.trim(),
          to: phone,
          body: messageText,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && (data?.sent === 'true' || data?.sent === true)) {
        return { success: true, provider: 'ultramsg', messageId: data?.id }
      }
      return { success: false, reason: 'api_error', message: data?.error || 'UltraMsg request failed' }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  // 3. META WHATSAPP CLOUD API (Official Free Tier - 1,000 free conversations/month)
  if (waConfig.provider === 'meta' || waConfig.provider === 'cloud-api') {
    const { instanceId: phoneNumberId, apiToken } = waConfig
    if (!phoneNumberId || !apiToken) {
      return { success: false, reason: 'unconfigured', message: 'Meta Phone Number ID and Access Token are required' }
    }

    try {
      const url = `https://graph.facebook.com/v19.0/${phoneNumberId.trim()}/messages`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { preview_url: true, body: messageText },
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.messages?.[0]?.id) {
        return { success: true, provider: 'meta', messageId: data.messages[0].id }
      }
      return { success: false, reason: 'api_error', message: data?.error?.message || 'Meta WhatsApp API request failed' }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  // 4. CUSTOM WEBHOOK (Zapier, Make, n8n, Pabbly)
  if (waConfig.provider === 'webhook') {
    if (!waConfig.apiToken) {
      return { success: false, reason: 'unconfigured', message: 'Webhook URL is required' }
    }

    try {
      const res = await fetch(waConfig.apiToken.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whatsapp_delivery',
          phone,
          message: messageText,
          order: orderData,
        }),
      })

      if (res.ok) {
        return { success: true, provider: 'webhook' }
      }
      return { success: false, reason: 'webhook_failed', message: `Webhook responded with status ${res.status}` }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  return { success: false, reason: 'unknown_provider', message: 'Unknown provider' }
}

/**
 * Universal VIP Text Message Formatter
 */
export function buildVipTextMessage(orderData, customDriveLink) {
  const phone = cleanPhoneNumber(orderData?.whatsapp || orderData?.phone)
  const name = orderData?.customerName || orderData?.name || 'Valued Creator'
  const product = orderData?.product || orderData?.productName || "World's Biggest Editing Bundle"
  const amount = orderData?.amount || 99
  const orderId = orderData?.orderId || `SS-${Date.now().toString().slice(-6)}`
  const drive =
    customDriveLink ||
    orderData?.driveLink ||
    'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc'

  return (
    `🎉 *SAN SHIFT VIP VAULT UNLOCKED!*\n\n` +
    `Hi *${name}*! Your payment of *₹${amount}* for *${product}* is verified! ✓\n\n` +
    `📦 *Order ID:* ${orderId}\n` +
    `💰 *Amount Paid:* ₹${amount}\n` +
    `👤 *Customer Name:* ${name}\n` +
    (phone ? `📱 *WhatsApp:* +${phone}\n\n` : `\n`) +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🚀 *YOUR VIP GOOGLE DRIVE ACCESS LINK:*\n` +
    `${drive}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⭐ *How to use:* Click the link above to instantly access all 55M+ assets. Bookmark or click "Add shortcut to Drive" for lifetime updates!\n\n` +
    `💬 Need help? Official Founder Support: +91 73394 67830`
  )
}

/**
 * Universal WhatsApp Link Generator (for sending TO a specific number)
 */
export function buildWhatsAppDeliveryUrl(orderData, customDriveLink) {
  const phone = cleanPhoneNumber(orderData?.whatsapp || orderData?.phone)
  const targetPhone = phone.length >= 10 ? phone : '917339467830'
  const message = buildVipTextMessage(orderData, customDriveLink)
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Universal WhatsApp Share Web URL (no phone number - opens "Message Yourself" or contact picker)
 */
export function buildWhatsAppShareUrl(orderData, customDriveLink) {
  const message = buildVipTextMessage(orderData, customDriveLink)
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
}

/**
 * Native Mobile WhatsApp Deep Link (bypasses popup blocker on iOS/Android)
 */
export function buildWhatsAppNativeUrl(orderData, customDriveLink) {
  const message = buildVipTextMessage(orderData, customDriveLink)
  return `whatsapp://send?text=${encodeURIComponent(message)}`
}

/**
 * Generate branded luxury HTML Email Receipt & Access Pass
 */
export function generateReceiptHtml(orderData) {
  const name = orderData.customerName || orderData.name || 'Valued Creator'
  const productName = orderData.product || orderData.productName || "World's Biggest Editing Bundle"
  const amount = orderData.amount || 99
  const orderId = orderData.orderId || `SS-${Date.now().toString().slice(-6)}`
  const driveLink = orderData.driveLink || 'https://drive.google.com/drive/folders/161lWIW0ad2LmYchO6M0yBri52UiUJZdc'
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>VIP Access Pass - SAN SHIFT</title>
</head>
<body style="margin:0;padding:0;background-color:#070a13;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#070a13;padding:30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;background-color:#0c101c;border:1px solid rgba(255,255,255,0.12);border-radius:24px;overflow:hidden;box-shadow:0 30px 90px rgba(0,56,255,0.35);">
          <!-- Header Bar -->
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg, #0038FF 0%, #001f8f 100%);text-align:center;">
              <div style="font-size:22px;font-weight:900;letter-spacing:4px;color:#ffffff;text-transform:uppercase;">
                SAN SHIFT
              </div>
              <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-top:4px;">
                Shift The Standard // VIP Access Pass
              </div>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding:32px 32px 16px 32px;text-align:left;">
              <div style="display:inline-block;padding:4px 12px;background-color:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:20px;font-size:11px;font-weight:bold;color:#10b981;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
                ✓ Payment Verified & Lifetime Access Granted
              </div>
              <h1 style="margin:0 0 10px 0;font-size:24px;font-weight:900;color:#ffffff;line-height:1.2;">
                Welcome to the Vault, ${name}! 🎉
              </h1>
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">
                Thank you for purchasing <strong>${productName}</strong>. Your unrestricted lifetime VIP access to all 55 Million+ assets is active and ready below.
              </p>
            </td>
          </tr>

          <!-- VIP Action Button -->
          <tr>
            <td style="padding:16px 32px 28px 32px;text-align:center;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;width:100%;">
                <tr>
                  <td align="center" style="border-radius:100px;background:linear-gradient(135deg, #0038FF 0%, #0022a1 100%);box-shadow:0 12px 30px rgba(0,56,255,0.4);">
                    <a href="${driveLink}" target="_blank" rel="noopener noreferrer" style="display:block;padding:18px 28px;font-size:14px;font-weight:900;color:#ffffff;text-decoration:none;text-transform:uppercase;letter-spacing:1.5px;border-radius:100px;">
                      🚀 Open Google Drive Bundle (55M+ Assets) →
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,0.4);">
                ⭐ Tip: Click the star icon or "Add shortcut to Drive" in Google Drive to keep it saved permanently.
              </div>
            </td>
          </tr>

          <!-- Official Receipt Details Table -->
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <table role="presentation" width="100%" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;font-size:12px;color:rgba(255,255,255,0.8);">
                <tr>
                  <td style="padding:6px 0;color:rgba(255,255,255,0.45);text-transform:uppercase;font-size:10px;font-weight:700;">Order ID</td>
                  <td align="right" style="padding:6px 0;font-weight:bold;color:#00e5ff;font-family:monospace;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(255,255,255,0.45);text-transform:uppercase;font-size:10px;font-weight:700;">Date</td>
                  <td align="right" style="padding:6px 0;color:#ffffff;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(255,255,255,0.45);text-transform:uppercase;font-size:10px;font-weight:700;">Item</td>
                  <td align="right" style="padding:6px 0;color:#ffffff;font-weight:bold;">${productName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(255,255,255,0.45);text-transform:uppercase;font-size:10px;font-weight:700;">Access License</td>
                  <td align="right" style="padding:6px 0;color:#10b981;font-weight:bold;">Unlimited Lifetime Access</td>
                </tr>
                <tr style="border-top:1px solid rgba(255,255,255,0.1);">
                  <td style="padding:12px 0 0 0;font-weight:bold;color:#ffffff;font-size:13px;">Total Paid</td>
                  <td align="right" style="padding:12px 0 0 0;font-weight:900;color:#0038FF;font-size:18px;">₹${amount}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support & Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:rgba(0,0,0,0.4);border-top:1px solid rgba(255,255,255,0.06);text-align:center;font-size:11px;color:rgba(255,255,255,0.45);">
              <div style="margin-bottom:8px;">
                Need help or have questions? Chat with our team:
              </div>
              <div>
                <a href="https://wa.me/917339467830" target="_blank" style="color:#10b981;text-decoration:none;font-weight:bold;margin:0 8px;">📲 WhatsApp Support (+91 73394 67830)</a>
                <span style="color:rgba(255,255,255,0.2);">•</span>
                <a href="mailto:hello.sanshift@gmail.com" style="color:#00e5ff;text-decoration:none;font-weight:bold;margin:0 8px;">✉️ hello.sanshift@gmail.com</a>
              </div>
              <div style="margin-top:16px;color:rgba(255,255,255,0.25);font-size:10px;">
                © ${new Date().getFullYear()} SAN SHIFT. All rights reserved. Shift The Standard.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Send automated Email receipt via Resend or Webhook
 */
export async function sendEmailReceipt(orderData, emailConfig) {
  if (!emailConfig || !emailConfig.enabled) {
    return { success: false, reason: 'disabled', message: 'Email automation is turned off' }
  }

  const recipientEmail = orderData.email
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { success: false, reason: 'invalid_email', message: 'Invalid recipient email' }
  }

  const htmlContent = generateReceiptHtml(orderData)
  const subject = interpolate(
    emailConfig.subject || '🎉 Your VIP Access Pass & Official Receipt — {productName}',
    {
      productName: orderData.product || orderData.productName || "World's Biggest Editing Bundle",
      orderId: orderData.orderId,
    }
  )

  // 1. RESEND API
  if (emailConfig.provider === 'resend') {
    const apiKey = emailConfig.apiKey?.trim()
    if (!apiKey) {
      return { success: false, reason: 'unconfigured', message: 'Resend API key is required' }
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailConfig.fromEmail?.trim() || 'SAN SHIFT <orders@sanshift.com>',
          to: [recipientEmail],
          subject,
          html: htmlContent,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.id) {
        return { success: true, provider: 'resend', id: data.id }
      }
      return { success: false, reason: 'api_error', message: data?.message || 'Resend API request failed' }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  // 2. CUSTOM WEBHOOK
  if (emailConfig.provider === 'webhook') {
    if (!emailConfig.apiKey) {
      return { success: false, reason: 'unconfigured', message: 'Webhook URL is required' }
    }

    try {
      const res = await fetch(emailConfig.apiKey.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email_receipt',
          recipient: recipientEmail,
          subject,
          html: htmlContent,
          order: orderData,
        }),
      })

      if (res.ok) {
        return { success: true, provider: 'webhook' }
      }
      return { success: false, reason: 'webhook_failed', message: `Webhook returned status ${res.status}` }
    } catch (err) {
      return { success: false, reason: 'network_error', message: err?.message || 'Network error' }
    }
  }

  return { success: false, reason: 'unknown_provider', message: 'Unknown email provider' }
}

/**
 * Trigger both WhatsApp and Email automated delivery in parallel
 */
export async function triggerAutomatedDelivery(orderData, automationConfig) {
  const [waResult, emailResult] = await Promise.allSettled([
    sendWhatsAppDelivery(orderData, automationConfig?.whatsapp),
    sendEmailReceipt(orderData, automationConfig?.email),
  ])

  const deliveryReport = {
    whatsapp: waResult.status === 'fulfilled' ? waResult.value : { success: false, error: waResult.reason },
    email: emailResult.status === 'fulfilled' ? emailResult.value : { success: false, error: emailResult.reason },
    timestamp: new Date().toISOString(),
  }

  return deliveryReport
}

/**
 * Sync Order to both localStorage and cloud storage (Supabase site_content)
 */
export async function persistOrderRecord(newOrder) {
  let ordersList = []
  try {
    const existing = JSON.parse(localStorage.getItem('sanshift_orders') || '[]')
    ordersList = [newOrder, ...existing.filter((o) => o.orderId !== newOrder.orderId)]
    localStorage.setItem('sanshift_orders', JSON.stringify(ordersList))
  } catch (err) {
    console.warn('Local order storage error:', err)
  }

  // Backup sync to Supabase site_content.orders
  try {
    const { data: siteRow } = await supabase.from('site_content').select('data').eq('id', 1).maybeSingle()
    if (siteRow?.data) {
      const updatedSiteData = {
        ...siteRow.data,
        orders: ordersList.slice(0, 100), // Keep last 100 orders synced in cloud
      }
      await supabase.from('site_content').upsert({ id: 1, data: updatedSiteData, updated_at: new Date().toISOString() })
    }
  } catch (err) {
    console.info('Supabase cloud order sync deferred:', err?.message || err)
  }

  return ordersList
}
