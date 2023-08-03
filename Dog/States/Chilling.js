import { State, states } from "./State.js";

export class Chilling extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.CHILLING, 4),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput() {    super.handleInput();
  }
}
