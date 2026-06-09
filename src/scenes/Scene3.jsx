import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryPhotos } from '../content/content';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&fit=crop'
];

export default function Scene3({ onComplete, device }) {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [photosToRender, setPhotosToRender] = useState([]);

  useEffect(() => {
    // Only use up to 10 photos to keep scrolling manageable
    setPhotosToRender(galleryPhotos.slice(0, 10));
    window.scrollTo(0, 0); // Reset scroll position when entering this scene
  }, []);

  useEffect(() => {
    if (photosToRender.length === 0) return;

    const cards = gsap.utils.toArray('.scroll-card');
    
    // Reverse z-index so the first element is on top
    gsap.set(cards, { 
      zIndex: (i, target, targets) => targets.length - i,
      transformOrigin: '50% 100%'
    });

    // Initialize cards underneath the top one
    cards.forEach((card, i) => {
      if (i > 0) {
        gsap.set(card, { scale: 0.85, y: 50, opacity: 0 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrolling effect
        onLeave: () => handleAdvance(), // Trigger next scene at bottom
      }
    });

    // Create the stacked scroll animation
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        // Current card flies away
        tl.to(card, {
          x: () => window.innerWidth > 768 ? -window.innerWidth * 0.8 : -window.innerWidth * 1.2,
          rotationZ: -15 - Math.random() * 10,
          opacity: 0,
          scale: 0.9,
          ease: "power2.inOut",
        }, i === 0 ? 0 : "+=0.2");

        // Next card pops up
        const nextCard = cards[i + 1];
        tl.to(nextCard, {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out"
        }, "<0.1"); // Start slightly after the previous card begins moving
      }
    });

    // Give a little padding at the end of the timeline before it finishes
    tl.to({}, { duration: 0.5 });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [photosToRender]);

  const handleAdvance = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Cream wipe transition out
    const wipe = document.createElement('div');
    wipe.style.position = 'fixed';
    wipe.style.inset = '0';
    wipe.style.backgroundColor = 'var(--cream)';
    wipe.style.zIndex = '100';
    wipe.style.pointerEvents = 'none';
    wipe.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
    wipe.style.willChange = 'clip-path';
    document.body.appendChild(wipe);

    // Fade out background slightly
    gsap.to(containerRef.current, { opacity: 0.5, duration: 1 });

    gsap.to(wipe, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        // Force scroll back to top for the next scene
        window.scrollTo(0, 0);
        onComplete();
        gsap.to(wipe, {
          opacity: 0,
          duration: 0.8,
          delay: 0.5, // let next scene load briefly
          onComplete: () => wipe.remove()
        });
      }
    });
  };

  if (photosToRender.length === 0) return null;

  return (
    // Set a massive height to create a scrollable track
    <div 
      ref={containerRef}
      className="w-full bg-[var(--charcoal)]"
      style={{ height: `${photosToRender.length * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-16">
        
        <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none">
          <h2 className="font-script text-4xl md:text-5xl text-[var(--gold)] drop-shadow-lg">Memories ✨</h2>
        </div>

        <div className="relative w-full max-w-[85vw] md:max-w-[40vh] aspect-[3/4] flex items-center justify-center mt-12">
          {photosToRender.map((photo, index) => (
            <div
              key={photo.id}
              className="scroll-card absolute inset-0 bg-[var(--cream)] p-4 md:p-5 rounded-sm shadow-2xl flex flex-col border border-[var(--gold)]/20"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="flex-1 overflow-hidden relative rounded-sm bg-black/5">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => {
                    e.target.src = FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length];
                  }}
                />
              </div>
              <div className="mt-3 md:mt-4 h-12 md:h-16 flex items-center justify-center shrink-0">
                <p className="font-script text-xl md:text-2xl text-[var(--charcoal)] text-center px-2 leading-tight">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
          <div className="flex flex-col items-center justify-center opacity-60">
            <p className="font-body text-xs md:text-sm text-[var(--gold)] tracking-[0.4em] uppercase font-semibold mb-2">
              Keep Scrolling
            </p>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--gold)] to-transparent"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
