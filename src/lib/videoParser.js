/**
 * Video & Social URL Parser for SAN SHIFT Phone Simulator
 * Supports Instagram Reels, YouTube Shorts, and Direct MP4/WebM video files.
 */
export function parseVideoUrl(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()

  // Match Instagram Reel, Post, or Share URL
  // Formats:
  // https://www.instagram.com/reel/C8XYZ123/?igsh=...
  // https://www.instagram.com/p/C8XYZ123/
  // https://www.instagram.com/share/reel/C8XYZ123/
  const igMatch = trimmed.match(/instagram\.com\/(?:reel|p|share\/reel|tv)\/([a-zA-Z0-9_-]+)/i)
  if (igMatch) {
    const id = igMatch[1]
    return {
      type: 'instagram',
      id,
      embedUrl: `https://www.instagram.com/reel/${id}/embed/`,
      embedCaptionedUrl: `https://www.instagram.com/reel/${id}/embed/captioned/`,
      originalUrl: trimmed,
    }
  }

  // Match YouTube Shorts or Watch URL
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/i)
  if (ytMatch) {
    const id = ytMatch[1]
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&modestbranding=1`,
      originalUrl: trimmed,
    }
  }

  // Direct Video files (.mp4, .webm, .mov, etc.) or streaming blob
  return {
    type: 'video',
    url: trimmed,
    originalUrl: trimmed,
  }
}
