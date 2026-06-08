import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ─── Firework Canvas ────────────────────────────────────────────────
function FireworkCanvas({ active }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  const launchFirework = useCallback((canvas, ctx) => {
    const W = canvas.width
    const H = canvas.height
    const x = 0.1 + Math.random() * 0.8
    const y = 0.1 + Math.random() * 0.5

    const colors = [
      '#c9a96e', '#e8d5b0', '#fff8e7',
      '#ff9f7f', '#ff6b6b', '#ffd700',
      '#a8edea', '#fed6e3', '#d299c2',
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const count = 80 + Math.floor(Math.random() * 60)

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 2 + Math.random() * 6
      particlesRef.current.push({
        x: W * x,
        y: H * y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size: 1.5 + Math.random() * 2.5,
        color,
        decay: 0.012 + Math.random() * 0.01,
        gravity: 0.08,
        trail: [],
      })
    }
  }, [])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    particlesRef.current = []

    // Launch fireworks at intervals
    const launches = [0, 600, 1200, 1800, 2600, 3400, 4200, 5200, 6200, 7500, 9000, 10500]
    const timers = launches.map(delay =>
      setTimeout(() => launchFirework(canvas, ctx), delay)
    )

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 8, 6, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.01)

      particlesRef.current.forEach(p => {
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha })
        if (p.trail.length > 6) p.trail.shift()

        // Draw trail
        p.trail.forEach((t, i) => {
          const trailAlpha = (i / p.trail.length) * p.alpha * 0.4
          ctx.beginPath()
          ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color.replace(')', `, ${trailAlpha})`).replace('rgb', 'rgba').replace('#', '')
          // Simple approach:
          ctx.globalAlpha = trailAlpha
          ctx.fillStyle = p.color
          ctx.fill()
        })

        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        grad.addColorStop(0, p.color)
        grad.addColorStop(1, 'transparent')
        ctx.globalAlpha = p.alpha * 0.3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.globalAlpha = 1

        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.98
        p.alpha -= p.decay
      })

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', resize)
    }
  }, [active, launchFirework])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

// ─── Balloon ────────────────────────────────────────────────────────
function Balloon({ color, delay, left }) {
  return (
    <motion.div
      initial={{ y: '110vh', x: 0, rotate: -8 }}
      animate={{
        y: '-25vh',
        x: [0, 15, -10, 18, -5, 0],
        rotate: [-8, 5, -5, 8, -3, 5],
      }}
      transition={{
        y: { duration: 10 + Math.random() * 5, delay, ease: 'easeOut' },
        x: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      style={{
        position: 'absolute',
        left: `${left}%`,
        bottom: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      {/* Balloon body */}
      <div
        style={{
          width: 50,
          height: 60,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          background: `radial-gradient(ellipse at 35% 35%, ${color}ee, ${color}88)`,
          position: 'relative',
          boxShadow: `inset -8px -8px 20px rgba(0,0,0,0.2), 0 4px 20px ${color}44`,
        }}
      >
        {/* Shine */}
        <div
          style={{
            position: 'absolute',
            top: '15%', left: '20%',
            width: '25%', height: '30%',
            background: 'rgba(255,255,255,0.35)',
            borderRadius: '50%',
            filter: 'blur(3px)',
          }}
        />
        {/* Knot */}
        <div
          style={{
            position: 'absolute',
            bottom: -6, left: '50%',
            transform: 'translateX(-50%)',
            width: 6, height: 10,
            background: color,
            borderRadius: '0 0 50% 50%',
          }}
        />
      </div>
      {/* String */}
      <svg width="2" height="80" style={{ display: 'block', margin: '0 auto' }}>
        <line x1="1" y1="0" x2="1" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </svg>
    </motion.div>
  )
}

// ─── Confetti trigger ───────────────────────────────────────────────
function useConfetti(active) {
  useEffect(() => {
    if (!active) return

    const GOLD = ['#c9a96e', '#e8d5b0', '#f0c060', '#fff8e7']
    const COLORS = [...GOLD, '#ff9f7f', '#a8edea', '#d299c2', '#fed6e3']

    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
        colors: COLORS,
      })
    }

    const burst = () => {
      fire(0.25, { spread: 26, startVelocity: 55 })
      fire(0.2, { spread: 60 })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1, { spread: 120, startVelocity: 45 })
    }

    // Multiple bursts
    const delays = [200, 800, 1600, 2800, 4500, 7000]
    const timers = delays.map(d => setTimeout(burst, d))

    // Side cannons
    const sides = [600, 2200, 4000]
    const sideTimers = sides.map(d => setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS })
      confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS })
    }, d))

    return () => { [...timers, ...sideTimers].forEach(clearTimeout) }
  }, [active])
}

// ─── Stars ──────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const BALLOON_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#ff6bcd', '#c9a96e', '#a8edea', '#ff9f7f',
  '#d299c2', '#fed6e3', '#96ceb4', '#ffeaa7',
]

const BALLOONS = Array.from({ length: 14 }, (_, i) => ({
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  delay: i * 0.5,
  left: 3 + (i * 7) % 90,
}))

export default function GrandFinale() {
  const [active, setActive] = useState(false)
  const ref = useRef(null)

  useConfetti(active)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const letterVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      transition: { delay: 0.5 + i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const message = 'Happy Birthday Hasini'.split('')

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a1208 0%, #0a0806 50%, #000 100%)',
      }}
    >
      {/* Fireworks */}
      <FireworkCanvas active={active} />

      {/* Stars */}
      <Stars />

      {/* Balloons */}
      <AnimatePresence>
        {active && BALLOONS.map((balloon, i) => (
          <Balloon key={i} {...balloon} />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={active ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-8xl mb-8"
        >
          🎂
        </motion.div>

        {/* Main title letters */}
        <div className="mb-6 flex flex-wrap justify-center items-center" aria-label="Happy Birthday Hasini">
          {'Happy Birthday'.split('').map((char, i) => (
            <motion.span
              key={`hb-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={active ? "visible" : "hidden"}
              className="font-cinematic italic text-cream"
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center mb-8">
          {'Hasini'.split('').map((char, i) => (
            <motion.span
              key={`name-${i}`}
              custom={i + 15}
              variants={letterVariants}
              initial="hidden"
              animate={active ? "visible" : "hidden"}
              className="font-display font-bold text-gold text-glow"
              style={{
                fontSize: 'clamp(3rem, 12vw, 8rem)',
                display: 'inline-block',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: [0, 1.3, 1] } : {}}
          transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl mb-12"
        >
          ❤️
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : {}}
          transition={{ delay: 2.8, duration: 1.5 }}
          className="h-px w-48 mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />

        {/* Sub message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 0.7, y: 0 } : {}}
          transition={{ delay: 3, duration: 1 }}
          className="font-cinematic italic text-gold-light text-xl md:text-2xl max-w-lg"
        >
          May this year bring you everything your beautiful heart deserves.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 0.4, y: 0 } : {}}
          transition={{ delay: 3.5, duration: 1 }}
          className="font-body text-gold/40 text-xs tracking-widest uppercase mt-8"
        >
          June 27 · Always & Forever
        </motion.p>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
      />
    </section>
  )
}
