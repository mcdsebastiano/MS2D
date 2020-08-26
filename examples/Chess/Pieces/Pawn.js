class Pawn extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'p';
    this.offsetCoords = [16, 8, -8, -16];
    this.offsetCaptureCoords = [-9, -7, 7, 9];
  }
  
  legalMoves(board) {
    // let moves = [];
    // for (let i = 0; i < this.offsetCoords.length; i++) {
      // let offsetIndex = idx + this.offsetCoords[i];
      // if (offsetIndex > 64 || offsetIndex < 0) {
        // continue;
      // }
      // if (this.color == 'w' && offsetIndex > idx) {
        // continue
      // } else if (this.color == 'b' && offsetIndex < idx) {
        // continue;
      // }
      
      // if (board.cells[offsetIndex].value == ' ') {
        // moves.push(offsetIndex);
      // }
    // }

    // for (let i = 0; i < this.offsetCaptureCoords.length; i++) {
      // let captureIndex = idx + this.offsetCaptureCoords[i];
      // if (captureIndex > 63 || captureIndex < 0) {
        // continue;
      // }
      // if (this.color == 'w' && captureIndex > idx) {
        // continue
      // } else if (this.color == 'b' && captureIndex < idx) {
        // continue;
      // }
      // if (board.cells[captureIndex].value != ' ') {
        // moves.push(captureIndex);
      // }
    // }
    // return moves;
    
    return [this.nortOne(board)]
  }
  // paint() {
    // let p = fillCircle(this.x, this.y, this.size / 2);
     // return p;
  // }
}
