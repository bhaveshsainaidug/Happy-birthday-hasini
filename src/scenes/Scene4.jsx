import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { letterContent } from '../content/content';

export default function Scene4({ onComplete, audioAnalyser }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const textContainerRef = useRef(null);
  const heartRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Audio-reactive state
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    // Reveal card first
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0, scale: 0.95, rotateX: 10 },
      { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.2, ease: "power3.out" }
    );

    // Text reveal animation: word by word
    const words = textContainerRef.current.querySelectorAll('.letter-word');
    gsap.set(words, { y: 12, opacity: 0 });
    
    const tl = gsap.timeline({ delay: 0.6 });

    tl.to(words, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.12, 
      ease: "power2.out"
    });

    // Heart drawing animation at the end
    gsap.set(heartRef.current, { strokeDasharray: 100, strokeDashoffset: 100 });
    tl.to(heartRef.current, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "power1.inOut",
      onComplete: () => {
        setShowButton(true);
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Audio-reactive listener to wiggle/pulse the handwriting text shadows
  useEffect(() => {
    if (!audioAnalyser) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const textPulse = () => {
      if (!active) return;
      audioAnalyser.getByteFrequencyData(dataArray);
      
      const treble = (dataArray[24] + dataArray[25] + dataArray[26] + dataArray[27]) / 4;
      const targetGlow = 1 + (treble / 255) * 0.8;
      
      setGlowIntensity(prev => prev + (targetGlow - prev) * 0.12);
      requestAnimationFrame(textPulse);
    };

    textPulse();
    return () => { active = false; };
  }, [audioAnalyser]);

  // Autoplay transition
  useEffect(() => {
    if (showButton) {
      const timer = setTimeout(() => {
        handleAdvance();
      }, 6500); // 6.5 seconds to read letter signoff, then auto-advances
      return () => clearTimeout(timer);
    }
  }, [showButton]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || isTransitioning) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Smooth tilt parallax on mouse move
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    const rotateX = -((y - rect.height / 2) / rect.height) * 8;
    gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: "power1.out" });

    // Throttle sparkles
    if (Math.random() > 0.18) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'absolute pointer-events-none select-none z-50 text-xs text-[var(--gold)]';
    sparkle.innerHTML = Math.random() > 0.5 ? '✨' : '🌸';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.8 + 0.6})`;
    sparkle.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    card.appendChild(sparkle);

    setTimeout(() => {
      sparkle.style.transform = 'translate(-50%, -100%) scale(0) rotate(180deg)';
      sparkle.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      sparkle.remove();
    }, 800);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || isTransitioning) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
  };

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Realistic folding fold-up animation of the letter sheet before exiting
    const tl = gsap.timeline();
    gsap.set(containerRef.current, { transformOrigin: "center center", zIndex: 100 });
    gsap.set(document.documentElement, { perspective: 1200 });

    // 1. Fold card in 3D half
    tl.to(cardRef.current, {
      rotateY: -45,
      scaleY: 0.9,
      duration: 0.6,
      ease: "power2.inOut"
    });

    // 2. Slide/swoop left curl off-screen
    tl.to(containerRef.current, {
      rotationY: -90,
      x: "-120%",
      opacity: 0,
      duration: 0.9,
      ease: "power3.in",
      force3D: true,
      onComplete: () => {
        onComplete();
      }
    }, "-=0.2");
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container overflow-hidden text-[#2C2C2C] touch-manipulation flex flex-col justify-center items-center px-4"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <div className="w-[600px] h-[400px] rounded-full blur-[150px]" style={{ backgroundColor: 'var(--rose)' }} />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-black/40 md:bg-transparent">
        <div className="hidden md:block absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
      </div>

      {/* Elegant Letter Sheet */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-2xl shadow-[0_30px_70px_-10px_rgba(0,0,0,0.5)] border border-[#e5c487]/30 px-6 py-8 md:p-12 z-10 overflow-hidden select-none"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Parchment design lines / gold borders */}
        <div className="absolute inset-3 border border-[#e5c487]/30 rounded-lg pointer-events-none" />
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#e5c487] pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#e5c487] pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#e5c487] pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#e5c487] pointer-events-none" />

        <div ref={textContainerRef} className="w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 opacity-0 letter-word">
            <div className="h-px flex-1 bg-[#e5c487]/30"></div>
            <span className="text-[#e5c487] text-xs tracking-[0.4em] uppercase font-body font-semibold">A Letter</span>
            <div className="h-px flex-1 bg-[#e5c487]/30"></div>
          </div>

          {/* Greeting */}
          <p className="font-script text-3xl md:text-4xl mb-4 text-[#A85856] drop-shadow-sm font-semibold">
            {letterContent.greeting.split(' ').map((word, wIdx) => (
              <span key={`g-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.3em]">{word}</span>
            ))}
          </p>
          
          {/* Paragraphs */}
          {letterContent.paragraphs.map((para, idx) => (
            <p key={idx} className="font-script text-lg md:text-xl leading-relaxed md:leading-loose mb-4 text-[#3a3a3a] font-medium">
              {para.split(' ').map((word, wIdx) => (
                <span key={`${idx}-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.25em]">{word}</span>
              ))}
            </p>
          ))}

          {/* Signoff */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span 
              className="font-script text-xl md:text-2xl font-bold transition-all duration-75"
              style={{ 
                color: '#a28038',
                textShadow: `0 0 ${glowIntensity * 8}px rgba(212,168,67,${(glowIntensity - 1) * 0.5})` 
              }}
            >
              {letterContent.signOff.split(' ').map((word, wIdx) => (
                <span key={`s-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.25em]">{word}</span>
              ))}
            </span>
            <svg className="inline-block opacity-0 letter-word" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A85856" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path ref={heartRef} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>

        {/* Autoplay loading indicator */}
        {showButton && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-8 flex justify-center"
          >
            <p className="font-body text-xs text-[#a28038] tracking-[0.2em] uppercase font-bold animate-pulse">
              Up Next: Birthday Celebrations... 🎂
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
