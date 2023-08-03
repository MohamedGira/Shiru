import { State, states } from "./State.js";

const firesounds = [
  new Audio("../../assets/sounds/fire.mp3"),
  new Audio("../../assets/sounds/fire2.mp3"),
  new Audio("../../assets/sounds/fire4.mp3"),
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
      a.volume=0.1;
    this.player.currentStateIndex == states.ROLLING && a.play();
   setTimeout(() => {
      this.player.setState(states.FALLING);
    }, 500);
  }

  handleInput(lastKey, isPress) {
    if (!isPress && lastKey == "roll") {
      this.player.setState(states.FALLING);
    }
    super.handleInput();
  }
}
