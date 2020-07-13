class Piece {
  constructor(x, y, size) {
    this.x = Math.floor((x * (size * 2)) + size / 2);
    this.y = Math.floor((y * (size * 2)) + size / 2);
    this.size = size;
  }

  move(file, rank) {

    let x = file.charCodeAt(0) - 97;
    let y = rank - 1;

    this.x = Math.floor((x * (this.size * 2)) + this.size / 2);
    this.y = Math.floor((y * (this.size * 2)) + this.size / 2);
  }

  paint() {
    let p = fillRect(this.x, this.y, this.size, this.size);
    p.rotateZ(180);
    p.rotate(180, 0, 1, 0);
    return p;
  }
}
