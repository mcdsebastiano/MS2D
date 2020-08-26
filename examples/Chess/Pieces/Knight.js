class Knight extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'n';
    this.canJump = true;
    this.offsetCoords = [6, 10, 15, 17 - 6, -10, -15, -17];
  }

  legalMoves(board) {

    let moves = [];
    let idx = board.cellIndex(this);

    return moves;

  }

  // paint() {
    // let offscreenCanvas = document.createElement('canvas');
    // const ctx = offscreenCanvas.getContext('2d');

    // let img = new Image();
    // img.src = './pieces/knight.png';

    // let wratio = 1;

    // img.width = Math.floor(img.width * wratio);
    // img.height = Math.floor(img.height * wratio);

    // offscreenCanvas.width = ctx.width = img.width;
    // offscreenCanvas.height = ctx.height = img.height;
    // ctx.drawImage(img, 0, 0, Math.floor(ctx.width / 4), Math.floor(ctx.height));
    // let imgData = ctx.getImageData(0, 0, Math.floor(img.width / 4), Math.floor(img.height * 4)).data;
    // let p = newShape();
    // for (let i = 0; i < imgData.length / 4; i++) {
    // if (i % 4 == 0) {
    // setColor(rgba(imgData[i], imgData[i + 1], imgData[i + 2]));
    // }

    // let type = img.src.substring(img.src.lastIndexOf('.') + 1);
    // let value;
    // if (type === 'jpg') {
    // value = img.width
    // } else if (type === 'png') {
    // value = img.height
    // }
    // vertexAt(-(WIDTH - this.x + this.size)+ (i % value), Math.floor(-(HEIGHT / 2) + this.y + this.size + (i / value)));
    // }
    // endShape();
    // p.scale(0.1, 0.1);
    // return p;
  // }
}
