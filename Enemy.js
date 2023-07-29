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
const dogwidth = 575;
const dogheight = 525;
const dog = new Image();
dog.src = "assets/shadow_dog.png";

let ground = 250;
let timespan = 15;
let accelerationscale = 0.2;

class Movable {
  frictionx = 1 * accelerationscale;
  accelerationY = -9.8 * accelerationscale;
  daX = 10;
  speedX = 0;
  speedY = 0;
  positionY = ground;

  constructor() {
    this.verticalMovePhysics();
    this.accelerationYPhysics();
  }
  accelerationYPhysics() {
    setInterval(() => {
      if (this.positionY > ground) {
        this.speedY += this.accelerationY;
      }
    }, timespan);
  }
  verticalMovePhysics() {
    setInterval(() => {
      if (this.speedY != 0) this.positionY += this.speedY;
      if (this.positionY < ground) {
        this.positionY = ground;
        this.speedY = 0;
      }
    }, timespan);
  }
  dash() {
    let oldspedd = this.speedX;
    this.speedX += 5;
    const minterval = setInterval(() => {
      if (Math.abs(this.speedX) > oldspedd + 0.1) {
        this.speedX -= this.speedX * this.frictionx;
      } else {
        this.speedX = oldspedd;
        clearInterval(minterval);
      }
    }, timespan * 2);
  }
}
class Dog extends Movable {
  constructor() {
    super();
    this.handleState();
    this.jumpVelocity=25
  }
  state = "stand";
  handleKeyUp() {
    this.jump();
  }
  handleKeyDown() {}
  handleKeyLeft() {}
  handleKeyRight() {
    this.speedX = 2;
    this.state = "run";
  }
  stop() {
    this.speedX = 0;
    puppy.state = "stand";
  }
  jump() {
    this.speedY += this.jumpVelocity;
  }
  handleSit() {
    this.state = "sit";
  }
  handleDash() {
    this.state = "dash";
    super.dash();
    setTimeout(() => {
      this.state = "stand";
    }, 330);
  }
  handleState() {
    setInterval(() => {
      if (this.speedY > 0) this.state = "jump";
      if (this.speedY < 0) this.state = "fall";
      if (this.speedY == 0 && this.state == "fall")
        this.speedX > 0 ? (this.state = "run") : (this.state = "stand");
      if (this.speedX > 0 && this.state != "dash") this.state = "run";
      if (this.speedX == 0 && this.state == "run") this.state = "stand";
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
  }
  draw() {
    ctx.drawImage(this.img, this.position, 0, 2400, CANVAS_HEIGHT);
    if (Math.abs(this.position) > 2400 - CANVAS_WIDTH) {
      ctx.drawImage(this.img, this.position + 2400, 0, 2400, CANVAS_HEIGHT);
    }
  }

  update() {
    if (Math.abs(this.position) > 2400) this.position = 0;
    this.position -= this.speed * puppy.speedX;
  }
}

class MoveSequence {
  constructor(name, frames, speed = 1) {
    this.name = name;
    this.frames = frames;
    this.speed = speed;
    this.index = 0;
  }
  draw() {
    ctx.drawImage(
      dog,
      this.frames[Math.floor(this.index * this.speed) % this.frames.length].x,
      this.frames[Math.floor(this.index * this.speed) % this.frames.length].y,
      dogwidth,
      dogheight,
      0,
      CANVAS_HEIGHT - puppy.positionY,
      dogwidth * 0.3,
      dogheight * 0.3
    );
  }
  update() {
    Math.floor(this.index * this.speed) ==this.frames.length ? this.index = 0 : 0;
    this.index += 1;
  }
}

function initializeMoves() {
  let moves = {};
  movesArr.forEach((move, index) => {
    frames = [];
    for (let i = 0; i < move.frames; i++) {
      let positionX = i * dogwidth;
      let positionY = index;
      frames.push({ x: positionX, y: positionY * dogheight });
    }
    const sequence = new MoveSequence(move.name, frames, 0.33);
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

let puppy = new Dog();
window.addEventListener("keydown", function (event) {
  if (
    event.key == "ArrowUp" ||
    event.key == "w" ||
    event.key == "W" ||
    event.key == " "
  )
    {
      if(puppy.positionY==ground)
          puppy.handleKeyUp();
    }
  if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
    puppy.handleKeyRight();
  if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
    puppy.handleSit();
  if (event.key == "q") puppy.handleDash();
});
window.addEventListener("keyup", function (event) {
  if (event.key == "ArrowRight" || event.key == "d" || event.key == "D")
    puppy.stop();
  if (event.key == "ArrowDown" || event.key == "s" || event.key == "S")
    puppy.stop();
});










//enemy stuff



const CANVAS_WIDTH =
  (canvas.width =
  canvas1.width =
  canvas2.width =
  canvas3.width =
  canvas4.width =
    800);
const CANVAS_HEIGHT =
  (canvas.height =
  canvas1.height =
  canvas2.height =
  canvas3.height =
  canvas4.height =
    700);

class Enemy {
  constructor(image, framesCount, width, height, speed, canvas) {
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

arr = [];
for (let i = 0; i < 4; i++) {
  let a = new Image();
  a.src = `./assets/enemies/enemy${i + 1}.png`;
  arr.push(a);
}

const EnemyAs = [];
const EnemyBs = [];
const EnemyCs = [];
const EnemyDs = [];
for (let i = 0; i < 20; i++) {
  EnemyAs.push(new EnemyA(ctx1));
}
for (let i = 0; i < 15; i++) {
  EnemyBs.push(new EnemyB(ctx2));
}
for (let i = 0; i < 18; i++) {
  EnemyCs.push(new EnemyC(ctx3));
}
for (let i = 0; i < 30; i++) {
  EnemyDs.push(new EnemyD(ctx4));
}

let i = 0;
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  EnemyAs.forEach((enemy) => {
    enemy.animate();
  });
  EnemyBs.forEach((enemy) => {
    enemy.animate();
  });
  EnemyCs.forEach((enemy) => {
    enemy.animate();
  });
  EnemyDs.forEach((enemy) => {
    enemy.animate();
  });
  bgs.forEach((bg) => {
      bg.update();
      bg.draw();
    });
    //dog drawing
    Moves[puppy.state].draw();
    Moves[puppy.state].update();
    requestAnimationFrame(animate);
}
animate();
