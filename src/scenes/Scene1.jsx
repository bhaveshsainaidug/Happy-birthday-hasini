import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

export default function Scene1({ onComplete, startMusic }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const envelopeRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!envelopeRef.current || isOpen || isTransitioning) return;
    const envelope = envelopeRef.current;
    const rect = envelope.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Smooth 3D tilt Parallax on hover
    gsap.to(envelope, {
      rotateY: (x / rect.width) * 22,
      rotateX: -(y / rect.height) * 22,
      scale: 1.04,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!envelopeRef.current || isOpen || isTransitioning) return;
    gsap.to(envelopeRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  };

  const handleOpenLetter = () => {
    if (isOpen || isTransitioning) return;
    setIsOpen(true);
    
    // Smooth reset tilt
    if (envelopeRef.current) {
      gsap.to(envelopeRef.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out"
      });
    }

    // Start background music
    if (startMusic) startMusic();

    // Trigger cute heart and gold confetti burst
    const end = Date.now() + 1200;
    const colors = ['#E8A598', '#D4A843', '#F5ECD7', '#ff7b93'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0.3, y: 0.65 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 0.7, y: 0.65 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Let the user read the letter for 3.5 seconds, then advance automatically
    setTimeout(() => {
      handleAdvance();
    }, 3500);
  };

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Stardust vortex wipe transition out
    const wipe = document.createElement('div');
    Object.assign(wipe.style, {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'var(--charcoal)',
      zIndex: '100',
      pointerEvents: 'none',
      clipPath: 'circle(0% at 50% 50%)',
      willChange: 'clip-path'
    });
    document.body.appendChild(wipe);

    gsap.to(wipe, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        onComplete();
        gsap.to(wipe, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => wipe.remove()
        });
      }
    });
  };

  return (
    <div 
      className="scene-container flex flex-col items-center justify-center relative touch-manipulation select-none"
      style={{ backgroundColor: 'transparent' }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        .floating-envelope {
          animation: float 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="absolute w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] rounded-full blur-[80px] opacity-40" 
             style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)' }} />
        <div className="w-[300px] h-[300px] rounded-full blur-[100px] opacity-20" style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Envelope Container with 3D perspective wrapper */}
        <div 
          ref={envelopeRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleOpenLetter}
          className={`floating-envelope cursor-pointer transition-shadow duration-300 ${isOpen ? '' : 'hover:shadow-[0_20px_50px_rgba(212,168,67,0.15)]'}`}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div className="relative w-[300px] h-[200px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {/* The Envelope wrapper */}
            <div className="absolute inset-0 bg-[#35272a] rounded-xl border border-white/5 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1f1618] to-[#291e20]" />
            </div>

            {/* Letter Inside (Slides up) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ y: 45, opacity: 0, scale: 0.9 }}
                  animate={{ y: -105, opacity: 1, scale: 1.05 }}
                  exit={{ y: 45, opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 65, damping: 13 }}
                  className="absolute w-[270px] h-[170px] bg-[#FAF7F0] rounded-lg shadow-lg border border-[#e5c487]/30 p-5 flex flex-col items-center justify-center z-10"
                  style={{ transformOrigin: 'bottom center', transformStyle: 'preserve-3d', translateZ: '1px' }}
                >
                  <div className="absolute inset-2 border border-[var(--gold)]/20 rounded-md pointer-events-none" />
                  <h1 className="font-display text-2xl md:text-3xl text-[#2C2C2C] tracking-wide mb-1 font-semibold">
                    For Hasini
                  </h1>
                  <p className="font-script text-base text-[var(--gold)] mb-4 tracking-wider">
                    June 27, 2026
                  </p>
                  <p className="font-script text-sm text-gray-500 text-center italic leading-tight">
                    "A little story, crafted just for you.<br/>Tap to read..."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Envelope Front Flaps */}
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ transformStyle: 'preserve-3d', translateZ: '2px' }}>
              {/* Left triangle */}
              <div 
                className="absolute bottom-0 left-0 w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[150px] border-l-[#2c1f21]/95" 
                style={{ filter: 'drop-shadow(2px 0px 4px rgba(0,0,0,0.25))' }}
              />
              {/* Right triangle */}
              <div 
                className="absolute bottom-0 right-0 w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-r-[150px] border-r-[#2c1f21]/95"
                style={{ filter: 'drop-shadow(-2px 0px 4px rgba(0,0,0,0.25))' }}
              />
              {/* Bottom triangle */}
              <div 
                className="absolute bottom-0 left-0 w-full h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[110px] border-b-[#251a1c]"
                style={{ filter: 'drop-shadow(0px -2px 5px rgba(0,0,0,0.3))' }}
              />
            </div>

            {/* Top Flap */}
            <motion.div 
              initial={{ scaleY: 1 }}
              animate={isOpen ? { scaleY: -1, y: -98, zIndex: 5 } : { scaleY: 1 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-[100px] z-30 origin-top pointer-events-none"
            >
              <svg width="300" height="100" viewBox="0 0 300 100" fill="none">
                <path d="M0 0L150 100L300 0H0Z" fill="#35272a" stroke="#ffffff" strokeWidth="0.1" />
              </svg>
            </motion.div>

            {/* Wax Seal */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div 
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.45, ease: "back.in(1.2)" }}
                  className="absolute z-40 w-13 h-13 rounded-full bg-gradient-to-br from-[var(--rose)] to-red-500 flex items-center justify-center shadow-lg border border-white/20 active:scale-90 transition-transform"
                  style={{ translateZ: '3px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button */}
        {!isOpen ? (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleOpenLetter}
            className="mt-12 px-8 py-3 bg-gradient-to-r from-[#e5c487] to-[var(--gold)] text-[#03010A] font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-gold/15 transition-all duration-300 font-body text-xs tracking-[0.25em] uppercase cursor-pointer z-50 border border-white/10"
          >
            Start Birthday Story 🎬
          </motion.button>
        ) : (
          <div className="mt-12 text-center h-8">
            <p className="font-body text-xs md:text-sm text-[var(--gold)] tracking-[0.3em] uppercase font-semibold animate-pulse">
              Opening your special delivery...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
