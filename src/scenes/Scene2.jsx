import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import confetti from 'canvas-confetti';

gsap.registerPlugin(TextPlugin);

export default function Scene2({ onComplete, audioAnalyser }) {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const arrowRef = useRef(null);
  const progressRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const nameLetters = "Hasini".split("");
  const letterColors = ['#FAF7F0', '#E8A598', '#D4A843', '#FAF7F0', '#9BAF88', '#E8A598'];

  // Audio-reactive letters scaling
  const lettersRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Reset elements safely
    if (textRef.current) gsap.set(textRef.current, { text: "" });
    if (arrowRef.current) gsap.set(arrowRef.current, { strokeDashoffset: 100, strokeDasharray: 100, opacity: 0 });
    if (progressRef.current) gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // 1. Cinematic 3D Letter Assembly and Screen Shake
    gsap.set('.name-letter', { 
      opacity: 0,
      transformPerspective: 1000
    });

    tl.fromTo('.name-letter', 
      {
        x: () => Math.random() * 600 - 300,
        y: () => Math.random() * 600 - 300,
        z: () => Math.random() * 800 - 400,
        rotationX: () => Math.random() * 360,
        rotationY: () => Math.random() * 360,
        rotationZ: () => Math.random() * 360,
        opacity: 0
      },
      {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.12,
        ease: "elastic.out(1, 0.75)",
        onComplete: () => {
          
          // Screen Shake on assembly impact!
          gsap.timeline()
            .to(containerRef.current, { x: 12, y: -8, duration: 0.04, yoyo: true, repeat: 6 })
            .to(containerRef.current, { x: -6, y: 10, duration: 0.04, yoyo: true, repeat: 3 })
            .to(containerRef.current, { x: 0, y: 0, duration: 0.05 });

          // Impact Confetti
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.55 },
            colors: letterColors
          });

          // Start continuous wavy float base (modulated by audio later)
          gsap.to('.name-letter', {
            y: -14,
            scaleY: 1.15,
            scaleX: 0.9,
            duration: 0.7,
            yoyo: true,
            repeat: -1,
            stagger: {
              each: 0.12,
              from: "start"
            },
            ease: "sine.inOut"
          });
        }
      }, "+=0.2"
    );

    // 2. Typewriter text
    if (textRef.current) {
      tl.to(textRef.current, {
        text: "Today, the world is a little more wonderful.",
        duration: 2.2,
        ease: "none"
      }, "-=0.2");
    }

    // 3. Subtitle fade in
    tl.to('#subtitle-line', { opacity: 1, y: 0, duration: 1 }, "+=0.2");

    // 4. Cursor blink & fade
    if (cursorRef.current) {
      tl.to(cursorRef.current, {
        opacity: 0,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "steps(1)"
      });
      tl.to(cursorRef.current, { opacity: 0, duration: 0.5 });
    }

    // 5. Arrow animates in
    if (arrowRef.current) {
      tl.to(arrowRef.current, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out"
      });
    }

    // 6. Progress bar fills
    if (progressRef.current) {
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 5.5,
        ease: "linear"
      }, "-=1.2");
    }

    // 7. Auto advance
    tl.call(() => {
      handleAdvance();
    }, null, "+=0.1");

    return () => {
      tl.kill();
    };
  }, []);

  // Audio-reactive wiggle listener
  useEffect(() => {
    if (!audioAnalyser) return;
    const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    let active = true;

    const wiggleLoop = () => {
      if (!active) return;
      audioAnalyser.getByteFrequencyData(dataArray);
      
      const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
      const treble = (dataArray[16] + dataArray[17] + dataArray[18]) / 3;

      // Pulse letters individually based on audio bins
      lettersRef.current.forEach((letterEl, index) => {
        if (!letterEl) return;
        const scaleVal = 1 + (bass / 255) * 0.18 * Math.sin(Date.now() * 0.01 + index);
        const rotationVal = (treble / 255) * 15 * Math.cos(Date.now() * 0.008 + index * 4);
        
        gsap.set(letterEl, {
          scale: scaleVal,
          rotationZ: rotationVal,
          textShadow: `0 ${4 + (bass/255)*12}px ${12 + (bass/255)*24}px rgba(212, 168, 67, ${0.25 + (bass/255)*0.5})`
        });
      });

      requestAnimationFrame(wiggleLoop);
    };

    wiggleLoop();
    return () => { active = false; };
  }, [audioAnalyser]);

  const handleLetterHover = (e, index) => {
    if (isTransitioning) return;

    const el = e.target;
    gsap.timeline()
      .to(el, { y: -20, scaleY: 1.3, scaleX: 0.8, rotation: Math.random() * 24 - 12, duration: 0.15, ease: "power2.out" })
      .to(el, { y: 5, scaleY: 0.8, scaleX: 1.2, rotation: 0, duration: 0.15, ease: "power2.inOut" })
      .to(el, { y: 0, scaleY: 1, scaleX: 1, duration: 0.2, ease: "back.out(2)" });

    const rect = el.getBoundingClientRect();
    confetti({
      particleCount: 15,
      spread: 50,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: [letterColors[index]],
      startVelocity: 14,
      gravity: 0.9,
      ticks: 40
    });
  };

  const handleAdvance = () => {
    console.log("[Scene2] handleAdvance requested. isTransitioning:", isTransitioning);
    if (isTransitioning) return;
    setIsTransitioning(true);
    onCompleteRef.current();
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container flex flex-col items-center justify-center relative touch-manipulation select-none overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* 3D Swirling Fairy Dust Sparkles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <style>{`
          @keyframes orbit-1 {
            0% { transform: rotateX(70deg) rotateY(15deg) rotateZ(0deg) translate3d(240px, 0, 0) rotateZ(0deg) rotateY(-15deg) rotateX(-70deg); }
            100% { transform: rotateX(70deg) rotateY(15deg) rotateZ(360deg) translate3d(240px, 0, 0) rotateZ(-360deg) rotateY(-15deg) rotateX(-70deg); }
          }
          @keyframes orbit-2 {
            0% { transform: rotateX(60deg) rotateY(-25deg) rotateZ(180deg) translate3d(280px, 0, 0) rotateZ(-180deg) rotateY(25deg) rotateX(-60deg); }
            100% { transform: rotateX(60deg) rotateY(-25deg) rotateZ(540deg) translate3d(280px, 0, 0) rotateZ(-540deg) rotateY(25deg) rotateX(-60deg); }
          }
          .orbit-sparkle-1 {
            position: absolute;
            top: 45%;
            left: 50%;
            margin-left: -12px;
            margin-top: -12px;
            animation: orbit-1 6s linear infinite;
          }
          .orbit-sparkle-2 {
            position: absolute;
            top: 45%;
            left: 50%;
            margin-left: -10px;
            margin-top: -10px;
            animation: orbit-2 8s linear infinite;
          }
        `}</style>

        {/* Orbit Sparkles */}
        <div className="orbit-sparkle-1 text-[var(--gold)] text-xl drop-shadow-[0_0_8px_var(--gold)]">✨</div>
        <div className="orbit-sparkle-2 text-[var(--rose)] text-lg drop-shadow-[0_0_8px_var(--rose)]">✦</div>
      </div>

      {/* Floating Sparkles in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <style>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .sparkle-slow {
            animation: spin-slow 15s linear infinite;
          }
        `}</style>
        
        <svg className="sparkle-slow absolute top-[25%] left-[15%] w-6 h-6 text-[var(--gold)]/20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
        <svg className="sparkle-slow absolute bottom-[25%] right-[15%] w-8 h-8 text-[var(--rose)]/20" viewBox="0 0 24 24" fill="currentColor" style={{ animationDirection: 'reverse', animationDuration: '20s' }}>
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
        <svg className="sparkle-slow absolute top-[60%] left-[80%] w-5 h-5 text-[var(--cream)]/30" viewBox="0 0 24 24" fill="currentColor" style={{ animationDuration: '10s' }}>
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] rounded-full blur-[80px] opacity-60" 
             style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full">
        {/* Name Text wrapper with perspective */}
        <div className="relative py-4 select-none flex items-center justify-center w-full" style={{ perspective: '1200px' }}>
          <h1 
            ref={nameRef}
            className="font-display text-7xl md:text-9xl lg:text-[10rem] font-bold flex tracking-[-0.02em] select-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {nameLetters.map((l, i) => (
              <span 
                key={i} 
                ref={(el) => (lettersRef.current[i] = el)}
                className="name-letter inline-block cursor-pointer select-none px-1 md:px-2" 
                style={{ color: letterColors[i], transformStyle: 'preserve-3d' }}
                onMouseEnter={(e) => handleLetterHover(e, i)}
                onTouchStart={(e) => handleLetterHover(e, i)}
              >
                {l}
              </span>
            ))}
          </h1>
        </div>

        <div className="font-body text-sm md:text-base text-[var(--gold)]/85 max-w-lg min-h-[2rem] tracking-[0.18em] uppercase font-semibold mt-6">
          <span ref={textRef}></span>
          <span ref={cursorRef} className="inline-block w-[2.5px] h-[1.2em] bg-[var(--gold)] align-middle ml-1 shadow-[0_0_8px_var(--gold)]"></span>
        </div>
        
        <p className="font-script text-xl md:text-2xl text-[var(--gold)]/60 mt-5 tracking-widest opacity-0 translate-y-3" id="subtitle-line">
          Twenty years. A beautiful journey.
        </p>

        <button 
          onClick={handleAdvance}
          className="mt-12 text-[var(--gold)] opacity-80 animate-bounce cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 z-30"
          style={{ background: 'none', border: 'none', outline: 'none' }}
          id="scene-2-next-btn"
          aria-label="Next Scene"
        >
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
        </button>
      </div>
      
      {/* Glowing Neon Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-gold/50 via-rose to-gold/50 shadow-[0_0_12px_rgba(212,168,67,0.8)]" />
      </div>
    </div>
  );
}
