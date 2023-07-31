import { State, states } from "./State.js";

export class Dying extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.DYING, 12),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput() {}
}
