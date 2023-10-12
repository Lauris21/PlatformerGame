import PlayScene from "../scenes/Play";
import { Enemy } from "./Enemy";

export class Birdman extends Enemy {

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "birdman");
  }

  shootProjectile() {

  }
}
