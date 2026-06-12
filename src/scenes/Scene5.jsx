import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { galleryPhotos } from '../content/content';
import { useDevice } from '../hooks/useDevice';

export default function Scene5({ onComplete, audioAnalyser }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const { isMobile } = useDevice();
  const [cardAspect, setCardAspect] = useState(1);

  const displayPhotos = [...galleryPhotos].sort((a, b) => {
    const filenameA = a.src.split('/').pop();
    const filenameB = b.src.split('/').pop();
    
    const numA = parseInt(filenameA.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(filenameB.match(/\d+/)?.[0] || '0', 10);
    
    if (numA !== numB) {
      return numA - numB;
    }
    return filenameA.localeCompare(filenameB);
  });
  const totalPhotos = displayPhotos.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sweep animation progress (0 to 1)
  const sweepProgress = useRef(0);
  const particles = useRef([]);
  const [glowPulse, setGlowPulse] = useState(1);

  // Load aspect ratio dynamically
  useEffect(() => {
    const img = new Image();
    img.src = displayPhotos[currentIndex].src;
    img.onload = () => {
      setCardAspect(img.naturalWidth / img.naturalHeight);
    };
  }, [currentIndex, displayPhotos]);

  // Transition timer
  useEffect(() => {
    if (isTransitioning) return;

    const timer = setTimeout(() => {
      triggerSweep();
    }, 3500); // Transition every 3.5 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning]);

  // Adjust canvas size automatically using ResizeObserver on its parent container
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const parent = canvasRef.current.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      }
    });
    
    resizeObserver.observe(parent);
    return () => resizeObserver.disconnect();
  }, []);

  // Audio-reactive wiggles (subtle 2D scale and drop-shadow, no 3D blur)
  useEffect(() => {
    if (!audioAnalyser) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const audioLoop = () => {
      if (!active) return;
      audioAnalyser.getByteFrequencyData(dataArray);

      const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
      const targetGlow = 1 + (bass / 255) * 0.04; // Very subtle scale (1.04x max)
      
      setGlowPulse(prev => prev + (targetGlow - prev) * 0.15);
      requestAnimationFrame(audioLoop);
    };

    audioLoop();
    return () => { active = false; };
  }, [audioAnalyser]);

  // Particle updates loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    let animationId;
    let lastSweepVal = 0;
    let time = 0;

    const tick = () => {
      time += 0.05;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const currentSweep = sweepProgress.current;
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;

      // Spawn particles along the vertical sweep edge during transitions
      if (isTransitioning && currentSweep > 0.01 && currentSweep < 0.99) {
        const edgeX = currentSweep * width;
        const delta = Math.abs(currentSweep - lastSweepVal);

        // Spawn density
        const count = Math.ceil(delta * 250);
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: edgeX + (Math.random() * 8 - 4),
            y: Math.random() * height,
            vx: -Math.random() * 2 - 0.5, // drift back slightly
            vy: Math.random() * 2.5 - 0.5, // fall down
            size: Math.random() * 3.5 + 1.2,
            alpha: 1.0,
            color: Math.random() > 0.45 ? '#D4A843' : '#E8A598'
          });
        }
      }
      lastSweepVal = currentSweep;

      // Update and draw particles
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Filter out dead particles
      particles.current = particles.current.filter(p => p.alpha > 0 && p.y < height);

      animationId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animationId);
  }, [isTransitioning]);

  const triggerSweep = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // If we've reached the last photo, transition to the next scene
    if (currentIndex >= totalPhotos - 1) {
      handleAdvance();
      return;
    }

    sweepProgress.current = 0;
    const sweepObj = { val: 0 };

    // Animate the diagonal clip-path from left to right
    gsap.fromTo(sweepObj,
      { val: 0 },
      {
        val: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          sweepProgress.current = sweepObj.val;
          
          if (cardRef.current) {
            const activeContainer = cardRef.current.querySelector('.next-photo-container');
            if (activeContainer) {
              const percent = sweepObj.val * 100;
              // Angled clip sweep
              activeContainer.style.clipPath = `polygon(0 0, ${percent + 15}% 0, ${percent - 15}% 100%, 0 100%)`;
            }
          }
        },
        onComplete: () => {
          // Commit indices
          setCurrentIndex(nextIndex);
          setNextIndex(prev => (prev + 1) % totalPhotos);
          setIsTransitioning(false);
          sweepProgress.current = 0;

          // Reset clip path of overlay container
          if (cardRef.current) {
            const activeContainer = cardRef.current.querySelector('.next-photo-container');
            if (activeContainer) {
              activeContainer.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
            }
          }
        }
      }
    );
  };

  const handleAdvance = () => {
    console.log("[Scene5] handleAdvance requested.");
    setIsTransitioning(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, { 
        scale: 0.88, 
        opacity: 0, 
        duration: 0.5, 
        ease: "power2.in",
        onComplete: () => {
          console.log("[Scene5] exit animation completed, calling onCompleteRef.current.");
          onCompleteRef.current();
        }
      });
    } else {
      console.log("[Scene5] cardRef.current is missing, calling onCompleteRef.current immediately.");
      onCompleteRef.current();
    }
  };

  const baseSizeMobile = 290;
  const baseSizeDesktop = 390;
  
  let wMobile, hMobile, wDesktop, hDesktop;
  
  if (cardAspect > 1) { // Landscape
    wMobile = baseSizeMobile;
    hMobile = Math.round(baseSizeMobile / cardAspect);
    wDesktop = baseSizeDesktop;
    hDesktop = Math.round(baseSizeDesktop / cardAspect);
  } else { // Portrait or Square
    hMobile = baseSizeMobile;
    wMobile = Math.round(baseSizeMobile * cardAspect);
    hDesktop = baseSizeDesktop;
    wDesktop = Math.round(baseSizeDesktop * cardAspect);
  }

  const sizes = { wMobile, hMobile, wDesktop, hDesktop };

  return (
    <div 
      ref={containerRef}
      className="scene-container flex flex-col items-center justify-center relative overflow-hidden select-none bg-transparent"
    >
      {/* Title block */}
      <div className="absolute top-8 md:top-12 z-20 text-center pointer-events-none">
        <h2 className="font-script text-4xl md:text-5xl text-[var(--gold)] drop-shadow-lg animate-pulse">
          Memories ✨
        </h2>
        <p className="font-body text-xs text-[var(--cream)]/60 tracking-[0.2em] uppercase mt-2">
          Stardust sweep gallery
        </p>
      </div>

      {/* Elegant Flat Square Polaroid Frame */}
      <div
        ref={cardRef}
        onClick={triggerSweep}
        className="relative bg-[#FAF7F0] rounded-3xl p-4 flex flex-col border border-white/20 select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-75 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        style={{
          transform: `scale(${glowPulse})`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 ${15 + (glowPulse-1)*150}px rgba(212,168,67,${0.15 + (glowPulse-1)*3})`,
          width: isMobile ? `${sizes.wMobile}px` : `${sizes.wDesktop}px`,
          height: isMobile ? `${sizes.hMobile}px` : `${sizes.hDesktop}px`
        }}
      >
        {/* Tape sticker style overlay */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-white/25 border border-white/10 shadow-sm rotate-[-2deg] backdrop-blur-[2px] z-30" />

        {/* Outer frame containing current and next image */}
        <div className="w-full h-full overflow-hidden bg-[#e0dbcf] rounded-2xl border border-black/5 relative shadow-inner">
          
          {/* Base Photo (Current Index) */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <img 
              src={displayPhotos[currentIndex].src} 
              alt="Memory Base" 
              className="w-full h-full object-cover object-center pointer-events-none"
              style={{
                imageRendering: 'auto'
              }}
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent mix-blend-overlay" />
          </div>

          {/* Sweep Overlay Photo (Next Index) */}
          <div 
            className="next-photo-container absolute inset-0 z-20 w-full h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
            }}
          >
            <img 
              src={displayPhotos[nextIndex].src} 
              alt="Memory Sweep" 
              className="w-full h-full object-cover object-center pointer-events-none"
              style={{
                imageRendering: 'auto'
              }}
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent mix-blend-overlay" />
          </div>

          {/* Stardust Sweep Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />
        </div>
      </div>

      {/* Manual Skip/Next Button */}
      <button
        onClick={handleAdvance}
        className="absolute bottom-12 right-12 z-50 bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 text-[var(--cream)] border border-white/10 rounded-full px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300 backdrop-blur-sm cursor-pointer hover:border-[var(--gold)]/50 active:scale-95"
      >
        Next Scene →
      </button>
    </div>
  );
}
