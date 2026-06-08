import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

function MasonryPhoto({ photo, index, onClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-5%' })
  const [hovered, setHovered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const delay = (index % 12) * 0.07

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-sm cursor-pointer break-inside-avoid mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(photo, index)}
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
    >
      {/* Photo */}
      <motion.div
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: 'transform' }}
      >
        {photo ? (
          <img
            src={photo.src}
            alt={photo.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="w-full block"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
              display: 'block',
            }}
          />
        ) : (
          <div
            className="w-full"
            style={{
              height: 200 + (index % 4) * 60,
              background: 'linear-gradient(135deg, #1a1510, #2d2520)',
            }}
          />
        )}
      </motion.div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)' }}
      >
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-body text-white/50 text-xs tracking-wider">#{String(index + 1).padStart(3, '0')}</p>
        </div>
      </motion.div>

      {/* Top-left corner accent */}
      <motion.div
        className="absolute top-0 left-0"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-8 h-px bg-gold/70" />
        <div className="w-px h-8 bg-gold/70" />
      </motion.div>
    </motion.div>
  )
}

export default function MemoryCollage({ photos }) {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-20%' })
  const [lightbox, setLightbox] = useState({ photo: null, index: -1 })

  const handleOpen = useCallback((photo, index) => {
    setLightbox({ photo, index })
  }, [])

  const handleClose = useCallback(() => {
    setLightbox({ photo: null, index: -1 })
  }, [])

  const handlePrev = useCallback(() => {
    setLightbox(prev => {
      const newIndex = (prev.index - 1 + photos.length) % photos.length
      return { photo: photos[newIndex], index: newIndex }
    })
  }, [photos])

  const handleNext = useCallback(() => {
    setLightbox(prev => {
      const newIndex = (prev.index + 1) % photos.length
      return { photo: photos[newIndex], index: newIndex }
    })
  }, [photos])

  if (photos.length === 0) return null

  // Divide into 3 columns for masonry
  const cols = [[], [], []]
  photos.forEach((photo, i) => cols[i % 3].push({ photo, originalIndex: i }))

  return (
    <section className="relative py-24">
      {/* Section header */}
      <div ref={headerRef} className="text-center mb-16 px-6">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="h-px max-w-xs mx-auto mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isHeaderInView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-body text-gold text-xs tracking-cinematic uppercase mb-4"
        >
          The Full Collection
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-cream font-light"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Every memory, preserved
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 0.5, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-cinematic italic text-gold-light text-lg mt-4"
        >
          {photos.length} beautiful moments
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="h-px max-w-xs mx-auto mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
      </div>

      {/* Masonry Grid */}
      <div className="px-4 md:px-12 grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
        {cols.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {col.map(({ photo, originalIndex }) => (
              <MasonryPhoto
                key={originalIndex}
                photo={photo}
                index={originalIndex}
                onClick={handleOpen}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.97)' }}
            onClick={handleClose}
          >
            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
              <p className="font-body text-white/40 text-xs tracking-widest">
                {String(lightbox.index + 1).padStart(3, '0')} / {String(photos.length).padStart(3, '0')}
              </p>
            </div>

            {/* Image */}
            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl max-h-[85vh] relative"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={lightbox.photo.src}
                alt={lightbox.photo.name}
                className="max-w-full max-h-[85vh] object-contain"
                style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.9)' }}
              />
            </motion.div>

            {/* Nav buttons */}
            <button
              onClick={e => { e.stopPropagation(); handlePrev() }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/60 transition-all duration-300"
            >
              ←
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleNext() }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/60 transition-all duration-300"
            >
              →
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors text-3xl font-light"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
