import PlayScene from "../scenes/Play";

export class Hud extends Phaser.GameObjects.Container {
  fontSize: number;
  scoreBoard: Phaser.GameObjects.Text;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y);

    scene.add.existing(this);

    const { rightTopCorner } = scene.config;
    this.setPosition(rightTopCorner.x - 50, rightTopCorner.y + 10);
    this.setScrollFactor(0);

    this.setupList();

    console.log(rightTopCorner);
  }

  setupList() {
    this.fontSize = 20;
    this.scoreBoard = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });

    this.add(this.scoreBoard);
  }
}
