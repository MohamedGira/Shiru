import { State, states } from "./State.js";

const firesounds = [
  document.getElementById("fireSound"),
  document.getElementById("fire2Sound"),
  document.getElementById("fire4Sound"),
];
export class Rolling extends State {
  constructor(player, sequence) {
    super(
      "ROLLING",
      sequence || State.generateSequence(states.ROLLING, 7),
      player
    );
  }

  enter() {
    this.player.ax += Math.sign(this.player.vx) * 3;
    this.player.ay += Math.sign(this.player.vy) * 3;
    super.enter();

    let a =
      firesounds[Math.floor(Math.random() * firesounds.length)].cloneNode();
    a.volume = 0.1;
    this.player.currentStateIndex == states.ROLLING && a.play();
    setTimeout(() => {
      this.player.setState(states.FALLING);
    }, 500);
  }

  handleInput(lastKey, isPress) {
    if (!isPress && lastKey == "roll") {
      this.player.setState(states.FALLING);
    }
    if (isPress)
      switch (lastKey) {
        case "up":
          this.player.isGrounded&&this.player.jump();
          break;
      
      }
    super.handleInput();
  }
}
