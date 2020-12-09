const Vector = function (x = 0, y = 0) {
  this.x = x;
  this.y = y;
  // this.normalize();
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;
}

Vector.prototype.mult = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
}

Vector.prototype.dot = function(other) {
  
  let a = this.x * other.x
  let b = this.y * other.y;
  
  return a + b
  
}

Vector.prototype.magnitude = function() {
  return Math.round(Math.abs(Math.sqrt((this.x * this.x) + (this.y * this.y))));
}

Vector.prototype.normalize = function() {
  this.mult(1/this.magnitude())
}