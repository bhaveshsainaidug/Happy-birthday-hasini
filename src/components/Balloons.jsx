import React, { useMemo } from 'react';

export default function Balloons() {
  const balloonData = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: 30 + Math.random() * 40,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 12 + Math.random() * 15,
    color: ['#D4A843', '#E8A598', '#9BAF88', '#F5ECD7'][Math.floor(Math.random() * 4)]
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <style>{`
        @keyframes float-balloon-global {
          0% { transform: translateY(100vh) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(0vh) translateX(20px) scale(1.05); }
          90% { opacity: 0.6; }
          100% { transform: translateY(-120vh) translateX(-20px) scale(1); opacity: 0; }
        }
        .global-balloon {
          position: absolute;
          bottom: -100px;
          width: 40px;
          height: 50px;
          border-radius: 50%;
          animation: float-balloon-global 15s ease-in-out infinite;
          opacity: 0;
        }
        .global-balloon::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 8px solid currentColor;
        }
        .global-balloon::after {
          content: '';
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.2);
        }
      `}</style>
      
      {balloonData.map((b) => (
        <div 
          key={b.id} 
          className="global-balloon"
          style={{
            width: b.size + 'px',
            height: (b.size * 1.25) + 'px',
            left: b.left + '%',
            backgroundColor: b.color,
            color: b.color,
            animationDelay: b.delay + 's',
            animationDuration: b.duration + 's'
          }}
        ></div>
      ))}
    </div>
  );
}
