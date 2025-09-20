import { useState } from 'react';
import { GameData, GameMetadata } from '../types/game';

const gameTemplates = {
  platformer: {
    type: 'platformer',
    config: {
      theme: 'default',
      objects: [
        { type: 'rectangle', x: 100, y: 400, width: 600, height: 20, color: '#8B4513', behavior: 'static' },
        { type: 'rectangle', x: 200, y: 300, width: 100, height: 20, color: '#8B4513', behavior: 'static' },
        { type: 'circle', x: 150, y: 350, radius: 15, color: '#FFD700', behavior: 'collectible' }
      ]
    }
  },
  puzzle: {
    type: 'puzzle',
    config: {
      theme: 'default',
      objects: [
        { type: 'rectangle', x: 200, y: 150, width: 50, height: 50, color: '#FF0000', behavior: 'puzzle-piece' },
        { type: 'rectangle', x: 300, y: 150, width: 50, height: 50, color: '#00FF00', behavior: 'puzzle-piece' }
      ]
    }
  },
  shooter: {
    type: 'shooter',
    config: {
      theme: 'space',
      objects: [
        { type: 'rectangle', x: 400, y: 500, width: 30, height: 50, color: '#0000FF', behavior: 'player' },
        { type: 'circle', x: 200, y: 100, radius: 15, color: '#FF0000', behavior: 'enemy' }
      ]
    }
  }
};

function analyzePrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('puzzle') || lowerPrompt.includes('match')) {
    return 'puzzle';
  } else if (lowerPrompt.includes('shoot') || lowerPrompt.includes('space')) {
    return 'shooter';
  }
  
  return 'platformer';
}

function extractTheme(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('space')) {
    return 'space';
  } else if (lowerPrompt.includes('forest')) {
    return 'forest';
  } else if (lowerPrompt.includes('water')) {
    return 'underwater';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const gameType = analyzePrompt(prompt);
      const theme = extractTheme(prompt);
      const template = (gameTemplates as any)[gameType] || gameTemplates.platformer;
      
      const gameData: GameData = {
        title: prompt.split(' ').slice(0, 3).join(' ') || `${gameType} Game`,
        type: gameType,
        config: {
          ...template.config,
          theme
        }
      };
      
      const metadata: GameMetadata = {
        id: Math.random().toString(36).substring(2, 9),
        title: gameData.title || 'Generated Game',
        prompt,
        createdAt: new Date(),
        plays: 0
      };
      
      // Store in localStorage
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
