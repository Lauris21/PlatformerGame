import { SharedConfig } from "../types";

export class BaseScene extends Phaser.Scene {
  config: SharedConfig;
  screenCenter: number[];
  fontSize: number;
  lineHeight: number;
  fontOptions: {
    fontSize: string;
    fill: string;
  };

  constructor(key: string, config: SharedConfig) {
    super(key);

    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 75;
    this.lineHeight = 84;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: "#713E01" };
  }

  create() {
    this.add.image(0, 0, "menu-bg").setOrigin(0).setScale(2.7);

    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 10, this.config.height - 10, "back")
        .setOrigin(1)
        .setScale(2)
        .setInteractive();

      backButton.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  createMenu(
    menu: {
      scene: string;
      text: string;
      textGo: Phaser.GameObjects.Text;
    }[],
    setupMenuEvents: (menuItem: {
      scene: string;
      text: string;
      textGo: Phaser.GameObjects.Text;
    }) => void
  ) {
    let lastMenuPositionY = 0;
    console.log(menu);

    menu.forEach((menuItem) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      menuItem.textGo = this.add
        .text(menuPosition[0], menuPosition[1], menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });
  }
}
