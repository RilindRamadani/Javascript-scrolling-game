/** @type {HTMLCanvasElement} **/
//Main script we are using, mujna tani me punu via imports and exports ktu.
//P.sh 4 other scripts nderlidhen me njona tjetren, tani veq vin ktu kejt bundled

import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { drawStatustext } from "./utils.js";
import { Background } from "./background.js";
import { FlyingClass, GroundEnemy, ClimbingEnemy } from "./enemies.js";
//
window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  loading.style.display = "none";
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 700;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 110;
      this.speed = 1;
      this.maxSpeed = 4;
      this.Background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = true;
      this.score = 0;
      this.particles = [];
      this.colisions = [];
    }

    update(deltaTime) {
      this.Background.update();
      this.player.update(this.input);

      //handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion) {
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
        }
      });

      //handle particles
      this.particles.forEach((partile, index) => {
        partile.update();
        if (partile.markedForDeletion) {
          this.particles.splice(index, 1);
        }
      });

      //handle colisions

      this.colisions.forEach((colision, index) => {
        colision.update(deltaTime);
        if (colision.markedForDeletion) {
          this.colisions.splice(index, 1);
        }
      });
    }
    draw(context, deltaTime) {
      console.log(this.colisions);

      this.Background.draw(context);
      this.player.draw(ctx, deltaTime);

      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });

      this.particles.forEach((partile, index) => {
        partile.draw(context);
      });

      this.colisions.forEach((colision, index) => {
        colision.draw(context);
      });
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingClass(this));
    }
  }

  //const player = new Player(canvas.width, canvas.height);

  const game = new Game(canvas.width, canvas.height);

  //const input = new InputHandler();
  //This does not work unless we bind it.
  //Tek qe that "lastKey" osht e definume te the class, and its an eventListeners, we have to bind
  // in order me keep track of what we are talking about

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx, deltaTime);
    drawStatustext(ctx, game, game.player);
    requestAnimationFrame(animate);
  }

  animate(0);
});
