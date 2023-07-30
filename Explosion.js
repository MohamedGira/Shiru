import Drawable from "./Drawable.js";
import Sequence from "./Sequence.js";

const explosionImage = new Image();
explosionImage.src = "./assets/enemies/boom.png";
const explosionSequence = new Sequence(explosionImage, 200, 179, 5, 0);

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

  static createExplosion(drawable, animationSpeed, scale) {
    !animationSpeed && (animationSpeed = drawable.animationSpeed);
    !scale && (scale = drawable.scale);
    return new Explosion(
      drawable.canvas,
      animationSpeed,
      drawable.px,
      drawable.py,
      scale
    );
  }
  setPosition(x, y) {
    this.px = x;
    this.py = y;
  }
  setScale(scale) {
    this.scale=scale;
  }
}
