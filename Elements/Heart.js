import Drawable from "../Interfaces/Drawable.js";
import { getSequence } from "../utils/getSequence.js";
import { CANVAS_WIDTH } from "../utils/globals.js";

export class Heart extends Drawable {
  static sequenceArgs = ["heartImg", 50, 50, 1, 0];

  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale,
    foe,
    options = {}
  ) {
    if (!Heart.sequence) Heart.sequence = getSequence(...Heart.sequenceArgs);
    super(canvas, Heart.sequence, animationSpeed, renderAtX, renderAtY, scale);
    this.index = 0;
    this.options = options;
    this.vx = 0;
    this.vy = 0;
    this.gameFrame = 0;
    this.canvas = canvas;
    this.foe = foe;

    this.setOriginalSpeed(Math.random() * -3);
    this.oscillateY(Math.random() * 3, 500);
    this.oscillateScale(0.2, 10);
    this.px = CANVAS_WIDTH;
  }
  update(deltaTime) {
    this.setVelocityX(this.orignalspeed - this.foe.vx * 0.2);
    super.update(deltaTime);
  }
}
