import { Physical } from "./Physical.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";

class Drawable extends Physical {
  //A class that Takes An Image,sequence of position, and animationSpeed, and renders it in the given postion
  /*
    Input: SequenceObject,Image,
     */
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale = 1
  ) {
    super(renderAtX, renderAtY);
    this.ctx = canvas;
    this.sequence = sequence;
    this.animationSpeed = animationSpeed;
    this.scale = scale;
    this.index = 0;
    this.physicalWidth =
      (this.sequence.frameWidth - this.sequence.whiteSpaceX) * this.scale;
    this.physicalHeight =
      (this.sequence.frameHeight - this.sequence.whiteSpaceY) * this.scale;
    this.orignalspeed = 0;
  }
  draw() {
    try {
      this.ctx.drawImage(
        this.sequence.image,
        this.sequence.frames[
          Math.floor(this.index * this.animationSpeed) %
            this.sequence.frames.length
        ].x,
        this.sequence.frames[
          Math.floor(this.index * this.animationSpeed) %
            this.sequence.frames.length
        ].y,
        this.sequence.frameWidth,
        this.sequence.frameHeight,
        this.px,
        this.py,
        this.sequence.frameWidth * this.scale,
        this.sequence.frameHeight * this.scale
      );
    } catch (e) {
      console.log(e);
    }
  }
  setOriginalSpeed(speed) {
    this.orignalspeed = speed;
  }
  update() {
    this.index == 999999999999999 ? (this.index = 0) : 0;
    this.index += 1;
    super.update();
  }
  animate() {
    this.draw();
    this.update();
  }
  setScale(scale) {
    this.scale = scale;
  }
  oscillateScale(by, speedMs) {
    let i = 0;
    let originalScale = this.scale;
    setInterval(() => {
      this.scale = originalScale + originalScale * by * Math.sin(i++ / 20);
    }, speedMs);
  }
  isoutOfScreen() {
    try {
      return (
        this.px < -this.sequence.frameWidth ||
        this.py < -this.sequence.frameHeight ||
        this.px > CANVAS_WIDTH + this.sequence.frameWidth ||
        this.py > CANVAS_HEIGHT + this.sequence.frameHeight
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default Drawable;
