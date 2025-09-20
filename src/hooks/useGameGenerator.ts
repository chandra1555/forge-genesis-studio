import { useState } from 'react';
import { GameData, GameMetadata, GameConfig } from '../types/game';

// Game templates for different prompt types
const gameTemplates = {
  platformer: {
    mechanics: ['jumping', 'running', 'collecting'],
    elements: ['platforms', 'enemies', 'coins'],
    config: {
      gravity: 0.5,
      jumpForce: -10,
      objects: [
        { type: 'rectangle', x: 100, y: 400, width: 600, height: 20, color: '#8B4513', behavior: 'static' },
        { type: 'rectangle', x: 200, y: 300, width: 100, height: 20, color: '#8B4513', behavior: 'static' },
        { type: 'rectangle', x: 400, y: 200, width: 100, height: 20, color: '#8B4513', behavior: 'static' },
        { type: 'circle', x: 150, y: 350, radius: 15, color: '#FFD700', behavior: 'collectible' }
      ]
    }
  },
  puzzle: {
    mechanics: ['matching', 'swapping', 'solving'],
    elements: ['tiles', 'blocks', 'grid'],
    config: {
      gridSize: 8,
      moves: 20,
      objects: [
        { type: 'rectangle', x: 200, y: 150, width: 50, height: 50, color: '#FF0000', behavior: 'puzzle-piece' },
        { type: 'rectangle', x: 300, y: 150, width: 50, height: 50, color: '#00FF00', behavior: 'puzzle-piece' },
        { type: 'rectangle', x: 400, y: 150, width: 50, height: 50, color: '#0000FF', behavior: 'puzzle-piece' }
      ]
    }
  },
  shooter: {
    mechanics: ['aiming', 'shooting', 'dodging'],
    elements: ['targets', 'projectiles', 'enemies'],
    config: {
      fireRate: 0.3,
      enemyCount: 10,
      objects: [
        { type: 'rectangle', x: 400, y: 500, width: 30, height: 50, color: '#0000FF', behavior: 'player' },
        { type: 'circle', x: 200, y: 100, radius: 15, color: '#FF0000', behavior: 'enemy' },
        { type: 'circle', x: 600, y: 150, radius: 15, color: '#FF0000', behavior: 'enemy' }
      ]
    }
  },
  adventure: {
    mechanics: ['exploring', 'collecting', 'solving'],
    elements: ['characters', 'items', 'puzzles'],
    config: {
      exploration: true,
      objects: [
        { type: 'rectangle', x: 400, y: 300, width: 40, height: 60, color: '#0000FF', behavior: 'player' },
        { type: 'rectangle', x: 200, y: 200, width: 30, height: 30, color: '#FFD700', behavior: 'item' },
        { type: 'rectangle', x: 600, y: 400, width: 30, height: 30, color: '#FFD700', behavior: 'item' }
      ]
    }
  }
};

// Analyze prompt to determine game type
function analyzePrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('platform') || lowerPrompt.includes('jump')) {
    return 'platformer';
  } else if (lowerPrompt.includes('puzzle') || lowerPrompt.includes('match') || lowerPrompt.includes('solve')) {
    return 'puzzle';
  } else if (lowerPrompt.includes('shoot') || lowerPrompt.includes('space') || lowerPrompt.includes('target')) {
    return 'shooter';
  } else if (lowerPrompt.includes('adventure') || lowerPrompt.includes('explore') || lowerPrompt.includes('quest')) {
    return 'adventure';
  }
  
  // Default to platformer if no specific type is detected
  return 'platformer';
}

// Extract theme from prompt
function extractTheme(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('space') || lowerPrompt.includes('alien')) {
    return 'space';
  } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('jungle')) {
    return 'forest';
  } else if (lowerPrompt.includes('water') || lowerPrompt.includes('ocean')) {
    return 'underwater';
  } else if (lowerPrompt.includes('castle') || lowerPrompt.includes('medieval')) {
    return 'medieval';
  }
  
  return 'default';
}

export function useGameGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedGame, setGeneratedGame] = useState<{
    data: GameData;
    metadata: GameMetadata;
  } | null>(null);

  const generateNewGame = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze prompt to determine game type
      const gameType = analyzePrompt(prompt);
      const theme = extractTheme(prompt);
      
      // Get template based on game type
      const template = gameTemplates[gameType as keyof typeof gameTemplates] || gameTemplates.platformer;
      
      // Generate game title from prompt
      const title = prompt.split(' ').slice(0, 3).join(' ') || `${gameType} Game`;
      
      // Create game data
      const gameData: GameData = {
        title,
        type: gameType,
        files: {},
        config: {
          ...template.config,
          mechanics: template.mechanics,
          elements: template.elements,
          theme,
          difficulty: 3 // Medium difficulty by default
        }
      };
      
      const metadata: GameMetadata = {
        id: Math.random().toString(36).substring(2, 9),
        title: gameData.title || 'Generated Game',
        prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
        plays: 0,
        files: []
      };
      
      // Save to localStorage
      const games = JSON.parse(localStorage.getItem('forge-games') || '{}');
      games[metadata.id] = { data: gameData, metadata };
      localStorage.setItem('forge-games', JSON.stringify(games));
      
      setGeneratedGame({ data: gameData, metadata });
      return { data: gameData, metadata };
    } catch (err) {
      const errorMessage = 'Failed to generate game. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateNewGame,
    isGenerating,
    error,
    generatedGame
  };
}
