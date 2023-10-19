import PlayScene from "../scenes/Play";

class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  size: {
    width: number;
    height: number;
  };
  pixelPerHealth: number;
  healthWidth: number;

  constructor(scene: PlayScene, x: number, y: number, health: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.setScrollFactor(0, 0);

    this.x = x;
    this.y = y;
    this.value = health;

    this.size = {
      // Tamaño barra de salud
      width: 50,
      height: 10,
    };

    this.pixelPerHealth = this.size.width / this.value; // dividimos el tamaño de la barra entre su valor 100

    scene.add.existing(this.bar);

    this.draw();
  }

  decrease(amount: number) {
    this.value = amount;
    this.draw();
  }

  draw() {
    this.bar.clear();

    const margin = 2;
    this.bar.fillStyle(0x9b00ff); // margen
    this.bar.fillRect(
      this.x,
      this.y,
      this.size.width + margin,
      this.size.height + margin
    ); // rellenamos

    this.bar.fillStyle(0xffff88); // fondo que se muestra a medida que quitan salud
    this.bar.fillRect(
      this.x + margin,
      this.y + margin,
      this.size.width - margin,
      this.size.height - margin
    );

    this.healthWidth = Math.floor(this.value * this.pixelPerHealth);

    this.bar.fillStyle(0x00ff00); // salud verde

    if(this.healthWidth <= this.size.width / 3) { // la mostramos roja si la barra es menor que 3 veces el valor
        this.bar.fillStyle(0xff0000); // salud roja 
    } else {
        this.bar.fillStyle(0x00ff00); // salud verde
    }

    if(this.healthWidth > 0) { // si es menor que 0 no se muestra ni verde ni rojo
        this.bar.fillRect(
            this.x + margin,
            this.y + margin,
            this.healthWidth - margin,
            this.size.height - margin
          );
    }
    
  }
}

export default HealthBar;
