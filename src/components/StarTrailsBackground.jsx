import React, { useEffect, useRef } from 'react';

export default function StarTrailsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    const numStars = 140; // Optimized count for buttery 60 FPS on low-power projector hardware

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Fill background with solid black initially
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      stars = [];
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        // Base diagonal speed parameters
        const speed = Math.random() * 1.2 + 0.4;
        const dx = -speed * 1.1; // Move leftwards
        const dy = speed * 0.65; // Move downwards
        
        const size = Math.random() * 2.0 + 0.8; // Thicker lines for increased brightness
        
        // High-contrast warm palette colors
        const color = ['#D4A843', '#E8A598', '#FAF7F0', '#A3B899', '#FFFFFF'][Math.floor(Math.random() * 5)];
        const alpha = Math.random() * 0.4 + 0.6; // High base brightness (60% to 100% opacity)

        stars.push({
          x,
          y,
          dx,
          dy,
          size,
          color,
          alpha,
          lastX: x,
          lastY: y
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clears canvas slowly (0.03 opacity overlay) so trails fade out gradually,
      // creating gorgeous, bright diagonal tracks.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const p = stars[i];
        
        // Update positions
        p.x += p.dx;
        p.y += p.dy;

        // Draw line from last position to new position (gapless trails)
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.alpha;
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Update previous coordinates
        p.lastX = p.x;
        p.lastY = p.y;

        // Wrap around when exiting bottom-left boundary
        if (p.x < -40 || p.y > height + 40) {
          // Re-spawn star at top edge or right edge to maintain uniform sky density
          if (Math.random() < 0.5) {
            p.x = Math.random() * width + (width * 0.2); // Right/middle side
            p.y = -40; // Top edge
          } else {
            p.x = width + 40; // Right edge
            p.y = Math.random() * height - (height * 0.2); // Top/middle side
          }
          p.lastX = p.x;
          p.lastY = p.y;
        }
      }

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
