import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

export default function OpeningScene({ onBegin }) {
  const containerRef = useRef(null)
  const particleContainerRef = useRef(null)
  const contentRef = useRef(null)
  const [leaving, setLeaving] = useState(false)

  const handleBegin = () => {
    setLeaving(true)
    setTimeout(onBegin, 1200)
  }

  useEffect(() => {
    // Inject Material Symbols font for the Stitch icons
    if (!document.getElementById('material-symbols')) {
      const link = document.createElement('link')
      link.id = 'material-symbols'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
      document.head.appendChild(link)
    }

    // Particle logic from Stitch
    const particleContainer = particleContainerRef.current
    if (!particleContainer) return

    const particleCount = 60
    const colors = ['#C8A96E', '#EEB9BD', '#FFFFFF']
    
    // Clean up existing particles (strict mode safety)
    particleContainer.innerHTML = ''

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      const size = Math.random() * 4 + 1
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      particle.className = 'absolute pointer-events-none rounded-full blur-[1px]'
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.backgroundColor = color
      particle.style.left = `${Math.random() * 100}vw`
      particle.style.top = `${Math.random() * 100 + 100}vh`
      particle.style.boxShadow = `0 0 10px ${color}`
      
      const duration = Math.random() * 10 + 10
      const delay = Math.random() * 20
      
      particle.style.animation = `float-particle ${duration}s linear ${delay}s infinite`
      
      particleContainer.appendChild(particle)
    }

    // Mouse parallax logic from Stitch
    const handleMouseMove = (e) => {
      if (!contentRef.current) return
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01
      contentRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="opening"
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#03010A]"
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Custom Styles for Stitch animations */}
          <style>{`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .cinematic-glow {
              text-shadow: 0 0 30px rgba(200, 169, 110, 0.4);
            }
            .soft-glow-bg {
              background: radial-gradient(circle at center, rgba(200, 169, 110, 0.15) 0%, transparent 70%);
            }
            @keyframes float-particle {
              0% { transform: translateY(0) rotate(0deg); opacity: 0; }
              50% { opacity: 0.6; }
              100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
            .fade-in {
              animation: fadeIn 3s ease-out forwards;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Particle Background */}
          <div ref={particleContainerRef} className="absolute inset-0 overflow-hidden z-0" />

          {/* Main Content Canvas */}
          <main className="relative z-10 text-center px-8 max-w-[1200px] w-full">
            <div className="soft-glow-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-0" />
            
            <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center w-full space-y-12 fade-in text-center">
              {/* Brand Anchor Representation */}
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-[#e5c487] text-4xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-['Inter'] text-[12px] leading-[1.0] font-semibold text-[#e5c487] tracking-[0.4em] opacity-60 text-center">A CINEMATIC EXPERIENCE</span>
              </div>

              {/* The Big Headline */}
              <h1 className="font-['Playfair_Display'] text-[clamp(48px,8vw,72px)] font-bold text-[#e5c487] cinematic-glow leading-tight tracking-[-0.02em] text-center flex flex-col items-center">
                <span>Happy Birthday</span>
                <span className="text-[#c8a96e] mt-4">Hasini</span>
              </h1>

              {/* Narrative Intro */}
              <p className="font-['Inter'] text-[18px] leading-relaxed font-normal text-[#d0c5b5] max-w-2xl mx-auto opacity-80 italic text-center">
                Step into a journey curated through moments, memories, and the timeless light you bring into our world.
              </p>

              {/* Action Button */}
              <div className="pt-12 flex justify-center w-full">
                <button 
                  onClick={handleBegin}
                  className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-['Inter'] text-[12px] font-semibold tracking-[0.15em] transition duration-500 ease-out border border-[#c8a96e] rounded-full shadow-md"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-[#402d00] bg-[#c8a96e] duration-500 -translate-x-full group-hover:translate-x-0 ease-out transition-transform">
                    <span className="material-symbols-outlined mr-2">play_arrow</span>
                    BEGIN
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-[#e5c487] transition-all duration-500 transform group-hover:translate-x-full ease">BEGIN</span>
                  <span className="relative invisible">BEGIN</span>
                </button>
              </div>
            </div>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
