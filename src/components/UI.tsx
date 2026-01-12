import type { CSSProperties } from 'react';

interface UIProps {
  started: boolean;
  onStart: () => void;
  pitch: number;
  frequency: number;
  isActive: boolean;
  gameOver: boolean;
  hasWon: boolean;
  onRestart: () => void;
}

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  fontFamily: 'Arial, sans-serif',
};

const startScreenStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  pointerEvents: 'auto',
};

const buttonStyle: CSSProperties = {
  padding: '20px 40px',
  fontSize: '24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  cursor: 'pointer',
  marginTop: '20px',
  transition: 'transform 0.2s',
};

const frequencyStyle: CSSProperties = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  color: 'white',
  fontSize: '16px',
  background: 'rgba(0, 0, 0, 0.5)',
  padding: '10px 20px',
  borderRadius: '10px',
};

const gameOverStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  pointerEvents: 'auto',
};

export function UI({
  started,
  onStart,
  frequency,
  isActive,
  gameOver,
  hasWon,
  onRestart,
}: UIProps) {
  if (!started) {
    return (
      <div style={containerStyle}>
        <div style={startScreenStyle}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
            🎵 Do-Re-Mi Challenge 🎵
          </h1>
          <p
            style={{
              fontSize: '18px',
              maxWidth: '500px',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Control the ball with your voice!
            <br />
            Sing to move forward.
            <br />
            Match your pitch to the hole height.
            <br />
            Go from Do (low) to Do (high)!
          </p>
          <button
            style={buttonStyle}
            onClick={onStart}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🎤 Start Singing!
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={containerStyle}>
        <div style={gameOverStyle}>
          <h1
            style={{
              fontSize: '64px',
              color: hasWon ? '#ffd700' : '#ff6b6b',
              textShadow: `0 0 20px ${hasWon ? '#ffd700' : '#ff6b6b'}`,
            }}
          >
            {hasWon ? '🎉 YOU WIN! 🎉' : '💥 CRASH! 💥'}
          </h1>
          <p style={{ fontSize: '24px', color: 'white', marginTop: '20px' }}>
            {hasWon ? 'Amazing singing!' : 'Try matching your pitch better!'}
          </p>
          <button
            style={buttonStyle}
            onClick={onRestart}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Frequency display */}
      <div style={frequencyStyle}>
        <div>
          Frequency: {frequency > 0 ? `${Math.round(frequency)} Hz` : '---'}
        </div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          {isActive ? '🎤 Singing...' : '🔇 Sing to move!'}
        </div>
      </div>
    </div>
  );
}
