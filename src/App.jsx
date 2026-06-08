import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useDevice } from './hooks/useDevice';
import Scene1 from './scenes/Scene1';
import Scene2 from './scenes/Scene2';
import Scene3 from './scenes/Scene3';
import Scene4 from './scenes/Scene4';
import Scene5 from './scenes/Scene5';
import Scene6 from './scenes/Scene6';
import Balloons from './components/Balloons';

export default function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const device = useDevice();
  const [audio] = useState(() => new Audio('/song.mp3'));
  
  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.4;
  }, [audio]);

  const startMusic = () => {
    audio.play().catch(e => console.log("Audio autoplay prevented by browser:", e));
  };

  const advanceScene = () => {
    if (currentScene < 5) {
      confetti({ particleCount: 40, spread: 70, origin: { y: 1 }, zIndex: 999 });
      setCurrentScene(prev => prev + 1);
    }
  };

  return (
    <div className="bg-noise w-full h-full absolute inset-0">
      <Balloons />
      {/* Render current scene */}
      {currentScene === 0 && <Scene1 onComplete={advanceScene} startMusic={startMusic} />}
      {currentScene === 1 && <Scene2 onComplete={advanceScene} />}
      {currentScene === 2 && <Scene3 onComplete={advanceScene} device={device} />}
      {currentScene === 3 && <Scene4 onComplete={advanceScene} />}
      {currentScene === 4 && <Scene5 onComplete={advanceScene} device={device} />}
      {currentScene === 5 && <Scene6 />}
    </div>
  );
}

