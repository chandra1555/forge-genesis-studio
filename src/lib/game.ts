export interface GameData {
  title?: string;
  description?: string;
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
  level: number;
  lives: number;
  completed: boolean;
}
