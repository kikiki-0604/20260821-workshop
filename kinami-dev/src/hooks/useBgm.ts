import { useCallback, useEffect, useReducer, useRef } from 'react';

const MUTE_KEY = 'reversi-bgm-muted';
const VOLUME = 0.4;
const BGM_SRC = `${import.meta.env.BASE_URL}audio/bgm.mp3`;

// Read once at module load, not on every render (useRef re-evaluates its
// initializer argument every render unlike useState's lazy-init form).
const initialMuted = typeof window !== 'undefined' && localStorage.getItem(MUTE_KEY) === 'true';

export function useBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef<boolean>(initialMuted);
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(BGM_SRC);
      audio.loop = true;
      audio.volume = VOLUME;
      audio.addEventListener('error', () => {
        console.warn('BGM failed to load:', BGM_SRC);
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const ensureStarted = useCallback(() => {
    const audio = getAudio();
    if (startedRef.current) {
      if (audio.paused && !mutedRef.current) void audio.play().catch(() => {});
      return;
    }
    startedRef.current = true;
    if (!mutedRef.current) void audio.play().catch(() => {});
    forceRender();
  }, [getAudio]);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (!startedRef.current) {
      startedRef.current = true;
      mutedRef.current = false;
      localStorage.setItem(MUTE_KEY, 'false');
      void audio.play().catch(() => {});
      forceRender();
      return;
    }
    mutedRef.current = !mutedRef.current;
    localStorage.setItem(MUTE_KEY, String(mutedRef.current));
    if (mutedRef.current) {
      audio.pause();
    } else {
      void audio.play().catch(() => {});
    }
    forceRender();
  }, [getAudio]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return {
    enabled: startedRef.current && !mutedRef.current,
    ensureStarted,
    toggle,
  };
}
