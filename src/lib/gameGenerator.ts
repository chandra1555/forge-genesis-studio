import { GameData, GameMetadata } from '../types/game';

export async function generateGame(prompt: string, options?: any): Promise<GameData> {
  // This would interface with your AI model or game generation logic
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, options }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate game');
    }

    const gameData = await response.json();
    return gameData;
  } catch (error) {
    console.error('Game generation error:', error);
    throw new Error('Failed to generate game. Please try again.');
  }
}

export function createGameMetadata(gameData: GameData, prompt: string): GameMetadata {
  return {
    id: generateId(),
    title: gameData.title || `Game-${generateId().slice(0, 8)}`,
    prompt,
    createdAt: new Date(),
    updatedAt: new Date(),
    plays: 0,
    files: Object.keys(gameData.files || {})
  };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
