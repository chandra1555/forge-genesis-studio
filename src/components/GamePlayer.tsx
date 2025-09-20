import React, { useEffect, useRef, useState } from 'react';
import { GameData, GameConfig } from '../types/game';

interface GamePlayerProps {
  gameData: GameData;
  gameId: string;
  onGameEnd?: (state: any) => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ gameData, gameId, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'ended'>('playing');

  useEffect(() => {
    if (canvasRef.current) {
      initGame(canvasRef.current);
    }
    
    return () => {
      // Cleanup game resources
    };
  }, [gameData]);

  const initGame = (canvas: HTMLCanvasElement) => {
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set background based on theme
    let bgColor = '#87CEEB'; // Default sky blue
    if (gameData.config.theme === 'space') {
      bgColor = '#000033'; // Dark blue for space
    } else if (gameData.config.theme === 'forest') {
      bgColor = '#228B22'; // Forest green
    } else if (gameData.config.theme === 'underwater') {
      bgColor = '#1E90FF'; // Water blue
    } else if (gameData.config.theme === 'medieval') {
      bgColor = '#D2B48C'; // Tan for medieval
    }
    
    renderGame(ctx, bgColor);
  };

  const renderGame = (ctx: CanvasRenderingContext2D, bgColor: string) => {
    // Clear canvas with theme-based background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Render game title
    ctx.fillStyle = '#FFF';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameData.title || 'Generated Game', ctx.canvas.width / 2, 30);
    
    // Render game type
    ctx.font = '16px Arial';
    ctx.fillText(`Type: ${gameData.type} | Theme: ${gameData.config.theme}`, ctx.canvas.width / 2, 60);
    
    // Render game objects based on config
    if (gameData.config.objects) {
      gameData.config.objects.forEach((obj) => {
        ctx.fillStyle = obj.color;
        
        if (obj.type === 'rectangle') {
          ctx.fillRect(obj.x, obj.y, obj.width || 50, obj.height || 50);
        } else if (obj.type === 'circle') {
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius || 20, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add behavior-specific rendering
        if (obj.behavior === 'player') {
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 2;
          if (obj.type === 'rectangle') {
            ctx.strokeRect(obj.x, obj.y, obj.width || 50, obj.height || 50);
          } else if (obj.type === 'circle') {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius || 20, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });
    }
    
    // Render score and lives
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 50);
    
    // Add game mechanics based on game type
    if (gameData.type === 'platformer') {
      // Platformer specific mechanics
      ctx.fillStyle = '#FFF';
      ctx.fillText('Click on coins to collect them!', 20, 80);
      
      // Add click event for collectibles
      ctx.canvas.onclick = (e) => {
        const rect = ctx.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on a collectible
        gameData.config.objects.forEach((obj) => {
          if (obj.behavior === 'collectible') {
            if (obj.type === 'circle') {
              const distance = Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2);
              if (distance <= (obj.radius || 20)) {
                setScore(prev => prev + 10);
                renderGame(ctx, bgColor); // Re-render to update score
              }
            }
          }
        });
      };
    } else if (gameData.type === 'shooter') {
      // Shooter specific mechanics
      ctx.fillStyle = '#FFF';
      ctx.fillText('Click on enemies to shoot them!', 20, 80);
      
      // Add click event for enemies
      ctx.canvas.onclick = (e) => {
        const rect = ctx.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on an enemy
        gameData.config.objects.forEach((obj) => {
          if (obj.behavior === 'enemy') {
            if (obj.type === 'circle') {
              const distance = Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2);
              if (distance <= (obj.radius || 20)) {
                setScore(prev => prev + 20);
                renderGame(ctx, bgColor); // Re-render to update score
              }
            }
          }
        });
      };
    } else {
      // Default mechanics for other game types
      ctx.fillStyle = '#FFF';
      ctx.fillText('Click on objects to interact!', 20, 80);
      
      // Add generic click event
      ctx.canvas.onclick = (e) => {
        setScore(prev => prev + 5);
        renderGame(ctx, bgColor); // Re-render to update score
      };
    }
  };

  return (
    <div className="game-player">
      <canvas ref={canvasRef} className="game-canvas"></canvas>
      <div className="game-controls">
        <button onClick={() => onGameEnd && onGameEnd({ score, lives, completed: true })}>
          End Game
        </button>
      </div>
    </div>
  );
};

export default GamePlayer;
