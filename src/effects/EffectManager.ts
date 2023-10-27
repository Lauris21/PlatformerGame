import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { impactPosition } from "../types";
import SpriteEffect from "./SpriteEffect";

export default class EffectManager {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playEffectOn(
    effectName: string,
    target: Enemy | Player,
    position: impactPosition
  ) {
    const effect = new SpriteEffect(this.scene, 0, 0, effectName, position);
    effect.playOn(target);
  }
}
