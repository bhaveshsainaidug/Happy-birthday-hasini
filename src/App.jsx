import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { useDevice } from './hooks/useDevice';
import Scene1 from './scenes/Scene1';
import Scene2 from './scenes/Scene2';
import Scene4 from './scenes/Scene4';
import Scene5 from './scenes/Scene5';
import Scene6 from './scenes/Scene6';
import Balloons from './components/Balloons';
import PinkAuroraBackground from './components/PinkAuroraBackground';
import ParticleEffect from './components/ParticleEffect';
import FloatingHearts from './components/FloatingHearts';
import LockdownScreen from './components/LockdownScreen';

export default function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const device = useDevice();
  const [audio] = useState(() => new Audio('/song.mp3'));
  
  // Cinematic transition references
  const overlayRef = useRef(null);
  const flareRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Admin state to trigger re-renders and handle session bypass
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true' || localStorage.getItem('isAdmin') === 'true';
  });

  // Calculate locked state dynamically using current time
  const targetDate = new Date('2026-06-27T00:00:00+05:30');
  const [now, setNow] = useState(new Date());

  // Periodically update current time to support auto-unlocking in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isLocked = now < targetDate && !isAdmin;

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.4;
  }, [audio]);

  const startMusic = () => {
    audio.play().catch(e => console.log("Audio autoplay prevented by browser:", e));
  };

  // Reset transition state automatically on scene change
  useEffect(() => {
    setIsTransitioning(false);
  }, [currentScene]);

  const advanceScene = () => {
    console.log("[App] advanceScene request. current:", currentScene, "isTransitioning:", isTransitioning);
    if (currentScene < 4 && !isTransitioning) {
      setIsTransitioning(true);
      
      const nextIndex = currentScene + 1;
      console.log("[App] Advancing to scene:", nextIndex);

      // Safety timeout: force transition state to reset after 3 seconds
      const safetyTimeout = setTimeout(() => {
        console.warn("[App] Safety transition timeout triggered.");
        setIsTransitioning(false);
      }, 3000);
      
      gsap.timeline()
        .set(overlayRef.current, { display: 'block' })
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        })
        .to(flareRef.current, {
          opacity: 0.7,
          scale: 1.15,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.6")
        .call(() => {
          console.log("[App] Transition midpoint. Setting scene:", nextIndex);
          setCurrentScene(nextIndex);
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        })
        .to(flareRef.current, {
          opacity: 0,
          scale: 1.35,
          duration: 0.8,
          ease: "power2.inOut"
        })
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.8")
        .set(overlayRef.current, { display: 'none' })
        .call(() => {
          console.log("[App] Transition timeline completed.");
          clearTimeout(safetyTimeout);
          setIsTransitioning(false);
        });
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  if (isLocked) {
    return <LockdownScreen onUnlock={() => setIsAdmin(true)} />;
  }

  return (
    <div className="bg-noise app-container relative overflow-hidden">
      <PinkAuroraBackground />
      <FloatingHearts />
      <ParticleEffect mode={currentScene === 0 ? 'dots' : 'hearts'} />
      <Balloons />
      {/* Render current scene in the correct order: Entry -> Intro -> Photos -> Letter -> Finale */}
      {currentScene === 0 && <Scene1 onComplete={advanceScene} startMusic={startMusic} />}
      {currentScene === 1 && <Scene2 onComplete={advanceScene} />}
      {currentScene === 2 && <Scene5 onComplete={advanceScene} />}
      {currentScene === 3 && <Scene4 onComplete={advanceScene} />}
      {currentScene === 4 && <Scene6 />}

      {/* Admin indicator & Logout button */}
      {isAdmin && (
        <button
          onClick={handleAdminLogout}
          className="absolute top-4 right-4 z-40 px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/20 cursor-pointer transition-all duration-300 font-sans"
          id="admin-logout-btn"
        >
          Exit Admin Mode 🔓
        </button>
      )}

      {/* Cinematic Projector / Theatrical Transition Overlay (Directly animated for performance) */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
        style={{ opacity: 0, display: 'none' }}
      >
        {/* Solid black curtain */}
        <div className="absolute inset-0 bg-[#000000]" />
        
        {/* Cinematic Golden Lens Flare / Film Projection Light leak */}
        <div 
          ref={flareRef}
          className="absolute inset-0"
          style={{
            opacity: 0,
            transform: 'scale(0.8)',
            background: 'radial-gradient(circle, rgba(212,168,67,0.45) 0%, rgba(232,165,152,0.15) 50%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
}



