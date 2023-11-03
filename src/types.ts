import { Birdman } from "./entities/BirdMan";
import { Snaky } from "./entities/Snaky";

export type SharedConfig = {
  mapOffset: number;
  width: number;
  height: number;
  zoomFactor: number;
  debug: boolean;
  leftTopCorner: {
    x: number;
    y: number;
  };
  rightTopCorner: {
    x: number;
    y: number;
  };
  rightBottomCorner: {
    x: number;
    y: number;
  };
  canGoBack: boolean;
  lastLevel: number;
};

export type EnemyTypes = {
  [key: string]: typeof Birdman | typeof Snaky;
};

export type impactPosition = {
  x: number;
  y: number;
};

export interface Property {
  name: string;
  value: any;
}
