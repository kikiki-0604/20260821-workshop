import { useCallback, useEffect, useRef, useState } from 'react';
import { CHARACTER_IDS } from '../characters/characters';
import type { CharacterId } from '../types';

const MUTE_KEY = 'reversi-voice-muted';

interface VoiceProfile {
  pitch: number;
  rate: number;
}

// Distinct pitch/rate per character so the four voices feel different even
// when the browser only offers a single Japanese TTS voice to work with.
const VOICE_PROFILES: Record<CharacterId, VoiceProfile> = {
  cat: { pitch: 1.35, rate: 1.05 },
  dog: { pitch: 1.05, rate: 1.15 },
  bird: { pitch: 1.55, rate: 1.2 },
  fish: { pitch: 0.85, rate: 0.85 },
};

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function useVoice() {
  const [muted, setMuted] = useState<boolean>(
    () => supported && localStorage.getItem(MUTE_KEY) === 'true',
  );
  const jaVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      jaVoicesRef.current = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang?.toLowerCase().startsWith('ja'));
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const pickVoice = useCallback((id: CharacterId): SpeechSynthesisVoice | null => {
    const jaVoices = jaVoicesRef.current;
    if (jaVoices.length === 0) return null;
    const index = CHARACTER_IDS.indexOf(id) % jaVoices.length;
    return jaVoices[index];
  }, []);

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (id: CharacterId, text: string) => {
      if (!supported || muted) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      const voice = pickVoice(id);
      if (voice) utterance.voice = voice;
      utterance.pitch = VOICE_PROFILES[id].pitch;
      utterance.rate = VOICE_PROFILES[id].rate;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    },
    [muted, pickVoice],
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (supported) localStorage.setItem(MUTE_KEY, String(next));
      if (next && supported) window.speechSynthesis.cancel();
      return next;
    });
  }, []);

  return { enabled: supported && !muted, supported, speak, cancel, toggle };
}
