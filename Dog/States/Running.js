import { State, states } from "./State.js";

export class Running extends State {
  constructor(player,sequence) {
    super(
      "RUNNING",
      sequence || State.generateSequence(states.RUNNING, 9),
      player
    );
  }
  enter() {super.enter()}

  handleInput() {}
}
