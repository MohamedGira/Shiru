import { puppy } from "./dog.js";
import { EnemyA, EnemyB, EnemyD } from "./Enemies/Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";
import { Explosion } from "./Explosion.js";
import { Ghost } from "./Enemies/Ghost.js";
import { Worm } from "./Enemies/Worm.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.font="50px Impact";
const timeInterval=1000;
let EnemyAs = [];



setInterval(()=>{
  EnemyAs.push(new Ghost( ctx,Math.random(),Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0.3,puppy));
  EnemyAs.push(new EnemyA(ctx,Math.random(),Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0.3,puppy));
},1200)
setInterval(()=>{
  EnemyAs.push(new EnemyD(ctx,Math.random(),Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0.3,puppy));
  EnemyAs.push(new Worm(ctx,Math.random(),Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,2,puppy));
},5000)
setInterval(()=>{
  EnemyAs.push(new EnemyB(ctx,Math.random(),Math.random()*CANVAS_WIDTH,Math.random()*CANVAS_HEIGHT,0.3,puppy));
},400)

let bgs = getBgs(ctx);

let booms= [];
//pooling design pattern
for(let i=0;i<50;i++){
  booms.push({isActive:false,explosion:new Explosion(ctx,0.2,0,0,0.2)})
}

let score=0;
let passed=0,lastTime=0;
function animate(timeStamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgs.forEach((bg) => {
    bg.puppySpeed = puppy.vx;
    bg.update();
    bg.draw();
  });
  let deltaTime=timeStamp-lastTime;
  lastTime=timeStamp;
  passed+=deltaTime
  EnemyAs.forEach((enemy) => {
    enemy.animate();
  });
  booms.forEach((boom) => {
    boom.isActive && boom.explosion.animate();
  });

  ctx.fillStyle = "black";

  ctx.fillText("Score: "+score, 8, 48);
  ctx.fillStyle = "white";
  ctx.fillText("Score: "+score, 10, 50);
  if(passed>timeInterval){
    EnemyAs=EnemyAs.filter((enemy) => !enemy.outOfScreen)
  }
  puppy.animate();
  
  requestAnimationFrame(animate);
}
animate(0);

//Collision

document.addEventListener("collision", function (e) {
  let en = e.detail.whoami;
  if (en && puppy.state == "roll") {
    let ex = booms[booms.findIndex((el) => !el.isActive)];
    ex.explosion.setPosition(en.px, en.py);
    ex.explosion.setScale(en.physicalWidth*1.2/ex.explosion.sequence.frameWidth );
    ex.isActive = true;
    score+=en.options.score;
    EnemyAs = EnemyAs.filter((el) => el != en);
    delete e.detail.whoami;
    setTimeout(() => {
      ex.isActive=false;
    }, 350);
  }
});
