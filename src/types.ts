import { Birdman } from "./entities/BirdMan";

export type SharedConfig = {
  mapOffset: number;
  width: number;
  height: number;
  zoomFactor: number;
  debug: boolean;
};

export type EnemyTypes = {
  [key: string]: typeof Birdman;
};
