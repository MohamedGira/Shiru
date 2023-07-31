import Drawable from "./Drawable.js";
import Sequence from "./Sequence.js";

const explosionImage = new Image();
explosionImage.src = "./assets/fire.png";

const explosionSequence = new Sequence(explosionImage, 100, 90, 1, 0);

export class Trail extends Drawable {
  constructor(canvas, animationSpeed, renderAtX, renderAtY, scale = 1) {
    super(
      canvas,
      explosionSequence,
      animationSpeed,
      renderAtX,
      renderAtY,
      scale
    );
    
  }

  
  update(){
    this.scale*=0.93;
  }
  draw(){
    this.ctx.save();
    this.ctx.globalAlpha=this.scale;
    super.draw();
    this.ctx.restore();
  }
}
