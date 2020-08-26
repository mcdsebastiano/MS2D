class Piece {
  constructor(x, y, size, color) {
    this.x = Math.floor((x * (size * 2)) + size / 2);
    this.y = Math.floor((y * (size * 2)) + size / 2);
    this.size = size;
    this.val = ' ';
    this.color = color;
    this.moving = false;
    this.canJump = false;
    this.hasMoved = false;
    // NOTE: We are not using this.x or this.y for the cellIndex
    this.cellIndex = y * 8 + x;
  }

  isInHand() {
    return this.moving === true;
  }

  inHand(value) {
    this.moving = value;
  }

  setPos(pos) {
    // we are considering this a default method for convenience, however this.pos
    // is initialized in the child class, not here.
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
    return p;
  }

  nortOne() {
    return this.cellIndex -= 8;
  }

  soutOne() {
    return this.cellIndex + 8;
  }

  eastOne() {
    return this.cellIndex + 1;
  }

  noEaOne() {
    return this.cellIndex + 9;
  }

  soEaOne() {
    return this.cellIndex - 7;
  }

  westOne() {
    return this.cellIndex - 1;
  }

  soWeOne() {
    return this.cellIndex - 9;
  }

  noWeOne() {
    return this.cellIndex + 7;
  }

}
