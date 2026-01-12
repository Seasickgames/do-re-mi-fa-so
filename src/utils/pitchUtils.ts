import { AUDIO_CONFIG, NOTE_FREQUENCIES } from '../config/constants';

// Convert frequency to normalized pitch (0-1) using logarithmic scale
export function frequencyToPitch(freq: number): number {
  const minLog = Math.log2(AUDIO_CONFIG.MIN_FREQUENCY);
  const maxLog = Math.log2(AUDIO_CONFIG.MAX_FREQUENCY);
  const freqLog = Math.log2(
    Math.max(
      AUDIO_CONFIG.MIN_FREQUENCY,
      Math.min(AUDIO_CONFIG.MAX_FREQUENCY, freq),
    ),
  );
  return (freqLog - minLog) / (maxLog - minLog);
}

// Get the pitch range for the musical notes
const MIN_NOTE_PITCH = frequencyToPitch(NOTE_FREQUENCIES.Do);
const MAX_NOTE_PITCH = frequencyToPitch(NOTE_FREQUENCIES.Do2);

// Remap pitch from full voice range to note range (0-1)
export function remapPitchToNoteRange(pitch: number): number {
  // Clamp pitch to note range, then remap to 0-1
  const clampedPitch = Math.max(
    MIN_NOTE_PITCH,
    Math.min(MAX_NOTE_PITCH, pitch),
  );
  return (clampedPitch - MIN_NOTE_PITCH) / (MAX_NOTE_PITCH - MIN_NOTE_PITCH);
}

// Generate notes with normalized heights
export function generateNotes() {
  return [
    {
      label: 'Do',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Do)),
    },
    {
      label: 'Re',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Re)),
    },
    {
      label: 'Mi',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Mi)),
    },
    {
      label: 'Fa',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Fa)),
    },
    {
      label: 'So',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.So)),
    },
    {
      label: 'La',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.La)),
    },
    {
      label: 'Ti',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Ti)),
    },
    {
      label: 'Do₂',
      height: remapPitchToNoteRange(frequencyToPitch(NOTE_FREQUENCIES.Do2)),
    },
  ];
}
