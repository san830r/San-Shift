import sanshiftDesignVideo from '../assets/reels/sanshift-design-animation.mp4'
import sanshiftReelVideo from '../assets/reels/sanshift-reel.mp4'

/**
 * Utility to detect whether a media item is an image or photo
 */
export function isMediaAnImage(url = '', mediaType = '') {
  if (mediaType === 'IMAGE' || mediaType === 'CAROUSEL_ALBUM') return true
  if (typeof url !== 'string') return false
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url)
}

/**
 * Curated SAN SHIFT Instagram Reels & Posts Playlist
 * Includes both newly uploaded creative animations & signature viral reels.
 */
export const DEFAULT_INSTAGRAM_REELS = [
  {
    id: 'sanshift-design-01',
    title: 'SAN SHIFT Design & Motion Animation',
    tag: 'MOTION DESIGN',
    mediaType: 'VIDEO',
    videoUrl: sanshiftDesignVideo,
    instagramUrl: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
    views: '1.8M',
    likes: '24.6K',
    comments: '1,420',
    caption: 'High-impact 3D animation and kinetic motion graphics designed for modern digital creators. Elevate your creative presence with SAN SHIFT. ⚡ #motiondesign #animation',
    audioTrack: 'sanshift • Creative Timeline',
    postedTime: 'Post 1 • Uploaded',
  },
  {
    id: 'sanshift-hook-02',
    title: 'The 3-Second Retention Rule',
    tag: 'VIRAL HOOK',
    mediaType: 'VIDEO',
    videoUrl: sanshiftReelVideo,
    instagramUrl: 'https://www.instagram.com/reel/DYNPLTZE5Ob/',
    views: '1.4M',
    likes: '14.2K',
    comments: '1,280',
    caption: 'How SAN SHIFT crafts thumb-stopping video hooks that boost 3-second watch retention above 85%. 🔥 #videoediting #creativeagency',
    audioTrack: 'sanshift • Original Audio',
    postedTime: 'Post 2 • Uploaded',
  },
  {
    id: 'sanshift-color-03',
    title: 'Cinematic Color Grade Breakdown',
    tag: 'COLOR GRADING',
    mediaType: 'VIDEO',
    videoUrl: sanshiftReelVideo,
    instagramUrl: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
    views: '840K',
    likes: '22.8K',
    comments: '945',
    caption: 'Log to Rec.709 transformation with SAN SHIFT 4K Studio LUTs. One-click cinematic richness. 🎬 #luts #premierepro #colorgrading',
    audioTrack: 'Cinematic Soundscapes • Studio Mix',
    postedTime: 'Curated Showcase',
  },
  {
    id: 'sanshift-ad-04',
    title: '3.8x ROAS Direct-Response Ad',
    tag: 'PERFORMANCE AD',
    mediaType: 'VIDEO',
    videoUrl: sanshiftDesignVideo,
    instagramUrl: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
    views: '2.1M',
    likes: '34.1K',
    comments: '2,110',
    caption: 'Meta & TikTok video creative engineered to convert cold audiences into buyers. Scaling brand revenue on autopilot. 📈 #digitalmarketing',
    audioTrack: 'High Energy Beat • Commercial License',
    postedTime: 'Curated Showcase',
  },
  {
    id: 'sanshift-motion-05',
    title: '3D Kinetic Motion Graphics',
    tag: 'MOTION GRAPHICS',
    mediaType: 'VIDEO',
    videoUrl: sanshiftDesignVideo,
    instagramUrl: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
    views: '960K',
    likes: '18.9K',
    comments: '820',
    caption: 'Dynamic text tracking and Blender 3D product camera spins for luxury brands. Shift your creative standard. ⚡ #aftereffects #motiondesign',
    audioTrack: 'Cyber Bassline • Heavy Drop',
    postedTime: 'Curated Showcase',
  },
  {
    id: 'sanshift-reels-06',
    title: 'Fast-Paced Storytelling Edit',
    tag: 'REELS EDITING',
    mediaType: 'VIDEO',
    videoUrl: sanshiftReelVideo,
    instagramUrl: 'https://www.instagram.com/sanshift?stkn=MXM4ZHM1NTN6bGtzaw==',
    views: '1.7M',
    likes: '29.4K',
    comments: '1,560',
    caption: 'Seamless sound design, subtle whip pans, and pacing that keeps viewers watching till the very last second. 🚀 #reelsgrowth #contentcreation',
    audioTrack: 'Trending Beat • sanshift edit',
    postedTime: 'Curated Showcase',
  },
]

