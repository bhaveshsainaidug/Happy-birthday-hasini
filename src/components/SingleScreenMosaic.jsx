import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function SingleScreenMosaic({ photos }) {
  const [gridConfig, setGridConfig] = useState({ cols: 20, rows: 20 })

  useEffect(() => {
    // Calculate optimal grid to perfectly fit all photos on screen
    const updateGrid = () => {
      const count = photos.length
      if (count === 0) return
      
      const aspect = window.innerWidth / window.innerHeight
      // To keep photos relatively square-ish, calculate columns based on screen aspect ratio
      const cols = Math.ceil(Math.sqrt(count * aspect))
      const rows = Math.ceil(count / cols)
      
      setGridConfig({ cols, rows })
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [photos.length])

  if (photos.length === 0) return null

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black flex items-center justify-center">
      {/* The perfectly fitted grid */}
      <div 
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          gap: '1px',
          padding: '1px'
        }}
      >
        {photos.map((photo, i) => (
          <div key={i} className="w-full h-full overflow-hidden bg-[#16111f]">
            <img
              src={photo.src}
              alt={`Memory ${i}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-300"
            />
          </div>
        ))}
      </div>

      {/* Center text overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 text-center pointer-events-none p-10 bg-black/60 backdrop-blur-md rounded-lg border border-gold/20 shadow-2xl"
      >
        <h2 className="font-['Playfair_Display'] text-cream text-4xl md:text-6xl font-light cinematic-glow">
          100 Memories
        </h2>
        <p className="font-['Inter'] text-gold-light mt-4 text-lg md:text-xl italic">
          One beautiful journey.
        </p>
        <p className="font-['Inter'] text-gold/40 tracking-[0.2em] uppercase text-xs mt-6">
          Every single moment, together.
        </p>
      </motion.div>
    </section>
  )
}
