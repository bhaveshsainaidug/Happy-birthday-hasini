import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    author: "Your brother Bhavesh",
    role: "The Big Brother 🤍",
    text: "Always the first to laugh, and the strongest support in times of chaos. So proud to be your big brother. I will always have your back, no matter where life leads you!",
    color: "var(--gold)",
    avatar: "👑"
  },
  {
    author: "Your bestie Chandu",
    role: "Partner In Crime since childhood 💫",
    text: "From playground games to late night college assignments, we've shared a lifetime of secrets and smiles. College is so much brighter with your crazy positive vibes!",
    color: "var(--rose)",
    avatar: "🦋"
  },
  {
    author: "Your friend Deekshitha",
    role: "Source of positive vibes 🌸",
    text: "You are the absolute light of our squad. Your laughter is contagious, and you make even the most boring lectures feel like a party. Never lose that spark!",
    color: "var(--sage)",
    avatar: "💛"
  }
];

export default function SceneQuotes({ onComplete, audioAnalyser }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Audio-reactive state
  const [ringGlow, setRingGlow] = useState(1);

  useEffect(() => {
    // Entrance fade in
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Autoplay quote sequence
    if (index >= quotes.length) {
      const timer = setTimeout(() => {
        handleAdvance();
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, 5500); // 5.5s per quote slide

    return () => clearTimeout(timer);
  }, [index]);

  // Audio-reactive listener for visualizer ring behind the card
  useEffect(() => {
    if (!audioAnalyser) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const ringLoop = () => {
      if (!active) return;
      audioAnalyser.getByteFrequencyData(dataArray);
      
      // Focus on treble/high frequencies
      let treble = 0;
      for (let i = 16; i < 32; i++) treble += dataArray[i];
      treble /= 16;

      const targetGlow = 1 + (treble / 255) * 0.45;
      setRingGlow(prev => prev + (targetGlow - prev) * 0.18);

      requestAnimationFrame(ringLoop);
    };

    ringLoop();
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
    
    gsap.to(card, {
      rotateY: (x / rect.width) * 20,
      rotateX: -(y / rect.height) * 20,
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
          What You Mean to Us 🤍
        </h2>
        <p className="font-body text-xs text-[var(--cream)]/60 tracking-[0.2em] uppercase mt-2">
          words from the squad
        </p>
      </div>

      {/* Audio-reactive rotating stardust portal ring behind card */}
      <div 
        className="absolute w-[360px] h-[360px] md:w-[460px] md:h-[460px] rounded-full border border-dashed pointer-events-none z-0 transition-transform duration-75"
        style={{
          borderColor: index < quotes.length ? `${quotes[index].color}20` : 'rgba(255,255,255,0.05)',
          transform: `scale(${ringGlow}) rotate(${ringGlow * 45}deg)`,
          boxShadow: index < quotes.length ? `0 0 60px ${quotes[index].color}08` : 'none'
        }}
      />

      <div className="relative w-full max-w-lg h-[360px] flex items-center justify-center px-4" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence mode="wait">
          {index < quotes.length && (
            <motion.div
              key={index}
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -90, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              className="absolute w-full p-8 md:p-10 rounded-3xl bg-[#09070f]/80 border border-white/10 shadow-2xl backdrop-blur-md flex flex-col justify-center relative overflow-hidden"
            >
              {/* Light flare sweep on card container */}
              <div 
                className="absolute inset-0 w-[150%] h-full pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${quotes[index].color}08, transparent)`,
                  transform: 'skewX(-25deg) translateX(-150%)',
                  animation: 'shimmer-sweep 3s ease-in-out infinite'
                }}
              />
              <style>{`
                @keyframes shimmer-sweep {
                  0% { transform: skewX(-25deg) translateX(-150%); }
                  100% { transform: skewX(-25deg) translateX(150%); }
                }
              `}</style>

              {/* Giant decorative quotation mark */}
              <div 
                className="absolute right-8 top-2 text-[12rem] font-serif font-black select-none pointer-events-none"
                style={{ color: quotes[index].color, opacity: 0.05, lineHeight: 1 }}
              >
                “
              </div>

              {/* Avatar Icon */}
              <motion.div 
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg border"
                style={{ borderColor: `${quotes[index].color}30`, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                {quotes[index].avatar}
              </motion.div>

              {/* Text paragraph (stagger word slide up) */}
              <div className="font-script text-xl md:text-2xl text-[var(--cream)]/90 leading-relaxed mb-6 font-medium italic overflow-hidden">
                {quotes[index].text.split(' ').map((word, wIdx) => (
                  <motion.span
                    key={wIdx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + wIdx * 0.04, ease: "easeOut" }}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Author & role */}
              <div className="flex flex-col">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="font-body text-sm font-bold tracking-wide" 
                  style={{ color: quotes[index].color }}
                >
                  {quotes[index].author}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.5, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="font-body text-xs text-[var(--cream)] uppercase tracking-wider mt-1"
                >
                  {quotes[index].role}
                </motion.span>
              </div>

              {/* Decorative color tag at bottom corner */}
              <div 
                className="absolute bottom-0 right-0 w-24 h-1 rounded-l-full"
                style={{ backgroundColor: quotes[index].color }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-10 z-20 flex gap-2">
        {quotes.map((_, i) => (
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
