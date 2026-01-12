import { useState, useCallback, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Ball, BALL_CONFIG } from './Ball';
import { Wall, WALL_CONFIG } from './Wall';
import { Floor } from './Floor';
import { FinishLine } from './FinishLine';
import { GAME_CONFIG } from '../config/constants';
import { generateNotes, remapPitchToNoteRange } from '../utils/pitchUtils';

interface GameProps {
  pitch: number;
  isActive: boolean;
  onGameOver?: (won: boolean) => void;
}

// Generate the notes configuration
const NOTES = generateNotes();

export function Game({ pitch, isActive, onGameOver }: GameProps) {
  const [ballZ, setBallZ] = useState<number>(GAME_CONFIG.START_Z);
  const [hasWon, setHasWon] = useState(false);
  const { camera } = useThree();

  const walls = useMemo(
    () =>
      NOTES.map((note, index) => ({
        ...note,
        z: GAME_CONFIG.FIRST_WALL_Z - index * GAME_CONFIG.WALL_SPACING,
        // Convert 0-1 height to actual Y position
        holeY:
          BALL_CONFIG.MIN_HEIGHT +
          note.height * (BALL_CONFIG.MAX_HEIGHT - BALL_CONFIG.MIN_HEIGHT),
      })),
    [],
  );

  const finishZ =
    GAME_CONFIG.FIRST_WALL_Z - NOTES.length * GAME_CONFIG.WALL_SPACING;

  // Wall info for Ball collision detection
  const wallInfos = useMemo(
    () =>
      walls.map((wall) => ({
        z: wall.z,
        holeY: wall.holeY,
        holeSize: WALL_CONFIG.HOLE_SIZE,
        thickness: WALL_CONFIG.THICKNESS,
      })),
    [walls],
  );

  const handlePositionChange = useCallback(
    (z: number) => {
      setBallZ(z);

      // Check win condition
      if (z <= finishZ && !hasWon) {
        setHasWon(true);
        onGameOver?.(true);
      }
    },
    [finishZ, onGameOver, hasWon],
  );

  // Camera follows ball from the side
  useFrame(() => {
    camera.position.x = GAME_CONFIG.CAMERA.OFFSET_X;
    camera.position.y = GAME_CONFIG.CAMERA.OFFSET_Y;
    camera.position.z = ballZ + GAME_CONFIG.CAMERA.OFFSET_Z;
    camera.lookAt(0, 2.5, ballZ - GAME_CONFIG.CAMERA.LOOK_AHEAD);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, ballZ]} intensity={0.5} color="#ff6b6b" />

      {/* Floor */}
      <Floor />

      {/* Ball */}
      <Ball
        targetHeight={remapPitchToNoteRange(pitch)}
        isMoving={isActive}
        onPositionChange={handlePositionChange}
        hasWon={hasWon}
        walls={wallInfos}
        startZ={GAME_CONFIG.START_Z}
      />

      {/* Walls */}
      {walls.map((wall, index) => (
        <Wall
          key={index}
          position={[0, 0, wall.z]}
          holeHeight={wall.holeY}
          label={wall.label}
        />
      ))}

      {/* Finish Line */}
      <FinishLine position={[0, 0, finishZ]} />

      {/* Start platform */}
      <mesh position={[0, 0.05, GAME_CONFIG.START_Z]} receiveShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#00aa00" />
      </mesh>
    </>
  );
}
