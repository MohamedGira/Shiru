import { puppy } from "./dog.js";
import { EnemyA, EnemyB, EnemyC, EnemyD } from "./Enemy.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
import { getBgs } from "./Layer.js";
import { Explosion } from "./Explosion.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let EnemyAs = [];
setInterval(() => {
  for (let i = 0; i < 1; i++) {
    EnemyAs.push(EnemyB.createEnemy(ctx, puppy));
    EnemyAs.push(EnemyA.createEnemy(ctx, puppy));
    EnemyAs.push(EnemyC.createEnemy(ctx, puppy));
    EnemyAs.push(EnemyD.createEnemy(ctx, puppy));
  }
}, 1000);

let bgs = getBgs(ctx);

let booms= [];
//pooling design pattern
for(let i=0;i<50;i++){
  booms.push({isActive:false,explosion:new Explosion(ctx,0.2,0,0,0.2)})
}
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgs.forEach((bg) => {
    bg.puppySpeed = puppy.vx;
    bg.update();
    bg.draw();
  });

  EnemyAs.forEach((enemy) => {
    enemy.animate();
  });
  booms.forEach((boom) => {
    boom.isActive && boom.explosion.animate();
  })
  puppy.animate();

  requestAnimationFrame(animate);
}
animate();

//Collision

document.addEventListener("collision", function (e) {
  let en = e.detail.whoami;
  if (en && puppy.state == "roll") {
    let ex = booms[booms.findIndex((el) => !el.isActive)];
    ex.explosion.setPosition(en.px, en.py);
    ex.explosion.setScale(en.scale*1.5);
    ex.isActive = true;
    EnemyAs = EnemyAs.filter((el) => el != en);
    delete e.detail.whoami;
    setTimeout(() => {
      ex.isActive=false;
    }, 350);
  }
});
