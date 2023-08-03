import { State, states } from "./State.js";

export class Dazed extends State {
  constructor(player,sequence) {
    super(
      "FALLING",
      sequence || State.generateSequence(states.DAZED, 11),
      player
    );
  }
  enter() {
    super.enter();
  }

  handleInput() {}
}
