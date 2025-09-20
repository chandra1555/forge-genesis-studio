import { useState } from 'react';
import { generateGame, createGameMetadata } from '../lib/gameGenerator';
import { saveGame } from '../lib/gameStorage';
import { GameData, GameMetadata } from '../types/game';

export function useGameGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedGame, setGeneratedGame] = useState<{
    data: GameData;
    metadata: GameMetadata;
  } | null>(null);

  const generateNewGame = async (prompt: string, options?: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const gameData = await generateGame(prompt, options);
      const metadata = createGameMetadata(gameData, prompt);
      
      // Save the game
      saveGame(gameData, metadata);
      
      setGeneratedGame({ data: gameData, metadata });
      return { data: gameData, metadata };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate game';
      setError(errorMessage);
      throw err;
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
