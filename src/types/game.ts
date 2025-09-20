export interface GameData {
  title?: string;
  type: string;
  files: Record<string, string>;
  config: GameConfig;
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

export interface GameConfig {
  mechanics: string[];
  elements: string[];
  theme: string;
  difficulty: number;
  objects: GameObject[];
  rules?: GameRules;
}

export interface GameObject {
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  behavior?: string;
}

export interface GameRules {
  winCondition: string;
  loseCondition: string;
  scoring: string;
}

export interface GameState {
  score: number;
  level: number;
  lives: number;
  completed: boolean;
}
