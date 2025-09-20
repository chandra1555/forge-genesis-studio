import React, { useEffect, useRef, useState } from 'react';
import { GameData } from '../types/game';

interface GamePlayerProps {
  gameData: GameData;
  gameId: string;
  onGameEnd?: (state: any) => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ gameData, gameId, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw a simple background
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the game title
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(gameData.title || 'Game', 10, 30);
        
        // Draw a simple object
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(100, 100, 50, 50);
      }
    }
  }, [gameData]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
      <div>Score: {score}</div>
      <button onClick={() => onGameEnd && onGameEnd({ score })}>End Game</button>
    </div>
  );
};

export default GamePlayer;
