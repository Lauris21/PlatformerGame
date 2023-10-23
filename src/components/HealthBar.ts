class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  scale: number;
  value: number;
  size: {
    width: number;
    height: number;
  };
  pixelPerHealth: number;
  healthWidth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    health: number,
    scale: number
  ) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x / scale;
    this.y = y / scale;
    this.scale = scale;
    this.value = health;

    this.size = {
      // Tamaño barra de salud
      width: 40,
      height: 8,
    };

    this.pixelPerHealth = this.size.width / this.value; // dividimos el tamaño de la barra entre su valor 100

    scene.add.existing(this.bar);

    this.draw();
  }

  decrease(amount: number) {
    if (amount <= 0) {
      this.value = 0;
    } else {
      this.value = amount;
    }
    this.draw();
  }

  draw() {
    this.bar.clear();

    const margin = 2;
    this.bar.fillStyle(0x000); // margen
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

    if (this.healthWidth <= this.size.width / 3) {
      // la mostramos roja si la barra es menor que 3 veces el valor
      this.bar.fillStyle(0xff0000); // salud roja
    } else {
      this.bar.fillStyle(0x00ff00); // salud verde
    }

    if (this.healthWidth > 0) {
      // si es menor que 0 no se muestra ni verde ni rojo
      this.bar.fillRect(
        this.x + margin,
        this.y + margin,
        this.healthWidth - margin,
        this.size.height - margin
      );
    }

    this.bar.setScrollFactor(0, 0).setScale(this.scale); // hacemos que siga la cámara y escalamos
  }
}

export default HealthBar;
