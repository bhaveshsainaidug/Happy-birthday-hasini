import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GenZScrollGallery({ photos }) {
  const containerRef = useRef(null)
  const pinRef = useRef(null)
  const photosRef = useRef([])

  // Take exactly up to 10 photos for this premium sequence
  const displayPhotos = photos.slice(0, 10)

  useEffect(() => {
    if (displayPhotos.length === 0) return

    const ctx = gsap.context(() => {
      // Create a timeline that spans height based on number of photos
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: 'top top',
          end: `+=${displayPhotos.length * 100}%`,
          scrub: 1, // Smooth scrubbing
        }
      })

      // Setup initial states for all photos except the first one
      displayPhotos.forEach((_, i) => {
        if (i !== 0) {
          gsap.set(photosRef.current[i], {
            yPercent: 120,
            scale: 0.7,
            rotationZ: 15,
            opacity: 0
          })
        }
      })

      // Build the scroll sequence
      displayPhotos.forEach((_, i) => {
        if (i === 0) return // Skip 0 because it's already in view

        // Phase label to sync the exit of previous and entrance of current
        const label = `transition-${i}`
        tl.add(label)

        // Previous photo slides to the left and scales back (3D depth effect)
        tl.to(photosRef.current[i - 1], {
          xPercent: -80,
          scale: 0.6,
          rotationY: -30,
          rotationZ: -10,
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut'
        }, label)

        // Current photo swoops up from the bottom with a dynamic scale and rotation
        tl.to(photosRef.current[i], {
          yPercent: 0,
          scale: 1,
          rotationZ: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut'
        }, label)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [displayPhotos])

  if (displayPhotos.length === 0) return null

  return (
    <section ref={containerRef} className="relative w-full bg-[#03010A]">
      {/* The pinned viewport */}
      <div 
        ref={pinRef} 
        className="w-full h-[100svh] overflow-hidden flex items-center justify-center relative"
        style={{ perspective: '2000px' }} // Enables 3D rotations
      >
        {/* Title Overlay */}
        <div className="absolute top-12 md:top-16 z-50 text-center w-full pointer-events-none">
          <h2 className="font-['Playfair_Display'] text-[#e5c487] text-3xl md:text-5xl font-bold tracking-tight drop-shadow-2xl">
            The Top 10
          </h2>
          <p className="font-['Inter'] text-[#d0c5b5] text-xs md:text-sm uppercase tracking-[0.3em] mt-4 opacity-80">
            Scroll to experience
          </p>
        </div>

        {/* Photo Stack */}
        {displayPhotos.map((photo, i) => (
          <div
            key={i}
            ref={el => photosRef.current[i] = el}
            className="absolute w-[85vw] md:w-[65vw] max-w-5xl h-[65vh] md:h-[75vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(229,196,135,0.2)]"
            style={{
              zIndex: i + 1, // Ensure newer photos stack on top
              transformOrigin: 'bottom center', // Makes the pop-up rotation look grounded
              border: '1px solid rgba(229, 196, 135, 0.15)'
            }}
          >
            <img
              src={photo.src}
              alt={photo.name || `Memory ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03010A]/90 via-transparent to-transparent flex flex-col items-center justify-end p-8 md:p-16 text-center">
              <p className="font-['Inter'] text-[#c8a96e] text-xs md:text-sm tracking-[0.3em] uppercase mb-2">
                Memory {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-['Playfair_Display'] text-white text-3xl md:text-6xl font-bold leading-tight">
                {i === 0 ? "Where it begins" : i === displayPhotos.length - 1 ? "The best is yet to come" : "A timeless moment"}
              </h3>
            </div>
          </div>
        ))}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_#03010A] z-40" />
      </div>
    </section>
  )
}
