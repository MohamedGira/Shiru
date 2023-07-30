import { Physical } from "./Physical.js";

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
    super(renderAtX,renderAtY);
    this.ctx = canvas;
    this.sequence = sequence;
    this.animationSpeed = animationSpeed;
    this.scale = scale;
    this.index = 0;
    this.physicalWidth = (this.sequence.frameWidth - this.sequence.whiteSpaceX)*this.scale;
    this.physicalHeight = (this.sequence.frameHeight- this.sequence.whiteSpaceY)*this.scale;
  }
  draw() {
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
  }
  update() {

    Math.floor(this.index * this.animationSpeed) == this.sequence.frames.length
      ? (this.index = 0)
      : 0;
    this.index += 1;
  }
  animate(){
    this.draw();
    this.update();
  }
}

export default Drawable;