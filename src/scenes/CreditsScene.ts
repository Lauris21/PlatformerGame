import { SharedConfig } from "../types";
import { BaseScene } from "./BaseScene";

export class CreditsScene extends BaseScene {
  menu: {
    scene: string;
    text: string;
    textGo: Phaser.GameObjects.Text;
  }[];

  constructor(config: SharedConfig) {
    super("CreditsScene", { ...config, canGoBack: true });

    console.log(config);

    this.menu = [
      { scene: "null", text: "Thank you for playing", textGo: null },
      { scene: "null", text: "With love 💜 Laura", textGo: null },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, () => {});
  }
}
