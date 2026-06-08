import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Placeholder photo when no real photo exists
function PhotoFrame({ photo, className = '', style = {}, eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {photo && !error ? (
        <img
          src={photo.src}
          alt={photo.name}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className="w-full h-full object-cover transition-all duration-700"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'scale(1)' : 'scale(1.05)',
          }}
        />
      ) : (
        // Elegant placeholder when no photo
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a1510, #2d2520)' }}
        >
          <div className="text-center">
            <p className="font-cinematic text-gold/30 text-lg italic">your memory here</p>
          </div>
        </div>
      )}
      {/* Subtle film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  )
}

// Chapter marker
function ChapterMarker({ number, title, subtitle }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <div ref={ref} className="flex flex-col items-center text-center py-24 px-6">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-24 bg-gold/40 mb-8"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 0.5, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 1 }}
        className="font-body text-gold tracking-cinematic uppercase text-xs mb-4"
      >
        Chapter {number}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-cream text-4xl md:text-6xl font-light mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-cinematic italic text-gold-light text-lg"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-24 bg-gold/40 mt-8"
      />
    </div>
  )
}

// Single photo with cinematic reveal
function RevealPhoto({ photo, delay = 0, className = '', style = {} }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={isInView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
      transition={{ delay, duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
      className={className}
      style={style}
    >
      <PhotoFrame photo={photo} className="w-full h-full" />
    </motion.div>
  )
}

// Story layout: text centered above photo
function StoryBlock({ photo, text, caption, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-8 items-center px-6 md:px-16 py-12 text-center"
    >
      {/* Text side */}
      <div className="flex-1 max-w-2xl mx-auto flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay + 0.3, duration: 1 }}
          className="font-cinematic italic text-gold-light text-xl md:text-3xl leading-relaxed mb-4 text-center"
        >
          {text}
        </motion.p>
        {caption && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5, y: 0 } : {}}
            transition={{ delay: delay + 0.6, duration: 1 }}
            className="font-body text-xs tracking-widest text-gold/60 uppercase text-center"
          >
            {caption}
          </motion.p>
        )}
      </div>

      {/* Photo side */}
      <div className="flex-1 max-w-3xl w-full mx-auto">
        <RevealPhoto
          photo={photo}
          delay={delay + 0.2}
          className="w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden mx-auto"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
        />
      </div>
    </motion.div>
  )
}

// Full-width cinematic photo
function CinematicPhoto({ photo, quote, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 1.5 }}
      className="relative w-full"
      style={{ height: 'clamp(50vh, 70vh, 85vh)' }}
    >
      <PhotoFrame photo={photo} className="absolute inset-0" />
      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
      />
      {quote && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: delay + 0.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 font-cinematic italic text-cream text-2xl md:text-4xl text-center max-w-2xl px-8"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          "{quote}"
        </motion.p>
      )}
    </motion.div>
  )
}

// Timeline row
function TimelineRow({ photos, year, description, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 1 }}
      className="px-6 md:px-16 py-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-gold/20" />
        <span className="font-body text-gold tracking-widest text-xs uppercase opacity-70">{year}</span>
        <div className="h-px flex-1 bg-gold/20" />
      </div>
      {description && (
        <p className="font-cinematic italic text-center text-gold-light/70 text-lg mb-8">{description}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo, i) => (
          <RevealPhoto
            key={i}
            photo={photo}
            delay={delay + i * 0.15}
            className="w-full aspect-[3/2] overflow-hidden rounded-sm"
            style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

const STORY_CHAPTERS = [
  {
    number: '01',
    title: 'The Beginning',
    subtitle: 'Where it all started...',
    quote: 'In the beginning, there was joy.',
    storyCaptions: ['A soul full of wonder', 'The world through her eyes'],
  },
  {
    number: '02',
    title: 'Growing Up',
    subtitle: 'Every day, a new discovery',
    quote: 'She grew in beauty, in spirit, in grace.',
    storyCaptions: ['Curiosity was her compass', 'The world couldn\'t keep up'],
  },
  {
    number: '03',
    title: 'The Golden Days',
    subtitle: 'Memories that last forever',
    quote: 'Some moments are too beautiful to forget.',
    storyCaptions: ['Laughter was her language', 'Joy in every frame'],
  },
]

export default function MemoryJourney({ photos }) {
  const total = photos.length

  if (total === 0) {
    return (
      <section className="py-24 text-center">
        <p className="font-cinematic italic text-gold/40 text-xl">Add photos to assets/photos to see them here...</p>
      </section>
    )
  }

  // Distribute photos across chapters
  const chunkSize = Math.ceil(total / STORY_CHAPTERS.length)
  const chunks = STORY_CHAPTERS.map((_, i) => photos.slice(i * chunkSize, (i + 1) * chunkSize))

  return (
    <section className="relative">
      {STORY_CHAPTERS.map((chapter, ci) => {
        const chapterPhotos = chunks[ci] || []
        if (chapterPhotos.length === 0) return null

        const [hero, ...rest] = chapterPhotos
        const storyPhotos = rest.slice(0, 2)
        const timelinePhotos = rest.slice(2, 8)

        return (
          <div key={ci}>
            {/* Chapter marker */}
            <ChapterMarker
              number={chapter.number}
              title={chapter.title}
              subtitle={chapter.subtitle}
            />

            {/* Cinematic hero photo */}
            {hero && (
              <CinematicPhoto
                photo={hero}
                quote={chapter.quote}
                delay={0.2}
              />
            )}

            {/* Story blocks */}
            {storyPhotos.map((photo, i) => (
              <StoryBlock
                key={i}
                photo={photo}
                text={chapter.storyCaptions[i] || 'A beautiful memory'}
                reversed={i % 2 !== 0}
                delay={0.1}
              />
            ))}

            {/* Timeline grid */}
            {timelinePhotos.length > 0 && (
              <TimelineRow
                photos={timelinePhotos}
                year={`Chapter ${chapter.number}`}
                description={`A collection of moments...`}
                delay={0.2}
              />
            )}
          </div>
        )
      })}
    </section>
  )
}
