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

    // Fireflies canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const numParticles = device.isMobile ? 40 : 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 1) * 1.5 - 0.5,
        alpha: Math.random(),
        da: (Math.random() - 0.5) * 0.02
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        gradient.addColorStop(0, `rgba(212, 168, 67, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(212, 168, 67, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
        
        p.x += p.dx;
        p.y += p.dy;
        p.alpha += p.da;

        if (p.alpha <= 0 || p.alpha >= 1) p.da = -p.da;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [device.isMobile]);

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
      style={{ backgroundColor: 'var(--charcoal)' }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.25; }
        }
      `}</style>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      />
      
      {/* Cinematic multi-layered glow at center */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 animate-[breathe_6s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />
        <div className="absolute w-[200px] h-[200px] rounded-full blur-[60px] opacity-20" style={{ background: 'var(--cream)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center tap-prompt">
        <h1 className="font-display text-5xl md:text-6xl text-[var(--cream)] mb-4 tracking-widest opacity-90">
          For Hasini
        </h1>
        <p className="font-script text-lg text-[var(--gold)]/60 mb-12 tracking-[0.3em] uppercase">
          June 27, 2026
        </p>
        <div className="flex flex-col items-center">
          <p className="font-body text-xs md:text-sm text-[var(--gold)] mb-6 tracking-[0.4em] uppercase font-semibold opacity-70 animate-[pulse_3s_ease-in-out_infinite]">
            Tap Anywhere To Begin
          </p>
        </div>
      </div>
    </div>
  );
}
