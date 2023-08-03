import { PlayerSpeed } from "../Dog.js";
import { State, states } from "./State.js";

export class Running extends State {
  constructor(player, sequence) {
    super(
      "RUNNING",
      sequence || State.generateSequence(states.RUNNING, 9),
      player
    );
    this.animationSpeed = this.player.animationSpeed;
  }
  enter() {
    super.enter();
  }

  handleInput(lastKey, isPress = false) {
    if (isPress)
      switch (lastKey) {
        case "left":
          this.player.animationSpeed = this.animationSpeed * 0.8;
          !this.player.isoutOfScreen() &&
            this.player.setVelocityX(-PlayerSpeed);
          break;
        case "right":
          this.player.animationSpeed = this.animationSpeed * 1.2;
          !this.player.isoutOfScreen() && this.player.setVelocityX(PlayerSpeed);
          break;
        case "up":
          this.player.setState(states.JUMPING);
          break;
        case "down":
          this.player.setState(states.DASHING);
        case "roll":
          this.player.setState(states.ROLLING);
          break;
        case "dash":
          this.player.setState(states.DASHING);
      }
    else {
      this.player.setVelocityX(0);
      this.player.animationSpeed = this.animationSpeed;
      //this.player.setState(states.STANDING);
    }
    super.handleInput();
  }
}
