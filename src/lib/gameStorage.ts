import { GameData, GameMetadata } from '../types/game';

const STORAGE_KEY = 'forge-genesis-games';

export function saveGame(gameData: GameData, metadata: GameMetadata): void {
  // Get existing games
  const existingGames = getGames();
  
  // Add new game
  existingGames[metadata.id] = {
    metadata,
    data: gameData
  };
  
  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingGames));
  
  // Also save to a more persistent storage if available
  if (import.meta.env.VITE_API_BASE_URL) {
    // This would sync with a backend API
    syncWithBackend(metadata.id, gameData, metadata);
  }
}

export function getGames(): Record<string, { metadata: GameMetadata; data: GameData }> {
  const gamesJson = localStorage.getItem(STORAGE_KEY);
  return gamesJson ? JSON.parse(gamesJson) : {};
}

export function getGame(gameId: string): { metadata: GameMetadata; data: GameData } | null {
  const games = getGames();
  return games[gameId] || null;
}

export function incrementPlayCount(gameId: string): void {
  const games = getGames();
  if (games[gameId]) {
    games[gameId].metadata.plays += 1;
    games[gameId].metadata.updatedAt = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  }
}

async function syncWithBackend(gameId: string, gameData: GameData, metadata: GameMetadata) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, gameData, metadata }),
    });
    
    if (!response.ok) {
      console.error('Failed to sync game with backend');
    }
  } catch (error) {
    console.error('Backend sync error:', error);
  }
}
