import { useCallback, useEffect, useReducer, useRef } from 'react';
import { scheduleProgression } from '../audio/bgm';

const MUTE_KEY = 'reversi-bgm-muted';
const MASTER_VOLUME = 0.55;

// Read once at module load, not on every render (useRef re-evaluates its
// initializer argument every render unlike useState's lazy-init form).
const initialMuted = typeof window !== 'undefined' && localStorage.getItem(MUTE_KEY) === 'true';

type AudioContextCtor = typeof AudioContext;

export function useBgm() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef<boolean>(initialMuted);
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const applyGain = useCallback((muted: boolean) => {
    const ctx = ctxRef.current;
    const gain = masterGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(muted ? 0 : MASTER_VOLUME, ctx.currentTime, 0.25);
  }, []);

  const beginScheduler = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const loop = (startAt: number) => {
      const endAt = scheduleProgression(ctx, masterGain, startAt);
      const delayMs = Math.max(0, (endAt - ctx.currentTime - 1) * 1000);
      timerRef.current = window.setTimeout(() => loop(endAt), delayMs);
    };
    loop(ctx.currentTime + 0.15);
  }, []);

  const ensureStarted = useCallback(() => {
    if (startedRef.current) {
      if (ctxRef.current?.state === 'suspended') void ctxRef.current.resume();
      return;
    }
    const AudioCtx: AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: AudioContextCtor }).webkitAudioContext;
    const ctx = new AudioCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.value = mutedRef.current ? 0 : MASTER_VOLUME;
    masterGain.connect(ctx.destination);

    ctxRef.current = ctx;
    masterGainRef.current = masterGain;
    startedRef.current = true;
    beginScheduler(ctx, masterGain);
    forceRender();
  }, [beginScheduler]);

  const toggle = useCallback(() => {
    if (!startedRef.current) {
      ensureStarted();
      if (mutedRef.current) {
        mutedRef.current = false;
        localStorage.setItem(MUTE_KEY, 'false');
        applyGain(false);
      }
      forceRender();
      return;
    }
    mutedRef.current = !mutedRef.current;
    localStorage.setItem(MUTE_KEY, String(mutedRef.current));
    applyGain(mutedRef.current);
    forceRender();
  }, [applyGain, ensureStarted]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return {
    enabled: startedRef.current && !mutedRef.current,
    ensureStarted,
    toggle,
  };
}
