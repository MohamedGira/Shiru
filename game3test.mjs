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
let drawables = [];
let music = new Audio("./assets/sounds/the_field_of_dreams.mp3");
music.loop = true;

window.addEventListener("load", () => {
  let bgs = getBgs(ctx);

  let score = 0;
  let passed = 0,
    lastTime = 0;
  let continueAnimating = true;

  let play = document.getElementById("play");

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
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => console.log(err));
    }
    animate(0);


  });

  function animate(timeStamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    bgs.forEach((bg) => {
      bg.puppySpeed = 4;
      bg.update();
      bg.draw();
    });
    requestAnimationFrame(animate);
  }
  document.getElementById("loader").style.display = "none";
  play.style.display = "block";
});
