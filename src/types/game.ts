export interface GameData {
  title?: string;
  type: string;
  config: GameConfig;
}

export interface GameMetadata {
  id: string;
  title: string;
  prompt: string;
  createdAt: Date;
  plays: number;
}

export interface GameConfig {
  theme: string;
  objects: GameObject[];
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
