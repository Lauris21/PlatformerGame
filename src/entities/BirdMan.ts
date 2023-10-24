import PlayScene from "../scenes/Play";
import { Enemy } from "./Enemy";
import initAnims from "../anims/birdmanAnims";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";
export class Birdman extends Enemy {
  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "birdman");
    initAnims(this.scene.anims);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (!this.active) {
      return; // comprobamos que el super no este destruido
    }

    if (this.isPlayingAnims("birdman-hurt")) {
      console.log(this.isPlayingAnims("birdman-hurt"));

      return;
    }

    this.play("birdman-idle", true);
  }

  takesHit(source: Projectiles | MeleeWeapon) {
    super.takesHit(source);
    this.play("birdman-hurt", true);
  }
}
