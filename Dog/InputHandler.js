import { TouchPad2 } from "../Touchpad2.mjs";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";
import { TouchPad, button } from "./Touchpad.js";

const gamePlayer = document.getElementById("gamePlayer");
const controlButtons = document.getElementById("controlButtons");

export class InputHandler {
  constructor(canvas) {
    this.lastKey = null;
    this.isPress = undefined;
    this.activeKeys = new Set();
    this.touchStart = null;
    this.touchCurrent = null;
    this.touchThresholdY = .5;
    this.touchThresholdX = .05;

    this.touchpad2 = new TouchPad2(gamePlayer, canvas, controlButtons);

    this.touchpad2.addButton(
      document.getElementById("rollBtn"),
      20,
      30,
      () => {
        this.handleSwipe("roll", true);
        setTimeout(() => {
          this.handleSwipe("roll", false);
        }, 300);
      },
      { width: 70 }
    );
    this.acceptedKeys = [
      "KeyW",
      "ArrowUp",
      "Space",
      "KeyS",
      "ArrowDown",
      "KeyA",
      "ArrowLeft",
      "KeyD",
      "ArrowRight",
      "ShiftRight",
      "ShiftLeft",
      "KeyR",
    ];
    window.addEventListener("keydown", (event) => {
      if (this.acceptedKeys.includes(event.code)) {
        this.whatKey(event);
        this.activeKeys.add(this.lastKey);
        this.isPress = true;
      }
    });
    window.addEventListener("keyup", (event) => {
      if (this.acceptedKeys.includes(event.code)) {
        this.whatKey(event);
        this.activeKeys.delete(this.lastKey);
        this.lastKey = this.activeKeys.values().next().value;
        if (!this.lastKey) {
          this.whatKey(event);
          this.isPress = false;
        }
      }
    });
    
  }

  handleController(){
      this.handleSwipe(
        "up",
        -this.touchpad2.controller.deltaYPercent > this.touchThresholdY
      );
      this.handleSwipe(
        "right",
        this.touchpad2.controller.deltaXPercent > this.touchThresholdX
      );
      this.handleSwipe(
        "left",
        -this.touchpad2.controller.deltaXPercent > this.touchThresholdX
      );
      this.handleSwipe(
        "down",
        this.touchpad2.controller.deltaYPercent > this.touchThresholdY
      );
      this.lastKey = getLastValue(this.activeKeys);
  }

  handleSwipe(movename, condition) {
    if (condition && !this.activeKeys.has(movename)) {
      this.lastKey = movename;
      this.activeKeys.add(this.lastKey);
      this.isPress = true;
      return;
    }
    if (!condition) {
      this.activeKeys.delete(movename);
      this.lastKey = getLastValue(this.activeKeys);
      if (!this.lastKey) {
        this.isPress = false;
      }
    }
  }
  whatKey(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
      case "Space":
        this.lastKey = "up";
        break;
      case "ArrowDown":
      case "KeyS":
        this.lastKey = "down";
        break;
      case "ArrowLeft":
      case "KeyA":
        this.lastKey = "left";
        break;
      case "ArrowRight":
      case "KeyD":
        this.lastKey = "right";
        break;
      case "ShiftRight":
      case "ShiftLeft":
      case "KeyR":
        this.lastKey = "roll";
        break;
      case "KeyE":
        this.lastKey = "dash";
        break;
    }
  }
}
function getLastValue(set) {
  let value;
  for (value of set);
  return value;
}

