import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

function PhotoFrame({ photo, className = '', style = {} }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-warm-gray ${className}`} style={style}>
      {photo ? (
        <img
          src={photo.src}
          alt={photo.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'scale(1)' : 'scale(1.05)' }}
        />
      ) : (
        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a1510, #2d2520)' }} />
      )}
    </div>
  )
}

// Large feature card with parallax
function FeatureCard({ photo, label, quote, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-sm cursor-pointer"
      style={{
        boxShadow: hovered
          ? '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.2)'
          : '0 20px 60px rgba(0,0,0,0.6)',
        transition: 'box-shadow 0.5s ease',
      }}
    >
      {/* Photo */}
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <PhotoFrame photo={photo} className="w-full h-full" />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col items-center text-center">
        <motion.p
          className="font-body text-gold/70 text-xs tracking-widest uppercase mb-2"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.5 }}
        >
          {label}
        </motion.p>
        <motion.p
          className="font-cinematic italic text-cream text-lg md:text-2xl leading-snug"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          {quote}
        </motion.p>
        <motion.div
          className="h-px bg-gold/60 mt-4 w-1/2 max-w-[100px]"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.8, duration: 1 }}
        />
      </div>

      {/* Corner accent */}
      <div className="absolute top-4 right-4 w-6 h-6">
        <div className="absolute top-0 right-0 w-full h-px bg-gold/50" />
        <div className="absolute top-0 right-0 h-full w-px bg-gold/50" />
      </div>
    </motion.div>
  )
}

const MOMENTS = [
  { label: 'A soul so bright', quote: 'She lights up every room she walks into' },
  { label: 'Pure joy', quote: 'Her laughter is the most beautiful sound' },
  { label: 'Strength', quote: 'She carries the world with grace' },
  { label: 'Love', quote: 'In her eyes — a universe of warmth' },
  { label: 'Wonder', quote: 'Endlessly curious, endlessly kind' },
  { label: 'Brilliance', quote: 'A mind that dazzles, a heart that heals' },
]

export default function HighlightMoments({ photos }) {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-20%' })
  const [lightbox, setLightbox] = useState(null)

  if (photos.length === 0) return null

  // Build feature grid: varies by photo count
  const features = photos.map((photo, i) => ({
    photo,
    ...MOMENTS[i % MOMENTS.length],
  }))

  // Layout: first photo large, rest in grid
  const [hero, ...grid] = features

  return (
    <section className="relative py-24">
      {/* Section header */}
      <div ref={headerRef} className="text-center mb-20 px-6">
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
          Highlight Moments
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-cream font-light"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          Moments that define her
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeaderInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="h-px max-w-xs mx-auto mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
      </div>

      {/* Hero feature */}
      {hero && (
        <div
          className="px-4 md:px-16 mb-8 cursor-pointer"
          onClick={() => setLightbox(hero.photo)}
        >
          <FeatureCard
            photo={hero.photo}
            label={hero.label}
            quote={hero.quote}
            index={0}
          />
        </div>
      )}

      {/* Grid of highlights */}
      {grid.length > 0 && (
        <div className="px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {grid.map((feature, i) => (
            <div
              key={i}
              className="cursor-pointer"
              style={{ aspectRatio: i % 3 === 0 ? '4/3' : i % 3 === 1 ? '3/4' : '1/1' }}
              onClick={() => setLightbox(feature.photo)}
            >
              <FeatureCard
                photo={feature.photo}
                label={feature.label}
                quote={feature.quote}
                index={i + 1}
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.name}
                className="max-w-full max-h-[90vh] object-contain"
                style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
