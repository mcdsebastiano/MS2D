/* NOTE: a boundary should not be drawn, it is an invisible edge to simply
 * determine line of sight.
 * TODO: implement a tilemap and boundary detection on said tiles.
 */

class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = new Vector(x1, y1);
    this.b = new Vector(x2, y2);
  }
  
  paint() {
    setColor(WHITE);
    drawLine(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}