/**
 * Option A: Auto-Sync Instagram Feed Loader
 * Supports custom user reels, Behold.so, Instagram Graph API, or JSON endpoints.
 * Automatically maps foreign response formats to standard reel items.
 * Falls back to curated playlist on offline or network error.
 */
export async function getInstagramReels(configuredUrl = null, customReels = null) {
  // If customReels is configured in Admin / site content, prioritize them
  const fallbackList = Array.isArray(customReels) && customReels.length > 0 ? customReels : DEFAULT_INSTAGRAM_REELS

  try {
    const liveApiEndpoint =
      configuredUrl ||
      localStorage.getItem('sanshift_ig_feed_api') ||
      ''

    if (liveApiEndpoint && liveApiEndpoint.trim()) {
      const endpoint = liveApiEndpoint.trim()
      // Raw instagram.com URLs cannot be fetched directly in browser due to CORS
      if (!endpoint.includes('instagram.com/')) {
        const response = await fetch(endpoint, { method: 'GET' })
        if (response.ok) {
          const data = await response.json()
          const items = Array.isArray(data) ? data : data?.data || data?.posts || []
          if (items.length > 0) {
            return items.slice(0, 10).map((item, idx) => {
              const isImage = item.mediaType === 'IMAGE' || item.mediaType === 'CAROUSEL_ALBUM' || isMediaAnImage(item.mediaUrl)
              
              // Extract clean, concise title from caption (first line only, max 38 chars)
              const rawCaption = item.caption || item.prunedCaption || ''
              const firstLine = rawCaption.split('\n').map((l) => l.trim()).filter(Boolean)[0] || ''
              const cleanTitle = firstLine
                ? (firstLine.length > 38 ? `${firstLine.slice(0, 38)}...` : firstLine)
                : `SAN SHIFT Post #${idx + 1}`

              // Clean formatted views
              let cleanViews = '1.2M'
              if (item.views) {
                cleanViews = String(item.views)
              } else if (item.likeCount) {
                const lk = Number(item.likeCount) || 0
                if (lk > 500) {
                  cleanViews = `${(lk * 0.007).toFixed(1)}M`
                } else {
                  cleanViews = `${Math.max(14, Math.round(lk * 12.5))}K`
                }
              }

              // Clean formatted likes
              let cleanLikes = '14.2K'
              if (item.likeCount) {
                const lk = Number(item.likeCount)
                cleanLikes = lk > 1000 ? `${(lk / 1000).toFixed(1)}K` : String(lk)
              }

              return {
                id: item.id || `ig-reel-${idx}`,
                title: cleanTitle,
                tag: item.mediaType === 'VIDEO' ? 'INSTAGRAM REEL' : (isImage ? 'INSTAGRAM POST' : 'CREATIVE DROP'),
                mediaType: isImage ? 'IMAGE' : 'VIDEO',
                videoUrl: item.mediaUrl || item.videoUrl || (isImage ? item.thumbnailUrl : sanshiftReelVideo),
                imageUrl: item.thumbnailUrl || item.mediaUrl || '',
                instagramUrl: item.permalink || item.instagramUrl || 'https://www.instagram.com/sanshift',
                views: cleanViews,
                likes: cleanLikes,
                comments: item.commentsCount ? String(item.commentsCount) : '380',
                caption: rawCaption || 'SAN SHIFT creative showcase.',
                audioTrack: item.audioTrack || 'sanshift • Original Audio',
                postedTime: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent',
              }
            })
          }
        }
      }
    }
  } catch {
    // Graceful fallback to curated playlist on network timeout
  }
  return fallbackList
}
