export class Collectable extends Phaser.Physics.Arcade.Sprite {
  score: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);

    scene.add.existing(this);

    this.score = 1;

    // Configuramos la animación subir y bajar
    scene.tweens.add({
      targets: this,
      y: this.y - 3,
      duration: Phaser.Math.Between(1500, 2500),
      repeat: -1,
      ease: "linear",
      yoyo: true,
    });
  }

  // addFromLayer(layer : Phaser.Tilemaps.ObjectLayer) {
  //   layer.objects.forEach((collectable) => {
  //     Creamos instancias de Collectable
  //     this.get(collectable.x, collectable.y, "diamond");
  //   });
  // }
}
