import PlayScene from "../scenes/Play";

export class Hud extends Phaser.GameObjects.Container {
  fontSize: number;
  lineHeight: number;
  scoreBoard: Phaser.GameObjects.Text;
  scoreBoard2: Phaser.GameObjects.Text;
  scoreBoard3: Phaser.GameObjects.Text;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y);

    scene.add.existing(this);

    const { rightTopCorner } = scene.config;
    this.setPosition(rightTopCorner.x - 75, rightTopCorner.y + 10);
    this.setScrollFactor(0);

    this.setupList();
  }

  setupList() {
    this.fontSize = 20;

    this.scoreBoard = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });
    this.scoreBoard2 = this.scene.add.text(0, 0, "Hola", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });

    this.scoreBoard3 = this.scene.add.text(0, 0, "Hola", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });

    this.lineHeight = 0;
    this.add([this.scoreBoard, this.scoreBoard2, this.scoreBoard3]);

    this.list.forEach((item) => {
      (item as Phaser.GameObjects.Text).setPosition(
        (item as Phaser.GameObjects.Text).x,
        ((item as Phaser.GameObjects.Text).y += this.lineHeight)
      );
      this.lineHeight += 20;
    });
  }
}
