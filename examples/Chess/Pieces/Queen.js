class Queen extends Piece {
  constructor(file, rank, size, color) {
    super(file.charCodeAt(0) - 97, 7 - (rank - 1), size, color);
    this.pos = {
      file,
      rank
    }
    this.val = 'q';
  }
}
