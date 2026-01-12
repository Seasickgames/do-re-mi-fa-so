import { BALL_CONFIG } from '../config/constants';

export interface WallInfo {
  z: number;
  holeY: number;
  holeSize: number;
  thickness: number;
}

// Check if ball can pass through wall at current position
export function canPassThrough(
  z: number,
  ballY: number,
  walls: WallInfo[],
): boolean {
  for (const wall of walls) {
    const wallFront = wall.z + wall.thickness / 2 + BALL_CONFIG.RADIUS;
    const wallBack = wall.z - wall.thickness / 2 - BALL_CONFIG.RADIUS;

    if (z <= wallFront && z >= wallBack) {
      const holeBottom = wall.holeY - wall.holeSize / 2 + BALL_CONFIG.RADIUS;
      const holeTop = wall.holeY + wall.holeSize / 2 - BALL_CONFIG.RADIUS;

      if (ballY < holeBottom || ballY > holeTop) {
        return false; // Would collide
      }
    }
  }
  return true;
}

// Find the minimum Z the ball can retreat to (just past the last cleared wall)
export function getMinRetreatZ(currentZ: number, walls: WallInfo[]): number {
  // Find walls that the ball has passed (ball is behind the wall)
  const passedWalls = walls.filter(
    (wall) => currentZ < wall.z - wall.thickness / 2 - BALL_CONFIG.RADIUS,
  );

  if (passedWalls.length === 0) {
    return Infinity; // No walls passed, can go back to start
  }

  // Get the most recently passed wall (highest Z among passed walls)
  const lastPassedWall = passedWalls.reduce((prev, curr) =>
    curr.z > prev.z ? curr : prev,
  );

  // Return position just behind that wall
  return (
    lastPassedWall.z - lastPassedWall.thickness / 2 - BALL_CONFIG.RADIUS - 0.1
  );
}
