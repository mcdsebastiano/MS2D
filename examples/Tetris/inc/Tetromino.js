class Tetromino {
  constructor(piece, x, y) {
    this.x = x || (WIDTH - w * 2) / 2;
    this.y = y || 0;
    this.cells = [];
    this.piece = piece;
    this.color = this.piece.color;
    this.locked = false;
    this.rotation = this.piece.r0;
  }

  lock() {
    this.locked = true;
  }

  reset() {
    this.pos = 0;
    this.cells = [];
    this.locked = false;
    this.rotation = this.piece.r0;
  }

  getHeight() {
    let pH = 0;
    for (let y = 0; y < this.rotation.length; y++) {
      for (let x = 0; x < this.rotation.length; x++) {
        if (this.rotation[y][x] == 1) {
          pH++;
          break;
        }
      }
    }
    return w * pH;
  }

  getWidth() {
    let pW = 0;
    for (let x = 0; x < this.rotation.length; x++) {
      for (let y = 0; y < this.rotation.length; y++) {
        if (this.rotation[y][x] == 1) {
          pW++;
          break;
        }
      }
    }
    return w * pW;
  }

  getBottomBounds() {
    return this.cells[this.cells.length - 1].y + w;
  }

  getLeftBounds() {
    let min = this.cells[0].x;
    this.cells.forEach(cell => {
      if (cell.x < min) {
        min = cell.x;
      }
    });
    return min;
  }

  getRightBounds() {
    let max = this.cells[0].x;
    this.cells.forEach(cell => {
      if (cell.x >= max) {
        max = cell.x + w;
      }
    });
    return max;
  }

  // this should be investigated i.e do i update the rotated pieces X/Y
  // (top left)
  rotate(dir) {
    if (this.locked)
      return;
    this.rotation = this.getNextPosition();
    // these checks needs to be applied to ANY object not just canvas.
    // i.e obj.x + obj.width() or something and maybe done as a check to be
    // returned from the function ?
    if (this.x < 0) {
      this.translate(-this.x, 0);
    } else if (this.x + this.getWidth() > WIDTH) {
      let diff = (this.x + this.getWidth()) - WIDTH;
      this.translate(-diff, 0);
    } else if (this.y + this.getHeight() > HEIGHT) {
      let diff = (this.y + this.getHeight()) - HEIGHT;
      this.translate(0, -diff);
    }
    this.draw();
  }

  translate(x, y) {
    if (this.locked)
      return;
    if (this.getBottomBounds() + y > HEIGHT ||
      this.getRightBounds() + x > WIDTH ||
      this.getLeftBounds() + x < 0)
      return;
    this.x += x;
    this.y += y;
    for (let cell of this.cells) {
      cell.translate(x, y);
    }
    this.draw();
    return true;
  }

  getNextPosition() {
    let newArray = [];
    for (let i = 0; i < this.rotation.length; i++) {
      newArray[i] = [];
      for (let j = 0; j < this.rotation.length; j++) {
        newArray[i][j] = this.rotation[this.rotation.length - j - 1][i];
      }
    }
    return newArray;
  }

  draw() {
    let coords = [];
    for (let y = 0; y < this.rotation.length; y++) {
      for (let x = 0; x < this.rotation.length; x++) {
        if (this.rotation[y][x] === 1) {
          coords.push({
            x: this.x + x * w,
            y: this.y + y * w
          });
        }
      }
    }
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.cells = [];
    for (let i = 0; i < coords.length; i++) {
      setColor(this.color);
      this.cells.push(fillRect(coords[i].x, coords[i].y, w, w));
      setColor(BLACK);
      Rect(coords[i].x, coords[i].y, w, w);
    }
  }
}
