/**
 * Generative lo-fi ambient pad loop, synthesized entirely with the Web Audio
 * API (no audio files, no extra libraries). A slow jazzy chord progression
 * (Cmaj7 - Am7 - Fmaj7 - G6) is played on soft, slightly-detuned triangle
 * oscillators through a gentle low-pass filter for a mellow, unobtrusive feel.
 */

interface ChordSpec {
  notes: number[];
}

const PROGRESSION: ChordSpec[] = [
  { notes: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
  { notes: [220.0, 261.63, 329.63, 392.0] }, // Am7
  { notes: [174.61, 220.0, 261.63, 329.63] }, // Fmaj7
  { notes: [196.0, 246.94, 293.66, 329.63] }, // G6
];

const CHORD_DURATION = 4.5;
const ATTACK = 1.3;
const RELEASE = 1.6;
const NOTE_GAIN = 0.045;
const FILTER_FREQ = 1400;

function playNote(ctx: AudioContext, destination: AudioNode, freq: number, startAt: number, endAt: number) {
  const noteGain = ctx.createGain();
  noteGain.gain.setValueAtTime(0, startAt);
  noteGain.gain.linearRampToValueAtTime(NOTE_GAIN, startAt + ATTACK);
  noteGain.gain.setValueAtTime(NOTE_GAIN, Math.max(startAt + ATTACK, endAt - RELEASE));
  noteGain.gain.linearRampToValueAtTime(0, endAt);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = FILTER_FREQ;
  filter.Q.value = 0.6;

  noteGain.connect(filter);
  filter.connect(destination);

  for (const detune of [-5, 5]) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(noteGain);
    osc.start(startAt);
    osc.stop(endAt + 0.05);
  }
}

function playChord(ctx: AudioContext, destination: AudioNode, notes: number[], startAt: number, duration: number) {
  const endAt = startAt + duration;
  for (const freq of notes) {
    playNote(ctx, destination, freq, startAt, endAt);
  }
}

/** Schedules one full pass of the progression starting at `startAt`, returning the time it ends (i.e. where the next loop should begin). */
export function scheduleProgression(ctx: AudioContext, destination: AudioNode, startAt: number): number {
  let t = startAt;
  for (const chord of PROGRESSION) {
    playChord(ctx, destination, chord.notes, t, CHORD_DURATION);
    t += CHORD_DURATION;
  }
  return t;
}
