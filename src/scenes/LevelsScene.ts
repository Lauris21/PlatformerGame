import { SharedConfig } from "../types";
import { BaseScene } from "./BaseScene";

export class LevelsScene extends BaseScene {
  menu: {
    scene: string;
    text: string;
    textGo: Phaser.GameObjects.Text;
    level: number;
  }[];

  constructor(config: SharedConfig) {
    super("LevelsScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    this.menu = [];

    const levels = this.registry.get("unlocked-levels");
    for (let i = 1; i <= levels; i++) {
      this.menu.push({
        scene: "PlayScene",
        text: `Level ${i}`,
        textGo: null,
        level: i,
      });
    }
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem: {
    scene: string;
    text: string;
    textGo: Phaser.GameObjects.Text;
    level: number;
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
      if (menuItem.scene) {
        this.registry.set("level", menuItem.level);
        this.scene.start(menuItem.scene);
      }

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}
