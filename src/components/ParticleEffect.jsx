import React, { useEffect, useRef } from 'react';
import { useDevice } from '../hooks/useDevice';

export default function ParticleEffect({ mode }) {
  const canvasRef = useRef(null);
  const device = useDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Fewer particles for hearts, more for dots
    const numParticles = mode === 'hearts' 
      ? (device.isMobile ? 15 : 30) 
      : (device.isMobile ? 40 : 80);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: mode === 'hearts' ? Math.random() * 8 + 8 : Math.random() * 2 + 0.5, // hearts are bigger
        dx: (Math.random() - 0.5) * 0.5,
        dy: mode === 'hearts' ? - (Math.random() * 1.5 + 1) : (Math.random() - 1) * 1.5 - 0.5, // hearts float up faster
        alpha: Math.random(),
        da: (Math.random() - 0.5) * 0.02
      });
    }

    const drawHeart = (ctx, x, y, size, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 30, size / 30);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ff7b93';
      ctx.beginPath();
      // Heart path
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-15, -10, -30, 10, 0, 30);
      ctx.bezierCurveTo(30, 10, 15, -10, 0, 10);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        if (mode === 'hearts') {
          drawHeart(ctx, p.x, p.y, p.r, p.alpha);
        } else {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          gradient.addColorStop(0, `rgba(212, 168, 67, ${p.alpha})`);
          gradient.addColorStop(1, `rgba(212, 168, 67, 0)`);
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        
        p.x += p.dx;
        p.y += p.dy;
        p.alpha += p.da;

        if (mode === 'hearts') {
          // Fade in and out more smoothly for hearts
          if (p.alpha <= 0) {
            p.y = canvas.height + 20; // reset to bottom
            p.x = Math.random() * canvas.width;
            p.alpha = 0;
            p.da = Math.abs(p.da); // ensure fading in
          } else if (p.alpha >= 1) {
            p.da = -Math.abs(p.da); // ensure fading out
          }
          if (p.y < -30) {
            p.y = canvas.height + 20;
            p.x = Math.random() * canvas.width;
            p.alpha = 0;
            p.da = Math.abs(p.da);
          }
        } else {
          if (p.alpha <= 0 || p.alpha >= 1) p.da = -p.da;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [device.isMobile, mode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-10 pointer-events-none"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    />
  );
}
