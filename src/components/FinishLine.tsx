import { Text } from '@react-three/drei';

interface FinishLineProps {
  position: [number, number, number];
}

export function FinishLine({ position }: FinishLineProps) {
  return (
    <group position={position}>
      {/* Finish platform */}
      <mesh position={[0, 0.05, -2]} receiveShadow>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Finish arch */}
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[2, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[4.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Finish text */}
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        FINISH!
      </Text>
    </group>
  );
}
