import Drawable from "../Interfaces/Drawable.js";
import Sequence from "../utils/Sequence.js";




const explosionSequence = new Sequence(document.getElementById("fireImg"), 100, 90, 1, 0);

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
