export class InputHandler {
  constructor() {
    this.lastKey = null;
    this.isPress = undefined;
    this.activeKeys = new Set();
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
