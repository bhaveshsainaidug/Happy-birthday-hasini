import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, X, Eye, EyeOff, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import PinkAuroraBackground from './PinkAuroraBackground';

const TARGET_DATE = new Date('2026-06-27T00:00:00+05:30'); // June 27, 2026 12:00 AM IST

function calculateTimeLeft() {
  const now = new Date();
  const difference = TARGET_DATE.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    passed: false
  };
}

export default function LockdownScreen({ onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining.passed) {
        clearInterval(timer);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onUnlock]);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      // Save state to sessionStorage and localStorage
      sessionStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isAdmin', 'true');
      
      // Fun confetti explosion for admin unlock
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#D4A843', '#E8A598', '#FAF7F0']
      });

      setShowAdminModal(false);
      onUnlock();
    } else {
      setError('Incorrect admin credentials. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const digitGroups = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="app-container bg-noise text-[#F5ECD7] font-display select-none p-6 md:p-12 relative justify-between items-center">
      
      {/* Background pink auroras (optimized for projector - no layout shift) */}
      <PinkAuroraBackground />

      {/* Top Header */}
      <div className="relative z-10 w-full flex justify-between items-center max-w-6xl mt-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-[var(--gold)] text-xl font-bold tracking-widest uppercase">A Special Story</span>
        </motion.div>

        {/* Subtle Admin Trigger */}
        <motion.button
          whileHover={{ scale: 1.05, bg: 'rgba(212,168,67,0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setError('');
            setUsername('');
            setPassword('');
            setShowAdminModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--gold)]/20 bg-white/5 text-xs text-[var(--gold)] cursor-pointer transition-all duration-300 animate-fade-in"
          id="admin-login-btn"
        >
          <Key size={14} className="animate-pulse" />
          <span>Admin Login</span>
        </motion.button>
      </div>

      {/* Main Countdown Body */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/30 mx-auto mb-8 shadow-lg shadow-gold/5">
            <Lock className="text-[var(--gold)]" size={28} />
          </div>

          <h1 className="text-4xl md:text-6xl font-light text-[var(--cream)] mb-4 leading-normal tracking-wide">
            A Magical Celebration Awaits
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--rose)] italic mb-12 tracking-wider">
            Unveiling on June 27, 2026 at 12:00 AM
          </p>
        </motion.div>

        {/* Countdown Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8"
        >
          {digitGroups.map((group, idx) => (
            <React.Fragment key={group.label}>
              <div className="flex flex-col items-center">
                <div className="relative overflow-hidden backdrop-blur-md bg-white/5 border border-[var(--gold)]/20 shadow-2xl rounded-2xl w-16 h-20 sm:w-24 sm:h-28 flex items-center justify-center min-w-[70px] sm:min-w-[96px]">
                  <span className="text-4xl sm:text-6xl font-light text-[var(--gold)] tracking-normal">
                    {String(group.value).padStart(2, '0')}
                  </span>
                  
                  {/* Subtle decorative internal line */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5" />
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest text-[var(--cream)]/60 uppercase mt-3 font-semibold">
                  {group.label}
                </span>
              </div>
              
              {idx < digitGroups.length - 1 && (
                <span className="text-2xl sm:text-4xl text-[var(--gold)]/40 pb-6 select-none">:</span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Footer message */}
      <div className="relative z-10 text-center mb-4 text-xs tracking-[0.2em] uppercase text-[var(--cream)]/40">
        Created for a Special Day
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: 'spring', 
                duration: 0.4, 
                x: { duration: 0.4, ease: 'easeInOut' } 
              }}
              className="relative w-full max-w-md bg-[#130b11] border border-[var(--gold)]/30 rounded-3xl p-8 md:p-10 shadow-2xl z-10 overflow-hidden"
              style={{ boxShadow: '0 25px 50px -12px rgba(212,168,67,0.15)' }}
            >
              {/* Gold light burst inside modal */}
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full bg-[var(--gold)]/10 blur-[40px] pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-6 right-6 text-[var(--cream)]/60 hover:text-[var(--gold)] hover:scale-110 cursor-pointer transition-all duration-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/30 mx-auto mb-4">
                  <User className="text-[var(--gold)]" size={20} />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--cream)] tracking-wide">Admin Portal</h3>
                <p className="text-xs text-[var(--rose)] italic mt-1">Unlock animations manually</p>
              </div>

              {/* Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--cream)]/60 mb-2 font-semibold">Admin Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-[var(--gold)]/60 rounded-xl px-4 py-3 text-sm text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-white/20 font-sans"
                      id="admin-username-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--cream)]/60 mb-2 font-semibold">Secret Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-[var(--gold)]/60 rounded-xl pl-4 pr-12 py-3 text-sm text-[var(--cream)] outline-none transition-all duration-300 placeholder:text-white/20 font-sans"
                      id="admin-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cream)]/40 hover:text-[var(--gold)] cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs italic text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#e5c487] to-[var(--gold)] hover:brightness-110 active:scale-[0.98] text-[#03010A] font-semibold rounded-xl shadow-lg transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer border border-white/10"
                  id="admin-submit-btn"
                >
                  Unlock Portal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
