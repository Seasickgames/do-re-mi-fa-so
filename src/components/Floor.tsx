export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow>
      <planeGeometry args={[20, 100]} />
      <meshStandardMaterial color="#2d3436" />
    </mesh>
  );
}
