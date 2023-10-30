import { Collectable } from "../collectables/Collectable";
import { Property } from "../types";

export class Collectables extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene, {
      classType: Collectable,
    });
  }

  // Obtenemos las propiedades de los diamantes en la capa y creamos un objeto con ellas
  mapProperties(propertiesList: Property[]) {
    if (!propertiesList || propertiesList.length === 0) {
      return;
    }

    return propertiesList.reduce((map, obj) => {
      map[obj.name] = obj.value;
      return map;
    }, {} as { [key: string]: any });
  }

  // Recorremos los objetos de la capa y creamos instancias de Collectable
  addFromLayer(layer: Phaser.Tilemaps.ObjectLayer) {
    const properties = this.mapProperties(layer.properties as Property[]);

    layer.objects.forEach((collectable) => {
      this.get(collectable.x, collectable.y, properties.type);
    });
  }
}
