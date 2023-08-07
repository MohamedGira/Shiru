import { Button } from "./Button.mjs";
import { Contoller } from "./controller.mjs";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/globals.js";



export class TouchPad2 {
  constructor(gamePlayer, canvas, controlButtons) {
    this.gamePlayer = gamePlayer;
    this.canvas = canvas;
    this.controlButtons = controlButtons;
    this.controller= new Contoller();
    this.controlButtons.appendChild(this.controller.element);
    this.buttons = [];
    this.controlButtons.style.display = "none";
    document.addEventListener("fullscreenchange", () => {
      this.controlButtons.style.display = document.fullscreenElement ? "block" : "none";
      this.adjustTouchpadOverlay(this.canvas);
    });
    window.addEventListener("resize", () => {
      this.adjustTouchpadOverlay(this.canvas);
      this.updateHtml(this.canvas.getBoundingClientRect().width);
    });
  }
  addButton(img, bottom, right, onClick, options = { canvasWidthPercent: 5 }) {
    this.buttons.push(new Button(img, bottom, right, onClick, options));
    this.controlButtons.appendChild(this.buttons[this.buttons.length-1].element);
  }
  updateHtml(canvasWidth){
    this.buttons.forEach(button=>{
      button.updateHtml(canvasWidth);
    })
    this.controller.updateHtml(canvasWidth);
  }
  adjustTouchpadOverlay(canvas) {
    this.controlButtons.style.width = `${this.canvas.getBoundingClientRect().width}px`;
    this.controlButtons.style.height = `${this.canvas.getBoundingClientRect().height}px`;
    this.controlButtons.style.left = `${this.canvas.getBoundingClientRect().left}px`;
    this.controlButtons.style.top = `${this.canvas.getBoundingClientRect().top}px`;
  }
  
}




