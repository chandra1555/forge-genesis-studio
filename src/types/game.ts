export interface GameData {
  title?: string;
  type: string;
  files: Record<string, string>;
  config: any;
}

export interface GameMetadata {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
  plays: number;
  files: string[];
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  level: number;
  lives: number;
}

export interface GenerationOptions {
  gameType: 'platformer' | 'shooter' | 'puzzle' | 'racing' | 'strategy';
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
}