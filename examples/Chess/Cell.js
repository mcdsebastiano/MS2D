class Cell {
  constructor(x, y, size, binValue) {
    this.x = x * size;
    this.y = y * size;
    this.size = size;
    this.pos = {
      file: String.fromCharCode(97 + x),
      rank: 8 - y
    }
    this.value = ' ';
    this.epState = false;
  }

  hasBlackPiece() {
    if (this.isOccupied() === false)
      return false;
    return this.value === this.value.toLowerCase();
  }

  hasWhitePiece() {
    if (this.isOccupied() === false)
      return false;
    return !hasBlackPiece();
  }

  hasValue(val) {
    return this.value.toLowerCase() === val;
  }

  isFree() {
    return this.hasValue(' ') === true;
  }

  isOccupied() {
    return this.value !== ' ';
  }

  paint() {
    if ((this.pos.file.charCodeAt(0) - 1 + this.pos.rank) % 2 === 0) {
      setColor(LIGHTTAN)
    } else {
      setColor(LIGHTBROWN);
    }
    return fillRect(this.x, this.y, this.size, this.size);
  }
}
