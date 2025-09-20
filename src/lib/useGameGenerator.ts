import { useState } from 'react';
import { GameData, GameMetadata } from '../types/game';

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
      
      // Generate simple game data based on prompt
      const gameData: GameData = {
        title: prompt.split(' ').slice(0, 3).join(' ') || 'New Game',
        type: 'clicker',
        files: {},
        config: {
          objects: [
            { type: 'rectangle', x: 350, y: 250, width: 100, height: 50, color: '#4CAF50' }
          ]
        }
      };
      
      const metadata: GameMetadata = {
        id: Math.random().toString(36).substring(2, 9),
        title: gameData.title,
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
