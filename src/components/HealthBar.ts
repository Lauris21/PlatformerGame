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
    this.bar.setScrollFactor(0, 0)
    
    this.x = x
    this.y = y
    this.value = health

    this.size = { // Tamaño barra de salud
        width: 40,
        height: 8
    }

    this.pixelPerHealth = this.size.width / this.value // dividimos el tamaño de la barra entre su valor 100

    scene.add.existing(this.bar)

    this.darw()
  }

  darw() {
    this.bar.clear()
    this.bar.fillStyle(0x9B00FF)
this.bar.fillRect(this.x, this.y, this.size.width, this.size.height)
  }
}

export default HealthBar;
