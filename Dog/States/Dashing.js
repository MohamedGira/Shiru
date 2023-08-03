import { State, states } from "./State.js";

export class Dashing extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.DASHING, 7),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput() {
    super.handleInput();
  }
}
