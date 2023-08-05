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

export function handleTrails(forDrawable,poolArray) {
  let trail = poolArray[poolArray.findIndex((el) => !el.isActive)];
  if (trail) {
    trail.object.setPosition(
      forDrawable.px +
        forDrawable.physicalWidth / 2 +
        Math.random() * 50 -
        25,
      forDrawable.py +
        forDrawable.physicalHeight / 2 +
        Math.random() * 50 -
        25
    );
    trail.object.setVelocity(-forDrawable.vx * 0.2, -forDrawable.vy * 0.2);
    trail.object.setAcceleration(0, -0.1);
    trail.object.setScale(Math.random() * 1.4);
    trail.isActive = true;
  }
}