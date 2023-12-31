export default (anims: Phaser.Animations.AnimationManager): void => {
  anims.create({
    key: "hit-effect",
    frames: anims.generateFrameNumbers("hit-sheet", { start: 0, end: 4 }),
    frameRate: 10,
    repeat: 0,
  });

  anims.create({
    key: "sword-default-swing",
    frames: anims.generateFrameNumbers("sword-default", { start: 0, end: 2 }),
    frameRate: 20,
    repeat: 0,
  });

  anims.create({
    key: "fireball",
    frames: [
      { key: "fireball-1", frame: 0 },
      { key: "fireball-2", frame: 0 },
      { key: "fireball-3", frame: 0 },
    ],
    frameRate: 5,
    repeat: -1,
  });

  anims.create({
    key: "iceball",
    frames: [
      { key: "iceball-1", frame: 0 },
      { key: "iceball-2", frame: 0 },
    ],
    frameRate: 5,
    repeat: -1,
  });

  anims.create({
    key: "diamond-shine",
    frames: [
      { key: "diamond-1", frame: 0 },
      { key: "diamond-2", frame: 0 },
      { key: "diamond-3", frame: 0 },
      { key: "diamond-4", frame: 0 },
      { key: "diamond-5", frame: 0 },
      { key: "diamond-6", frame: 0 },
    ],
    frameRate: 5,
    repeat: -1,
  });
};
