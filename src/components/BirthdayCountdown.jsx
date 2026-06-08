import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  function getTimeLeft(date) {
    const now = new Date()
    const target = new Date(date)
    // If birthday already passed this year, count to next year
    if (target < now) target.setFullYear(target.getFullYear() + 1)
    const diff = target - now

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      passed: diff <= 0,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function DigitGroup({ value, label }) {
  const display = String(value).padStart(2, '0')
  const [prev, setPrev] = useState(display)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (display !== prev) {
      setFlip(true)
      const t = setTimeout(() => { setPrev(display); setFlip(false) }, 300)
      return () => clearTimeout(t)
    }
  }, [display, prev])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ perspective: '300px' }}>
        {/* Background card */}
        <div
          className="rounded-sm px-5 py-4 md:px-8 md:py-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #1a1208, #0f0a05)',
            border: '1px solid rgba(201,169,110,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,169,110,0.1)',
            minWidth: '80px',
          }}
        >
          {/* Shine line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)' }}
          />

          <motion.span
            key={display}
            initial={{ y: flip ? -20 : 0, opacity: flip ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-display text-gold font-light block text-center"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1 }}
          >
            {display}
          </motion.span>

          {/* Divider line */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '50%',
              height: '1px',
              background: 'rgba(0,0,0,0.4)',
            }}
          />
        </div>
      </div>
      <span className="font-body text-gold/50 text-xs tracking-widest uppercase">{label}</span>
    </div>
  )
}

// Birthday — June 27
const BIRTHDAY = `${new Date().getFullYear()}-06-27`

export default function BirthdayCountdown() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })
  const { days, hours, minutes, seconds, passed } = useCountdown(BIRTHDAY)

  return (
    <section ref={ref} className="relative py-32 flex flex-col items-center overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="text-center mb-16 px-6"
      >
        <div
          className="h-px max-w-xs mx-auto mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <p className="font-body text-gold text-xs tracking-cinematic uppercase mb-4 opacity-70">
          {passed ? 'Today is the day' : 'Counting down to'}
        </p>
        <h2
          className="font-display text-cream font-light"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          {passed ? 'Happy Birthday Hasini! 🎂' : 'June 27'}
        </h2>
        {!passed && (
          <p className="font-cinematic italic text-gold-light/60 mt-4 text-lg">
            Until the most special day
          </p>
        )}
        <div
          className="h-px max-w-xs mx-auto mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
      </motion.div>

      {/* Countdown display */}
      {!passed ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex items-end gap-4 md:gap-8"
        >
          <DigitGroup value={days} label="Days" />
          <div className="font-display text-gold/40 text-3xl mb-8 select-none">:</div>
          <DigitGroup value={hours} label="Hours" />
          <div className="font-display text-gold/40 text-3xl mb-8 select-none">:</div>
          <DigitGroup value={minutes} label="Minutes" />
          <div className="font-display text-gold/40 text-3xl mb-8 select-none">:</div>
          <DigitGroup value={seconds} label="Seconds" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-display text-gold text-glow"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            🎂
          </motion.div>
          <p className="font-cinematic italic text-gold-light text-xl mt-6">
            Today, the world celebrates you.
          </p>
        </motion.div>
      )}

      {/* June 27 badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-16 flex items-center gap-4"
      >
        <div className="h-px w-12 bg-gold/30" />
        <p className="font-body text-gold/50 text-xs tracking-widest uppercase">
          June 27 · Hasini's Day
        </p>
        <div className="h-px w-12 bg-gold/30" />
      </motion.div>
    </section>
  )
}
