import { Enemy, EnemyA, EnemyB, EnemyD } from "./Enemies/Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";
import { Explosion } from "./Explosion.js";
import { Ghost } from "./Enemies/Ghost.js";
import { Worm } from "./Enemies/Worm.js";
import { Trail } from "./Trail.js";
import { showMessage } from "./utils/showMessage.js";
import { Heart } from "./Heart.js";
import { InputHandler, getCanvasCoordinates } from "./Dog/InputHandler.js";
import { states } from "./Dog/States/State.js";
import { Dog } from "./Dog/Dog.js";
import { CollisionDetector } from "./CollisionDetector.js";
import { TouchPad, button } from "./Dog/Touchpad.js";
import { isMobile } from "./utils/checkMobile.js";

export const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const timeInterval = 2000;
let drawables = [];
let music = new Audio("./assets/sounds/the_field_of_dreams.mp3");
music.loop = true;
var myFont = new FontFace("Pixels", "url(assets/VT323/VT323-Regular.ttf)");

myFont.load().then(function (font) {
  document.fonts.add(font);
});

window.addEventListener("load", () => {
  let drawablesTypes = [
    { drawable: EnemyA, scale: 0.3 },
    { drawable: EnemyB, scale: 0.3 },
    { drawable: Ghost, scale: 0.3 },
    { drawable: EnemyD, scale: 0.3 },
    { drawable: Worm, scale: 2 },
    { drawable: Heart, scale: 1 },
  ];
  let bgs = getBgs(ctx);
  //pooling design pattern
  let boomsPool = [];
  let trailsPool = [];
  for (let i = 0; i < 10; i++) {
    boomsPool.push({
      isActive: false,
      object: new Explosion(ctx, 0.2, 0, 0, 0.2),
    });
    trailsPool.push({
      isActive: false,
      object: new Trail(ctx, 0.2, 0, 0, 0.2),
    });
  }
  function handleTrails(forDrawable) {
    let trail = trailsPool[trailsPool.findIndex((el) => !el.isActive)];
    if (trail) {
      trail.object.setPosition(
        forDrawable.px +
          forDrawable.physicalWidth / 2 +
          Math.random() * 50 -
          25,
        forDrawable.py +
          forDrawable.physicalHeight / 2 +
          Math.random() * 50 -
          25
      );
      trail.object.setVelocity(-forDrawable.vx * 0.2, -forDrawable.vy * 0.2);
      trail.object.setAcceleration(0, -0.1);
      trail.object.setScale(Math.random() * 1.4);
      trail.isActive = true;
    }
  }

  const inputHandler = new InputHandler();
  let t = new TouchPad(
    ctx,
    100,
    30,
    canvas.width - 120,
    canvas.height - 120,
    canvas.width - 120,
    canvas.height - 120
  );

  let rollbtn = new button(ctx, 0, 10, CANVAS_HEIGHT -120, { scale: 0.6 });
  let score = 0;
  let passed = 0,
    lastTime = 0;
  let continueAnimating = true;

  let play = document.getElementById("play");
  let puppy;

  let hide = true;

  play.addEventListener("click", () => {
    hide = true;
    const fadeout = setInterval(() => {
      try {
        music.volume /= 0.9;
      } catch (er) {
        music.volume = 1;
        clearInterval(fadeout);
      }
    }, 200);
    music.play();

    continueAnimating = true;
    drawables = [];
    puppy = new Dog(ctx, 0.4, 0, 250, 0.3, { initialLives: 10 });
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => console.log(err));
      screen.orientation.lock("landscape");
    }
    animate(0);
  });
  let enemyInterval = 0;
  let filterInterval = 0;
  let isphone = isMobile() || true;
  function animate(timeStamp) {
    continueAnimating && requestAnimationFrame(animate);

    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    passed += deltaTime;
    enemyInterval += deltaTime;
    filterInterval += deltaTime;
    if (passed > 1000 / 150) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      //renreing backgrounds
      bgs.forEach((bg) => {
        bg.puppySpeed = puppy.vx;
        bg.update();
        bg.draw();
      });
      if (enemyInterval > Math.random() * 1000 + 1000) {
        let i = Math.floor(Math.random() * drawablesTypes.length);
        drawables.push(
          new drawablesTypes[i].drawable(
            ctx,
            Math.random(),
            Math.random() * CANVAS_WIDTH,
            Math.random() * CANVAS_HEIGHT,
            Math.random() * 0.4 + drawablesTypes[i].scale,
            puppy
          )
        );
        enemyInterval = 0;
      }
      //adding new enemies
      if (filterInterval > timeInterval) {
        drawables = drawables.filter((enemy) => !enemy.outOfScreen);
        console.log("filteres");
        filterInterval = 0;
      }

      drawables.forEach((enemy) => {
        enemy.animate();
      });
      const {rectangleWidth,rectangleHeight,deltaHeight,deltaWidth}=getCanvasCoordinates();
      inputHandler.touchCurrent
        ? t.handleInnerPos(
            ((inputHandler.touchCurrent.x-deltaWidth) / rectangleWidth) * CANVAS_WIDTH,
            ((inputHandler.touchCurrent.y-deltaHeight )/ rectangleHeight) * CANVAS_HEIGHT
          )
        : t.resetInnerPos();
      [...boomsPool, ...trailsPool].forEach((boom) => {
        if (boom.object.scale <= 0.2) {
          boom.isActive = false;
        }
        boom.isActive && boom.object.animate();
      });

      showMessage(ctx, `Score: ${score}`);
      puppy.draw();
      puppy.update(inputHandler.lastKey, inputHandler.isPress);
      if (puppy.currentStateIndex == states.ROLLING) {
        handleTrails(puppy);
      }
      puppy.lives.draw();
      isphone && t.draw();
      isphone && rollbtn.draw();
      if (puppy.currentStateIndex == states.DYING) {
        hide && canvas.animate([{ opacity: 1 }, { opacity: 0 }], 3000);
        const fadeout =
          hide &&
          setInterval(() => {
            music.volume *= 0.9;
            if (music.volume < 0.1) clearInterval(fadeout);
          }, 200);
        showMessage(ctx, `Game Over`, {
          font: "100px Pixels",
          renderAtX: CANVAS_WIDTH / 2 - 200,
          renderAtY: CANVAS_HEIGHT / 2,
          offset: -2,
          color: "red",
          shadowColor: "black",
        });

        hide &&
          setTimeout(() => {
            document.exitFullscreen();
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            continueAnimating = false;
            document.getElementById("btnImg").src =
              document.getElementById("tryAgainKey").src;
            play.style.display = "block";
          }, 3000);
        hide = false;
      }
      let collisionWith = CollisionDetector.betterDetectCollision(
        puppy,
        drawables
      );
      if (collisionWith) {
        let en = drawables[drawables.findIndex((el) => el == collisionWith)];
        if (puppy.currentStateIndex != states.DYING) {
          let ex = boomsPool[boomsPool.findIndex((el) => !el.isActive)];
          ex.object.setPosition(en.px, en.py);
          ex.object.setScale(
            (en.physicalWidth * 1.2) / ex.object.sequence.frameWidth
          );
          ex.isActive = true;
          drawables = drawables.filter((el) => el != en);
          if (en instanceof Enemy) {
            if (puppy.currentStateIndex == states.ROLLING)
              score += en.options.score;
            else if (puppy.currentStateIndex != states.DAZED) {
              puppy.lives.decrementLives();
              this.lives.live?puppy.setState(states.DAZED):puppy.setState(states.DYING);
            }
          } else if (en instanceof Heart) {
            puppy.lives.incrementLives();
          }
        }
      }
      passed = 0;
    }
  }
  document.getElementById("loader").style.display = "none";
  play.style.display = "block";
});
