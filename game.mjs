const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const canvas1 = document.getElementById("game1");
const ctx1 = canvas1.getContext("2d");
const canvas2 = document.getElementById("game2");
const ctx2 = canvas2.getContext("2d");
const canvas3 = document.getElementById("game3");
const ctx3 = canvas3.getContext("2d");
const canvas4 = document.getElementById("game4");
const ctx4 = canvas4.getContext("2d");

//dogstuff

const dog = new Image();
dog.src = "assets/shadow_dog.png";
const boomImg = new Image();
boomImg.src = "assets/enemies/boom.png";
const CANVAS_WIDTH =
  (canvas.width =
  canvas1.width =
  canvas2.width =
  canvas3.width =
  canvas4.width =
    800 + 200);
const CANVAS_HEIGHT =
  (canvas.height =
  canvas1.height =
  canvas2.height =
  canvas3.height =
  canvas4.height =
    700 + 200);

let ground = CANVAS_HEIGHT - 95;
let timespan = 15;
let accelerationscale = 0.2;

class Movable {
  frictionx = 1 * accelerationscale;
  accelerationY = 9.8 * accelerationscale;
  speedX = 1;
  speedY = 0;
  positionY = ground;
  positionX = 0;

  constructor(width, height) {
    this.verticalMovePhysics();
    this.accelerationYPhysics();
    this.width = width;
    this.height = height;
  }
  accelerationYPhysics() {
    setInterval(() => {
      if (this.positionY < ground) {
        this.speedY += this.accelerationY;
      }
    }, timespan);
  }
  verticalMovePhysics() {
    setInterval(() => {
      if (this.speedY != 0) this.positionY += this.speedY;
      if (this.positionY > ground) {
        this.positionY = ground;
        this.speedY = 0;
      }
    }, timespan);
  }
  dash() {
    let oldspedd = this.speedX;
    this.speedX += 50;
    const minterval = setInterval(() => {
      if (Math.abs(this.speedX) > oldspedd + 0.1) {
        this.speedX -= this.speedX * this.frictionx;
      } else {
        this.speedX = oldspedd;
        clearInterval(minterval);
      }
    }, timespan * 2);
  }
  roll() {
    let oldspedd = this.speedX;

    this.speedX *= 20;
    this.speedY *= 2;

    const minterval = setInterval(() => {
      if (Math.abs(this.speedX) > Math.abs(oldspedd) + 0.1) {
        this.speedX -= this.speedX * this.frictionx;
      } else {
        this.speedX = oldspedd;
        clearInterval(minterval);
      }
    }, timespan * 2);
  }
}
class Dog extends Movable {
  constructor(scale) {
    super(575, 525);
    this.handleState();
    this.jumpVelocity = 30;
    this.state = "stand";
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
    this.isImmune = false;
  }
  handleKeyUp() {
    this.jump();
  }
  handleKeyDown() {}
  handleKeyLeft() {
    this.speedX = -3;
    this.state = "run";
  }
  handleKeyRight() {
    this.speedX = 3;
    this.state = "run";
  }
  stop() {
    this.speedX = 1;
    this.state = "run";
  }
  jump() {
    this.speedY -= this.jumpVelocity;
  }
  handleSit() {
    if (this.positionY < ground) this.speedY += 50;
    else this.state = "sit";
  }
  handleDash() {
    this.state = "dash";
    super.dash();
    setTimeout(() => {
      this.state = "run";
    }, 330);
  }
  handleRoll() {
    this.state = "roll";
    super.roll();
    setTimeout(() => {
      this.state = "run";
    }, 1000);
  }
  setState(state) {
    if (this.statesPriority[state] <= this.statesPriority[this.state]) {
      this.state = state;
    }
  }
  handleState() {
    setInterval(() => {
      if (this.state != "dazed") {
        if (this.speedY < 0) this.setState("jump");
        if (this.speedY > 0) this.setState("fall");
        if (this.speedY == 0 && this.state == "fall")
          Math.abs(this.speedX) > 0
            ? (this.state = "run")
            : (this.state = "stand");
        if (this.speedX > 0 && this.state != "dash" && this.state != "roll")
          this.setState("run");
        if (this.speedX == 0 && this.state == "run") this.setState("stand");
      }
    }, 20);
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

class Layer {
  constructor(img, speed) {
    this.img = img;
    this.speed = speed;
    this.position = 0;
    this.puppySpeed = 1;
  }
  draw() {
    ctx.drawImage(this.img, this.position, 0, 2400, CANVAS_HEIGHT);
    if (Math.abs(this.position) > 2400 - CANVAS_WIDTH) {
      ctx.drawImage(this.img, this.position + 2400, 0, 2400, CANVAS_HEIGHT);
    }
  }

  update() {
    if (Math.abs(this.position) > 2400) this.position = 0;
    this.position -= Math.max(1, this.speed + this.puppySpeed * 0.2);
  }
}

class MoveSequence {
  constructor(name, frames, speed = 1, img, movableObject) {
    this.name = name;
    this.frames = frames;
    this.speed = speed;
    this.index = 0;
    this.img = img;
    this.movableObject = movableObject;
  }
  animate() {
    this.draw();
    this.update();
  }
  draw() {
    ctx.drawImage(
      this.img,
      this.frames[Math.floor(this.index * this.speed) % this.frames.length].x,
      this.frames[Math.floor(this.index * this.speed) % this.frames.length].y,
      this.movableObject.width,
      this.movableObject.height,
      this.movableObject.speedX != 1
        ? (this.movableObject.positionX += this.movableObject.speedX)
        : this.movableObject.positionX,
      this.movableObject.positionY -
        this.movableObject.height * this.movableObject.scale,
      this.movableObject.width * this.movableObject.scale,
      this.movableObject.height * this.movableObject.scale
    );
  }
  update() {
    this.movableObject.positionX = Math.min(
      this.movableObject.positionX,
      CANVAS_WIDTH - this.movableObject.width * this.movableObject.scale
    );
    this.movableObject.positionX = Math.max(this.movableObject.positionX, 0);
    Math.floor(this.index * this.speed) == this.frames.length
      ? (this.index = 0)
      : 0;
    this.index += 1;
  }
}
let puppy = new Dog(0.3);

function generateFramesLocationArray(width, height, framesCount, index = 0) {
  frames = [];
  for (let i = 0; i < framesCount; i++) {
    let positionX = i * width;
    let positionY = index;
    frames.push({ x: positionX, y: positionY * height });
  }
  return frames;
}

function initializeMoves() {
  let moves = {};
  movesArr.forEach((move, index) => {
    frames = [];
    const sequence = new MoveSequence(
      move.name,
      generateFramesLocationArray(
        puppy.width,
        puppy.height,
        move.frames,
        index
      ),
      0.33,
      dog,
      puppy
    );
    moves[move.name] = sequence;
  });
  return moves;
}
let Moves = initializeMoves();

function initializeBackgroundArray() {
  let bgs = [];
  for (let i = 1; i <= 5; i++) {
    let aa = new Image();
    aa.src = `assets/layer-${i}.png`;
    bgs.push(new Layer(aa, i));
  }
  return bgs;
}

let bgs = initializeBackgroundArray();
bgs[0].speed = 1.5;
bgs[1].speed = 2.5;
bgs[2].speed = 3.5;
bgs[3].speed = 4.5;
bgs[4].speed = 5.5;

window.addEventListener("keydown", function (event) {
  if (puppy.state != "dazed") {
    if (
      event.key == "ArrowUp" ||
      event.key == "w" ||
      event.key == "W" ||
      event.key == " "
    ) {
      if (puppy.positionY == ground) puppy.handleKeyUp();
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
  if (puppy.state != "dazed") {
    if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
      puppy.stop();
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
      puppy.stop();
  }
});

//enemy stuff

class Enemy {
  constructor(image, framesCount, width, height, speed, canvas, foe) {
    this.index = 0;
    this.image = image;
    this.speed = speed || Math.random();
    this.width = width;
    this.height = height;
    this.mapWidth = this.width / 3;
    this.mapHeight = this.height / 3;
    this.framesCount = framesCount;
    this.x = Math.random() * (CANVAS_WIDTH - this.mapHeight);
    this.y = Math.random() * (CANVAS_HEIGHT - this.mapWidth);
    this.dx = 0;
    this.dy = 0;
    this.gameFrame = 0;
    this.canvas = canvas;
    this.checkCollision(puppy);
    this.collisionEvent = new CustomEvent("collision", {
      detail: { whoami: this },
    });
  }

  checkCollision(player) {
    setInterval(() => {
      if (
        player.state == "dazed" ||
        player.positionX > this.x + this.mapWidth ||
        player.positionX + player.width * player.scale < this.x ||
        player.positionY - player.height * player.scale >
          this.y + this.mapHeight ||
        player.positionY < this.y
      ) {
      } else {
        setTimeout(() => (player.isImmune = false), 1000);
        document.dispatchEvent(this.collisionEvent);
      }
    }, 50);
  }
  setpositionX(x) {
    this.x = x;
  }
  setpositionY(y) {
    this.y = y;
  }
  changeVelocity(dx = 0, dy = 0) {
    this.dx += dx;
    this.dy += dy;
  }
  setVelocityX(dx) {
    this.dx = dx;
  }
  setVelocityY(dy) {
    this.dy = dy;
  }
  noiseMoveX(strengthx = 1) {
    this.changeVelocity(Math.random() * strengthx - strengthx / 2, 0);
  }
  noiseMoveY(strengthy = 1) {
    this.changeVelocity(0, Math.random() * strengthy - strengthy / 2);
  }
  draw() {
    this.canvas.drawImage(
      this.image,
      (Math.floor(this.index * this.speed) % this.framesCount) * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.mapWidth,
      this.mapHeight
    );
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    //out from right
    if (this.x > CANVAS_WIDTH) this.x = -this.width;
    //out from left
    if (this.x + this.width < 0) this.x = CANVAS_WIDTH;
    //out from above
    if (this.y + this.height < 0) this.y = CANVAS_HEIGHT;
    //out from below
    if (this.y > CANVAS_HEIGHT) this.y = -this.height;

    Math.floor(this.index * this.speed) == this.framesCount
      ? (this.index = 0)
      : 0;
    this.index++;
    this.gameFrame++;
  }
  oscillateX(amplitude = 1, speedMs = 50) {
    let i = 0;
    setInterval(() => {
      this.setVelocityX(Math.sin((i++ * 3.14) / 360) * amplitude);
      this.noiseMoveX(amplitude * 0.6);
    }, speedMs);
  }
  oscillateY(amplitude = 1, speedMs = 1) {
    let i = 0;
    setInterval(() => {
      this.setVelocityY(Math.sin((i++ * 180) / 3.14) * amplitude);
      this.noiseMoveY(amplitude);
    }, speedMs);
  }
  animate() {
    this.draw();
    this.update();
  }
}

class EnemyA extends Enemy {
  constructor(canves) {
    super(arr[0], 6, 293, 153, 0.2, canves);
  }
  update() {
    this.noiseMoveY(0.2);
    this.noiseMoveX(0.2);
    super.update();
  }
}
class EnemyB extends Enemy {
  constructor(canves) {
    super(arr[1], 6, 266, 188, 0.2, canves);
    this.setVelocityX(-Math.random() * 3);
    this.oscillateY(Math.random() * 5, 100);
    this.x = CANVAS_WIDTH + this.width;
  }
  update() {
    super.update();
  }
}
class EnemyC extends Enemy {
  constructor(canves) {
    super(arr[2], 6, 218, 177, 0.2, canves);
    this.angle = 0;
    this.offsetX = (CANVAS_WIDTH - this.mapWidth) / 2;
    this.offsetY = (CANVAS_HEIGHT - this.mapHeight) / 2;
    this.anglex = Math.random();
    this.angley = Math.random();
    this.anglexSpeed = Math.random() * 2;
  }
  update() {
    this.anglex += this.anglexSpeed;
    this.angley += this.anglexSpeed;
    this.setpositionX(
      ((CANVAS_WIDTH - this.mapWidth) / 2) *
        Math.sin((this.anglex * Math.PI) / 90) +
        this.offsetX
    );
    this.setpositionY(
      ((CANVAS_HEIGHT - this.mapHeight) / 2) *
        Math.cos((this.angley * Math.PI) / 180) +
        this.offsetY
    );
  }
}
class EnemyD extends Enemy {
  constructor(canves) {
    super(arr[3], 9, 213, 212, 0.2, canves);
    this.randomizePosition();
    this.moveEvery = Math.floor(Math.random() * 200 + 100);
  }
  randomizePosition() {
    this.newX = (Math.random() * CANVAS_WIDTH) / 2;
    this.newY = (Math.random() * CANVAS_HEIGHT) / 2;
  }
  update() {
    if (this.gameFrame % this.moveEvery == 0) {
      this.randomizePosition();
      this.dx = (this.newX - this.x) / 50;
      this.dy = (this.newY - this.y) / 50;
    }
    this.dx *= 0.99;
    this.dy *= 0.99;

    super.update();
  }
}
let booms = [];
arr = [];
for (let i = 0; i < 4; i++) {
  let a = new Image();
  a.src = `./assets/enemies/enemy${i + 1}.png`;
  arr.push(a);
}

let EnemyAs = [];
const EnemyBs = [];
const EnemyCs = [];
const EnemyDs = [];
setInterval(() => {
  for (let i = 0; i < 1; i++) {
    //EnemyAs.push(new EnemyA(ctx));
    //EnemyAs.push(new EnemyC(ctx));
    EnemyAs.push(new EnemyB(ctx));
    //EnemyAs.push(new EnemyD(ctx));
  }
}, 1000);
ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
ctx3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgs.forEach((bg) => {
    bg.puppySpeed = puppy.speedX;
    bg.update();
    bg.draw();
  });

  EnemyAs.forEach((enemy) => {
    enemy.animate();
  });
  Moves[puppy.state].draw();
  Moves[puppy.state].update();

  booms.forEach((boom) => {
    boom.animate();
  });

  requestAnimationFrame(animate);
}
animate();

//Collision
let boomframes = generateFramesLocationArray(200, 179, 5, 0);

document.addEventListener("collision", function (e) {
  if (puppy.state == "roll") {
    let en = e.detail.whoami;
    EnemyAs = EnemyAs.filter((el) => el != en);
    if (en) {
      let boom = new MoveSequence("boom", boomframes, 0.2, boomImg, {
        positionX: en.x,
        positionY: en.y + en.mapHeight,
        scale: 0.5,
        width: 200,
        height: 179,
        speedX: 1,
      });
      let i = booms.length;
      booms.push(boom);
      setTimeout(() => {
        booms.splice(booms.indexOf(boom), 1);
      }, 300);
    }
    delete e.detail.whoami;
  }

  if (e.detail.whoami && puppy.state != "dazed") {
    puppy.speedY *= -1;
    puppy.speedX *= -1;

    puppy.state = "dazed";
    setTimeout(() => {
      puppy.state = "stand";
    }, 2000);
  }
});
