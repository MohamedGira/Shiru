import { State, states } from "./State.js";

export class Dazed extends State {
  constructor(player,sequence) {
    super(
      "DAZED",
      sequence || State.generateSequence(states.DAZED, 11),
      player
    );
  }
  enter() {
    this.player.vx=0;
    this.player.vy=-this.player.vy;
    setTimeout(() => {
      this.player.setState(states.RUNNING)
    }, 2000);
    super.enter();
  }

  handleInput() {}
}
