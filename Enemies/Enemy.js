import { CollisionDetector } from "../CollisionDetector.js";
import Drawable from "../Drawable.js";
import {getSequence} from "../utils/getSequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";

const enemyScale=.3
export class Enemy extends Drawable {
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe,
    options={score:10}
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale);
    this.index = 0;
    this.options=options;
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
  
  isoutOfScreen(){
    return (this.px < -this.sequence.frameWidth || this.py < -this.sequence.frameHeight || this.px > CANVAS_WIDTH+this.sequence.frameWidth || this.py > CANVAS_HEIGHT+this.sequence.frameHeight)
  }

  update() {
    this.outOfScreen=this.isoutOfScreen();
    super.update();
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



export class EnemyA extends Enemy {
  static sequence=getSequence('../assets/enemies/enemy1.png',293,153,6,0);

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, EnemyA.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
  }
  update() {
    this.noiseMoveY(0.2);
    this.noiseMoveX(0.2);
    super.update();
  }
}

export class EnemyB extends Enemy {
  static sequence=getSequence('../assets/enemies/enemy2.png',266,188,6,0);

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, EnemyB.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.setVelocityX(-Math.random() * 3);
    this.oscillateY(Math.random() * 5, 100);
    this.px = CANVAS_WIDTH + this.sequence.frameWidth;
  }
}

export class EnemyD extends Enemy {
  static sequence=getSequence('../assets/enemies/enemy4.png',213,212,9,0);

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    super(canvas, EnemyD.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
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
}
