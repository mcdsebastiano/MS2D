let angle = 0;

let xcoords = [];
let ycoords = [];

function setup() {
  setColor(BLACK);

  for (let i = 0; i < 50000; i++) {
    xcoords[i] = Math.random() * WIDTH;
    ycoords[i] = Math.random() * HEIGHT;
  }
}

function draw() {
  // drawBorder();
  for (let i = 0; i < 50000; i++) {
    let r = Rect(xcoords[i], ycoords[i], 10, 10);
  }
}
