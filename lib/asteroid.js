(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (options) {
    options.color = options.color || Asteroid.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.radius = options.radius || Asteroid.RADIUS;
    options.vel = options.vel || Asteroids.Util.randomVec(Asteroid.SPEED);
    Asteroids.MovingObject.call(this, options);
  };

  Asteroid.COLOR = "#505050";
  Asteroid.RADIUS = 50;
  Asteroid.SPEED = 3;

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);


  Asteroids.Asteroid.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Ship) {
      otherObject.relocate();
    }
  };

  Asteroids.Asteroid.prototype.split = function(){
    if (this.radius < Asteroid.RADIUS / 2){
      return null;
    }
    return [
      new Asteroid({ radius: this.radius * 2/3, pos: this.pos, game: this.game }),
      new Asteroid({ radius: this.radius * 2/3, pos: this.pos, game: this.game })
    ];
  };
})();
