import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/globals.js";
import { TouchPad } from "./Touchpad.js";

export class InputHandler {
  constructor(canvas) {
    this.lastKey = null;
    this.isPress = undefined;
    this.activeKeys = new Set();
    this.touchStart = null;
    this.touchCurrent = null;
    this.touchY = 0;
    this.touchThreshold = 30;
    this.deltaX = 0;
    this.touchpad = new TouchPad(
      canvas.getContext("2d"),
      100,
      30,
      canvas.width - 120,
      canvas.height - 120,
      canvas.width - 120,
      canvas.height - 120
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
    window.addEventListener("touchstart", (event) => {
      if (
        event.changedTouches[event.changedTouches.length - 1].clientX <
          window.innerWidth * (250 / CANVAS_WIDTH) &&
        event.changedTouches[event.changedTouches.length - 1].clientY >
          window.innerHeight * (1 - 250 / CANVAS_HEIGHT)
      ) {
        this.handleSwipe("roll", true);
      }
      let touchStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      let { deltaWidth, deltaHeight, rectangleWidth, rectangleHeight } =
        getCanvasCoordinates();
      if (
        touchStart.x > deltaWidth + rectangleWidth * (1 - 330 / CANVAS_WIDTH) &&
        touchStart.y > deltaHeight + rectangleHeight * (1 - 330 / CANVAS_HEIGHT)
      ) {
        this.touchStart = touchStart;
      }
    });
    window.addEventListener("touchmove", (event) => {
      if (this.touchStart) {
        this.touchCurrent = {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY,
        };
        this.handleSwipe(
          "up",
          this.touchStart.y - event.changedTouches[0].clientY >
            this.touchThreshold
        );
        this.handleSwipe(
          "right",
          event.changedTouches[0].clientX - this.touchStart.x > 5
        );
        this.handleSwipe(
          "left",
          this.touchStart.x - event.changedTouches[0].clientX > 5
        );
        this.handleSwipe(
          "down",
          event.changedTouches[0].clientY - this.touchStart.y >
            this.touchThreshold
        );
        this.lastKey = getLastValue(this.activeKeys);
      }
    });
    window.addEventListener("touchend", (event) => {
      if (!event.touches.length) {
        this.touchStart = null;
        this.touchCurrent = null;
        this.activeKeys.clear();
        this.isPress = false;
      }
      this.handleSwipe("roll", false);
    });
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

  handleTouchPad(){
    const { rectangleWidth, rectangleHeight, deltaHeight, deltaWidth } =getCanvasCoordinates();
    this.touchCurrent
      ? this.touchpad.handleInnerPos(
          ((this.touchCurrent.x - deltaWidth) / rectangleWidth) *
            CANVAS_WIDTH,
          ((this.touchCurrent.y - deltaHeight) / rectangleHeight) *
            CANVAS_HEIGHT
        )
      : this.touchpad.resetInnerPos();
  }
}
function getLastValue(set) {
  let value;
  for (value of set);
  return value;
}

export function getCanvasCoordinates() {
  // Given data
  const rectangleAspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT; // Replace with your desired rectangle's aspect ratio
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenAspectRatio = screenWidth / screenHeight;
  let canvasStartX, canvasStartY, deltaHeight, deltaWidth;
  // Calculate the dimensions of the rectangle to fit within the screen's boundaries
  let rectangleWidth, rectangleHeight;
  if (screenAspectRatio > rectangleAspectRatio) {
    // Screen is wider than the rectangle
    rectangleHeight = screenHeight;
    rectangleWidth = screenHeight * rectangleAspectRatio;
    canvasStartX = deltaWidth = (screenWidth - rectangleWidth) / 2;
    canvasStartY = 0;
    deltaHeight = 0;
  } else {
    // Screen is taller than the rectangle
    rectangleWidth = screenWidth;
    rectangleHeight = screenWidth / rectangleAspectRatio;
    canvasStartX = deltaWidth = 0;
    deltaHeight = canvasStartY = (screenHeight - rectangleHeight) / 2;
  }

  // Calculate the bottom left corner position
  const bottomRightX = rectangleWidth;
  const bottomRightY = screenHeight * (1 - rectangleHeight / 2);

  return {
    bottomRightX,
    bottomRightY,
    rectangleWidth,
    rectangleHeight,
    canvasStartX,
    canvasStartY,
    deltaHeight,
    deltaWidth,
  };
}
