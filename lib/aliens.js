(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  function randomColor() {
    var hexDigits = "0123456789ABCDEF";

    var color = "#";
    for (var i = 0; i < 3; i ++) {
      color += hexDigits[Math.floor((Math.random() * 16))];
    }

    return color;
  }


  var Alien = Asteroids.Alien = function (options) {
    this.game = options.game;
    this.radius = Alien.RADIUS;
    this.vel = options.vel || [0, 0];
    this.color = options.color || Alien.COLOR;
    this.pos = Asteroids.Util.spawnLocation(this.game);
    this.ship = options.ship;
    this.timerId = setInterval(function(){
      this.fireBullet();
    }.bind(this), 2000);
    this.soundId = setInterval(function(){
      this.game.playSoundEffect("sound/saucerBig.wav");
    }.bind(this), 200);
  };
  Alien.RADIUS = 32;
  Alien.COLOR = randomColor();

  Asteroids.Util.inherits(Alien, Asteroids.MovingObject);

  Alien.prototype.fireBullet = function () {
    var norm = Asteroids.Util.norm(this.vel);

    if (norm == 0) {
      // Can't fire unless moving.
      return;
    }

    var relVel = Asteroids.Util.scale(
      Asteroids.Util.dir(this.vel),
      Asteroids.Bullet.SPEED / 2
    );

    var bulletVel = [
      relVel[0] + this.vel[0], relVel[1] + this.vel[1]
    ];

    var bullet = new Asteroids.Bullet({
      pos: this.pos,
      vel: bulletVel,
      radius: 6,
      color: this.color,
      game: this.game,
      owner: this
    });


      this.game.add(bullet);
    };

  Alien.prototype.waffleAround = function(){
    // var SHIFT = [[0,-4], [0,4], [4,0], [-4,0], [4,4], [-4,4], [4,-4], [-4,-4]];
    var chasePlayer = [this.ship.pos[0] - this.pos[0], this.ship.pos[1] - this.pos[1]];
    var vector = Asteroids.Util.dir(chasePlayer);
    this.vel = [vector[0]*2, vector[1]*2];
  };

  Alien.prototype.draw = function(ctx){
    this.waffleAround();
    Asteroids.MovingObject.prototype.draw.call(this, ctx);
  };

  Alien.prototype.remove = function(){
    clearInterval(this.timerId);
    clearInterval(this.soundId);
    this.game.remove(this);
  };

  Asteroids.Alien.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Ship) {
      otherObject.relocate();
    }
  };
})();
