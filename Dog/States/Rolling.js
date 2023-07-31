import { State, states } from "./State.js";

export class Rolling extends State {
  constructor(player,sequence) {
    super(
      "ROLLING",
      sequence || State.generateSequence(states.ROLLING, 7),
      player
    );
  }
  enter() {super.enter()}

  handleInput() {}
}
