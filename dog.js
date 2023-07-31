import Sequence from "./Sequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { Terrestrial } from "./Terrestrial.js";
import { Lives } from "./Lives.js";
import { play } from "./game2.mjs";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const timespan = 20;
//dogstuff

const dog = new Image();
dog.src = "assets/shadow_dog.png";
let run = new Audio("./assets/sounds/doggy.mp3");
run.loop=true
run.volume=.1
let ground = CANVAS_HEIGHT * 0.87;
const firesounds = [
  new Audio("./assets/sounds/fire.mp3"),
  new Audio("./assets/sounds/fire2.mp3"),
  //new Audio("./assets/sounds/fire3.mp3"),
  new Audio("./assets/sounds/fire4.mp3"),
];


class Dog extends Terrestrial {
  constructor(
    canvas,
    animationSpeed,
    renderAtX,
    renderAtY,
    sequences,
    scale = 1,
    options={
      initialLives:3
    }
  ) {
    super(
      canvas,
      sequences["run"],
      animationSpeed,
      renderAtX,
      renderAtY,
      scale
    );
    this.handleState();
    this.jumpVelocity = -15;
    this.state = "run";
    this.scale = scale;
    this.statesPriority = {
      roll: 1,
      dash: 1,
      dazed: 0,
      fall: 2,
      jump: 2,
      stand: 3,
      run: 3,
    };
    this.regularspeed = 1;
    this.isImmune = false;
    this.sequences = sequences;
    this.lives = new Lives(canvas, 0 ,CANVAS_WIDTH*.7, CANVAS_HEIGHT*.01 , .5,{initialLives:options.initialLives});
  }

  handleKeyUp() {
    this.jump();
  }
  handleKeyDown() {}
  handleKeyLeft() {
    this.vx = -3;
    this.state = "run";
  }
  handleKeyRight() {
    this.vx = 3;
    this.state = "run";
  }
  stop() {
    this.vx = 0;
  }
  jump() {
    if (this.isGrounded) this.vy += this.jumpVelocity;
  }
  handleSit() {
    if (this.positionY < ground) this.vy += 50;
    else this.state = "sit";
  }
  handleDash() {
    if (this.state != "roll" && this.state != "dash") {
      this.state = "dash";
      this.dash();
      setTimeout(() => {
        if(this.state!='die')
          this.state = "run";
      }, 330);
    }
  }
  handleRoll() {
    if (this.state != "roll" && this.state != "dash") {
      this.state = "roll";
      let a=firesounds[Math.floor(Math.random()*firesounds.length)].cloneNode()
      a.volume=.2
      a.play();
      this.roll();
      setTimeout(() => {
        this.state = "run";
      }, 1000);
    }
  }
  setState(state) {
    if (this.statesPriority[state] <= this.statesPriority[this.state]) {
      this.state = state;
    }
  }
  handleState() {
    setInterval(() => {
      this.state=="run"&&play?run.play():run.pause();
      this.state=="dead"&&run.stop();
      if (this.state != "dazed") {
        if (this.vy < 0) this.setState("jump");
        if (this.vy > 0) this.setState("fall");
        if (this.vy == 0 && this.state == "fall") this.state = "run";
        if (this.vx > 0 && this.state != "dash" && this.state != "roll")
          this.setState("run");
      }
      this.sequence = this.sequences[this.state];
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
    super.update();
    this.px = Math.min(
      this.px,
      CANVAS_WIDTH - this.sequence.frameWidth * this.scale
    );
    this.px = Math.max(this.px, 0);
    if (this.py < 0) {
      this.ay = 0;
      this.vy = 0;
      this.py = 10;
    }
  }
  
}

let movesArr = [
  {
    name: "stand",
    frames: 7,
  },
  {
    name: "jump",
    frames: 7,
  },
  {
    name: "fall",
    frames: 7,
  },
  {
    name: "run",
    frames: 9,
  },
  {
    name: "dazed",
    frames: 11,
  },
  {
    name: "sit",
    frames: 5,
  },
  {
    name: "roll",
    frames: 7,
  },
  {
    name: "dash",
    frames: 7,
  },
  {
    name: "die",
    frames: 12,
  },
];

function initializeMoves() {
  let moves = {};
  movesArr.forEach((move, index) => {
    moves[move.name] = new Sequence(
      dog,
      575,
      525,
      move.frames,
      index,
      0.4,
      0.4
    );
  });
  return moves;
}
let Moves = initializeMoves();

window.addEventListener("keydown", function (event) {
  if (puppy.state != "dazed" && puppy.state != "die") {
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
  if (puppy.state != "dazed" && puppy.state != "die") {
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
  ground - Moves["stand"].frameHeight * 0.3,
  Moves,
  0.3
);
