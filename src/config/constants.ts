// Game configuration constants
export const GAME_CONFIG = {
  WALL_SPACING: 8,
  START_Z: 5,
  FIRST_WALL_Z: 0,
  CAMERA: {
    OFFSET_X: 12,
    OFFSET_Y: 3,
    OFFSET_Z: 4,
    LOOK_AHEAD: 8,
  },
} as const;

// Ball physics constants
export const BALL_CONFIG = {
  RADIUS: 0.3,
  MIN_HEIGHT: 0.5,
  MAX_HEIGHT: 5,
  FORWARD_SPEED: 0.05,
  BACKWARD_SPEED: 0.03,
  HEIGHT_LERP_SPEED: 0.1,
} as const;

// Wall dimensions
export const WALL_CONFIG = {
  WIDTH: 6,
  HEIGHT: 6,
  THICKNESS: 0.3,
  HOLE_SIZE: 1.2,
  OPACITY: 0.3,
} as const;

// Audio/Voice configuration
export const AUDIO_CONFIG = {
  MIN_FREQUENCY: 80, // Hz - low male voice
  MAX_FREQUENCY: 800, // Hz - high female voice
  VOLUME_THRESHOLD: 0.005,
  PITCH_SMOOTHING: 0.3,
  SILENCE_FRAMES_BEFORE_DROP: 10,
  FFT_SIZE: 2048,
  SMOOTHING_TIME_CONSTANT: 0.8,
} as const;

// Musical note frequencies for Do-Re-Mi-Fa-So-La-Ti-Do (C4 to C5)
export const NOTE_FREQUENCIES = {
  Do: 261.63, // C4
  Re: 293.66, // D4
  Mi: 329.63, // E4
  Fa: 349.23, // F4
  So: 392.0, // G4
  La: 440.0, // A4
  Ti: 493.88, // B4
  Do2: 523.25, // C5
} as const;
