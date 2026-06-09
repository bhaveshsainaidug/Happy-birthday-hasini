import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[#1a1016] to-[#12080d]"></div>
      
      {/* Animated glowing orbs - Increased visibility */}
      <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-[#ffb3ba]/30 blur-[100px] animate-aurora-1 mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[90vw] h-[90vw] rounded-full bg-[#ffdfba]/25 blur-[120px] animate-aurora-2 mix-blend-screen"></div>
      <div className="absolute top-[30%] left-[40%] w-[70vw] h-[70vw] rounded-full bg-[#ffb3c6]/30 blur-[90px] animate-aurora-3 mix-blend-screen"></div>
    </div>
  );
}
