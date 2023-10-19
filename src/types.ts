import { Birdman } from "./entities/BirdMan";

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
};

export type EnemyTypes = {
  [key: string]: typeof Birdman;
};
