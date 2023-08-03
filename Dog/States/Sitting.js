import { State, states } from "./State.js";

export class Sitting extends State {
  constructor(player, sequence) {
    super(
      "SITTING",
      sequence || State.generateSequence(states.SITTING, 5),
      player
    );
  }
  enter() {
    super.enter();
    this.player.vx = 0;
  }

  handleInput() {
    super.handleInput();
  }
}
