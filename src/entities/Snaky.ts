import PlayScene from "../scenes/Play";
import { Enemy } from "./Enemy";
import initAnims from "../anims/snakyAnims";
import Projectiles from "../attacks/Projectiles";
import MeleeWeapon from "../attacks/MeleeWeapon";

export class Snaky extends Enemy {
  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "snaky");
    initAnims(this.scene.anims);
  }

  init() {
    super.init();
    this.speed = 50;
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (!this.active) {
      return; // comprobamos que el super no este destruido
    }

    if (this.isPlayingAnims("snaky-hurt")) {
      return;
    }

    this.play("snaky-walk", true);
  }

  takesHit(source: Projectiles | MeleeWeapon) {
    super.takesHit(source);
    this.play("snaky-hurt", true);
  }
}
