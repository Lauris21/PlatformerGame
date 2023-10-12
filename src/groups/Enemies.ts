import { Player } from "../entities/Player";
import collidable from "../mixins/collidable";
import PlayScene from "../scenes/Play";
import { EnemyTypes } from "../types"
import { enemyTypeslist } from "../utils.js/enemyTypes"

export class Enemies extends Phaser.GameObjects.Group {

    types: EnemyTypes
    addCollider: (otherGameobject: Phaser.Tilemaps.StaticTilemapLayer | Player, callback: any) => void;
  scene: PlayScene;

    constructor(scene : any) {
        super(scene)

        Object.assign(this, collidable)
    }

    getTypes() {
        this.types = enemyTypeslist
        return this.types
    }
}