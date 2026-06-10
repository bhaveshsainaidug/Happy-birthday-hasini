import React, { useEffect, useRef } from 'react';
import { useDevice } from '../hooks/useDevice';

export default function ParticleEffect({ mode, audioAnalyser }) {
  const canvasRef = useRef(null);
  const device = useDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Depth-of-field 3D particle config
    const numParticles = mode === 'hearts' 
      ? (device.isMobile ? 18 : 35) 
      : (device.isMobile ? 50 : 100);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles with Z-depth
    for (let i = 0; i < numParticles; i++) {
      const z = Math.random() * 3 + 0.5;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: z,
        r: mode === 'hearts' ? Math.random() * 6 + 4 : Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: mode === 'hearts' ? -(Math.random() * 0.8 + 0.4) : -(Math.random() * 0.5 + 0.2), 
        alpha: Math.random() * 0.7 + 0.1,
        da: (Math.random() - 0.5) * 0.015,
        color: ['#D4A843', '#E8A598', '#F5ECD7', '#FFB3C6'][Math.floor(Math.random() * 4)]
      });
    }

    const drawHeart = (ctx, x, y, size, alpha, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 24, size / 24);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.bezierCurveTo(-12, -8, -24, 8, 0, 24);
      ctx.bezierCurveTo(24, 8, 12, -8, 0, 8);
      ctx.fill();
      ctx.restore();
    };

    const bufferLength = audioAnalyser ? audioAnalyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate audio bass energy
      let bassMultiplier = 1;
      if (audioAnalyser) {
        audioAnalyser.getByteFrequencyData(dataArray);
        // Average low-frequency bins for bass beat detection
        const bassVal = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
        bassMultiplier = 1 + (bassVal / 255) * 1.25; // swells up to 2.25x on heavy beats!
      }

      // Sort by depth
      particles.sort((a, b) => a.z - b.z);

      particles.forEach(p => {
        const speedMultiplier = p.z * (bassMultiplier * 0.95);
        const size = p.r * p.z * bassMultiplier; // Swell size dynamically to music
        
        // Depth-of-Field Blur
        const blurAmount = Math.max(0, (3.0 - p.z) * 1.5);
        if (blurAmount > 0.8 && !device.isLowEnd) {
          ctx.filter = `blur(${blurAmount}px)`;
        } else {
          ctx.filter = 'none';
        }

        if (mode === 'hearts') {
          drawHeart(ctx, p.x, p.y, size, p.alpha, p.color);
        } else {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2.5);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        // Update positions with audio-reactive speed scale
        p.x += p.dx * speedMultiplier;
        p.y += p.dy * speedMultiplier;
        p.alpha += p.da;

        // Reset particles smoothly
        if (p.alpha <= 0) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.alpha = 0;
          p.da = Math.abs(p.da);
        } else if (p.alpha >= 0.8) {
          p.da = -Math.abs(p.da);
        }

        if (p.y < -30) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.alpha = 0.1;
          p.da = Math.abs(p.da);
        }
      });
      
      ctx.filter = 'none';
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [device.isMobile, device.isLowEnd, mode, audioAnalyser]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-10 pointer-events-none"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    />
  );
}
