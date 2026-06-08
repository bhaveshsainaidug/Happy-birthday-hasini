import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InfinitePhotoWall({ photos }) {
  const containerRef = useRef(null)
  const dragRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)

  // With 400 photos, we want a dense grid.
  // E.g., roughly 20x20 grid if 400 photos.
  const cols = Math.ceil(Math.sqrt(photos.length * 1.5)) // make it wider than tall
  
  useEffect(() => {
    // Subtle auto-pan
    if (!dragRef.current) return
    const controls = dragRef.current
    // We'll just let the user drag it, but we could add a slow auto-pan here using GSAP or Framer
  }, [])

  if (photos.length === 0) return null

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black" ref={containerRef}>
      {/* Overlay text */}
      <div className="absolute inset-x-0 top-12 z-20 text-center pointer-events-none">
        <h2 className="font-['Playfair_Display'] text-cream text-3xl md:text-5xl font-light cinematic-glow">
          A Universe of Memories
        </h2>
        <p className="font-['Inter'] text-gold/60 tracking-widest uppercase text-xs mt-4">
          {photos.length} moments · Drag to explore
        </p>
      </div>

      {/* Draggable massive canvas */}
      <motion.div
        ref={dragRef}
        drag
        dragConstraints={containerRef}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{
          // Create a massive grid
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(120px, 18vw))`,
          gap: '0.5rem',
          padding: '20vw', // Extra padding so you can drag to edges
        }}
        initial={{ x: '-10%', y: '-10%' }}
        animate={{
          x: ['-10%', '-15%', '-5%', '-10%'],
          y: ['-10%', '-5%', '-15%', '-10%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear'
        }}
        whileDrag={{ scale: 0.98, transition: { duration: 0.2 } }}
      >
        {photos.map((photo, i) => {
          // Add some organic variation to sizes and positions
          const isLarge = i % 17 === 0;
          const isOffset = i % 3 === 0;
          
          return (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-sm group bg-[#16111f]"
              style={{
                aspectRatio: i % 5 === 0 ? '4/5' : i % 2 === 0 ? '1/1' : '3/2',
                gridColumn: isLarge ? 'span 2' : 'span 1',
                gridRow: isLarge ? 'span 2' : 'span 1',
                marginTop: isOffset ? '2rem' : '0',
              }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.src}
                alt={photo.name || `Memory ${i}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Subtle grain */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
              />
            </motion.div>
          )
        })}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox.src}
              alt={lightbox.name}
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl"
              style={{ boxShadow: '0 0 50px rgba(200,169,110,0.2)' }}
            />
            <button className="absolute top-8 right-8 text-white/50 hover:text-white text-4xl font-light">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay for cinematic feel */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </section>
  )
}
