import { State, states } from "./State.js";

export class Falling extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.FALLING, 7),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput() {}
}
