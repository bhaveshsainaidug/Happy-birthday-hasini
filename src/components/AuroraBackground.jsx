import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[#1a1016] to-[#12080d]"></div>
      
      {/* Animated glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--rose)]/15 blur-[120px] animate-aurora-1 mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[var(--gold)]/10 blur-[130px] animate-aurora-2 mix-blend-screen"></div>
      <div className="absolute top-[30%] left-[40%] w-[50vw] h-[50vw] rounded-full bg-[#ff7b93]/15 blur-[100px] animate-aurora-3 mix-blend-screen"></div>
    </div>
  );
}
