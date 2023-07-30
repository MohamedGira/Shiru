import {getSequence } from "../utils/getSequence.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";
import { Enemy } from "./Enemy.js";

export class Ghost extends Enemy {
    static sequence=getSequence('../assets/enemies/enemy3.png',218,177,6,0);
    constructor(
      canvas,
      animationSpeed,
      renderAtX,
      renderAtY,
      scale,
      foe
    ) {
      super(canvas, Ghost.sequence, animationSpeed, renderAtX, renderAtY, scale, foe);
      this.angle = 0;
      this.offsetX = (CANVAS_WIDTH - this.sequence.frameWidth) / 2;
      this.offsetY = (CANVAS_HEIGHT - this.sequence.frameHeight) / 2;
      this.anglex = Math.random();
      this.angley = Math.random();
      this.anglexSpeed = Math.random() * 2;
    }
    update() {
      this.anglex += this.anglexSpeed;
      this.angley += this.anglexSpeed;
      this.setpositionX(
        ((CANVAS_WIDTH - this.sequence.frameWidth) / 2) *
          Math.sin((this.anglex * Math.PI) / 90) +
          this.offsetX
      );
      this.setpositionY(
        ((CANVAS_HEIGHT - this.sequence.frameHeight) / 2) *
          Math.cos((this.angley * Math.PI) / 180) +
          this.offsetY
      );
      super.update();
    }

  }