import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { galleryPhotos } from '../content/content';

export default function Scene5({ onComplete, device }) {
  const containerRef = useRef(null);
  const slidesRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Initial entrance of the whole scene
    gsap.fromTo(containerRef.current, 
      { opacity: 0, scale: 1.1 }, 
      { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
    );

    // Animate title in
    gsap.fromTo('.scene5-title', 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    // 3D transition logic for the current slide
    const currentSlide = slidesRef.current[currentIndex];
    const prevSlide = slidesRef.current[currentIndex - 1 >= 0 ? currentIndex - 1 : galleryPhotos.length - 1];

    if (currentSlide) {
      // Bring in new slide with 3D rotation
      gsap.fromTo(currentSlide, 
        { opacity: 0, rotationY: 45, x: 200, z: -200 },
        { opacity: 1, rotationY: 0, x: 0, z: 0, duration: 1.2, ease: "power3.out" }
      );
    }

    if (prevSlide && currentIndex !== 0) {
      // Push old slide away in 3D
      gsap.to(prevSlide, {
        opacity: 0, rotationY: -45, x: -200, z: -200, duration: 1.2, ease: "power3.in"
      });
    }

    // Auto-advance every 5 seconds
    const timer = setTimeout(() => {
      if (currentIndex < galleryPhotos.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleAdvance();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Zoom-in fade to white transition
    const flash = document.createElement('div');
    Object.assign(flash.style, {
      position: 'fixed', inset: 0, backgroundColor: '#fff', opacity: 0, zIndex: 100, pointerEvents: 'none'
    });
    document.body.appendChild(flash);

    gsap.to(containerRef.current, { scale: 1.15, filter: "blur(10px)", duration: 1, ease: "power2.in" });
    gsap.to(flash, {
      opacity: 1, duration: 1, ease: "power2.inOut",
      onComplete: () => {
        onComplete();
        setTimeout(() => {
          gsap.to(flash, { opacity: 0, duration: 0.8, onComplete: () => flash.remove() });
        }, 100);
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="scene-container bg-transparent flex flex-col items-center justify-center relative overflow-hidden touch-manipulation"
      style={{ perspective: "1000px" }}
      onClick={handleAdvance}
    >
      <div className="absolute top-8 md:top-12 left-0 right-0 z-20 text-center pointer-events-none">
        <h2 className="font-script text-4xl md:text-5xl text-[var(--gold)] drop-shadow-lg scene5-title">
          A few more memories...
        </h2>
      </div>

      <div className="relative w-full h-[60vh] max-w-4xl mx-auto flex items-center justify-center transform-style-3d">
        {galleryPhotos.map((photo, idx) => (
          <div 
            key={photo.id}
            ref={el => slidesRef.current[idx] = el}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 w-[60vw] max-w-[60vw] md:max-w-[40vh] aspect-[3/4] flex-shrink-0">
              <img 
                src={photo.src} 
                alt="Memory" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="font-body text-xl md:text-2xl text-[var(--cream)] drop-shadow-md">
                  {photo.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide counter dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {galleryPhotos.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[var(--gold)] scale-125' : 'bg-white/30'}`} />
        ))}
      </div>

    </div>
  );
}
