const Shape = function () {
  // refactor
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
  // this.listeners = {};
};

// Shape.prototype.listeners = null;

// Shape.prototype.addEventListener = function (type, callback) {
// if (!(type in this.listeners)) {
// this.listeners[type] = [];
// }
// this.listeners[type].push(callback);
// };

// Shape.prototype.removeEventListener = function (type, callback) {
// if (!(type in this.listeners)) {
// return;
// }
// var stack = this.listeners[type];
// for(let i = 0, l = stack.length; i < l; i++) {
// if(stack[i] === callback) {
// stack.splice(i, 1);
// return;
// }
// }
// };

// Shape.prototype.dispatchEvent = function(event) {
// if(!(event.type in this.listeners)) {
// return true;
// }
// let stack = this.listeners[event.type].slice();

// for(let i = 0, l = stack.length; i < l; i++) {
// stack[i].call(this, event);
// }

// return !event.defaultPrevented;
// }

Shape.prototype.paint = function () {
  gl.uniformMatrix4fv(gl.getUniformLocation(gl.program, 'u_ModelMatrix'), false, this.matrix.elements);
  gl.drawArrays(this.mode, this.offset, this.v.length);
  // this.setIdentity();
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
  this.matrix.translate(convertX(WIDTH / 2 + x * xAspectRatio), convertY(HEIGHT / 2 + y / yAspectRatio), 0);
}
Shape.prototype.rotate = function (angle, x, y, z) {
  this.matrix.rotate(angle, x, y, z);
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
Shape.prototype.fill = function () {
  this.mode = gl.TRIANGLE_FAN;
}
Shape.prototype.line = function () {
  this.mode = gl.LINES;
}
Shape.prototype.noFill = function () {
  this.mode = gl.LINE_LOOP;
}
Shape.prototype.pt = function () {
  this.mode = gl.POINTS;
}
