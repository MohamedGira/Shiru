import { State, states } from "./State.js";

export class Jumping extends State {
  constructor(player,sequence) {
    super(
      "JUMPING",
      sequence || State.generateSequence(states.JUMPING, 7),
      player
    );
  }
  enter() {super.enter()}

  handleInput() {}
}
