import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function Scene2({ onComplete }) {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const arrowRef = useRef(null);
  const progressRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nameLetters = "Hasini".split("");
  const letterColors = ['#F5ECD7', '#E8A598', '#D4A843', '#F5ECD7', '#9BAF88', '#E8A598'];

  useEffect(() => {
    const tl = gsap.timeline();

    // Reset elements
    gsap.set('.name-letter', { y: 60, opacity: 0, force3D: true, willChange: 'transform, opacity' });
    gsap.set(textRef.current, { text: "" });
    gsap.set(arrowRef.current, { strokeDashoffset: 100, strokeDasharray: 100, opacity: 0 });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // 1. Animate Name
    tl.to('.name-letter', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.08,
      ease: "expo.out",
      onComplete: () => {
        gsap.set('.name-letter', { willChange: 'auto' });
      }
    }, "+=0.5");

    // 2. Typewriter text
    tl.to(textRef.current, {
      text: "Today, the world is a little more wonderful.",
      duration: 2.5,
      ease: "none"
    });

    // 3. Subtitle fade in
    tl.to('#subtitle-line', { opacity: 1, y: 0, duration: 1 }, "+=0.3");

    // 4. Cursor blink & fade
    tl.to(cursorRef.current, {
      opacity: 0,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "steps(1)"
    });
    tl.to(cursorRef.current, { opacity: 0, duration: 0.5 });

    // 5. Arrow animates in
    tl.to(arrowRef.current, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out"
    });

    // 6. Progress bar fills over the remaining 4 seconds
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 4,
      ease: "linear"
    }, "-=1.2");

    // 7. Auto advance after 4 seconds
    tl.call(() => {
      handleAdvance();
    }, null, "+=4");

  }, []);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Film-grain wipe left-to-right via SVG clipPath transition
    const wipe = document.createElement('div');
    wipe.style.position = 'fixed';
    wipe.style.inset = '0';
    wipe.style.backgroundColor = 'var(--charcoal)';
    wipe.style.zIndex = '100';
    wipe.style.pointerEvents = 'none';
    wipe.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
    wipe.style.willChange = 'clip-path';
    document.body.appendChild(wipe);

    gsap.to(wipe, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        onComplete();
        gsap.to(wipe, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => wipe.remove()
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container flex flex-col items-center justify-center relative touch-manipulation"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full blur-[120px] opacity-10" 
             style={{ background: 'radial-gradient(ellipse, var(--rose) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 
          ref={nameRef}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-10 flex overflow-hidden py-4 tracking-[-0.02em]"
          style={{ textShadow: '0 10px 40px rgba(229, 196, 135, 0.2)' }}
        >
          {nameLetters.map((l, i) => (
            <span key={i} className="name-letter inline-block" style={{ color: letterColors[i] }}>{l}</span>
          ))}
        </h1>

        <div className="font-body text-sm md:text-base text-[var(--gold)]/80 max-w-lg min-h-[2rem] tracking-[0.15em] uppercase font-medium">
          <span ref={textRef}></span>
          <span ref={cursorRef} className="inline-block w-[2px] h-[1.2em] bg-[var(--gold)] align-middle ml-1"></span>
        </div>
        
        <p className="font-script text-lg md:text-xl text-[var(--gold)]/50 mt-4 tracking-widest opacity-0" id="subtitle-line">
          Twenty years. A beautiful journey.
        </p>

        <div className="mt-12 text-[var(--gold)] opacity-80">
          <svg width="40" height="100" viewBox="0 0 40 100" fill="none">
            <path 
              ref={arrowRef}
              d="M20 0C20 0 18 50 20 80M20 80L10 65M20 80L30 65" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <div ref={progressRef} className="h-full bg-[var(--gold)]/40" />
      </div>
    </div>
  );
}
