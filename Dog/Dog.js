import { Terrestrial } from "../Interfaces/Terrestrial.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";

import { states } from "./States/State.js";
import { Standing } from"./States/Standing.js";
import { Jumping } from "./States/Jumping.js";
import { Falling } from "./States/Falling.js";
import { Running } from "./States/Running.js";
import { Sitting } from "./States/Sitting.js";
import { Dazed } from   "./States/Dazed.js";
import { Chilling } from"./States/Chilling.js";
import { Rolling } from "./States/Rolling.js";
import { Dashing } from "./States/Dashing.js";
import { Dying } from "./States/Dying.js"
;
import { Lives } from "../Elements/Lives.js";

const canvas = document.getElementById("game");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const timespan = 20;
//dogstuff
export const PlayerSpeed = 5;



let ground = CANVAS_HEIGHT * 0.87;

export class Dog extends Terrestrial {
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale = 1,
    options = {
      initialLives: 3,
      initialStateId: states.STANDING,
    }
  ) {
    super(
      canvas,
      new Standing().sequence,
      animationSpeed,
      renderAtX,
      renderAtY,
      scale
    );
    this.lives = new Lives(
      canvas,
      0,
      CANVAS_WIDTH * 0.7,
      CANVAS_HEIGHT * 0.01,
      0.5,
      { initialLives: options.initialLives }
    );
    (this.states = [
      new Standing(this),
      new Jumping(this),
      new Falling(this),
      new Running(this),
      new Dazed(this),
      new Sitting(this),
      new Rolling(this),
      new Dashing(this),
      new Dying(this),
      new Chilling(this),
    ]),
      (this.currentState = this.states[options.initialStateId || 2]);
    this.currentState.enter();
    this.currentStateIndex = options.initialStateId || 2;
    this.sequence = this.currentState.sequence;
    this.jumpVelocity = -15;
    this.scale = scale;
    this.regularspeed = 0;
    this.isImmune = false;
  }

  setState(state) {
    state = Math.min(state, this.states.length - 1);
    this.index = 0;
    this.currentState.leave();
    this.currentStateIndex = state;
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  jump(){
    this.vy += this.jumpVelocity;
  }
  update(lastKey, isPress,deltaXPercent,deltaTime) {
    this.px = Math.min(
      this.px,
      CANVAS_WIDTH - this.currentState.sequence.frameWidth * this.scale
    );
    this.currentStateIndex != states.DYING && (this.px = Math.max(this.px, 0));
    if (this.py < 0) {
      this.ay = 0;
      this.vy = 0;
      this.py = 10;
    }
    super.update(deltaTime);
    this.currentState.handleInput(lastKey, isPress,deltaXPercent);
  }
}
