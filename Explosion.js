import Drawable from "./Drawable.js";
import Sequence from "./Sequence.js";


const explosionSequence = new Sequence(document.getElementById('boomImg'), 200, 179, 5, 0);

export class Explosion extends Drawable {
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


  update() {
    if (
      Math.floor(this.index * this.animationSpeed) >=
      this.sequence.frames.length-1
    ) {
      this.index = 0;
      this.scale = 0;
    }
    super.update();
  }
}
