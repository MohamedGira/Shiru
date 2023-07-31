import Sequence from "../Sequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";
import { Terrestrial } from "../Terrestrial.js";
import { Lives } from "../Lives.js";
import { states } from "./States/State.js";
import { Standing } from "./States/Standing.js";
import { Jumping } from "./States/Jumping.js";
import { Falling } from "./States/Falling.js";
import { Running } from "./States/Running.js";
import { Sitting } from "./States/Sitting.js";
import { Dazed } from "./States/Dazed.js";
import { Chilling } from "./States/Chilling.js";
import { Rolling } from "./States/Rolling.js";
import { Dashing } from "./States/Dashing.js";
import { Dying } from "./States/Dying.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const timespan = 20;
//dogstuff

const dog = new Image();
dog.src = "assets/shadow_dog.png";
let run = new Audio("./assets/sounds/doggy.mp3");
run.loop = true;
run.volume = 0.1;
let music = new Audio("./assets/sounds/the_field_of_dreams.mp3");
music.loop = true;
let ground = CANVAS_HEIGHT * 0.87;
const firesounds = [
  new Audio("./assets/sounds/fire.mp3"),
  new Audio("./assets/sounds/fire2.mp3"),
  new Audio("./assets/sounds/fire4.mp3"),
];

class Dog extends Terrestrial {
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    scale = 1,
    options = {
      initialLives: 3,
      initialStateId: states.STANDING
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
    this.states =   [new Standing(this),new Jumping(this),new Falling(this),new Running(this),new Dazed(this),
      new Sitting(this),new Rolling(this),new Dashing(this),new Dying(this),new Chilling(this)],
    this.currentState = this.states[options.initialStateId||0];
    this.currentStateIndex=options.initialStateId||0;
    this.sequence=this.currentState.sequence;
    this.handleState();
    this.jumpVelocity = -15;
    this.scale = scale;
    this.regularspeed = 1;
    this.isImmune = false;
    this.lives = new Lives(
      canvas,
      0,
      CANVAS_WIDTH * 0.7,
      CANVAS_HEIGHT * 0.01,
      0.5,
      { initialLives: options.initialLives }
    );
  }

  handleKeyUp() {
    this.jump();
  }
  handleKeyDown() {}
  handleKeyLeft() {
    this.vx = -3;
    this.setState(states.RUNNING);
  }
  handleKeyRight() {
    this.vx = 3;
    this.setState(states.RUNNING);
  }
  stop() {
    this.vx = 0;
  }
  jump() {
    if (this.isGrounded) this.vy += this.jumpVelocity;
  }
  handleSit() {
    if (this.positionY < ground) this.vy += 50;
    else this.setState(states.RUNNING);
  }
  handleDash() {
    if (this.currentStateIndex!=states.ROLLING && this.currentStateIndex!=states.DASHING) {
      this.setState(states.DASHING)
      this.dash();
      setTimeout(() => {
        if (this.currentStateIndex != states.DYING) this.setState(states.RUNNING);
      }, 330);
    }
  }
  handleRoll() {
    if (this.currentStateIndex !=states.ROLLING && this.currentStateIndex!=states.DASHING) {
      this.setState(states.ROLLING);
      let a =firesounds[Math.floor(Math.random() * firesounds.length)].cloneNode();
      a.volume = 0.2;
      this.currentStateIndex==states.ROLLING&&a.play();
      this.roll();
      setTimeout(() => {
        this.setState(states.RUNNING);
      }, 1000);
    }
  }
  setState(state) {
    state=Math.min(state,this.states.length-1)
    this.currentStateIndex=state;
    this.currentState = this.states[state];
    this.currentState.enter()
  }
  handleState() {
    setInterval(() => {
      this.currentStateIndex == states.RUNNING && play ? run.play() : run.pause();
      this.currentStateIndex == states.DYING && run.pause();
      if (this.currentStateIndex != states.DAZED&&this.currentStateIndex != states.ROLLING) {
        if (this.vy < 0) this.setState(states.JUMPING);
        if (this.vy > 0) this.setState(states.FALLING);
        if (this.vy == 0 && this.currentStateIndex == states.FALLING) this.setState(states.RUNNING);
        if (this.vx > 0 && this.currentStateIndex != states.DASHING && this.currentStateIndex != states.ROLLING)
          this.setState(states.RUNNING);
      }
    }, 20);
  }
  dash() {
    this.ax += 10;
  }
  roll() {
    this.ax += Math.sign(this.vx) * 3;
    this.ay += Math.sign(this.vy) * 3;
  }
  update() {
    
    this.px = Math.min(
      this.px,
      CANVAS_WIDTH -  this.currentState.sequence.frameWidth * this.scale
    );
    this.px = Math.max(this.px, 0);
    if (this.py < 0) {
      this.ay = 0;
      this.vy = 0;
      this.py = 10;
    }
    super.update();

  }
}





window.addEventListener("keydown", function (event) {
  music.play();

  if (puppy.currentState != puppy.states[states.DAZED] && puppy.currentState != puppy.states[states.DYING]) {
    if (
      event.key == "ArrowUp" ||
      event.key == "w" ||
      event.key == "W" ||
      event.key == " "
    ) {
      puppy.handleKeyUp();
    }
    if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
      puppy.handleKeyRight();
    if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A")
      puppy.handleKeyLeft();
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
      puppy.handleSit();
    if (event.key == "Shift" || event.key == "r" || event.key == "R")
      puppy.handleRoll();
    if (event.key == "q") puppy.handleDash();
  }
});
window.addEventListener("keyup", function (event) {
  if (puppy.currentState != puppy.states[states.DAZED] && puppy.currentState != puppy.states[states.DYING]) {
    if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
      puppy.stop();
    if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A")
      puppy.stop();
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
      puppy.stop();
  }
});


export const puppy = new Dog(
  ctx,
  0.4,
  0,
  250,
  0.3
);
