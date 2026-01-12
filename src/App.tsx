import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Game } from './components/Game';
import { UI } from './components/UI';
import { useVoiceControl } from './hooks/useVoiceControl';

function App() {
  const [started, setStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const { pitch, frequency, isActive, start } = useVoiceControl();

  const handleStart = useCallback(async () => {
    await start();
    setStarted(true);
    setGameOver(false);
    setHasWon(false);
  }, [start]);

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setGameOver(false);
    setHasWon(false);
  }, []);

  const handleGameOver = useCallback((won: boolean) => {
    setGameOver(true);
    setHasWon(won);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Canvas shadows camera={{ position: [0, 4, 10], fov: 60 }}>
        <color attach="background" args={['#1a1a2e']} />
        <fog attach="fog" args={['#1a1a2e', 10, 50]} />
        <Game
          key={gameKey}
          pitch={pitch}
          isActive={isActive}
          onGameOver={handleGameOver}
        />
      </Canvas>
      <UI
        started={started}
        onStart={handleStart}
        pitch={pitch}
        frequency={frequency}
        isActive={isActive}
        gameOver={gameOver}
        hasWon={hasWon}
        onRestart={handleRestart}
      />
    </div>
  );
}

export default App;
