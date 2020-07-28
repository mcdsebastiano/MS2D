class Piece {
  constructor(x, y, size, color) {
    this.x = Math.floor((x * (size * 2)) + size / 2);
    this.y = Math.floor((y * (size * 2)) + size / 2);
    this.size = size;
    this.val = ' ';
    this.color = color;
    this.moving = false;
  }

  isInHand() {
    return this.moving === true;
  }

  inHand(value) {
    this.moving = value;
    return this;
  }

  setPos(pos) {
    this.pos = pos;
  }

  getCol() {
    return this.pos.file.charCodeAt(0) - 97;
  }

  getRow() {
    return this.pos.rank - 1;
  }

  setX(x) {
    this.x = Math.floor((x * (this.size * 2)) + this.size / 2);
  }

  setY(y) {
    this.y = Math.floor((y * (this.size * 2)) + this.size / 2);
  }

  value() {
    return this.val;
  }

  paint() {
    let p = fillRect(this.x, this.y, this.size, this.size);
    // if (this.moving !== true)
    // p.rotateZ(180);
    return p;
  }
}
