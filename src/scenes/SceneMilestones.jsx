import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const milestones = [
  {
    year: "2006",
    title: "A Star Is Born 🌟",
    text: "The universe gained a bundle of joy, laughter, and infinite light. The beginning of a beautiful journey.",
    bgColor: "from-[#352226] to-[#1e1315]",
    tag: "June 27, 2006",
    accentColor: "#E8A598"
  },
  {
    year: "2016",
    title: "Double Digits! 🌸",
    text: "Ten years of spreading happiness, wobbly steps turning into confident strides, and a heart full of childhood dreams.",
    bgColor: "from-[#222e35] to-[#131b1e]",
    tag: "Ten Years Old",
    accentColor: "#9BAF88"
  },
  {
    year: "2024",
    title: "College Adventures! 🎓",
    text: "First year of B.Tech. A whole new chapter of finding our squad, late night assignments, and laughter in the hallways.",
    bgColor: "from-[#2f2235] to-[#1a131e]",
    tag: "The B.Tech Squad",
    accentColor: "#D4A843"
  },
  {
    year: "2026",
    title: "The Big 20! 🎂",
    text: "Two decades of warmth, grace, and wonderful memories. Standing on the edge of the most exciting years of your life.",
    bgColor: "from-[#352c22] to-[#1e1913]",
    tag: "Twenty Years Young",
    accentColor: "#FAF7F0"
  }
];

export default function SceneMilestones({ onComplete, audioAnalyser }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Audio-reactive states
  const [glowPulse, setGlowPulse] = useState(1);

  useEffect(() => {
    // Initial entrance fade in
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Auto advance slide index
    if (index >= milestones.length) {
      const timer = setTimeout(() => {
        handleAdvance();
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, 5500); // 5.5 seconds per slide for a richer experience

    return () => clearTimeout(timer);
  }, [index]);

  // Audio-reactive listener for pulse scaling
  useEffect(() => {
    if (!audioAnalyser) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const pulseLoop = () => {
      if (!active) return;
      audioAnalyser.getByteFrequencyData(dataArray);
      const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
      
      // Update local state smoothly
      const targetGlow = 1 + (bass / 255) * 0.35;
      setGlowPulse(prev => prev + (targetGlow - prev) * 0.15);

      requestAnimationFrame(pulseLoop);
    };

    pulseLoop();
    return () => { active = false; };
  }, [audioAnalyser]);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const wipe = document.createElement('div');
    Object.assign(wipe.style, {
      position: 'fixed', inset: 0, backgroundColor: 'var(--charcoal)', zIndex: 100, pointerEvents: 'none',
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
    });
    document.body.appendChild(wipe);

    gsap.to(wipe, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1.2,
      ease: "power3.inOut",
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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth 3D tilt
    gsap.to(card, {
      rotateY: (x / rect.width) * 18,
      rotateX: -(y / rect.height) * 18,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container flex flex-col items-center justify-center relative select-none overflow-hidden bg-transparent"
      style={{ perspective: '1200px' }}
    >
      {/* Title */}
      <div className="absolute top-8 md:top-12 z-20 text-center pointer-events-none">
        <h2 className="font-script text-4xl md:text-5xl text-[var(--gold)] drop-shadow-lg animate-pulse">
          Our Journey Through Time ⏳
        </h2>
        <p className="font-body text-xs text-[var(--cream)]/60 tracking-[0.2em] uppercase mt-2">
          cinematic milestones
        </p>
      </div>

      <div className="relative w-full max-w-xl h-[380px] flex items-center justify-center px-4" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence mode="wait">
          {index < milestones.length && (
            <motion.div
              key={index}
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ x: 250, opacity: 0, scale: 0.92, rotateY: 20, rotateX: -5 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
              exit={{ x: -250, opacity: 0, scale: 0.92, rotateY: -20, rotateX: 5 }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.36, 1] }}
              style={{ 
                transformStyle: 'preserve-3d', 
                perspective: '1000px',
                boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 168, 67, ${0.05 + (glowPulse - 1) * 0.3})`
              }}
              className={`absolute w-full p-8 md:p-12 rounded-3xl bg-gradient-to-br ${milestones[index].bgColor} border border-white/5 flex flex-col justify-center relative overflow-hidden`}
            >
              {/* Audio-reactive ambient light flare */}
              <div 
                className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] opacity-30 pointer-events-none transition-transform duration-75"
                style={{
                  backgroundColor: milestones[index].accentColor,
                  transform: `scale(${glowPulse})`
                }}
              />

              {/* 3D Parallax Year Digits */}
              <div className="absolute -right-4 -bottom-12 flex select-none pointer-events-none font-display font-black text-white/5 text-[9rem] md:text-[11rem] tracking-tighter" style={{ transformStyle: 'preserve-3d' }}>
                {milestones[index].year.split('').map((char, charIdx) => (
                  <motion.span
                    key={charIdx}
                    initial={{ translateZ: -250, opacity: 0, x: 60 }}
                    animate={{ translateZ: -100, opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + charIdx * 0.08, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Tag / Category */}
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[var(--gold)] text-xs font-semibold tracking-[0.25em] uppercase mb-4 font-body block"
              >
                {milestones[index].tag}
              </motion.span>

              {/* Title with subtle slide-up stagger */}
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                className="font-display text-2xl md:text-3xl text-white font-bold mb-4 drop-shadow-sm leading-tight"
              >
                {milestones[index].title}
              </motion.h3>

              {/* Body text */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                className="font-body text-base md:text-lg text-[var(--cream)] leading-relaxed font-medium z-10"
              >
                {milestones[index].text}
              </motion.p>

              {/* Glowing horizontal divider line inside */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "power2.out" }}
                className="absolute top-0 bottom-0 left-0 w-1 origin-top"
                style={{ backgroundColor: milestones[index].accentColor }}
              />

              {/* Neon Progress Fuse at card bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ scaleX: 0, transformOrigin: 'left center' }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                  className="h-full"
                  style={{ backgroundColor: milestones[index].accentColor }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-10 z-20 flex gap-2">
        {milestones.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-6 bg-[var(--gold)]' : 'w-1.5 bg-white/20'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
