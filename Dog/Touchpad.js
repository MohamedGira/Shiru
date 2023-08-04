import Drawable from "../Drawable.js";
import { getSequence } from "../utils/getSequence.js";

export class TouchPad {
  constructor(
    canvasContext,
    outerRadius,
    innerRadius,
    px,
    py,
    innerpx,
    innerpy
  ) {
    this.ctx = canvasContext;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.midRadus = innerRadius * 2;
    this.px = px;
    this.py = py;
    this.innerpx = innerpx;
    this.innerpy = innerpy;
  }
  setInnerPos(px, py) {
    this.innerpx = px;
    this.innerpy = py;
  }

  handleInnerPos(mappedX, mappedY) {
    let r = Math.sqrt((mappedX - this.px) ** 2 + (mappedY - this.py) ** 2);
    if (r < this.midRadus) {
      this.innerpx = mappedX;
      this.innerpy = mappedY;
    }
    else{
        this.innerpx=this.px+Math.cos(Math.atan2(mappedY-this.py,mappedX-this.px))*this.midRadus;
        this.innerpy=this.py+Math.sin(Math.atan2(mappedY-this.py,mappedX-this.px))*this.midRadus;
    }
  }
  resetInnerPos() {
    this.innerpx = this.px;
    this.innerpy = this.py;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.px, this.py, this.outerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(0,0,0,.2)";
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.px, this.py, this.midRadus, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(0,0,0,.2)";
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.innerpx, this.innerpy, this.innerRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.fill();
  }
}

export class button extends Drawable{
    constructor(canvasContext,animationSpeed,renderAtX,renderAtY,options={scale:1}){
        super(canvasContext,getSequence("rollBtn",189,190,1,0),animationSpeed,renderAtX,renderAtY,options?.scale);
    }
}