/** @type {HTMLCanvasElement} **/
import { Dust } from "./particle.js";
import { GroundEnemy } from "./enemies.js";
import { ColisionAnimation } from "./colision.js";
import {
  StandingLeft,
  StandingRight,
  SittingLeft,
  SittingRight,
  RunningLeft,
  RunningRight,
  JumpingLeft,
  JumpingRight,
  FallingLeft,
  FallingRight,
  Rolling,
  Diving,
} from "./state.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.gameWidth = game.width;
    this.gameHeight = game.height;
    this.groundMargin = game.groundMargin;

    //States from state pattern stored in an array, and we pick between those
    //Each state is an object ne vete, at state.js

    //Make sure that the order is right njejt with Enums on state.js
    this.states = [
      new StandingLeft(this.game),
      new StandingRight(this.game),
      new SittingLeft(this.game),
      new SittingRight(this.game),
      new RunningLeft(this.game),
      new RunningRight(this.game),
      new JumpingLeft(this.game),
      new JumpingRight(this.game),
      new FallingLeft(this.game),
      new FallingRight(this.game),
      new Rolling(this.game),
      new Diving(this.game),
    ];
    this.currentState = this.states[1];
    this.img = document.getElementById("dogImage");

    //the sprite dimensions from the image. We move via these values
    this.width = 200;
    this.height = 181.83;

    //Drawing current sprite on canvas
    this.x = this.gameWidth / 2 - this.width / 2;
    this.y = this.gameHeight - this.height - this.groundMargin;

    this.vy = 0;
    this.gravity = 0.5;
    //Frame numbers for sprites on image
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
    this.frameSpeed = 5;

    this.speed = 0;
    this.maxSpeed = 5;

    this.fps = 10;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;

    this.health = 5;
  }

  draw(ctx, deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
        this.frameTimer = 0;
      }
    } else {
      this.frameTimer += deltaTime;
    }

    if (this.game.debug) {
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(
      this.img,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  //this input from eventListeners is passed down here, and then its passed down to currentState
  //method, which there it will handle and check depending on state (the true essence of state pattern)
  update(input) {
    this.checkCollision();

    this.currentState.handleInput(input);
    this.x += this.speed;

    if (this.x <= 0) {
      this.x = 0;
    } else if (this.x >= this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width;
    }

    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.gravity;
    } else {
      this.vy = 0;
    }

    //to not fall on the floor

    if (this.y > this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
    }
  }
  setState(state, gameSpeed) {
    this.currentState = this.states[state];
    this.currentState.enter();
    this.game.speed = this.game.maxSpeed * gameSpeed;
  }

  onGround() {
    return this.y >= this.gameHeight - this.height - this.groundMargin;
  }

  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        if (
          this.currentState.state === "ROLLING" ||
          this.currentState.state === "DIVING"
        ) {
          enemy.markedForDeletion = true;
          this.game.colisions.push(
            new ColisionAnimation(
              this.game,
              enemy.x + enemy.width * 0.5,
              enemy.y + enemy.height * 0.5
            )
          );

          console.log(this.game.colisions);
          this.game.score += enemy.points;
        } else {
          this.health -= 1;
          enemy.markedForDeletion = true;
          this.game.score += enemy.points;
          this.game.colisions.push(
            new ColisionAnimation(
              this.game,
              enemy.x + enemy.width * 0.5,
              enemy.y + enemy.height * 0.5
            )
          );

          //Implement gameover, popup to restart
          if (this.health <= 0) {
          }
        }
      }
    });
  }
}
