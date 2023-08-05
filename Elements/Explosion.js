import Drawable from "../Interfaces/Drawable.js";
import Sequence from "../utils/Sequence.js";

const explosionSequence = new Sequence(
  document.getElementById("boomImg"),
  200,
  179,
  5,
  0
);

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

  update(deltaTime) {
    console.log(this.index , this.animationSpeed);
    if (this.index >= this.sequence.frames.length - 1) {
      this.index = 0;
      this.scale = 0;
    }
    super.update(deltaTime);
  }
}
