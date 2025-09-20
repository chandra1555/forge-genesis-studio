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
    // Set background based on theme
    const bgColor = gameData.config.theme === 'space' ? '#000033' : 
                   gameData.config.theme === 'forest' ? '#228B22' : 
                   gameData.config.theme === 'underwater' ? '#1E90FF' : '#87CEEB';
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Render game title
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameData.title || 'Generated Game', ctx.canvas.width / 2, 30);
    
    // Render game objects
    gameData.config.objects.forEach((obj) => {
      ctx.fillStyle = obj.color;
      
      if (obj.type === 'rectangle') {
        ctx.fillRect(obj.x, obj.y, obj.width || 50, obj.height || 50);
      } else if (obj.type === 'circle') {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius || 20, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Render score
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
    
    // Add click interaction
    ctx.canvas.onclick = (e) => {
      const rect = ctx.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if click is on any object
      gameData.config.objects.forEach((obj) => {
        if (obj.behavior === 'collectible' || obj.behavior === 'enemy') {
          if (obj.type === 'circle') {
            const distance = Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2);
            if (distance <= (obj.radius || 20)) {
              setScore(prev => prev + 10);
              renderGame(ctx);
            }
          } else if (obj.type === 'rectangle') {
            if (x >= obj.x && x <= obj.x + (obj.width || 50) && 
                y >= obj.y && y <= obj.y + (obj.height || 50)) {
              setScore(prev => prev + 10);
              renderGame(ctx);
            }
          }
        }
      });
    };
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
