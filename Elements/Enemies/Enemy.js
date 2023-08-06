
import Drawable from "../../Interfaces/Drawable.js";
import {getSequence} from "../../utils/getSequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../utils/globals.js";

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
    this.exploded=false;
    this.foe=foe;
    this.orignalspeed=this.vx;
  }


  update(deltaTime) {
    this.setVelocityX(this.orignalspeed-this.foe.vx*.2);
    this.outOfScreen=this.isoutOfScreen();
    super.update(deltaTime);
  }
}



export class EnemyA extends Enemy {
  static sequenceArgs=['enemy1Img',293,153,6,0];
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    if(!EnemyA.sequence)EnemyA.sequence=getSequence(...EnemyA.sequenceArgs);
    super(canvas, EnemyA.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
  }
  update(passed) {
    this.noiseMoveY(0.2);
    this.noiseMoveX(0.2);
    super.update(passed);
  }
}

export class EnemyB extends Enemy {
  static sequenceArgs=['enemy2Img',266,188,6,0];
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    if(!EnemyB.sequence)EnemyB.sequence=getSequence(...EnemyB.sequenceArgs);
    super(canvas, EnemyB.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.setOriginalSpeed(this.animationSpeed*-3)
    this.oscillateY(Math.random() * 5, 100);
    this.px = CANVAS_WIDTH ;
  }
}

export class EnemyD extends Enemy {
  static sequenceArgs=['enemy4Img',213,212,9,0];

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe
  ) {
    if(!EnemyD.sequence)EnemyD.sequence=getSequence(...EnemyD.sequenceArgs);
    super(canvas, EnemyD.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
    this.randomizePosition();
    this.moveEvery = Math.floor(Math.random() * 3000+1000);
    this.movepassed=0;
  }
  randomizePosition() {
    this.newX = this.foe.px;
    this.newY = this.foe.py;
  }
  update(deltaTime) {
    super.update(deltaTime);

    this.movepassed+=deltaTime;
    if (this.movepassed > this.moveEvery ) {
      this.movepassed=0;
      this.randomizePosition();
      this.setOriginalSpeed ((this.newX - this.px) / 50);
      this.setVelocityY((this.newY - this.py) / 50);
    }
    this.vx *= 0.99;
    this.vy *= 0.99;

  }
}
