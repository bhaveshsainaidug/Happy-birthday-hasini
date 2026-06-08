import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

// The letter content — edit this to personalize
const LETTER_LINES = [
  "Dear Hasini,",
  "",
  "On this special day, I want you to know",
  "just how extraordinary you truly are.",
  "",
  "You carry a light that touches everyone around you —",
  "a warmth that no words can fully capture.",
  "",
  "Every memory we've shared is a treasure I hold dear.",
  "Every laugh, every moment, every quiet afternoon —",
  "each one is a gift I'm grateful for.",
  "",
  "You've grown into someone remarkable.",
  "Brave, kind, endlessly wonderful.",
  "The world is undeniably better with you in it.",
  "",
  "Here's to you, Hasini —",
  "today and every day after.",
  "",
  "Happy Birthday, with all my love. ❤️",
]

function useTypewriter(lines, started, speed = 40) {
  const [displayedLines, setDisplayedLines] = useState([''])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!started) return
    if (done) return

    const currentLine = lines[lineIndex] ?? ''

    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => {
          const updated = [...prev]
          updated[lineIndex] = currentLine.slice(0, charIndex + 1)
          return updated
        })
        setCharIndex(c => c + 1)
      }, currentLine[charIndex] === ' ' ? speed / 3 : speed)
      return () => clearTimeout(timer)
    } else {
      // Move to next line
      const nextLine = lineIndex + 1
      if (nextLine < lines.length) {
        const lineDelay = currentLine === '' ? 150 : 400
        const timer = setTimeout(() => {
          setLineIndex(nextLine)
          setCharIndex(0)
          setDisplayedLines(prev => [...prev, ''])
        }, lineDelay)
        return () => clearTimeout(timer)
      } else {
        setDone(true)
      }
    }
  }, [started, lineIndex, charIndex, lines, done, speed])

  return { displayedLines, done }
}

export default function PersonalLetter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })
  const [started, setStarted] = useState(false)
  const { displayedLines, done } = useTypewriter(LETTER_LINES, started)

  useEffect(() => {
    if (isInView && !started) {
      const timer = setTimeout(() => setStarted(true), 600)
      return () => clearTimeout(timer)
    }
  }, [isInView, started])

  return (
    <section ref={ref} className="relative py-24 px-6 flex flex-col items-center">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <p className="font-body text-gold text-xs tracking-cinematic uppercase mb-4 opacity-70">
          From the heart
        </p>
        <h2
          className="font-display text-cream font-light"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          A Letter to Hasini
        </h2>
        <div
          className="h-px max-w-xs mx-auto mt-6"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
      </motion.div>

      {/* Letter paper */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 5 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl"
        style={{ perspective: '1000px' }}
      >
        {/* Paper layers for depth effect */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            transform: 'translate(6px, 6px)',
            background: '#e8ddd0',
            opacity: 0.3,
          }}
        />
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            transform: 'translate(3px, 3px)',
            background: '#ede5d8',
            opacity: 0.5,
          }}
        />

        {/* Main paper */}
        <div
          className="relative letter-paper rounded-sm px-10 md:px-16 py-12 md:py-16"
          style={{ minHeight: '600px' }}
        >
          {/* Top rule lines */}
          <div className="absolute top-0 left-0 right-0 h-2 rounded-t-sm"
            style={{ background: 'linear-gradient(90deg, rgba(201,169,110,0.3), rgba(201,169,110,0.1))' }}
          />

          {/* Red margin line */}
          <div
            className="absolute top-0 bottom-0 left-12 w-px"
            style={{ background: 'rgba(180,80,80,0.15)' }}
          />

          {/* Horizontal rule lines on paper */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${80 + i * 32}px`,
                height: '1px',
                background: 'rgba(139,110,80,0.1)',
              }}
            />
          ))}

          {/* Letter content */}
          <div className="relative" style={{ paddingLeft: '2rem' }}>
            {displayedLines.map((line, i) => (
              <div key={i} className="relative" style={{ minHeight: '2rem' }}>
                <span
                  className="font-handwritten text-[#2a1f10]"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    lineHeight: '2rem',
                    display: 'block',
                    opacity: line === '' ? 1 : 1,
                  }}
                >
                  {line === '' ? '\u00A0' : line}
                  {/* Cursor on last active line */}
                  {i === displayedLines.length - 1 && !done && (
                    <span
                      className="cursor-blink inline-block ml-0.5 bg-[#2a1f10]"
                      style={{ width: '2px', height: '1.1em', verticalAlign: 'text-bottom' }}
                    />
                  )}
                </span>
              </div>
            ))}

            {/* Signature flourish when done */}
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-8"
              >
                <div
                  className="h-px w-24"
                  style={{ background: 'rgba(139,110,80,0.3)' }}
                />
              </motion.div>
            )}
          </div>

          {/* Wax seal decoration */}
          <div
            className="absolute bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse, #8b1a1a, #5a0f0f)',
              boxShadow: '0 4px 20px rgba(139,26,26,0.4)',
              opacity: done ? 1 : 0.3,
              transition: 'opacity 1s ease',
            }}
          >
            <span className="font-cinematic italic text-white/80 text-xl font-bold">H</span>
          </div>
        </div>
      </motion.div>

      {/* Decorative quote below letter */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 0.5, y: 0 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
        className="font-cinematic italic text-gold-light text-center mt-12 max-w-md"
        style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}
      >
        "Some people are so rare, the world feels lucky just to have them."
      </motion.p>
    </section>
  )
}
