import { Enemy, EnemyA, EnemyB, EnemyD } from "./Enemies/Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";
import { Explosion } from "./Explosion.js";
import { Ghost } from "./Enemies/Ghost.js";
import { Worm } from "./Enemies/Worm.js";
import { Trail } from "./Trail.js";
import { showMessage } from "./utils/showMessage.js";
import { Heart } from "./Heart.js";
import { InputHandler } from "./utils/InputHandler.js";
import { puppy } from "./Dog/dog.js";
import { states } from "./Dog/States/State.js";

const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const timeInterval = 1000;
let EnemyAs = [];

var myFont = new FontFace("Pixels", "url(assets/VT323/VT323-Regular.ttf)");

myFont.load().then(function (font) {
  document.fonts.add(font);
});



setInterval(() => {
  EnemyAs.push(
    new Ghost(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      0.3,
      puppy
    )
  );
  EnemyAs.push(
    new EnemyA(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      0.3,
      puppy
    )
  );
}, 1200);
setInterval(() => {
  EnemyAs.push(
    new EnemyD(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      0.3,
      puppy
    )
  );
  EnemyAs.push(
    new Worm(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      2,
      puppy
    )
  );
}, 5000);

setInterval(() => {
  EnemyAs.push(
    new EnemyD(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      0.3,
      puppy
    )
  );
  EnemyAs.push(
    new Heart(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      1,
      puppy
    )
  );
}, 5000);

setInterval(() => {
  EnemyAs.push(
    new EnemyB(
      ctx,
      Math.random(),
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      0.3,
      puppy
    )
  );
}, 400);

let bgs = getBgs(ctx);

//pooling design pattern
let boomsPool = [];
let trailsPool = [];
for (let i = 0; i < 1000; i++) {
  boomsPool.push({
    isActive: false,
    object: new Explosion(ctx, 0.2, 0, 0, 0.2),
  });
  trailsPool.push({ isActive: false, object: new Trail(ctx, 0.2, 0, 0, 0.2) });
}

let score = 0;
let passed = 0,
  lastTime = 0;
let continueAnimating = true;

function animate(timeStamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgs.forEach((bg) => {
    bg.puppySpeed = puppy.vx;
    bg.update();
    bg.draw();
  });
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  passed += deltaTime;
  EnemyAs.forEach((enemy) => {
    enemy.animate();
  });
  [...boomsPool, ...trailsPool].forEach((boom) => {
    if (boom.object.scale <= 0.2) {
      boom.isActive = false;
    }
    boom.isActive && boom.object.animate();
  });

  showMessage(ctx, `Score: ${score}`);
  if (passed > timeInterval) {
    EnemyAs = EnemyAs.filter((enemy) => !enemy.outOfScreen);
  }
  puppy.animate();
  if (puppy.currentStateIndex==states.ROLLING) {
    let trail = trailsPool[trailsPool.findIndex((el) => !el.isActive)];
    if (trail) {
      trail.object.setPosition(
        puppy.px + puppy.physicalWidth / 2 + Math.random() * 50 - 25,
        puppy.py + puppy.physicalHeight / 2 + Math.random() * 50 - 25
      );
      trail.object.setVelocity(-puppy.vx * 0.2, -puppy.vy * 0.2);
      trail.object.setAcceleration(0, -0.1);

      trail.object.setScale(Math.random() * 1.4);
      trail.isActive = true;
    }
  }
  puppy.lives.draw();
  if (puppy.currentStateIndex==states.DYING) {
    puppy.ax = 0;
    showMessage(ctx, `Game Over`, {
      font: "100px Pixels",
      renderAtX: CANVAS_WIDTH / 2 - 200,
      renderAtY: CANVAS_HEIGHT / 2,
      offset: -2,
      color: "red",
      shadowColor: "black",
    });
    document.getElementById("play").innerHTML = "Try Again";
  }
  if (puppy.currentStateIndex==states.DYING && puppy.isGrounded) {
    puppy.vx = -4;
  }
  if (
    puppy.currentStateIndex==states.DYING &&
    Math.floor(puppy.index * puppy.animationSpeed) ==
      puppy.sequence.frames.length - 1
  ) {
    puppy.update = () => {};
  }
  continueAnimating && requestAnimationFrame(animate);
}
animate(0);

//Collision

document.addEventListener("collision", function (e) {
  let en = e.detail.whoami;
  if (en && puppy.currentStateIndex!=states.DYING) {
    let ex = boomsPool[boomsPool.findIndex((el) => !el.isActive)];
    ex.object.setPosition(en.px, en.py);
    ex.object.setScale(
      (en.physicalWidth * 1.2) / ex.object.sequence.frameWidth
    );
    ex.isActive = true;
    EnemyAs = EnemyAs.filter((el) => el != en);
    if (en instanceof Enemy) {
      if (puppy.currentStateIndex==states.ROLLING) score += en.options.score;
      else {
        puppy.lives.decrementLives();
        if (puppy.lives.lives <= 0) {
          puppy.index = 0;
          puppy.animationSpeed = 0.18;
          puppy.setState(states.DYING);
          let i = 0;
          setTimeout(() => {
            continueAnimating = false;
          }, 3000);
        }
      }
    } else if (en instanceof Heart) {
      puppy.lives.incrementLives();
    }
    delete e.detail.whoami;
  }
});

let c = new InputHandler();
