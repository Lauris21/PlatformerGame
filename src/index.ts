import Phaser from "phaser";
import PlayScene from "./scenes/Play";
import PreloadScene from "./scenes/Preload";
import { SharedConfig } from "./types";
import { MenuScene } from "./scenes/MenuScene";
import { LevelsScene } from "./scenes/LevelsScene";
import { CreditsScene } from "./scenes/CreditsScene";

const mapWidth: number = 1600;

const width: number = document.body.offsetWidth; // ancho navegador
const height: number = 600;
const zoomFactor: number = 1.2;

const sharedConfig: SharedConfig = {
  // El desplazamiento de la camara será el ancho del juego menos el ancho del reproductor
  mapOffset: mapWidth > width ? mapWidth - width : 0,
  width: width,
  height: height,
  zoomFactor: zoomFactor,
  debug: false,
  leftTopCorner: {
    x: (width - width / zoomFactor) / 2,
    y: (height - height / zoomFactor) / 2,
  },
  rightTopCorner: {
    x: width / zoomFactor + (width - width / zoomFactor) / 2,
    y: (height - height / zoomFactor) / 2,
  },
  rightBottomCorner: {
    x: width / zoomFactor + (width - width / zoomFactor) / 2,
    y: height / zoomFactor + (height - height / zoomFactor) / 2,
  },
  canGoBack: false,
  lastLevel: 3,
};

//Tienen que ir en orden de ejecución
const Scenes = [PreloadScene, MenuScene, LevelsScene, PlayScene, CreditsScene];

// Creamos una nueva escena con la configuracion compartida
const createScene = (Scene: any) => new Scene(sharedConfig);
//Inicializamos instancias para las escenas
const initScenes = () => Scenes.map(createScene);

const config = {
  //WebGL (web graphics library) API JS para renderizar gráficos en 2 y 3D
  type: Phaser.AUTO,
  ...sharedConfig,
  // scale: {
  //   parent: "game-container",
  //   mode: Phaser.Scale.FIT, // Escala para ajustar al contenedor
  //   width: width,
  //   height: height,
  // },
  // Evita que se vean manchas alrededor de elementos
  pixelArt: true,
  physics: {
    //utiliza la física de arcade -> gestiona simulaciones físicas (gravedad, velocidad, etc)
    default: "arcade",
    arcade: {
      debug: sharedConfig.debug, // ayuda ver movimientos y a donde va el objeto
    },
  },
  //La escena es lo que puede ver en la pantalla
  //Tiene 3 funciones precargar, crear y actualizar
  scene: initScenes(),
};

new Phaser.Game(config);
