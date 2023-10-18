import PlayScene from "../scenes/Play";

class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  size: {
    width: number;
    height: number;
}
pixelPerHealth : number

  constructor(scene: PlayScene, x: number, y: number, health: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x
    this.y = y
    this.value = health

    this.size = { // Tamaño barra de salud
        width: 40,
        height: 8
    }

    this.pixelPerHealth = this.size.width / this.value // dividimos el tamaño de la barra entre su valor 100

    scene.add.existing(this.bar)
  }
}

export default HealthBar;
