import { Collectable } from "../collectables/Collectable";

export class Collectables extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: Collectable,
    });
  }

  //   this.createFromConfig = ({
  //     classType: Collectable
  //   })
}
