import { Enemy } from "../entities/Enemy";
import { impactPosition } from "../types";

export default class SpriteEffect extends Phaser.Physics.Arcade.Sprite {
  target: Enemy;
  effectName: string;
  impactPosition: impactPosition;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    effectName: string,
    impactPosition: impactPosition
  ) {
    super(scene, x, y, effectName);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.target = null;
    this.effectName = effectName;
    this.impactPosition = impactPosition;

    this.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === this.effectName) this.destroy();
      },
      this
    );
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.placeEffect();
  }

  placeEffect() {
    if (!this.target && !this.body) {
      return;
    }

    const center = this.target.getCenter();
    if (this.body) {
      console.log(this.body);

      this.body.reset(center.x, this.impactPosition.y);
    }
  }

  playOn(target: Enemy) {
    this.target = target;
    this.play(this.effectName, true);
    this.placeEffect();
  }
}
