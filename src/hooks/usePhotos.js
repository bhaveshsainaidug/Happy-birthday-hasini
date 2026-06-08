// Dynamically import all photos from the assets/photos directory
// Supported formats: jpg, jpeg, png, webp, gif
const photoModules = import.meta.glob(
  '../assets/photos/**/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
)

export function usePhotos() {
  const photos = Object.entries(photoModules).map(([path, module]) => {
    const filename = path.split('/').pop()
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    return {
      src: module.default,
      path,
      filename,
      name: nameWithoutExt,
      // Parse index from filename if it starts with a number e.g. "01-name.jpg"
      index: parseInt(nameWithoutExt.match(/^(\d+)/)?.[1] ?? '0'),
    }
  }).sort((a, b) => a.index - b.index || a.filename.localeCompare(b.filename))

  return photos
}

// Split photos into logical groups for different sections
export function usePhotoGroups(photos) {
  const total = photos.length
  if (total === 0) return { hero: [], timeline: [], highlights: [], collage: [], recent: [] }

  // Distribute photos across sections proportionally
  const heroCount = Math.min(3, Math.ceil(total * 0.05))
  const timelineCount = Math.min(12, Math.ceil(total * 0.2))
  const highlightCount = Math.min(6, Math.ceil(total * 0.1))
  const recentCount = Math.min(8, Math.ceil(total * 0.15))
  const collageCount = total - heroCount - timelineCount - highlightCount - recentCount

  let idx = 0
  const take = (n) => { const s = photos.slice(idx, idx + n); idx += n; return s }

  return {
    hero:       take(Math.max(1, heroCount)),
    timeline:   take(Math.max(1, timelineCount)),
    highlights: take(Math.max(1, highlightCount)),
    collage:    take(Math.max(0, collageCount)),
    recent:     take(Math.max(1, recentCount)),
  }
}
