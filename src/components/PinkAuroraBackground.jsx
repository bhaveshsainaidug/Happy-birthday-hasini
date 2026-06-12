import React, { useEffect, useRef } from 'react';

export default function PinkAuroraBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // 1. Draw flat dark charcoal base on CPU
      ctx.fillStyle = '#03010A';
      ctx.fillRect(0, 0, width, height);

      // 2. Slow time variable for waving animations
      const time = Date.now() * 0.0003;

      // Define three centers of light moving in slow organic orbits
      const x1 = width * 0.25 + Math.sin(time * 0.8) * width * 0.15;
      const y1 = height * 0.15 + Math.cos(time * 0.6) * height * 0.1;

      const x2 = width * 0.75 + Math.cos(time * 0.7) * width * 0.18;
      const y2 = height * 0.25 + Math.sin(time * 0.9) * height * 0.12;

      const x3 = width * 0.5 + Math.sin(time * 0.5) * width * 0.1;
      const y3 = height * 0.65 + Math.cos(time * 0.8) * height * 0.1;

      // Draw Aurora Orb 1: Pastel Pink Glow (Top-Left)
      const r1 = Math.max(width, height) * 0.55;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      g1.addColorStop(0, 'rgba(255, 182, 193, 0.16)'); // Light pink
      g1.addColorStop(0.5, 'rgba(232, 165, 152, 0.06)'); // Rose gold transition
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Draw Aurora Orb 2: Deep Pink/Magenta (Top-Right)
      const r2 = Math.max(width, height) * 0.6;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      g2.addColorStop(0, 'rgba(255, 105, 180, 0.14)'); // Hot pink
      g2.addColorStop(0.6, 'rgba(186, 85, 211, 0.04)'); // Medium orchid
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Draw Aurora Orb 3: Soft Lavender Rose (Center-Bottom)
      const r3 = Math.max(width, height) * 0.5;
      const g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
      g3.addColorStop(0, 'rgba(219, 112, 147, 0.12)'); // Pale violet red
      g3.addColorStop(0.5, 'rgba(255, 192, 203, 0.04)'); // Pink shimmer
      g3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
