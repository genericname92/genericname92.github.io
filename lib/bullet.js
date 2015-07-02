(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function (options) {
    options.radius = options.radius || Bullet.RADIUS;
    this.owner = options.owner;
    Asteroids.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 2;
  Bullet.SPEED = 15;

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  Bullet.prototype.collideWith = function (otherObject) {
    if (this.owner instanceof Asteroids.Ship){
      if (otherObject instanceof Asteroids.Asteroid || otherObject instanceof Asteroids.Alien) {
        this.remove();
        otherObject.remove();
      }
    } else if (this.owner instanceof Asteroids.Alien){
      if (otherObject instanceof Asteroids.Ship){
        this.remove();
        otherObject.relocate();
        console.log("ship hit!");

      }
    }



  };

  Bullet.prototype.isWrappable = false;
})();
