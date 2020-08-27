const Shape = function () {
  // refactor
  this.angle = 0;
  this.matrix = new Matrix4();
  this.offset = 0;
  this.index = 0;
  this.mode = 0;
  this.x = 0;
  this.y = 0;
  // v array needs to update on transformations
  this.v = [];
  this.w = 0;
  this.h = 0;
  this.r = 0;
  this.d = 0;
  this.d = 0;
  this.cX = 0;
  this.cY = 0;
  this.d1 = 0;
  this.d2 = 0;
};

Shape.prototype.paint = function () {
  gl.uniformMatrix4fv(gl.getUniformLocation(gl.program, 'u_ModelMatrix'), false, this.matrix.elements);
  gl.uniformMatrix4fv(gl.getUniformLocation(gl.program, 'u_VpMatrix'), false, vpMatrix.elements);
  gl.drawArrays(this.mode, this.offset, this.v.length);
}

Shape.prototype.setIdentity = function () {
  this.matrix.setIdentity();
}
Shape.prototype.setTranslate = function (x, y) {
  this.matrix.setTranslate(convertX(x), convertY(y), 0);
}
Shape.prototype.setRotate = function (angle, x, y, z) {
  this.matrix.setRotate(angle, x, y, z);
}
Shape.prototype.setScale = function (x, y) {
  this.matrix.setScale(x, y, 1);
}
Shape.prototype.moveTo = function (x, y) {
  let dY = y - HEIGHT / 2;
  let dX = x - WIDTH / 2;
  this.matrix.translate(convertX(WIDTH + dX - this.x), convertY(HEIGHT + dY - this.y), 0);
}
Shape.prototype.translate = function (x, y) {
  this.matrix.translate(convertX(WIDTH / 2 + x), convertY(HEIGHT / 2 + y), 0);
}
Shape.prototype.rotate = function (angle, x, y, z) {
  this.matrix.rotate(angle,x,y,z);
}
Shape.prototype.rotateZ = function (angle, origin) {
  if (origin)
    this.translate(this.x - WIDTH / 2, this.y - HEIGHT / 2);
  this.matrix.rotate(angle, 0, 0, 1);
  if (origin)
    this.translate(WIDTH / 2 - this.x - this.w / 2, HEIGHT / 2 - this.y - this.h / 2);
}
Shape.prototype.rotateX = function (angle, x, y, z) {
  this.matrix.rotate(angle, 1, 0, 0);
}
Shape.prototype.rotateY = function (angle, x, y, z) {
  this.matrix.rotate(angle, 0, 1, 0);
}
Shape.prototype.scale = function (x, y) {
  this.matrix.scale(x, y, 1);
}

Shape.prototype.triangles = function() {
  this.mode = gl.TRIANGLES;
}
Shape.prototype.triangleStrip = function() {
  this.mode = gl.TRIANGLE_STRIP;
}
Shape.prototype.fill = function () {
  this.mode = gl.TRIANGLE_FAN;
}
Shape.prototype.lines = function () {
  this.mode = gl.LINES;
}
Shape.prototype.lineStrip = function() {
  this.mod = gl.LINE_STRIP;
}
Shape.prototype.noFill = function () {
  this.mode = gl.LINE_LOOP;
}
Shape.prototype.points = function () {
  this.mode = gl.POINTS;
}
