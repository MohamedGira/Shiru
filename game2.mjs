import { Enemy, EnemyA, EnemyB, EnemyD } from "./Enemies/Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";
import { Explosion } from "./Explosion.js";
import { Ghost } from "./Enemies/Ghost.js";
import { Worm } from "./Enemies/Worm.js";
import { Trail } from "./Trail.js";
import { showMessage } from "./utils/showMessage.js";
import { Heart } from "./Heart.js";
import { InputHandler } from "./Dog/InputHandler.js";
import { states } from "./Dog/States/State.js";
import { Dog } from "./Dog/Dog.js";

const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const timeInterval = 1000;
let EnemyAs = [];
let music = new Audio("./assets/sounds/the_field_of_dreams.mp3");
music.loop = true;
var myFont = new FontFace("Pixels", "url(assets/VT323/VT323-Regular.ttf)");

myFont.load().then(function (font) {
  document.fonts.add(font);
});

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
function handleTrails(forDrawable) {
  let trail = trailsPool[trailsPool.findIndex((el) => !el.isActive)];
  if (trail) {
    trail.object.setPosition(
      forDrawable.px + forDrawable.physicalWidth / 2 + Math.random() * 50 - 25,
      forDrawable.py + forDrawable.physicalHeight / 2 + Math.random() * 50 - 25
    );
    trail.object.setVelocity(-forDrawable.vx * 0.2, -forDrawable.vy * 0.2);
    trail.object.setAcceleration(0, -0.1);
    trail.object.setScale(Math.random() * 1.4);
    trail.isActive = true;
  }
}

const inputHandler = new InputHandler();

let score = 0;
let passed = 0,
  lastTime = 0;
let continueAnimating = true;

let play = document.getElementById("play");
let puppy;

let EnemyGen1, EnemyGen2, EnemyGen3, EnemyGen4;
play.addEventListener("click", () => {
  play.style.display = "none";
  music.play();
  clearInterval(EnemyGen1);
  clearInterval(EnemyGen2);
  clearInterval(EnemyGen3);
  clearInterval(EnemyGen4);
  continueAnimating = true;
  puppy = new Dog(ctx, 0.4, 0, 250, 0.3, { initialLives: 10 });
  animate(0);
  EnemyAs = [];
  EnemyGen1 = setInterval(() => {
    EnemyAs.push(
      new Ghost(
        ctx,
        Math.random(),
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() * 0.5 + 0.3,
        puppy
      )
    );
    EnemyAs.push(
      new EnemyA(
        ctx,
        Math.random(),
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() * 0.3 + 0.3,
        puppy
      )
    );
  }, 1200);
  EnemyGen2 = setInterval(() => {
    EnemyAs.push(
      new EnemyD(
        ctx,
        Math.random(),
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() * 0.5 + 0.3,
        puppy
      )
    );
    EnemyAs.push(
      new Worm(
        ctx,
        Math.random(),
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() + 2,
        puppy
      )
    );
  }, 5000);

  EnemyGen3 = setInterval(() => {
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
  }, 3000);

  EnemyGen4 = setInterval(() => {
    EnemyAs.push(
      new EnemyB(
        ctx,
        Math.random(),
        Math.random() * CANVAS_WIDTH,
        Math.random() * CANVAS_HEIGHT,
        Math.random() * 0.3 + 0.3,
        puppy
      )
    );
  }, 400);

  document.addEventListener("collision", function (e) {
    let en = e.detail.whoami;
    if (en && puppy.currentStateIndex != states.DYING) {
      let ex = boomsPool[boomsPool.findIndex((el) => !el.isActive)];
      ex.object.setPosition(en.px, en.py);
      ex.object.setScale(
        (en.physicalWidth * 1.2) / ex.object.sequence.frameWidth
      );
      ex.isActive = true;
      EnemyAs = EnemyAs.filter((el) => el != en);
      if (en instanceof Enemy) {
        if (puppy.currentStateIndex == states.ROLLING)
          score += en.options.score;
        else {
          puppy.lives.decrementLives();
        }
      } else if (en instanceof Heart) {
        puppy.lives.incrementLives();
      }
      delete e.detail.whoami;
    }
  });
});
let hide = true;
function hideHead() {
  hide &&
    document.getElementById("head").animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 1000,
      fill: "forwards",
    });
  hide = false;
}

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
  puppy.draw();
  puppy.update(inputHandler.lastKey, inputHandler.isPress);
  if (puppy.currentStateIndex == states.ROLLING) {
    handleTrails(puppy);
  }
  puppy.lives.draw();
  if (puppy.currentStateIndex == states.DYING) {
    hide && canvas.animate([{ opacity: 1 }, { opacity: 0 }], 3000);
    const fadeout=hide&&setInterval(()=>{
      music.volume*=0.9;
      if (music.volume<0.1)
      clearInterval(fadeout);
    },200)
    hide = false;
    showMessage(ctx, `Game Over`, {
      font: "100px Pixels",
      renderAtX: CANVAS_WIDTH / 2 - 200,
      renderAtY: CANVAS_HEIGHT / 2,
      offset: -2,
      color: "red",
      shadowColor: "black",
    });
    
    setTimeout(() => {
      continueAnimating = false;
      document.getElementById("btnImg").src = "./assets/tryAgain.png";
      play.style.display = "block";
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }, 3000);
  }
  continueAnimating && requestAnimationFrame(animate);
}

let controls=document.getElementById('controlsList');
document.getElementById('controls').addEventListener('mouseover',()=>{
controls.style.display='flex';
controls.style.position='fixed';
controls.style.left='10px';
controls.style.maxWidth='20rem';


})
document.getElementById('controls').addEventListener('mouseout',()=>{
  controls.style.display='none';
})
window.addEventListener('keydown', function(e) {
  if(e.code == 'Space' && e.target == document.body) {
    e.preventDefault();
  }
});

let c = new InputHandler();
