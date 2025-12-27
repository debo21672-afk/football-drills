
// Extend Window interface for webkit support
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const createBeepSound = (frequency: number, duration: number) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.log('Audio not supported');
      return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    console.log('Audio not supported');
  }
};

export const playCountdownSound = () => createBeepSound(800, 0.2);
export const playStartSound = () => createBeepSound(1000, 0.5);
export const playWarningSound = () => createBeepSound(600, 0.3);
export const playEndSound = () => createBeepSound(400, 1.0);

// Enhanced countdown beep that gets progressively higher and more urgent
export const playFinalCountdownSound = (secondsLeft: number) => {
  // Frequency increases as time runs out (more urgent)
  // Duration gets shorter as time runs out (more staccato)
  const baseFrequency = 600;
  const frequencyIncrease = (11 - secondsLeft) * 80; // Gets higher pitched
  const frequency = baseFrequency + frequencyIncrease;

  // Last 3 seconds are shorter and sharper
  const duration = secondsLeft <= 3 ? 0.15 : 0.25;

  createBeepSound(frequency, duration);
};
