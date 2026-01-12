import { useEffect, useRef, useState, useCallback } from 'react';
import { AUDIO_CONFIG } from '../config/constants';

interface VoiceControlState {
  pitch: number; // 0-1 normalized pitch
  volume: number; // 0-1 normalized volume
  isActive: boolean;
  frequency: number; // actual frequency in Hz
}

export function useVoiceControl(): VoiceControlState & {
  start: () => Promise<void>;
} {
  const [state, setState] = useState<VoiceControlState>({
    pitch: 0, // Start at bottom (Do)
    volume: 0,
    isActive: false,
    frequency: 0,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isStartedRef = useRef(false);
  const smoothedPitchRef = useRef(0);
  const silenceFramesRef = useRef(0);

  const detectPitch = useCallback(
    (analyser: AnalyserNode, sampleRate: number) => {
      const bufferLength = analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(buffer);

      // Calculate RMS volume
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        sumSquares += buffer[i] * buffer[i];
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      const volume = Math.min(1, rms * 5); // Normalize to 0-1

      // Check if volume is too low
      if (volume < AUDIO_CONFIG.VOLUME_THRESHOLD) {
        silenceFramesRef.current++;
        if (
          silenceFramesRef.current > AUDIO_CONFIG.SILENCE_FRAMES_BEFORE_DROP
        ) {
          // Gradually drop pitch to 0
          smoothedPitchRef.current *= 0.9;
          if (smoothedPitchRef.current < 0.01) {
            smoothedPitchRef.current = 0;
          }
          setState({
            pitch: smoothedPitchRef.current,
            volume,
            isActive: false,
            frequency: 0,
          });
        }
        return;
      }

      silenceFramesRef.current = 0;

      // Use YIN-like algorithm for better pitch detection
      const minPeriod = Math.floor(sampleRate / AUDIO_CONFIG.MAX_FREQUENCY);
      const maxPeriod = Math.floor(sampleRate / AUDIO_CONFIG.MIN_FREQUENCY);

      // Calculate normalized square difference function
      const nsdf = new Float32Array(maxPeriod + 1);
      for (let tau = minPeriod; tau <= maxPeriod; tau++) {
        let acf = 0; // Autocorrelation
        let m1 = 0; // Energy of first segment
        let m2 = 0; // Energy of second segment

        for (let i = 0; i < bufferLength - tau; i++) {
          acf += buffer[i] * buffer[i + tau];
          m1 += buffer[i] * buffer[i];
          m2 += buffer[i + tau] * buffer[i + tau];
        }

        // Normalized Square Difference Function
        if (m1 + m2 > 0) {
          nsdf[tau] = (2 * acf) / (m1 + m2);
        }
      }

      // Find the first peak above threshold
      let bestTau = -1;
      let bestValue = 0;
      let foundPeak = false;
      const threshold = 0.2; // Lowered threshold for easier detection

      for (let tau = minPeriod; tau <= maxPeriod; tau++) {
        if (nsdf[tau] > threshold) {
          // Look for peak
          if (tau > minPeriod && tau < maxPeriod) {
            if (nsdf[tau] > nsdf[tau - 1] && nsdf[tau] > nsdf[tau + 1]) {
              if (nsdf[tau] > bestValue) {
                bestValue = nsdf[tau];
                bestTau = tau;
                foundPeak = true;
              }
            }
          }
        }
      }

      // If no peak found, try finding the maximum
      if (!foundPeak) {
        for (let tau = minPeriod; tau <= maxPeriod; tau++) {
          if (nsdf[tau] > bestValue && nsdf[tau] > threshold * 0.5) {
            bestValue = nsdf[tau];
            bestTau = tau;
          }
        }
      }

      if (bestTau > 0 && bestValue > 0.1) {
        const frequency = sampleRate / bestTau;

        // Map frequency to 0-1 pitch range
        // Use a logarithmic scale for more natural pitch mapping
        const minLog = Math.log2(AUDIO_CONFIG.MIN_FREQUENCY);
        const maxLog = Math.log2(AUDIO_CONFIG.MAX_FREQUENCY);
        const freqLog = Math.log2(
          Math.max(
            AUDIO_CONFIG.MIN_FREQUENCY,
            Math.min(AUDIO_CONFIG.MAX_FREQUENCY, frequency),
          ),
        );
        const rawPitch = (freqLog - minLog) / (maxLog - minLog);

        // Smooth the pitch to reduce jitter
        smoothedPitchRef.current =
          smoothedPitchRef.current * (1 - AUDIO_CONFIG.PITCH_SMOOTHING) +
          rawPitch * AUDIO_CONFIG.PITCH_SMOOTHING;

        setState({
          pitch: Math.max(0, Math.min(1, smoothedPitchRef.current)),
          volume,
          isActive: true,
          frequency,
        });
      } else {
        // No valid pitch detected, but still have volume - keep last pitch briefly
        silenceFramesRef.current++;
        setState((prev) => ({
          ...prev,
          volume,
          isActive: volume > AUDIO_CONFIG.VOLUME_THRESHOLD,
        }));
      }
    },
    [],
  );

  const start = useCallback(async () => {
    if (isStartedRef.current) return;
    isStartedRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = AUDIO_CONFIG.FFT_SIZE;
      analyser.smoothingTimeConstant = AUDIO_CONFIG.SMOOTHING_TIME_CONSTANT;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const update = () => {
        if (analyserRef.current) {
          detectPitch(analyserRef.current, audioContext.sampleRate);
        }
        animationFrameRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (err) {
      console.error('Failed to access microphone:', err);
      isStartedRef.current = false;
    }
  }, [detectPitch]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { ...state, start };
}
