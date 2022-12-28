import { Dust, Fire, Splash } from "./particle.js";

//ENUMS for constants
export const states = {
  STANDING_LEFT: 0,
  STANDING_RIGHT: 1,
  SITTING_LEFT: 2,
  SITTING_RIGHT: 3,
  RUNNING_LEFT: 4,
  RUNNING_RIGHT: 5,
  JUMPING_LEFT: 6,
  JUMPING_RIGHT: 7,
  FALLING_LEFT: 8,
  FALLING_RIGHT: 9,
  ROLLING: 10,
  DIVING: 11,
};

const speeds = {
  STANDING: 0.2,
  SITTING: 0,
  RUNNING_RIGHT: 0.5,
  RUNNING_LEFT: 0.3,
  JUMPING_RIGHT: 0.8,
  JUMPING_LEFT: 0.5,
  FALLING_RIGHT: 0.5,
  FALLING_LEFT: 0.4,
  ROLLING: 1,
  DIVING: 0,
};
class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

//Each stateImplementation must extend the superClass, and its own behaviour
export class StandingLeft extends State {
  //Useful to change player properties on different states
  constructor(game) {
    super("STANDING LEFT", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 1;
    this.game.player.speed = 0;
  }

  //swapping on differentState, and to only some possibilities we set to(from jump cant jump again)
  handleInput(input) {
    if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.RUNNING_RIGHT, speeds.RUNNING_RIGHT);
    } else if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.RUNNING_LEFT, speeds.RUNNING_LEFT);
    } else if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.SITTING_LEFT, speeds.SITTING);
    } else if (input.lastKey === "PRESS up") {
      this.game.player.setState(states.JUMPING_LEFT, speeds.JUMPING_LEFT);
    }
  }
}

export class StandingRight extends State {
  constructor(game) {
    super("STANDING RIGHT", game);
  }

  enter() {
    this.game.player.maxFrame = 6;

    this.game.player.frameY = 0;
    this.game.player.speed = 0;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.RUNNING_LEFT, speeds.RUNNING_LEFT);
    } else if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.RUNNING_RIGHT, speeds.RUNNING_RIGHT);
    } else if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.SITTING_RIGHT, speeds.SITTING);
    } else if (input.lastKey === "PRESS up") {
      this.game.player.setState(states.JUMPING_RIGHT, speeds.JUMPING_RIGHT);
    }
  }
}

export class SittingLeft extends State {
  constructor(game) {
    super("SITTING LEFT", game);
  }

  enter() {
    this.game.player.maxFrame = 4;

    this.game.player.frameY = 9;
    this.game.player.speed = 0;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    } else if (input.lastKey === "RELEASE down") {
      this.game.player.setState(states.STANDING_LEFT, speeds.STANDING);
    }

    // if (input.lastKey === "PRESS right") {
    //   this.player.setState(states.STANDING_RIGHT);
    // } else if (input.lastKey === "PRESS left") {
    //   this.player.setState(states.STANDING_LEFT);
    // }
  }
}

export class SittingRight extends State {
  constructor(game) {
    super("SITTING RIGHT", game);
    this.player = player;
  }

  enter() {
    this.game.player.maxFrame = 4;
    this.game.player.frameY = 8;
    this.game.player.speed = 0;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.STANDING_LEFT, speeds.STANDING);
    } else if (input.lastKey === "RELEASE down") {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    }
  }
}

export class RunningRight extends State {
  constructor(game) {
    super("RUNNING right", game);
  }

  enter() {
    this.game.player.maxFrame = 8;
    this.game.player.frameY = 6;
    this.game.player.speed = this.game.player.maxSpeed;
  }

  handleInput(input) {
    this.game.particles.push(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.2,
        this.game.player.y + this.game.player.height * 0.8
      )
    );
    if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.RUNNING_RIGHT, speeds.RUNNING_RIGHT);
    } else if (input.lastKey === "RELEASE right") {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    } else if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.SITTING_RIGHT, speeds.SITTING);
    }
  }
}

export class RunningLeft extends State {
  constructor(game) {
    super("RUNNING left", game);
  }

  enter() {
    this.game.player.maxFrame = 8;
    this.game.player.frameY = 7;
    this.game.player.speed = -this.game.player.maxSpeed;
  }

  handleInput(input) {
    this.game.particles.push(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.8,
        this.game.player.y + this.game.player.height * 0.8
      )
    );
    if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.RUNNING_LEFT, speeds.RUNNING_LEFT);
    } else if (input.lastKey === "RELEASE left") {
      this.game.player.setState(states.STANDING_LEFT, speeds.STANDING);
    } else if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.SITTING_LEFT, speeds.SITTING);
    }
  }
}

export class JumpingLeft extends State {
  constructor(game) {
    super("JUMPING left", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 3;
    if (this.game.player.onGround()) {
      this.game.player.vy = -20;
    }

    this.game.player.speed = -this.game.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.JUMPING_RIGHT, speeds.JUMPING_RIGHT);
    } else if (this.game.player.vy > 0) {
      this.game.player.setState(states.FALLING_LEFT, speeds.FALLING_LEFT);
    }

    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    }
    if (input.lastKey === "PRESS control") {
      this.game.player.setState(states.ROLLING, speeds.ROLLING);
    }

    if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.DIVING, speeds.DIVING);
    }
  }
}

export class JumpingRight extends State {
  constructor(game) {
    super("JUMPING right", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 2;
    if (this.game.player.onGround()) {
      this.game.player.vy = -20;
    }
    this.game.player.speed = this.game.player.maxSpeed * 0.5;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.JUMPING_LEFT, speeds.JUMPING_LEFT);
    } else if (this.game.player.vy > 0) {
      this.game.player.setState(states.FALLING_RIGHT, speeds.FALLING_RIGHT);
    }

    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    }

    if (input.lastKey === "PRESS control") {
      this.game.player.setState(states.ROLLING, speeds.ROLLING);
    }

    if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.DIVING, speeds.DIVING);
    }
  }
}

export class FallingLeft extends State {
  constructor(game) {
    super("FALLING left", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 5;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS right") {
      this.game.player.setState(states.FALLING_RIGHT, speeds.FALLING_RIGHT);
    }

    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_LEFT, speeds.STANDING);
    }

    if (input.lastKey === "PRESS control") {
      this.game.player.setState(states.ROLLING, speeds.ROLLING);
    }
  }
}

export class FallingRight extends State {
  constructor(game) {
    super("FALLING right", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 4;
  }

  handleInput(input) {
    if (input.lastKey === "PRESS left") {
      this.game.player.setState(states.FALLING_LEFT, speeds.FALLING_LEFT);
    }

    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    }

    if (input.lastKey === "PRESS control") {
      this.game.player.setState(states.ROLLING, speeds.ROLLING);
    }

    if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.DIVING, speeds.DIVING);
    }
  }
}

export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 10;
  }

  handleInput(input) {
    this.game.particles.push(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.4,
        this.game.player.y + this.game.player.height * 0.2
      )
    );
    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
    }

    if (input.lastKey === "PRESS down") {
      this.game.player.setState(states.DIVING, speeds.DIVING);
    }
  }
}

export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  enter() {
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 10;
    this.game.player.vy = 10;
  }

  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.4,
        this.game.player.y + this.game.player.height * 0.2
      )
    );
    if (this.game.player.onGround()) {
      this.game.player.setState(states.STANDING_RIGHT, speeds.STANDING);
      for (let i = 0; i < 19; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.4,
            this.game.player.y + this.game.player.height * 0.4
          )
        );
      }
    }
  }
}
