import { Enemy, EnemyA, EnemyB, EnemyD } from "./Elements/Enemies/Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";

import { Explosion } from "./Elements/Explosion.js";
import { Worm } from "./Elements/Enemies/Worm.js";
import { Trail, handleTrails } from "./Elements/Trail.js";
import { Heart } from "./Elements/Heart.js";
import { Ghost } from "./Elements/Enemies/Ghost.js";

import { showMessage } from "./utils/showMessage.js";
import { InputHandler } from "./Dog/InputHandler.js";
import { states } from "./Dog/States/State.js";
import { Dog } from "./Dog/Dog.js";

import { button } from "./Dog/Touchpad.js";
import { CollisionDetector } from "./utils/CollisionDetector.js";
import { isMobile } from "./utils/checkMobile.js";
import { run } from "./Dog/States/Running.js";

export const canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
const timeInterval = 2000;
let drawables = [];
let music = document.getElementById("themeSong");
music.loop = true;
var myFont = new FontFace("Pixels", "url(assets/VT323/VT323-Regular.ttf)");

myFont.load().then(function (font) {
  document.fonts.add(font);
});
let continueAnimating = true;



window.addEventListener("load", () => {
  let gamePlayer=document.getElementById('gamePlayer');

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

  const inputHandler = new InputHandler(canvas);
  let score = 0;
  let passed = 0,
    lastTime = 0;

  let play = document.getElementById("play");
  let puppy;

  let hide = true;

  canvas.addEventListener("click", () => {
    if (!document.fullscreenElement && play.style.display == "none") {
      music.play();
      gamePlayer.requestFullscreen().catch((err) => console.log(err));
      screen.orientation.lock("landscape");
    }
  });
  play.addEventListener("click", () => {
    play.style.display = "none";
    hide = true;
    const fadeout = setInterval(() => {
      try {
        music.volume /= 0.9;
      } catch (er) {
        music.volume = 1;
        clearInterval(fadeout);
      }
    }, 200);

    continueAnimating = true;
    drawables = [];
    puppy = new Dog(ctx, 0.4, 0, 250, 0.3, { initialLives: 3 });
    if (!document.fullscreenElement) {
      music.play();
      gamePlayer.requestFullscreen().catch((err) => console.log(err));
      screen.orientation.lock("landscape");
    }
    animate(0);
  });

  let enemyInterval = 0;
  let filterInterval = 0;
  let isphone = isMobile();
  function animate(timeStamp) {
    continueAnimating && requestAnimationFrame(animate);
    //needed time intervals
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

      //adding new enemies
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
      //filter out of screen enemies
      if (filterInterval > timeInterval) {
        drawables = drawables.filter((enemy) => !enemy.outOfScreen);
        filterInterval = 0;
      }
      //animating enemies
      drawables.forEach((enemy) => {
        enemy.animate(deltaTime);
      });
      //animating booms and trails
      [...boomsPool, ...trailsPool].forEach((boom) => {
        if (boom.object.scale <= 0.2) {
          boom.isActive = false;
        }
        boom.isActive && boom.object.animate(deltaTime);
      });
      showMessage(ctx, `Score: ${score}`);
      puppy.draw();
      puppy.lives.draw();


      /*Updates&handlings*/
      isMobile() && inputHandler.handleController();
      
      puppy.update(
        inputHandler.lastKey,
        inputHandler.isPress,
        inputHandler.touchpad2?.controller?.deltaXPercent,
        deltaTime
      );

      puppy.currentStateIndex == states.ROLLING &&
        handleTrails(puppy, trailsPool);

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

      //collision detection
      let collisionWith = CollisionDetector.betterDetectCollision(
        puppy,
        drawables
      );
      if (collisionWith) {
        //handling collision
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
            if (
              puppy.currentStateIndex == states.ROLLING ||
              puppy.py + puppy.physicalHeight < en.py
            ) {
              score += en.options.score;
              puppy.currentStateIndex != states.ROLLING &&
                puppy.py < en.py &&
                (puppy.vy = -puppy.vy);
            } else if (puppy.currentStateIndex != states.DAZED) {
              puppy.lives.decrementLives();
              puppy.lives.lives
                ? puppy.setState(states.DAZED)
                : puppy.setState(states.DYING);
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
  document.addEventListener("fullscreenchange", () => {
    continueAnimating = document.fullscreenElement;
    setTimeout(() => {
      !document.fullscreenElement && music.pause();
      !document.fullscreenElement && run.pause();
    }, 100);
    continueAnimating
      ? animate(0)
      : play.style.display != "block" &&
        (document.getElementById("click").style.display = "block");
  });
});
