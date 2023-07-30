import { CollisionDetector } from "./CollisionDetector.js";
import Drawable from "./Drawable.js";
import Sequence from "./Sequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";

const enemyScale=.3
class Enemy extends Drawable {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale);
    this.index = 0;

    this.vx = 0;
    this.vy = 0;
    this.gameFrame = 0;
    this.canvas = canvas;
    this.collisionEvent = new CustomEvent("collision", {
      detail: { whoami: this },
    });
    CollisionDetector.detectCollesion(this, foe, this.collisionEvent);
    this.exploded=false;
  }



  setpositionX(x) {
    this.px = x;
  }
  setpositionY(y) {
    this.py = y;
  }
  changeVelocity(dx = 0, dy = 0) {
    this.vx += dx;
    this.vy += dy;
  }
  setVelocityX(dx) {
    this.vx = dx;
  }
  setVelocityY(dy) {
    this.vy = dy;
  }
  noiseMoveX(strengthx = 1) {
    this.changeVelocity(Math.random() * strengthx - strengthx / 2, 0);
  }
  noiseMoveY(strengthy = 1) {
    this.changeVelocity(0, Math.random() * strengthy - strengthy / 2);
  }
  oscillateX(amplitude = 1, speedMs = 50) {
    let i = 0;
    setInterval(() => {
      this.setVelocityX(Math.sin((i++ * 3.14) / 360) * amplitude);
      this.noiseMoveX(amplitude * 0.6);
    }, speedMs);
  }
  oscillateY(amplitude = 1, speedMs = 1) {
    let i = 0;
    setInterval(() => {
      this.setVelocityY(Math.sin((i++ * 180) / 3.14) * amplitude);
      this.noiseMoveY(amplitude);
    }, speedMs);
  }

  static createEnemy() {}
}

function getSequence(
  Class,
  imgsrc,
  frameWidth,
  frameHeight,
  framesCount,
  offset
) {
  Class.image = new Image();
  Class.image.src = imgsrc;
  Class.sequence = new Sequence(
    Class.image,
    frameWidth,
    frameHeight,
    framesCount,
    offset
  );
}

export class EnemyA extends Enemy {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
  }
  update() {
    this.noiseMoveY(0.2);
    this.noiseMoveX(0.2);
  }
  static createEnemy(canvas, foe) {
    if (!EnemyA.image) {
      console.log("loading");
      getSequence(EnemyA, "./assets/enemies/enemy1.png", 293, 153, 6, 0);
    }
    return new EnemyA(
      canvas,
      EnemyA.sequence,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      enemyScale,
      foe
    );
  }
}

export class EnemyB extends Enemy {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.setVelocityX(-Math.random() * 3);
    this.oscillateY(Math.random() * 5, 100);
    this.px = CANVAS_WIDTH + this.sequence.frameWidth;
  }

  static createEnemy(canvas, foe) {
    if (!EnemyB.image) {
      console.log("loading");
      getSequence(EnemyB, "./assets/enemies/enemy2.png", 266, 188, 6, 0);
    }
    return new EnemyB(
      canvas,
      EnemyB.sequence,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      enemyScale,
      foe
    );
  }
}
export class EnemyC extends Enemy {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.angle = 0;
    this.offsetX = (CANVAS_WIDTH - this.sequence.frameWidth) / 2;
    this.offsetY = (CANVAS_HEIGHT - this.sequence.frameHeight) / 2;
    this.anglex = Math.random();
    this.angley = Math.random();
    this.anglexSpeed = Math.random() * 2;
  }
  update() {
    this.anglex += this.anglexSpeed;
    this.angley += this.anglexSpeed;
    this.setpositionX(
      ((CANVAS_WIDTH - this.sequence.frameWidth) / 2) *
        Math.sin((this.anglex * Math.PI) / 90) +
        this.offsetX
    );
    this.setpositionY(
      ((CANVAS_HEIGHT - this.sequence.frameHeight) / 2) *
        Math.cos((this.angley * Math.PI) / 180) +
        this.offsetY
    );
  }
  static createEnemy(canvas, foe) {
    if (!EnemyC.image) {
      console.log("loading");
      getSequence(EnemyC, "./assets/enemies/enemy3.png", 218, 177, 6, 0);
    }
    return new EnemyC(
      canvas,
      EnemyC.sequence,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      enemyScale,
      foe
    );
  }
}
export class EnemyD extends Enemy {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.randomizePosition();
    this.moveEvery = Math.floor(Math.random() * 200 + 100);
  }
  randomizePosition() {
    this.newX = (Math.random() * CANVAS_WIDTH) / 2;
    this.newY = (Math.random() * CANVAS_HEIGHT) / 2;
  }
  update() {
    if (this.index % this.moveEvery == 0) {
      this.randomizePosition();
      this.vx = (this.newX - this.px) / 50;
      this.vy = (this.newY - this.py) / 50;
    }
    this.vx *= 0.99;
    this.vy *= 0.99;

    super.update();
  }
  static createEnemy(canvas, foe) {
    if (!EnemyD.image) {
      console.log("loading");
      getSequence(EnemyD, "./assets/enemies/enemy4.png", 213, 212, 9, 0);
    }
    return new EnemyD(
      canvas,
      EnemyD.sequence,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      enemyScale,
      foe
    );
  }
}
