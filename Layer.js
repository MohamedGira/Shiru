import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";
 
 class Layer {
    constructor(img, speed,canvas) {
      this.img = img;
      this.speed = speed;
      this.ctx=canvas;
      this.position = 0;
      this.puppySpeed = 1;
    }
    draw() {
      this.ctx.drawImage(this.img, this.position, 0, 2400, CANVAS_HEIGHT);
      if (Math.abs(this.position) > 2400 - CANVAS_WIDTH) {
        this.ctx.drawImage(this.img, this.position + 2400, 0, 2400, CANVAS_HEIGHT);
      }
    }
  
    update() {
      if (Math.abs(this.position) > 2400) this.position = 0;
      this.position -= Math.max(1, this.speed + this.puppySpeed * 0.2);
    }
  }

  export const getBgs=function initializeBackgroundArray(canvas) {
    let bgs = [];
    for (let i = 1; i <= 5; i++) {
      let aa = new Image();
      aa.src = `assets/layer-${i}.png`;
      bgs.push(new Layer(aa, i,canvas));
    }
    return bgs;
  }

  