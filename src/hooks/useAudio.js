import { useRef, useEffect, useCallback } from 'react'

export function useAudio(src) {
  const audioRef = useRef(null)
  const fadingRef = useRef(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0
    audio.preload = 'auto'
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [src])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || fadingRef.current) return
    audio.play().catch(() => {})
    fadeIn(audio)
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    fadeOut(audio)
  }, [])

  return { play, pause, audioRef }
}

function fadeIn(audio, targetVolume = 0.55, duration = 3000) {
  const steps = 60
  const increment = targetVolume / steps
  const interval = duration / steps
  let current = audio.volume
  const timer = setInterval(() => {
    current = Math.min(current + increment, targetVolume)
    audio.volume = current
    if (current >= targetVolume) clearInterval(timer)
  }, interval)
}

function fadeOut(audio, duration = 2000) {
  const steps = 60
  const interval = duration / steps
  let current = audio.volume
  const decrement = current / steps
  const timer = setInterval(() => {
    current = Math.max(current - decrement, 0)
    audio.volume = current
    if (current <= 0) { clearInterval(timer); audio.pause() }
  }, interval)
}
