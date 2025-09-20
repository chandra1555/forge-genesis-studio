import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Share } from 'lucide-react';
import { GameData, GameState } from '@/types/game';
import { toast } from 'sonner';

interface GamePlayerProps {
  gameData: GameData | null;
  onSave?: (gameData: GameData) => void;
  onShare?: (gameData: GameData) => void;
}

export const GamePlayer = ({ gameData, onSave, onShare }: GamePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    isGameOver: false,
    level: 1,
    lives: 3
  });

  useEffect(() => {
    if (!gameData || !containerRef.current) return;

    // Clean up previous game
    if (gameInstanceRef.current) {
      gameInstanceRef.current.stop();
      containerRef.current.innerHTML = '';
    }

    // Create new game instance
    try {
      // Execute the game code to make Game class available
      eval(gameData.files['main.js']);
      
      if (typeof (window as any).Game === 'function') {
        const gameInstance = new (window as any).Game();
        const canvas = gameInstance.getCanvas();
        
        if (canvas && containerRef.current) {
          containerRef.current.appendChild(canvas);
          gameInstanceRef.current = gameInstance;
          
          // Set up game state monitoring
          const originalStop = gameInstance.stop;
          gameInstance.stop = function() {
            originalStop.call(this);
            setGameState(prev => ({ ...prev, isPlaying: false }));
          };
          
          const originalGameOver = gameInstance.gameOver;
          gameInstance.gameOver = function() {
            originalGameOver.call(this);
            setGameState(prev => ({ 
              ...prev, 
              isGameOver: true, 
              isPlaying: false,
              score: this.score || 0
            }));
          };
          
          const originalGameWin = gameInstance.gameWin;
          gameInstance.gameWin = function() {
            originalGameWin.call(this);
            setGameState(prev => ({ 
              ...prev, 
              isGameOver: true, 
              isPlaying: false,
              score: this.score || 0
            }));
          };
          
          // Monitor score updates
          const monitorScore = () => {
            if (gameInstance.score !== undefined) {
              setGameState(prev => ({ ...prev, score: gameInstance.score }));
            }
            if (gameInstance.isRunning) {
              requestAnimationFrame(monitorScore);
            }
          };
          
          // Override start method to include monitoring
          const originalStart = gameInstance.start;
          gameInstance.start = function() {
            originalStart.call(this);
            setGameState(prev => ({ ...prev, isPlaying: true, isGameOver: false }));
            monitorScore();
          };
          
          // Auto-start the game
          gameInstance.start();
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Failed to load game');
    }

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.stop();
      }
    };
  }, [gameData]);

  const handlePlayPause = () => {
    if (!gameInstanceRef.current) return;

    if (gameState.isPlaying) {
      gameInstanceRef.current.stop();
      setGameState(prev => ({ ...prev, isPlaying: false }));
    } else {
      gameInstanceRef.current.start();
      setGameState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const handleRestart = () => {
    if (!gameInstanceRef.current) return;

    gameInstanceRef.current.stop();
    setGameState({
      score: 0,
      isPlaying: false,
      isGameOver: false,
      level: 1,
      lives: 3
    });

    // Restart the game
    setTimeout(() => {
      if (gameInstanceRef.current) {
        // Reset game state
        gameInstanceRef.current.score = 0;
        gameInstanceRef.current.player.x = 100;
        gameInstanceRef.current.player.y = 400;
        gameInstanceRef.current.player.vx = 0;
        gameInstanceRef.current.player.vy = 0;
        
        // Reset collectibles
        gameInstanceRef.current.collectibles.forEach((c: any) => c.collected = false);
        
        gameInstanceRef.current.start();
        setGameState(prev => ({ ...prev, isPlaying: true }));
      }
    }, 100);
  };

  const handleSave = () => {
    if (gameData && onSave) {
      onSave(gameData);
    }
  };

  const handleShare = () => {
    if (gameData && onShare) {
      onShare(gameData);
    } else {
      // Copy game URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Game URL copied to clipboard!');
    }
  };

  if (!gameData) {
    return (
      <Card className="tech-panel border-primary/30">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Game Loaded</h3>
          <p className="text-muted-foreground">Generate or load a game to start playing</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="tech-panel border-primary/30 overflow-hidden">
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{gameData.title || 'Generated Game'}</h3>
            <p className="text-sm text-muted-foreground capitalize">{gameData.type} Game</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                Score: <span className="text-gaming-glow">{gameState.score}</span>
              </span>
              <span className="flex items-center gap-1">
                Status: <span className={gameState.isGameOver ? "text-red-400" : gameState.isPlaying ? "text-green-400" : "text-yellow-400"}>
                  {gameState.isGameOver ? "Game Over" : gameState.isPlaying ? "Playing" : "Paused"}
                </span>
              </span>
            </div>
            
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handlePlayPause}>
                {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={containerRef}
          className="w-full min-h-[600px] bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center"
        />
        
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
          <p className="text-sm text-muted-foreground">Use arrow keys or WASD to move</p>
          <p className="text-xs text-gaming-glow">Press Space or Up arrow to jump</p>
        </div>
        
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Card className="p-6 text-center">
              <h4 className="text-2xl font-bold text-primary mb-2">Game Complete!</h4>
              <p className="text-lg text-foreground mb-4">Final Score: {gameState.score}</p>
              <Button onClick={handleRestart} className="mx-auto">
                Play Again
              </Button>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
};