import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth
    let H = window.innerHeight

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const COUNT = Math.min(80, Math.floor((W * H) / 15000))
    particlesRef.current = Array.from({ length: COUNT }, () => createParticle(W, H))

    function createParticle(W, H) {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        targetAlpha: Math.random() * 0.6 + 0.1,
        // Gold color variants
        hue: 38 + Math.random() * 20,
        saturation: 50 + Math.random() * 30,
        lightness: 60 + Math.random() * 20,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      particlesRef.current.forEach((p) => {
        // Pulse alpha
        p.pulse += p.pulseSpeed
        const alphaMod = Math.sin(p.pulse) * 0.2
        const a = Math.max(0, Math.min(1, p.alpha + alphaMod))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${a})`
        ctx.fill()

        // Draw subtle glow for larger particles
        if (p.size > 1.5) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          grad.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${a * 0.3})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        // Move
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
