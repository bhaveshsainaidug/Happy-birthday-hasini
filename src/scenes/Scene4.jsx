import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { letterContent } from '../content/content';
export default function Scene4({ onComplete }) {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const heartRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Text reveal animation: word by word
    const words = textContainerRef.current.querySelectorAll('.letter-word');
    
    gsap.set(words, { y: 15, opacity: 0 });
    
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(words, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.25, // Slower, comfortable reading pace
      ease: "power2.out"
    });

    // Heart drawing animation at the end
    gsap.set(heartRef.current, { strokeDasharray: 100, strokeDashoffset: 100 });
    tl.to(heartRef.current, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "power1.inOut"
    });


    // Auto advance after 40 seconds total to account for slower reading pace
    const advanceTimer = setTimeout(() => {
      handleAdvance();
    }, 40000);

    return () => clearTimeout(advanceTimer);
  }, []);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Page-curl transition out
    gsap.set(containerRef.current, { transformOrigin: "top left", zIndex: 100 });
    gsap.set(containerRef.current.parentElement, { perspective: 1200 });

    gsap.to(containerRef.current, {
      rotationY: -90,
      rotationX: 10,
      x: "-100%",
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
      force3D: true,
      onComplete: () => {
        onComplete();
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container overflow-hidden bg-black text-[var(--cream)]"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="w-full h-full max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center relative">
        <div ref={textContainerRef} className="w-full">
          <p className="font-script text-3xl md:text-4xl mb-4 text-[var(--rose)] drop-shadow-sm">
            {letterContent.greeting.split(' ').map((word, wIdx) => (
              <span key={`g-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.3em]">{word}</span>
            ))}
          </p>
          
          {letterContent.paragraphs.map((para, idx) => (
            <p key={idx} className="font-script text-xl md:text-2xl leading-relaxed md:leading-loose mb-4 text-[var(--cream)]/90">
              {para.split(' ').map((word, wIdx) => (
                <span key={`${idx}-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.25em]">{word}</span>
              ))}
            </p>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="font-script text-2xl md:text-3xl text-[var(--gold)]">
              {letterContent.signOff.split(' ').map((word, wIdx) => (
                <span key={`s-${wIdx}`} className="inline-block opacity-0 letter-word mr-[0.25em]">{word}</span>
              ))}
            </span>
            <svg className="inline-block opacity-0 letter-word" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path ref={heartRef} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
