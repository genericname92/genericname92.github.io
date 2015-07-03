(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function () {
    this.lifeCounter = 5; //num of lives
    this.score = 0;
    this.DIM_X = 1000;
    this.DIM_Y = 600;
    this.asteroids = [];
    this.bullets = [];
    this.ships = [];
    this.aliens = [];
    this.sound = true;
    this.addAsteroids();

    this.alienTimer = setInterval(
      function(){
        if (this.aliens.length < Game.MAX_ALIENS){
          this.add(new Asteroids.Alien({game: this, ship: this.ships[0]}));
        }
      }.bind(this), 13000
    );
    this.updateGameStatus();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 1000;
  Game.DIM_Y = 600;
  Game.FPS = 32;
  Game.NUM_ASTEROIDS = 7;
  Game.MAX_ALIENS = 3;

  Game.prototype.add = function (object) {
    if (object instanceof Asteroids.Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Asteroids.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Asteroids.Ship) {
      this.ships.push(object);
    } else if (object instanceof Asteroids.Alien){
      this.aliens.push(object);
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      this.add(new Asteroids.Asteroid({ game: this }));
    }
  };

  Game.prototype.addShip = function () {
    var ship = new Asteroids.Ship({
      pos: this.randomPosition(),
      game: this
    });

    this.add(ship);

    return ship;
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.ships, this.asteroids, this.bullets, this.aliens);
  };

  Game.prototype.checkCollisions = function () {
    var game = this;

    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 == obj2) {
          // don't allow self-collision
          return;
        }

        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (object) {
      object.move();
    });
  };

  Game.prototype.randomPosition = function () {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  };

  Game.prototype.remove = function (object) {
    if (object instanceof Asteroids.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Asteroids.Asteroid) {
      var idx = this.asteroids.indexOf(object);
      var asteroid = this.asteroids.splice(idx, 1)[0];
      this.score += 200;
      var fragments = asteroid.split();
      if (fragments){
        this.asteroids.push(fragments[0]);
        this.asteroids.push(fragments[1]);
      }
      if (this.asteroids.length < Game.NUM_ASTEROIDS + 2){
        var newPos = Asteroids.Util.spawnLocation(this);
        var newAsteroid = new Asteroids.Asteroid({ game: this, pos: newPos });
        this.asteroids.push(newAsteroid);
      }
      this.updateGameStatus();
      this.playSoundEffect("sound/bangMedium.wav");
    } else if (object instanceof Asteroids.Ship) {
      this.playSoundEffect("sound/bangLarge.wav");
      this.updateGameStatus();
      this.ships.splice(this.ships.indexOf(object), 1);
    } else if (object instanceof Asteroids.Alien){
      this.aliens.splice(this.aliens.indexOf(object), 1);
      this.score += 350;
      this.playSoundEffect("sound/bangMedium.wav");
      this.updateGameStatus();
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
    this.checkListeners();
  };

  Game.prototype.wrap = function (pos) {
    return [
      wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
    ];

    function wrap(coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };

  Game.prototype.checkListeners = function(){
    if (this.lifeCounter === 0){
      return;
    }
    var ship = this.ships[0];
    var GameMoves = {
      "w": [ 0, -0.5],
      "a": [-0.5,  0],
      "s": [ 0,  0.5],
      "d": [ 0.5,  0],
    };
    Object.keys(GameMoves).forEach(function (k) {
      var move = GameMoves[k];
      if ( key.isPressed(k) ) {
        ship.power(move);
      }
    });
    if (key.isPressed("space")){
      ship.fireBullet();
    }
  };

  Game.prototype.updateGameStatus = function(){
    document.getElementById("game-status").innerHTML = "Current Life Count: " + this.lifeCounter + " Score: " + this.score;
  };

  Game.prototype.loseShipLife = function(){
    this.lifeCounter--;
    this.updateGameStatus();
  };

  Game.prototype.gameOver = function(){
    clearInterval(this.alienTimer);
  };

  Game.prototype.playSoundEffect = function(filename){
    if (this.sound){
      var snd = new Audio(filename); // buffers automatically when created
      snd.volume = 0.2;
      snd.play();
    }
  };

  Game.prototype.toggleSound = function(){
    if (this.sound){
      this.sound = false;
      document.getElementsByClassName("soundToggle")[0].innerHTML = "Sound OFF";
    } else {
      this.sound = true;
      document.getElementsByClassName("soundToggle")[0].innerHTML = "Sound ON";
    }
  }
})();
