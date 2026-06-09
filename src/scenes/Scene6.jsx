import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function Scene6() {
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [candleOut, setCandleOut] = useState(false);
  
  const containerRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    // GSAP Cinematic Entrance
    const colors = ['#D4A843', '#E8A598', '#F5ECD7', '#9BAF88'];
    
    gsap.fromTo([title1Ref.current, title2Ref.current], 
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.4)", delay: 0.3, stagger: 0.2,
        onStart: () => {
          setTimeout(() => {
            confetti({
              particleCount: 180,
              spread: 100,
              origin: { y: 0.6 },
              colors: colors,
              disableForReducedMotion: true
            });
          }, 800);
        }
      }
    );

    gsap.fromTo(dateRef.current,
      { opacity: 0 },
      { opacity: 0.7, duration: 1, delay: 1.2 }
    );

    // Auto blow out candle after 4 seconds
    const timer = setTimeout(() => {
      setCandleOut(true);
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, zIndex: 9999 });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleTwoClick = () => {
    const newCount = easterEggClicks + 1;
    setEasterEggClicks(newCount);
    
    if (newCount === 3) {
      setEasterEggVisible(true);
      setTimeout(() => {
        setEasterEggVisible(false);
        setEasterEggClicks(0); // reset
      }, 4000);
    }
  };

  return (
    <div ref={containerRef} className="scene-container flex flex-col items-center justify-center relative overflow-hidden bg-transparent">

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
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 flex flex-col items-center justify-center gap-y-2">
          <span ref={title1Ref} className="text-shimmer drop-shadow-lg scene6-title">
            Happy <span onClick={handleTwoClick} className="cursor-pointer">B</span>irthday,
          </span>
          <span ref={title2Ref} className="text-shimmer drop-shadow-lg scene6-title">Hasini! 🎂</span>
        </h1>
        
        <p ref={dateRef} className="font-display text-2xl md:text-3xl text-[var(--cream)] opacity-70 mb-12 scene6-date">
          June 27, 2026
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 z-30">
          <div className="text-5xl transition-all duration-500 hover:scale-110 active:scale-95">
            {candleOut ? '🎂' : '🕯️'}
          </div>
          <p className="font-script text-lg text-[var(--cream)]/50 transition-opacity">
            {candleOut ? 'Wish made! 🌟' : 'Making a wish...'}
          </p>
        </div>

        {/* Final Message Card */}
        {candleOut && (
          <div className="mt-8 max-w-sm mx-auto bg-white/5 border border-[var(--gold)]/20 rounded-xl p-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="font-script text-xl text-[var(--cream)]/80 text-center leading-relaxed">
              "Twenty years down, a whole lifetime of adventures ahead. 
              We'll be cheering you on every step of the way. 🤍"
            </p>
          </div>
        )}

        {/* Secret Easter Egg Message */}
        <div 
          className={`absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md pointer-events-none transition-opacity duration-1000 ${easterEggVisible ? 'opacity-100 z-50' : 'opacity-0 -z-10'}`}
        >
          <p className="font-script text-3xl md:text-4xl text-[#1a1a1a] rotate-[-4deg] bg-[var(--cream)]/90 backdrop-blur p-6 rounded-lg shadow-2xl border border-[var(--gold)]/50">
            I'll always be here for you.
          </p>
        </div>
      </div>
    </div>
  );
}
