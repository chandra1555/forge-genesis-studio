import { useState, useCallback } from 'react';
import { GameData, GameMetadata, GenerationOptions } from '@/types/game';
import { toast } from 'sonner';

interface UseGameGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  currentGame: GameData | null;
  generateGame: (prompt: string, options?: GenerationOptions) => Promise<void>;
  saveGame: (game: GameData, metadata: Omit<GameMetadata, 'id' | 'createdAt' | 'updatedAt' | 'plays'>) => string;
  loadGame: (id: string) => GameData | null;
  getGameHistory: () => GameMetadata[];
  deleteGame: (id: string) => void;
}

const STORAGE_KEY = 'forge-genesis-games';
const METADATA_KEY = 'forge-genesis-metadata';

export const useGameGenerator = (): UseGameGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);

  const simulateGameGeneration = async (prompt: string, options?: GenerationOptions): Promise<GameData> => {
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    const gameType = options?.gameType || 'platformer';
    const theme = options?.theme || 'cyberpunk';
    
    // Generate a basic game structure based on prompt
    const gameConfig = {
      width: 800,
      height: 600,
      backgroundColor: theme === 'cyberpunk' ? '#0a0a0f' : '#87CEEB',
      playerSpeed: 5,
      jumpPower: 12,
      gravity: 0.8,
      enemies: Math.floor(Math.random() * 5) + 3,
      collectibles: Math.floor(Math.random() * 10) + 5
    };

    const gameData: GameData = {
      title: prompt.slice(0, 50),
      type: gameType,
      files: {
        'main.js': generateGameCode(prompt, gameConfig),
        'config.json': JSON.stringify(gameConfig, null, 2)
      },
      config: gameConfig
    };

    return gameData;
  };

  const generateGameCode = (prompt: string, config: any): string => {
    return `
// Generated game: ${prompt}
class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.player = { x: 100, y: 400, width: 32, height: 32, vx: 0, vy: 0, onGround: false };
    this.enemies = [];
    this.collectibles = [];
    this.score = 0;
    this.isRunning = false;
    this.config = ${JSON.stringify(config)};
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.ctx = this.canvas.getContext('2d');
    
    // Generate enemies
    for (let i = 0; i < this.config.enemies; i++) {
      this.enemies.push({
        x: Math.random() * (this.config.width - 50) + 200,
        y: Math.random() * (this.config.height - 100) + 50,
        width: 24,
        height: 24,
        vx: (Math.random() - 0.5) * 2
      });
    }
    
    // Generate collectibles
    for (let i = 0; i < this.config.collectibles; i++) {
      this.collectibles.push({
        x: Math.random() * (this.config.width - 30) + 50,
        y: Math.random() * (this.config.height - 100) + 50,
        width: 16,
        height: 16,
        collected: false
      });
    }
    
    this.setupControls();
  }

  setupControls() {
    const keys = {};
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    
    this.keys = keys;
  }

  update() {
    if (!this.isRunning) return;
    
    // Player movement
    if (this.keys['ArrowLeft'] || this.keys['a']) this.player.vx = -this.config.playerSpeed;
    else if (this.keys['ArrowRight'] || this.keys['d']) this.player.vx = this.config.playerSpeed;
    else this.player.vx *= 0.8;
    
    if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys[' ']) && this.player.onGround) {
      this.player.vy = -this.config.jumpPower;
      this.player.onGround = false;
    }
    
    // Apply gravity
    this.player.vy += this.config.gravity;
    
    // Update position
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
    
    // Ground collision
    if (this.player.y > this.config.height - this.player.height - 50) {
      this.player.y = this.config.height - this.player.height - 50;
      this.player.vy = 0;
      this.player.onGround = true;
    }
    
    // Boundaries
    this.player.x = Math.max(0, Math.min(this.config.width - this.player.width, this.player.x));
    
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.x += enemy.vx;
      if (enemy.x <= 0 || enemy.x >= this.config.width - enemy.width) enemy.vx *= -1;
    });
    
    // Check collisions
    this.checkCollisions();
  }

  checkCollisions() {
    // Enemy collisions
    this.enemies.forEach(enemy => {
      if (this.checkCollision(this.player, enemy)) {
        this.gameOver();
      }
    });
    
    // Collectible collisions
    this.collectibles.forEach(collectible => {
      if (!collectible.collected && this.checkCollision(this.player, collectible)) {
        collectible.collected = true;
        this.score += 10;
      }
    });
    
    // Win condition
    if (this.collectibles.every(c => c.collected)) {
      this.gameWin();
    }
  }

  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  render() {
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    
    // Draw ground
    this.ctx.fillStyle = '#444';
    this.ctx.fillRect(0, this.config.height - 50, this.config.width, 50);
    
    // Draw player
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw enemies
    this.ctx.fillStyle = '#ff0000';
    this.enemies.forEach(enemy => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw collectibles
    this.ctx.fillStyle = '#ffff00';
    this.collectibles.forEach(collectible => {
      if (!collectible.collected) {
        this.ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      }
    });
    
    // Draw UI
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(\`Score: \${this.score}\`, 20, 30);
    this.ctx.fillText(\`Collectibles: \${this.collectibles.filter(c => !c.collected).length}\`, 20, 60);
  }

  gameLoop() {
    this.update();
    this.render();
    if (this.isRunning) requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
  }

  gameOver() {
    this.stop();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', this.config.width / 2, this.config.height / 2);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(\`Final Score: \${this.score}\`, this.config.width / 2, this.config.height / 2 + 50);
  }

  gameWin() {
    this.stop();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('You Win!', this.config.width / 2, this.config.height / 2);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(\`Score: \${this.score}\`, this.config.width / 2, this.config.height / 2 + 50);
  }

  getCanvas() {
    return this.canvas;
  }
}

// Export for use
window.Game = Game;
`;
  };

  const generateGame = useCallback(async (prompt: string, options?: GenerationOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const gameData = await simulateGameGeneration(prompt, options);
      setCurrentGame(gameData);
      toast.success('Game generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate game';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const saveGame = useCallback((game: GameData, metadata: Omit<GameMetadata, 'id' | 'createdAt' | 'updatedAt' | 'plays'>): string => {
    const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save game data
    const savedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    savedGames[id] = game;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGames));
    
    // Save metadata
    const gameMetadata: GameMetadata = {
      ...metadata,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      plays: 0
    };
    
    const savedMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || '[]');
    savedMetadata.push(gameMetadata);
    localStorage.setItem(METADATA_KEY, JSON.stringify(savedMetadata));
    
    toast.success('Game saved successfully!');
    return id;
  }, []);

  const loadGame = useCallback((id: string): GameData | null => {
    const savedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const game = savedGames[id];
    
    if (game) {
      // Update plays count
      const savedMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || '[]');
      const metadataIndex = savedMetadata.findIndex((m: GameMetadata) => m.id === id);
      if (metadataIndex !== -1) {
        savedMetadata[metadataIndex].plays += 1;
        savedMetadata[metadataIndex].updatedAt = new Date();
        localStorage.setItem(METADATA_KEY, JSON.stringify(savedMetadata));
      }
      
      setCurrentGame(game);
      return game;
    }
    
    return null;
  }, []);

  const getGameHistory = useCallback((): GameMetadata[] => {
    const savedMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || '[]');
    return savedMetadata.sort((a: GameMetadata, b: GameMetadata) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, []);

  const deleteGame = useCallback((id: string) => {
    // Remove game data
    const savedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete savedGames[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGames));
    
    // Remove metadata
    const savedMetadata = JSON.parse(localStorage.getItem(METADATA_KEY) || '[]');
    const filteredMetadata = savedMetadata.filter((m: GameMetadata) => m.id !== id);
    localStorage.setItem(METADATA_KEY, JSON.stringify(filteredMetadata));
    
    toast.success('Game deleted successfully!');
  }, []);

  return {
    isGenerating,
    error,
    currentGame,
    generateGame,
    saveGame,
    loadGame,
    getGameHistory,
    deleteGame
  };
};