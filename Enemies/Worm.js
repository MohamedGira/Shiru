import { getSequence } from "../utils/getSequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, ground } from "../utils/globals.js";
import { Enemy } from "./Enemy.js";

export class Worm extends Enemy {
  static sequence = getSequence("wormImg",80,60,6,0);
  constructor(canvas, animationSpeed, renderAtX, renderAtY, scale, foe) {
    super(canvas,Worm.sequence,animationSpeed,renderAtX,renderAtY,scale,foe,{score:5});
    this.vx = this.animationSpeed*-3
    this.py= ground- this.sequence.frameHeight*this.scale;
    this.px= 500;
    this.setOriginalSpeed(this.animationSpeed*-3)
  }
  update(){
    this.setVelocityX(this.orignalspeed-this.foe.vx*.2);
    super.update();
  }
}
