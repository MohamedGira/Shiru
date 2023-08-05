import Drawable from "./Drawable.js";
import { ground } from "./utils/globals.js";
import { f, g } from "./utils/globals.js";
export class Terrestrial extends Drawable {
  /* A Drawable affected by gravity &drag forces */
  constructor(
    canvas,
    sequence,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale = 1
  ) {
    super(canvas, sequence, animationSpeed, renderAtX, renderAtY, scale);
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.gravity();
    this.friction();
  }
  gravity() {
    this.bottom = this.sequence.frameHeight * this.scale + this.py;
    this.isGrounded = this.bottom >= ground;
    if (!this.isGrounded) this.vy += g;
    else {
      this.vy = 0;
      this.py = ground - this.sequence.frameHeight * this.scale;
    }
  }
  friction() {
    if (Math.abs(this.ax) > 0.001) this.ax -= f * Math.sign(this.ax);
    else this.ax = 0;
    if (Math.abs(this.ay) > 0.001) this.ay -= f * Math.sign(this.ay);
    else this.ay = 0;
  }
}
