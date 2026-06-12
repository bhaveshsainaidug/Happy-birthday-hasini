import React, { useMemo } from 'react';

export default function FloatingHearts() {
  const heartData = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: 15 + Math.random() * 20,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 10,
    color: ['#E8A598', '#FFB3C6', '#D4A843', '#FAF7F0'][Math.floor(Math.random() * 4)]
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <style>{`
        @keyframes float-heart-global {
          0% { transform: translate(0, 105vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translate(0, 50vh) rotate(180deg) scale(1.15); }
          90% { opacity: 0.6; }
          100% { transform: translate(0, -10vh) rotate(360deg) scale(0.8); opacity: 0; }
        }
        .global-heart {
          position: absolute;
          bottom: -50px;
          animation: float-heart-global 15s linear infinite;
          opacity: 0;
        }
      `}</style>
      {heartData.map((h) => (
        <svg
          key={h.id}
          className="global-heart"
          style={{
            width: h.size + 'px',
            height: h.size + 'px',
            left: h.left + '%',
            fill: h.color,
            animationDelay: h.delay + 's',
            animationDuration: h.duration + 's',
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
}
