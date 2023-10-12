import PlayScene from "../scenes/Play";
import { Enemy } from "./Enemy";
import initAnims from "../anims/birdmanAnims"
export class Birdman extends Enemy {

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y, "birdman");
    initAnims(this.scene.anims)
  }

  update(time: number, delta:number) {
super.update(time, delta)
this.play("birdman-idle", true)
  }
}
