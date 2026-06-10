import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { futureWishes } from '../content/content';

export default function Scene6({ audioAnalyser }) {
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [candleOut, setCandleOut] = useState(false);
  const [openedWishes, setOpenedWishes] = useState({});
  const [shakingWishes, setShakingWishes] = useState({});
  
  const containerRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const dateRef = useRef(null);

  // Audio-reactive flame height
  const [flameHeight, setFlameHeight] = useState(1);

  useEffect(() => {
    const colors = ['#D4A843', '#E8A598', '#F5ECD7', '#9BAF88'];
    
    // Initial text entry animations
    gsap.fromTo([title1Ref.current, title2Ref.current], 
      { y: 30, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        ease: "back.out(1.5)", 
        delay: 0.2, 
        stagger: 0.15,
        onStart: () => {
          setTimeout(() => {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.75 },
              colors: colors,
              disableForReducedMotion: true
            });
          }, 600);
        }
      }
    );

    gsap.fromTo(dateRef.current,
      { opacity: 0 },
      { opacity: 0.7, duration: 1, delay: 1 }
    );
  }, []);

  // Audio listener for wiggling candle flame height
  useEffect(() => {
    if (!audioAnalyser || candleOut) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const flameWiggle = () => {
      if (!active || candleOut) return;
      audioAnalyser.getByteFrequencyData(dataArray);
      
      const mid = (dataArray[10] + dataArray[11] + dataArray[12] + dataArray[13]) / 4;
      const targetHeight = 0.85 + (mid / 255) * 0.55;
      
      setFlameHeight(prev => prev + (targetHeight - prev) * 0.2);
      requestAnimationFrame(flameWiggle);
    };

    flameWiggle();
    return () => { active = false; };
  }, [audioAnalyser, candleOut]);

  // Autoplay Candle Blowout Schedule
  useEffect(() => {
    const timer = setTimeout(() => {
      blowCandle();
    }, 3200); 
    return () => clearTimeout(timer);
  }, []);

  // Autoplay Wish Unwrap Schedule (shakes first, then flips!)
  useEffect(() => {
    if (!candleOut) return;

    const timers = [
      // Gift 1: shakes at 1s, opens at 1.8s
      setTimeout(() => setShakingWishes(prev => ({ ...prev, 0: true })), 1000),
      setTimeout(() => {
        setShakingWishes(prev => ({ ...prev, 0: false }));
        toggleWish(0);
      }, 1800),

      // Gift 2: shakes at 4.2s, opens at 5.0s
      setTimeout(() => setShakingWishes(prev => ({ ...prev, 1: true })), 4200),
      setTimeout(() => {
        setShakingWishes(prev => ({ ...prev, 1: false }));
        toggleWish(1);
      }, 5000),

      // Gift 3: shakes at 7.4s, opens at 8.2s
      setTimeout(() => setShakingWishes(prev => ({ ...prev, 2: true })), 7400),
      setTimeout(() => {
        setShakingWishes(prev => ({ ...prev, 2: false }));
        toggleWish(2);
      }, 8200)
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [candleOut]);

  const blowCandle = () => {
    if (candleOut) return;
    setCandleOut(true);

    const colors = ['#D4A843', '#E8A598', '#F5ECD7', '#9BAF88', '#ff7b93'];
    
    // Massive celebration confetti explosions
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: colors,
        zIndex: 9999
      });
    }, 350);
  };

  const toggleWish = (idx) => {
    setOpenedWishes(prev => ({ ...prev, [idx]: true }));
    
    // Sparkle confetti for unboxing
    confetti({
      particleCount: 25,
      spread: 45,
      colors: ['#D4A843', '#E8A598', '#9BAF88'],
      origin: { y: 0.7 }
    });
  };

  const handleTwoClick = () => {
    const newCount = easterEggClicks + 1;
    setEasterEggClicks(newCount);
    
    if (newCount === 3) {
      setEasterEggVisible(true);
      setTimeout(() => {
        setEasterEggVisible(false);
        setEasterEggClicks(0);
      }, 4000);
    }
  };

  const allWishesOpened = Object.keys(openedWishes).length === futureWishes.length;

  return (
    <div 
      ref={containerRef} 
      className="scene-container flex flex-col items-center justify-start overflow-y-auto py-12 md:py-16 relative bg-transparent select-none cinematic-scrollbar"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(
            to right,
            var(--cream) 20%,
            var(--gold) 40%,
            #fff8e7 60%,
            var(--cream) 80%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          50% { transform: scale(1.08) rotate(1.5deg); }
        }
        .animate-flicker {
          animation: flicker 0.15s ease-in-out infinite alternate;
        }
        @keyframes smoke {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          15% { opacity: 0.6; }
          100% { transform: translateY(-35px) scaleX(1.4); opacity: 0; }
        }
        .animate-smoke {
          animation: smoke 2.2s ease-out forwards;
        }
        @keyframes gift-shake {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20%, 60% { transform: rotate(-8deg) scale(1.08); }
          40%, 80% { transform: rotate(8deg) scale(1.08); }
        }
        .animate-gift-shake {
          animation: gift-shake 0.4s ease-in-out infinite;
        }
        
        /* 3D Flip Card CSS */
        .flip-card {
          perspective: 1000px;
          width: 100%;
          min-height: 160px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1rem;
        }
        .flip-card-front {
          background: linear-gradient(135deg, #2f2224, #1e1516);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .flip-card-back {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 168, 67, 0.3);
          backdrop-filter: blur(8px);
          transform: rotateY(180deg);
        }
        
        /* Light flare sweep animation */
        @keyframes flare {
          0% { left: -150%; }
          100% { left: 150%; }
        }
        .flare-sweep {
          position: absolute;
          top: 0;
          height: 100%;
          width: 40px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-30deg);
          animation: flare 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background radial shadow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] rounded-full blur-[90px] opacity-60" 
             style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 75%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-3xl">
        
        {/* Header Title */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 flex flex-col items-center justify-center gap-y-2 select-none">
          <span ref={title1Ref} className="text-shimmer drop-shadow-lg scene6-title">
            Happy <span onClick={handleTwoClick} className="cursor-pointer font-bold select-none">B</span>irthday,
          </span>
          <span ref={title2Ref} className="text-shimmer drop-shadow-lg scene6-title">Hasini! 🎂</span>
        </h1>
        
        <p ref={dateRef} className="font-body text-lg md:text-xl text-[var(--gold)]/75 opacity-70 mb-10 tracking-[0.3em] uppercase font-semibold">
          June 27, 2026
        </p>

        {/* 3D-effect SVG Cake */}
        <div className="flex flex-col items-center gap-3 z-30 mb-8">
          <div className="relative filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
            <svg width="220" height="200" viewBox="0 0 220 200" className="select-none">
              <ellipse cx="110" cy="170" rx="90" ry="12" fill="#FAF7F0" opacity="0.1" />
              
              <path d="M 30 130 A 80 15 0 0 0 190 130 L 190 160 A 80 15 0 0 1 30 160 Z" fill="#E8A598" />
              <ellipse cx="110" cy="130" rx="80" ry="15" fill="#e28a7a" />
              
              <circle cx="50" cy="142" r="1.5" fill="var(--gold)" />
              <circle cx="80" cy="148" r="1.5" fill="var(--cream)" />
              <circle cx="110" cy="151" r="1.5" fill="var(--gold)" />
              <circle cx="140" cy="149" r="1.5" fill="var(--cream)" />
              <circle cx="170" cy="141" r="1.5" fill="var(--gold)" />

              <path d="M 50 85 A 60 12 0 0 0 170 85 L 170 120 A 60 12 0 0 1 50 120 Z" fill="#FAF7F0" />
              <ellipse cx="110" cy="85" rx="60" ry="12" fill="#f5eedd" />
              
              <path d="M 50 85 Q 58 100 66 85 Q 74 102 82 85 Q 90 98 98 85 Q 106 102 114 85 Q 122 98 130 85 Q 138 102 146 85 Q 154 98 162 85 L 170 85 L 170 94 Q 162 101 154 94 Q 146 103 138 94 Q 130 101 122 94 Q 114 103 106 94 Q 98 101 90 94 L 50 94 Z" fill="#FAF7F0" />
              
              <circle cx="75" cy="81" r="5" fill="#A85856" />
              <circle cx="110" cy="78" r="5" fill="#A85856" />
              <circle cx="145" cy="81" r="5" fill="#A85856" />

              <rect x="107" y="45" width="6" height="25" fill="#D4A843" rx="2" />
              
              {!candleOut && (
                <g className="animate-flicker" style={{ transformOrigin: '110px 45px', transform: `scale(${flameHeight})` }}>
                  <path d="M 110 22 C 105 31 105 39 110 42 C 115 39 115 31 110 22 Z" fill="#ff9800" />
                  <path d="M 110 28 C 107 33 107 38 110 40 C 113 40 113 33 110 28 Z" fill="#ffeb3b" />
                </g>
              )}
              
              {candleOut && (
                <path className="animate-smoke" style={{ transformOrigin: '110px 40px' }} d="M 110 42 Q 107 30 114 24 T 108 10" stroke="#FAF7F0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
              )}
            </svg>
          </div>

          <p className="font-body text-xs text-[var(--cream)]/60 transition-opacity uppercase tracking-widest mt-1">
            {candleOut ? 'Wish made! 🌟' : 'Making a wish...'}
          </p>
        </div>

        {/* Future Wishes Section (with 3D Flips) */}
        <AnimatePresence>
          {candleOut && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex flex-col items-center z-20 mb-8"
            >
              <h2 className="font-script text-3xl text-[var(--gold)] mb-6 drop-shadow">
                Your Wishes 🎁
              </h2>
              
              {/* 3D Flip Gift boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl px-2">
                {futureWishes.map((wish, idx) => (
                  <div key={idx} className="flip-card">
                    <div className={`flip-card-inner shadow-2xl ${
                      openedWishes[idx] ? 'flipped' : ''
                    } ${
                      shakingWishes[idx] ? 'animate-gift-shake' : ''
                    }`}>
                      
                      {/* Front face (🎁 Unwrap wrapping) */}
                      <div className="flip-card-front flex flex-col items-center justify-center p-5 select-none relative overflow-hidden">
                        <div className="flare-sweep" />
                        <span className="text-4xl mb-2.5 block">🎁</span>
                        <h3 className="font-body text-xs uppercase tracking-[0.2em] text-[var(--gold)]/70 font-bold">
                          {shakingWishes[idx] ? 'Opening...' : 'Unwrapping'}
                        </h3>
                        <p className="font-script text-sm text-[var(--cream)]/45 mt-1">Please wait</p>
                      </div>

                      {/* Back face (Wish text card) */}
                      <div className="flip-card-back flex flex-col items-center justify-center p-5 select-none relative">
                        <div className="absolute inset-2 border border-[var(--gold)]/20 rounded-lg pointer-events-none" />
                        <span className="text-xl mb-1 inline-block">✨</span>
                        <h3 className="font-body text-xs uppercase tracking-[0.25em] text-[var(--gold)] font-bold mb-2">{wish.title}</h3>
                        <p className="font-body text-xs text-[var(--cream)]/85 leading-relaxed font-medium">{wish.text}</p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Message Card */}
        <AnimatePresence>
          {candleOut && allWishesOpened && (
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
              className="w-full max-w-md mx-auto bg-white/5 border border-[var(--gold)]/20 rounded-2xl p-6 backdrop-blur-sm shadow-[0_25px_50px_-12px_rgba(212,168,67,0.15)] mb-12 relative overflow-hidden"
            >
              <div className="absolute inset-1.5 border border-[var(--gold)]/15 rounded-xl pointer-events-none" />
              <p className="font-script text-xl text-[var(--cream)]/85 text-center leading-relaxed italic">
                "Twenty years down, a whole lifetime of adventures ahead. 
                We'll be cheering you on every step of the way. 🤍"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secret Easter Egg Message */}
        <div 
          className={`absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs pointer-events-none transition-opacity duration-1000 ${
            easterEggVisible ? 'opacity-100 z-50' : 'opacity-0 -z-10'
          }`}
        >
          <p className="font-script text-2xl text-[#1a1a1a] rotate-[-3deg] bg-[#FAF7F0] p-5 rounded-lg shadow-2xl border border-[var(--gold)]/40 text-center">
            "I'll always be here for you."
          </p>
        </div>
      </div>
    </div>
  );
}
