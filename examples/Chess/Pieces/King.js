class King extends Piece {
  constructor(file, rank, size) {
    super(file.charCodeAt(0) - 97, rank - 1, size);
    this.pos = {
      file,
      rank
    }
  }
}
