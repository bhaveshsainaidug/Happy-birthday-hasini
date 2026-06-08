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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nameLetters = "Hasini".split("");

  useEffect(() => {
    const tl = gsap.timeline();

    // Reset letters
    gsap.set('.name-letter', { y: 60, opacity: 0, force3D: true, willChange: 'transform, opacity' });
    gsap.set(textRef.current, { text: "" });
    gsap.set(arrowRef.current, { strokeDashoffset: 100, strokeDasharray: 100, opacity: 0 });

    // 1. Animate Name
    tl.to('.name-letter', {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
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

    // 3. Cursor blink & fade
    tl.to(cursorRef.current, {
      opacity: 0,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "steps(1)"
    });
    tl.to(cursorRef.current, { opacity: 0, duration: 0.5 });

    // 4. Arrow animates in
    tl.to(arrowRef.current, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut"
    });

    // 5. Auto advance after a brief pause
    tl.call(() => {
      handleAdvance();
    }, null, "+=2");

  }, []);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Film-grain wipe left-to-right via SVG clipPath transition
    const wipe = document.createElement('div');
    wipe.style.position = 'fixed';
    wipe.style.inset = '0';
    wipe.style.backgroundColor = 'var(--cream)';
    wipe.style.zIndex = '100';
    wipe.style.pointerEvents = 'none';
    wipe.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
    wipe.style.willChange = 'clip-path';
    document.body.appendChild(wipe);

    gsap.to(wipe, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        onComplete();
        gsap.to(wipe, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => wipe.remove()
        });
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h1 
          ref={nameRef}
          className="font-display text-7xl md:text-9xl text-[var(--cream)] mb-8 flex overflow-hidden py-4"
        >
          {nameLetters.map((l, i) => (
            <span key={i} className="name-letter inline-block">{l}</span>
          ))}
        </h1>

        <div className="font-body text-xl md:text-2xl text-[var(--cream)]/80 max-w-lg min-h-[4rem]">
          <span ref={textRef}></span>
          <span ref={cursorRef} className="inline-block w-[2px] h-[1.2em] bg-[var(--gold)] align-middle ml-1"></span>
        </div>

        <div className="mt-16 text-[var(--gold)] opacity-80">
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
    </div>
  );
}
