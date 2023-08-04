import { CollisionDetector } from "./CollisionDetector.js";
import Drawable from "./Drawable.js";
import { getSequence } from "./utils/getSequence.js";
import { CANVAS_WIDTH } from "./utils/globals.js";
export class Heart extends Drawable {
  static sequence = getSequence("heartImg", 50, 50, 1, 0);

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe,
    options = {}
  ) {
    super(canvas, Heart.sequence, animationSpeed, renderAtX, renderAtY, scale);
    this.index = 0;
    this.options = options;
    this.vx = 0;
    this.vy = 0;
    this.gameFrame = 0;
    this.canvas = canvas;
    this.foe=foe
    this.collisionEvent = new CustomEvent("collision", {
      detail: { whoami: this },
    });
    CollisionDetector.detectCollesion(this, foe, this.collisionEvent);
    this.setOriginalSpeed(Math.random() * -3);
    this.oscillateY(Math.random() * 3, 500);
    this.oscillateScale(0.2, 10);
    this.px = CANVAS_WIDTH;
    
  }
  update(){
    this.setVelocityX(this.orignalspeed-this.foe.vx*.2);
    super.update();
  }
}
