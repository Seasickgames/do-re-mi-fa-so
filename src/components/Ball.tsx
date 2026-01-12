import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { BALL_CONFIG } from '../config/constants';
import {
  canPassThrough,
  getMinRetreatZ,
  type WallInfo,
} from '../utils/collisionUtils';

interface BallProps {
  targetHeight: number; // 0-1 based on pitch
  isMoving: boolean;
  onPositionChange: (z: number) => void;
  hasWon: boolean;
  walls: WallInfo[];
  startZ: number;
}

export function Ball({
  targetHeight,
  isMoving,
  onPositionChange,
  hasWon,
  walls,
  startZ,
}: BallProps) {
  const meshRef = useRef<Mesh>(null);
  const currentHeight = useRef(BALL_CONFIG.MIN_HEIGHT);

  useFrame(() => {
    if (!meshRef.current) return;

    // Smoothly interpolate height based on pitch
    const targetY =
      BALL_CONFIG.MIN_HEIGHT +
      targetHeight * (BALL_CONFIG.MAX_HEIGHT - BALL_CONFIG.MIN_HEIGHT);
    currentHeight.current +=
      (targetY - currentHeight.current) * BALL_CONFIG.HEIGHT_LERP_SPEED;
    meshRef.current.position.y = currentHeight.current;

    if (hasWon) return;

    const currentZ = meshRef.current.position.z;
    const ballY = currentHeight.current;

    if (isMoving) {
      // Try to move forward
      const newZ = currentZ - BALL_CONFIG.FORWARD_SPEED;
      if (canPassThrough(newZ, ballY, walls)) {
        meshRef.current.position.z = newZ;
        onPositionChange(newZ);
      }
    } else {
      // Move backward when not singing, but stop before going through cleared walls
      const minRetreatZ = getMinRetreatZ(currentZ, walls);
      const maxZ = Math.min(startZ, minRetreatZ);
      const newZ = Math.min(maxZ, currentZ + BALL_CONFIG.BACKWARD_SPEED);
      meshRef.current.position.z = newZ;
      onPositionChange(newZ);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, BALL_CONFIG.MIN_HEIGHT, 5]}>
      <sphereGeometry args={[BALL_CONFIG.RADIUS, 32, 32]} />
      <meshStandardMaterial
        color={hasWon ? '#00ff00' : '#ff6b6b'}
        emissive={hasWon ? '#00ff00' : '#ff6b6b'}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export { BALL_CONFIG };
