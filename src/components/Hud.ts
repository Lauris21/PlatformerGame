import PlayScene from "../scenes/Play";

export class Hud extends Phaser.GameObjects.Container {
  fontSize: number;
  lineHeight: number;
  containerWidth: number;
  scoreBoard: Phaser.GameObjects.Container;
  scoreBoard2: Phaser.GameObjects.Text;
  scoreBoard3: Phaser.GameObjects.Text;

  constructor(scene: PlayScene, x: number, y: number) {
    super(scene, x, y);

    scene.add.existing(this);

    const { rightTopCorner } = scene.config;
    this.containerWidth = 70;
    this.setPosition(
      rightTopCorner.x - this.containerWidth,
      rightTopCorner.y + 10
    );
    this.setScrollFactor(0);

    this.setupList();
  }

  setupList() {
    this.fontSize = 20;

    this.createScore();

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

  createScore() {
    const scoreText = this.scene.add.text(0, 0, "0", {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    });

    const scoreImage = this.scene.add
      .image(scoreText.width + 5, 0, "diamond")
      .setOrigin(0)
      .setScale(1.3);

    this.scoreBoard = this.scene.add.container(0, 0, [scoreText, scoreImage]);
    // this.scoreBoard.setName("scoreBoard");
  }

  updateScoreBoard(score: string) {
    const [scoreText, scoreImage] = this.scoreBoard.list;
    (scoreText as Phaser.GameObjects.Text).setText(score);
    (scoreImage as Phaser.GameObjects.Text).setX(
      (scoreText as Phaser.GameObjects.Text).width + 5
    );
  }
}
