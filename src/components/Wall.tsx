import { Text } from '@react-three/drei';
import { WALL_CONFIG } from '../config/constants';

interface WallProps {
  position: [number, number, number];
  holeHeight: number; // Y position of the hole center
  label: string;
}

export function Wall({ position, holeHeight, label }: WallProps) {
  // Create wall segments around the hole
  // We need: left part, right part, bottom part, top part

  const holeY = holeHeight;
  const halfHole = WALL_CONFIG.HOLE_SIZE / 2;

  // Side segments (full height, on left and right of hole)
  const sideWidth = (WALL_CONFIG.WIDTH - WALL_CONFIG.HOLE_SIZE) / 2;

  // Top and bottom segments (between the sides, above and below hole)
  const topHeight = WALL_CONFIG.HEIGHT - (holeY + halfHole);
  const bottomHeight = holeY - halfHole;

  return (
    <group position={position}>
      {/* Left segment */}
      <mesh
        position={[
          -(WALL_CONFIG.HOLE_SIZE / 2 + sideWidth / 2),
          WALL_CONFIG.HEIGHT / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[sideWidth, WALL_CONFIG.HEIGHT, WALL_CONFIG.THICKNESS]}
        />
        <meshStandardMaterial
          color="#4a90d9"
          transparent
          opacity={WALL_CONFIG.OPACITY}
        />
      </mesh>

      {/* Right segment */}
      <mesh
        position={[
          WALL_CONFIG.HOLE_SIZE / 2 + sideWidth / 2,
          WALL_CONFIG.HEIGHT / 2,
          0,
        ]}
      >
        <boxGeometry
          args={[sideWidth, WALL_CONFIG.HEIGHT, WALL_CONFIG.THICKNESS]}
        />
        <meshStandardMaterial
          color="#4a90d9"
          transparent
          opacity={WALL_CONFIG.OPACITY}
        />
      </mesh>

      {/* Bottom segment */}
      {bottomHeight > 0 && (
        <mesh position={[0, bottomHeight / 2, 0]}>
          <boxGeometry
            args={[WALL_CONFIG.HOLE_SIZE, bottomHeight, WALL_CONFIG.THICKNESS]}
          />
          <meshStandardMaterial
            color="#4a90d9"
            transparent
            opacity={WALL_CONFIG.OPACITY}
          />
        </mesh>
      )}

      {/* Top segment */}
      {topHeight > 0 && (
        <mesh position={[0, holeY + halfHole + topHeight / 2, 0]}>
          <boxGeometry
            args={[WALL_CONFIG.HOLE_SIZE, topHeight, WALL_CONFIG.THICKNESS]}
          />
          <meshStandardMaterial
            color="#4a90d9"
            transparent
            opacity={WALL_CONFIG.OPACITY}
          />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, WALL_CONFIG.HEIGHT + 0.5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Hole glow effect */}
      <mesh position={[0, holeY, 0.1]}>
        <ringGeometry
          args={[
            WALL_CONFIG.HOLE_SIZE / 2 - 0.1,
            WALL_CONFIG.HOLE_SIZE / 2 + 0.1,
            32,
          ]}
        />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export { WALL_CONFIG };
