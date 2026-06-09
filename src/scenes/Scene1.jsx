import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useDevice } from '../hooks/useDevice';

export default function Scene1({ onComplete, startMusic }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const device = useDevice();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // GSAP Entrance
    gsap.fromTo('.tap-prompt', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, delay: 0.8, ease: "power2.out" });
  }, []);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Start background music on first interaction
    if (startMusic) startMusic();

    // Soft white flash transition
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.backgroundColor = '#fff';
    flash.style.opacity = '0';
    flash.style.zIndex = '100';
    flash.style.pointerEvents = 'none';
    flash.style.willChange = 'opacity';
    document.body.appendChild(flash);

    gsap.to(flash, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete();
        gsap.to(flash, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => flash.remove()
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleAdvance}
      className="scene-container flex flex-col items-center justify-center cursor-pointer touch-manipulation"
      style={{ backgroundColor: 'transparent' }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.25; }
        }
      `}</style>
      
      {/* Cinematic multi-layered glow at center */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        {/* Dark vignette behind text for legibility */}
        <div className="absolute w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] rounded-full blur-[80px] opacity-60" 
             style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)' }} />
        <div className="w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 animate-[breathe_6s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />
        <div className="absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-20" style={{ background: 'var(--cream)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center tap-prompt">
        <h1 
          className="font-display text-5xl md:text-6xl text-[var(--cream)] mb-4 tracking-widest opacity-90"
          style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 24px rgba(0, 0, 0, 0.4)' }}
        >
          For Hasini
        </h1>
        <p 
          className="font-script text-lg text-[var(--gold)]/80 mb-12 tracking-[0.3em] uppercase drop-shadow-lg"
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)' }}
        >
          June 27, 2026
        </p>
        <div className="flex flex-col items-center">
          <p 
            className="font-body text-xs md:text-sm text-[var(--gold)] mb-6 tracking-[0.4em] uppercase font-semibold opacity-90 animate-[pulse_3s_ease-in-out_infinite]"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}
          >
            Tap Anywhere To Begin
          </p>
        </div>
      </div>
    </div>
  );
}
