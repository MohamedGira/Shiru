import { State, states } from "./State.js";

export class Standing extends State {
  constructor(player,sequence) {
    super(
      "STANDING",
      sequence || State.generateSequence(states.STANDING, 7),
      player
    );
  }
  enter() {super.enter()}

  handleInput() {}
}
