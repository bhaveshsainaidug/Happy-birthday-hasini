import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SITE_URL } from '../content/content';

export default function Scene6() {
  const [toastVisible, setToastVisible] = useState(false);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  useEffect(() => {
    // Confetti burst on mount
    const colors = ['#D4A843', '#E8A598', '#F5ECD7', '#9BAF88'];
    
    setTimeout(() => {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true
      });
    }, 500); // slight delay for impact
  }, []);

  const balloons = Array.from({ length: 15 });

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
    <div className="scene-container flex flex-col items-center justify-center relative overflow-hidden">
      {/* Slow looping CSS gradient background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#000000'
        }}
      ></div>

      <style>{`
        @keyframes gradient-cycle {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-cycle {
          animation: gradient-cycle 15s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(
            to right,
            var(--charcoal) 20%,
            var(--gold) 40%,
            var(--gold) 60%,
            var(--charcoal) 80%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes float-balloon {
          0% { transform: translateY(100vh) translateX(0) scale(1); opacity: 1; }
          50% { transform: translateY(0vh) translateX(20px) scale(1.05); }
          100% { transform: translateY(-120vh) translateX(-20px) scale(1); opacity: 0; }
        }
        .balloon {
          position: absolute;
          bottom: -100px;
          width: 40px;
          height: 50px;
          border-radius: 50%;
          animation: float-balloon 12s ease-in-out infinite;
        }
        .balloon::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 8px solid currentColor;
        }
        .balloon::after {
          content: '';
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.4);
        }
      `}</style>

      {/* Balloons layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {balloons.map((_, i) => {
          const size = 30 + Math.random() * 40;
          const left = Math.random() * 100;
          const delay = Math.random() * 10;
          const duration = 10 + Math.random() * 10;
          const color = ['#D4A843', '#E8A598', '#9BAF88'][Math.floor(Math.random() * 3)];
          
          return (
            <div 
              key={i} 
              className="balloon opacity-80"
              style={{
                width: size + 'px',
                height: (size * 1.25) + 'px',
                left: left + '%',
                backgroundColor: color,
                color: color,
                animationDelay: delay + 's',
                animationDuration: duration + 's'
              }}
            ></div>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 flex flex-col items-center justify-center gap-y-2">
          <span className="text-shimmer drop-shadow-sm">
            Happy <span onClick={handleTwoClick} className="cursor-pointer">B</span>irthday,
          </span>
          <span className="text-shimmer drop-shadow-sm">Hasini! 🎂</span>
        </h1>
        
        <p className="font-display text-2xl md:text-3xl text-[var(--charcoal)] opacity-80 mb-12">
          June 27, 2026
        </p>

        {/* Secret Easter Egg Message */}
        <div 
          className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md pointer-events-none transition-opacity duration-1000 ${easterEggVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="font-script text-3xl md:text-4xl text-[var(--charcoal)] rotate-[-4deg] bg-[var(--cream)]/80 backdrop-blur p-6 rounded-lg shadow-xl border border-[var(--gold)]/30">
            I'll always be here for you.
          </p>
        </div>





      </div>
    </div>
  );
}
