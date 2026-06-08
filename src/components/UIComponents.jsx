import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// A cinematic section divider with animated gold line
export function SectionDivider({ label }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex flex-col items-center py-16 px-6">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-full max-w-3xl"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }}
      />
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 0.4, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-body text-gold text-xs tracking-cinematic uppercase mt-6"
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}

// Scroll progress indicator
export function ScrollProgress({ progress }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-px" style={{ background: 'rgba(201,169,110,0.1)' }}>
      <motion.div
        className="h-full bg-gold"
        style={{ scaleX: progress, transformOrigin: 'left' }}
      />
    </div>
  )
}

// Quote banner
export function QuoteBanner({ quote, author }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.5 }}
      className="py-24 px-6 md:px-16 text-center"
    >
      <div
        className="relative max-w-3xl mx-auto py-16 px-8"
        style={{
          borderTop: '1px solid rgba(201,169,110,0.2)',
          borderBottom: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        {/* Large quotation mark */}
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 font-cinematic text-gold/20 select-none"
          style={{ fontSize: '8rem', lineHeight: 1 }}
        >
          "
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-cinematic italic text-cream text-xl md:text-3xl leading-relaxed mb-6"
        >
          {quote}
        </motion.p>

        {author && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-body text-gold text-xs tracking-widest uppercase"
          >
            — {author}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
