const Matrix4 = function (src) {
  if (src) {}
  else {
    this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 0, 0, 0, 1]);
  }
}

Matrix4.prototype.setIdentity = function () {

  return this;
}

Matrix4.prototype.set = function (src) {}

Matrix4.prototype.concat = function (other) {

  return this;
}

Matrix4.prototype.multiply = Matrix4.prototype.concat;

Matrix4.prototype.multiplyVec3 = function () {}
Matrix4.prototype.multiplyVec4 = function () {}
Matrix4.prototype.transpose;
Matrix4.prototype.setInverseOf;
Matrix4.prototype.invert;
Matrix4.prototype.setOrtho;
Matrix4.prototype.ortho;
Matrix4.prototype.setFrustum;
Matrix4.prototype.frustum;
Matrix4.prototype.setPerspective;
Matrix4.prototype.perspective;


Matrix4.prototype.setScale = (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}

Matrix4.prototype.scale = (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}
Matrix4.prototype.setTranslate = (x, y, z) => {
  (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}
Matrix4.prototype.translate = (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}
Matrix4.prototype.setRotate = (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}
Matrix4.prototype.rotate = (x, y, z) =  > {
  let d = this.elements;
  d[0] = 0; d[4] = 0; d[8]  = 0; d[12] = 0;
  d[1] = 0; d[5] = 0; d[9]  = 0; d[13] = 0;
  d[2] = 0; d[6] = 0; d[10] = 0; d[14] = 0;
  d[3] = 0; d[7] = 0; d[11] = 0; d[15] = 0;
  return this.elements;
}
Matrix4.prototype.setLookAt;
Matrix4.prototype.lookAt;
