/**
 * Lightweight sound effects using the Web Audio API.
 * No external audio files — all sounds are generated procedurally.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.3,
) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);
  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

/** Short click for keypad press */
export function playTap() {
  playTone(800, 0.05, "square", 0.1);
}

/** Rising chime for correct answer */
export function playCorrect() {
  const ac = getCtx();
  const now = ac.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    gain.gain.setValueAtTime(0.2, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.15);
  });
}

/** Buzzer for wrong answer */
export function playWrong() {
  playTone(200, 0.25, "sawtooth", 0.15);
}

/** Thud for rope pull */
export function playPull() {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.15);
}

/** Urgent tick for rush timer warning */
export function playWarning() {
  playTone(1000, 0.08, "square", 0.2);
}

/** Fanfare for team victory */
export function playWin() {
  const ac = getCtx();
  const now = ac.currentTime;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.12);
    gain.gain.setValueAtTime(0.25, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.3);
  });
}

/** Descending tone for tie */
export function playTie() {
  const ac = getCtx();
  const now = ac.currentTime;
  [440, 392, 349].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.15);
    gain.gain.setValueAtTime(0.2, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.25);
  });
}
