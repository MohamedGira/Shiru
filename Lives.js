import Drawable from "./Drawable.js";
import Sequence from "./Sequence.js";
import { CANVAS_WIDTH } from "./utils/globals.js";
import { showMessage } from "./utils/showMessage.js";


const liveSequence = new Sequence(document.getElementById('livesImg'), 50, 50, 1, 0);

export class Lives extends Drawable {
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale = 1,
    options = { initialLives: 3 }
  ) {
    super(canvas, liveSequence, animationSpeed, renderAtX, renderAtY, scale);
    this.lives =options.initialLives;
  }
  incrementLives() {
    this.lives++;
  }
  decrementLives() {
    this.lives&&this.lives--;
  }

  update() {
    this.ctx.clearRect(
      this.px,
      this.py,
      this.physicalWidth * this.lives,
      this.physicalHeight
    );
  }
  draw() {
    for (let a = 0; a < this.lives; a++) {
      if (this.px + this.physicalWidth * (a+1) > CANVAS_WIDTH)
        {
          showMessage(this.ctx, `+${this.lives - a}`, {
            renderAtX: this.px+this.physicalWidth*(a-Math.min(3,a-3)),
            renderAtY: this.py+this.physicalHeight+20,
            font: "50px Pixels",
            shadowColor: "green",
            color: "white",
            offset:-2,
          });
          break;
        }
      this.ctx.drawImage(
        this.sequence.image,
        this.px + this.physicalWidth * a,
        this.py,
        this.physicalWidth,
        this.physicalHeight
      );
    }
  }
}
