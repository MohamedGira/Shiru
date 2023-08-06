import Drawable from "../Interfaces/Drawable.js";
import Sequence from "../utils/Sequence.js";
import { getSequence } from "../utils/getSequence.js";



export class Explosion extends Drawable {
  static sequenceArgs = ["boomImg", 200, 179, 5, 0];
  constructor(canvas, animationSpeed, renderAtX, renderAtY, scale = 1) {
    if (!Explosion.sequence) Explosion.sequence = getSequence(...Explosion.sequenceArgs);
    super(
      canvas,
      Explosion.sequence,
      animationSpeed,
      renderAtX,
      renderAtY,
      scale
    );
  }

  update(deltaTime) {
    if (this.index >= this.sequence.frames.length - 1) {
      this.index = 0;
      this.scale = 0;
    }
    super.update(deltaTime);
  }
}
