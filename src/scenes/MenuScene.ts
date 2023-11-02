import { SharedConfig } from "../types";
import { BaseScene } from "./BaseScene";

export class MenuScene extends BaseScene {
  menu: {
    scene: string;
    text: string;
    textGo: Phaser.GameObjects.Text;
  }[];

  constructor(config: SharedConfig) {
    super("MenuScene", config);

    console.log(config);

    this.menu = [
      { scene: "PlayScene", text: "Play", textGo: null },
      { scene: "LevelScene", text: "Levels", textGo: null },
      { scene: "null", text: "Exit", textGo: null },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem: {
    scene: string;
    text: string;
    textGo: Phaser.GameObjects.Text;
  }) {
    const textGO = menuItem.textGo;
    textGO.setInteractive();
    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ff0" });
    });
    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#713E01" });
    });
    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}
