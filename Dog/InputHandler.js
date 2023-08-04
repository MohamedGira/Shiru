export class InputHandler {
  constructor() {
    this.lastKey = null;
    this.isPress = undefined;
    this.activeKeys = new Set();
    this.touchStart = null;
    this.touchCurrent = null;
    this.touchY = 0;
    this.touchThreshold = 30;
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
      this.touchStart = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    });
    window.addEventListener("touchmove", (event) => {
    
      
      this.handleSwipe(
        "up",
        this.touchStart.y - event.changedTouches[0].clientY > this.touchThreshold
      );
      this.handleSwipe(
        "right",
        event.changedTouches[0].clientX - this.touchStart.x > this.touchThreshold
      );

      this.handleSwipe(
        "left",
        this.touchStart.x - event.changedTouches[0].clientX > this.touchThreshold
      );

      this.touchCurrent = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
      console.log(this.activeKeys)
    });
    window.addEventListener("touchend", (event) => {
      this.touchStart = null;
      this.touchCurrent = null;
      this.handleSwipe("up", this.touchCurrent);
      this.handleSwipe("right", this.touchCurrent);
      this.handleSwipe("left", this.touchCurrent);
    });
  }
  handleSwipe(movename, condition) {
    if (condition) {
      this.lastKey = movename;
      this.activeKeys.add(this.lastKey);
      this.isPress = true;
    } else {
      this.activeKeys.delete(movename);
      this.lastKey = this.activeKeys.values().next().value;
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
