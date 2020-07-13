class Cell {
  constructor(x, y, size) {
    this.x = x * size;
    this.y = y * size;
    this.size = size;
    this.pos = {
      file: String.fromCharCode(x + 97),
      rank: y + 1
    }
  }

  paint() {

    if ((this.pos.file.charCodeAt(0) - 1 + this.pos.rank) % 2 === 0) {
      setColor(WHITE)
    } else {
      setColor(DIM_GRAY);
    }

    let cell = fillRect(this.x, this.y, this.size, this.size);
    cell.rotateZ(180);
    cell.rotate(180, 0, 1, 0);
    return cell;
  }
}
