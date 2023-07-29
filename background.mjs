const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);

function initializeBackgroundArray() {
  let bgs = [];
  for (let i = 1; i <= 5; i++) {
    let aa = new Image();
    aa.src = `assets/layer-${i}.png`;
    bgs.push({ img: aa, position: 0 ,position2:0});
  }
  return bgs;
}

let bgs = initializeBackgroundArray();
bgs[0].speed = 1;
bgs[1].speed = 2;
bgs[2].speed = 3;
bgs[3].speed = 4;
bgs[4].speed = 5;

let x = 0;
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  x++;
  //for each image, display it, if the image ended , its position (bgs[i].speed*x) will be 2400-WIDTH, in this case, draw it again
  // if so,
  for (let i in bgs) {
    ctx.drawImage(
      bgs[i].img,
      (bgs[i].position += bgs[i].speed),
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );
    if (bgs[i].position > 2400 - CANVAS_WIDTH)
      {
        bgs[i].position2-=bgs[i].speed
        
        ctx.drawImage(
          bgs[i].img,
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          CANVAS_WIDTH+bgs[i].position2,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
      }
    if (bgs[i].position > 2400) bgs[i].position =bgs[i].position2= 0;
  }

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("keydown", function (event) {
  move = movesArr.filter((e) => e.key.includes(event.key))[0].name;
});
