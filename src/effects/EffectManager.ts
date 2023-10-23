import { Enemy } from "../entities/Enemy";
import { impactPosition } from "../types";
import SpriteEffect from "./SpriteEffect";

export default class EffectManager {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playEffectOn(effectName: string, target: Enemy, position: impactPosition) {
    const effect = new SpriteEffect(this.scene, 0, 0, effectName, position);
    effect.playOn(target);
  }
}
