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
var myFont = new FontFace("Pixels", "url(assets/VT323/VT323-Regular.ttf)");

myFont.load().then(function (font) {
  document.fonts.add(font);
});


window.addEventListener("load", () => {
  let bgs = getBgs(ctx);
  //pooling design pattern

  const inputHandler = new InputHandler();

  let score = 0;
  let passed = 0,
    lastTime = 0;
  let continueAnimating = true;

  let play = document.getElementById("play");
  let puppy,w;

  let hide = true;

  play.addEventListener("click", () => {
    hide = true;
 
    music.play();

    continueAnimating = true;
    puppy = new Dog(ctx, 0.4, 0, 250, 0.3, { initialLives: 1 });
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().catch((err) => console.log(err));
    }
    animate(0);
    w=new Worm(
      ctx,
      1,
      Math.random() * CANVAS_WIDTH,
      Math.random() * CANVAS_HEIGHT,
      Math.random() *.4+  2,
      puppy
    )
  });
  function animate(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    passed += deltaTime;
    if (passed > 30) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bgs.forEach((bg) => {
        bg.puppySpeed = puppy.vx;
        bg.update();
        bg.draw();
      });
      w.animate();

     
     /*  puppy.draw();
      puppy.update(inputHandler.lastKey, inputHandler.isPress); */
      if (puppy.currentStateIndex == states.ROLLING) {
        handleTrails(puppy);
      }
      passed=0;
    }
    requestAnimationFrame(animate);

  }
  document.getElementById("loader").style.display = "none";
  play.style.display = "block";
});
