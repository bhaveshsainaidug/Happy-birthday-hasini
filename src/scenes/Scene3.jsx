import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { useDrag } from '@use-gesture/react';
import { galleryPhotos } from '../content/content';

const ENTRANCE_ANIMATIONS = [
  // 1. POLAROID DROP
  (el) => gsap.fromTo(el, { y: -80, rotationZ: 15, opacity: 0 }, { y: 0, rotationZ: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)", force3D: true }),
  // 2. LAZY FLOAT
  (el) => gsap.fromTo(el, { y: 40, rotationZ: -4, opacity: 0 }, { y: 0, rotationZ: 0, opacity: 1, duration: 1.1, ease: "power2.out", force3D: true }),
  // 3. CORNER PEEL
  (el) => {
    gsap.set(el, { transformOrigin: "bottom left" });
    return gsap.fromTo(el, { scale: 0.85, rotationZ: -12, opacity: 0 }, { scale: 1, rotationZ: 0, opacity: 1, duration: 0.8, ease: "power2.out", force3D: true });
  },
  // 4. CARD FLIP
  (el, isLowEnd) => {
    if (isLowEnd) return gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 });
    gsap.set(el.parentElement, { perspective: 800 });
    return gsap.fromTo(el, { rotationY: 90, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.6, ease: "power2.out", force3D: true });
  },
  // 5. SLAM
  (el) => gsap.fromTo(el, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out", force3D: true }),
  // 6. DRIFT RIGHT
  (el) => gsap.fromTo(el, { x: -60, rotationZ: 3, opacity: 0 }, { x: 0, rotationZ: 0, opacity: 1, duration: 0.8, ease: "circ.out", force3D: true }),
  // 7. RISE
  (el, isLowEnd) => {
    if (isLowEnd) return gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
    gsap.set(el.parentElement, { perspective: 600 });
    return gsap.fromTo(el, { y: 50, rotationX: 15, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.8, ease: "power2.out", force3D: true });
  },
  // 8. SNAP IN
  (el) => gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", force3D: true }),
  // 9. SWING
  (el) => {
    gsap.set(el, { transformOrigin: "top center" });
    return gsap.fromTo(el, { rotationZ: -20, opacity: 0 }, { rotationZ: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.3)", force3D: true });
  },
  // 10. SLOW REVEAL
  (el) => gsap.fromTo(el, { filter: "blur(8px)", opacity: 0 }, { filter: "blur(0px)", opacity: 1, duration: 1.4, ease: "power1.inOut", force3D: true })
];

const EXIT_VECTORS = [
  { x: -200, y: -200 }, { x: 0, y: -200 }, { x: 200, y: -200 },
  { x: 200, y: 0 }, { x: 200, y: 200 }, { x: 0, y: 200 },
  { x: -200, y: 200 }, { x: -200, y: 0 }, { x: -150, y: -150 }, { x: 150, y: 150 }
];

export default function Scene3({ onComplete, device }) {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const cardsRef = useRef([]);
  const imagesRef = useRef([]);
  const containerRef = useRef(null);
  
  // Mobile carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const total = galleryPhotos.length;
    
    galleryPhotos.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
      img.onload = img.onerror = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (loadedCount === total) {
          setReadyToAnimate(true);
        }
      };
    });

    // Fallback: don't hang if images take too long or fail silently
    const fallbackTimer = setTimeout(() => {
      setReadyToAnimate(true);
    }, 1500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Entrance animations
  useEffect(() => {
    if (!readyToAnimate || cardsRef.current.length === 0) return;

    const tl = gsap.timeline();
    const staggerTime = device.isMobile ? 0.08 : 0.12;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.set(card, { willChange: "transform, opacity" });
      const animFn = ENTRANCE_ANIMATIONS[index % ENTRANCE_ANIMATIONS.length];
      
      tl.add(animFn(card, device.isLowEnd), index * staggerTime);
    });

    tl.eventCallback("onComplete", () => {
      cardsRef.current.forEach(card => {
        if(card) gsap.set(card, { willChange: "auto" });
      });
      
      // Auto-advance the entire scene after ~30s
      setTimeout(() => {
        handleExit();
      }, 30000);
    });

  }, [readyToAnimate, device]);

  // Auto-play mobile carousel
  useEffect(() => {
    if (!device.isMobile || !readyToAnimate) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev >= galleryPhotos.length - 1) return prev;
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [device.isMobile, readyToAnimate]);

  // Desktop hover effect
  const handleMouseMove = (e, index) => {
    if (device.isMobile) return;
    const card = cardsRef.current[index];
    const img = imagesRef.current[index];
    if (!card || !img) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      y: -8,
      scale: 1.04,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.5)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (index) => {
    if (device.isMobile) return;
    const card = cardsRef.current[index];
    const img = imagesRef.current[index];
    if (!card || !img) return;

    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      duration: 0.6,
      ease: "elastic.out(1, 0.75)"
    });
  };

  // Exit animation
  const handleExit = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // 0.2s black flash
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.backgroundColor = '#000';
        flash.style.zIndex = '200';
        document.body.appendChild(flash);
        
        onComplete();
        
        setTimeout(() => {
          gsap.to(flash, { opacity: 0, duration: 0.3, onComplete: () => flash.remove() });
        }, 200);
      }
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const vector = EXIT_VECTORS[index % EXIT_VECTORS.length];
      const rotation = (Math.random() * 25 + 15) * (Math.random() > 0.5 ? 1 : -1);

      tl.to(card, {
        x: vector.x * (device.isMobile ? 1.5 : 3),
        y: vector.y * (device.isMobile ? 1.5 : 3),
        rotationZ: rotation,
        opacity: 0,
        duration: 0.7,
        ease: "power3.in",
        force3D: true,
      }, index * 0.04);
    });
  };

  // Mobile Drag Handler
  const bindDrag = useDrag(({ active, movement: [mx], direction: [dx], cancel }) => {
    if (!device.isMobile || !readyToAnimate) return;

    const currentCard = cardsRef.current[activeIndex];
    if (!currentCard) return;

    if (active) {
      gsap.to(currentCard, { x: mx * 0.85, duration: 0 });
    } else {
      if (Math.abs(mx) > window.innerWidth * 0.3) {
        // Snap to next/prev
        const newIndex = dx > 0 ? Math.max(0, activeIndex - 1) : Math.min(galleryPhotos.length - 1, activeIndex + 1);
        if (newIndex !== activeIndex) {
          gsap.to(currentCard, { x: dx > 0 ? window.innerWidth : -window.innerWidth, opacity: 0, duration: 0.3 });
          setActiveIndex(newIndex);
        } else {
          gsap.to(currentCard, { x: 0, duration: 0.4, ease: "back.out(1.7)" });
        }
      } else {
        // Snap back
        gsap.to(currentCard, { x: 0, duration: 0.4, ease: "back.out(1.7)" });
      }
    }
  });

  // Mobile Carousel render effects
  useEffect(() => {
    if (!device.isMobile || !readyToAnimate) return;
    
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      if (i === activeIndex) {
        gsap.to(card, { scale: 1, opacity: 1, x: 0, zIndex: 10, duration: 0.4 });
      } else if (i === activeIndex - 1) {
        gsap.to(card, { scale: 0.88, opacity: 0.6, x: -40, zIndex: 5, duration: 0.4 });
      } else if (i === activeIndex + 1) {
        gsap.to(card, { scale: 0.88, opacity: 0.6, x: 40, zIndex: 5, duration: 0.4 });
      } else {
        gsap.to(card, { opacity: 0, scale: 0.8, x: 0, zIndex: 0, duration: 0.4 });
      }
    });
  }, [activeIndex, device.isMobile, readyToAnimate]);

  if (!readyToAnimate) {
    return (
      <div className="scene-container flex items-center justify-center bg-[var(--charcoal)] text-[var(--cream)]">
        <p className="font-body text-xl opacity-50 animate-pulse">Gathering memories...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`scene-container text-[var(--cream)] relative ${device.isMobile ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}
      style={{ backgroundColor: '#000000' }}
      {...(device.isMobile ? bindDrag() : {})}
    >
      {/* Container for Desktop Grid or Mobile Stack */}
      <div className={`relative w-full h-full max-w-7xl mx-auto p-4 md:p-12 ${device.isMobile ? 'flex items-center justify-center' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 content-center'}`}>
        
        {galleryPhotos.map((photo, index) => (
          <div
            key={photo.id}
            ref={el => cardsRef.current[index] = el}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={`
              bg-[var(--cream)] p-3 md:p-4 rounded-sm shadow-md 
              flex flex-col opacity-0
              ${device.isMobile ? 'absolute w-[85vw] max-w-sm aspect-[3/4]' : 'w-full aspect-[3/4]'}
            `}
            style={{ 
              transformOrigin: "center",
              touchAction: device.isMobile ? 'none' : 'auto' // required for use-gesture
            }}
          >
            <div className="flex-1 overflow-hidden relative rounded-sm bg-black/5">
              <img
                ref={el => imagesRef.current[index] = el}
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1516085213601-209212cbb54a?q=80&w=600&auto=format&fit=crop&sig=${index}`;
                }}
              />
            </div>
            <div className="mt-3 md:mt-4 h-12 md:h-16 flex items-center justify-center">
              <p className="font-script text-xl md:text-2xl text-[var(--charcoal)] text-center px-2">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}

      </div>



    </div>
  );
}
