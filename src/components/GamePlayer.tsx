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
      initGame(canvasRef.current);
    }
  }, [gameData]);

  const initGame = (canvas: HTMLCanvasElement) => {
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    renderGame(ctx);
  };

  const renderGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Render game title
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameData.title || 'Generated Game', ctx.canvas.width / 2, 50);
    
    // Simple interactive element
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(350, 250, 100, 50);
    
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click Me!', 400, 280);
    
    // Add click event
    ctx.canvas.onclick = (e) => {
      const rect = ctx.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if click is on the button
      if (x >= 350 && x <= 450 && y >= 250 && y <= 300) {
        setScore(prev => prev + 10);
        renderGame(ctx); // Re-render to update score
      }
    };
    
    // Render score
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
  };

  return (
    <div className="game-player">
      <canvas ref={canvasRef} className="game-canvas"></canvas>
      <div className="game-controls">
        <button onClick={() => onGameEnd && onGameEnd({ score })}>
          End Game
        </button>
      </div>
    </div>
  );
};

export default GamePlayer;
