let order = 6;
let N = Math.floor(Math.pow(2, order));
let total = N * N;
let counter = 0;
let path = [];

function setup() {
  setColor(BLACK);
  for (let i = 0; i < total; i++) {
    path.push(hilbert(i));
    const len = WIDTH / N;
    path[i].mult(len);
    path[i].add(new Vector(len / 2, len / 2));
  }
}

function draw() {
  for (let i = 1; i < counter - 1; i++)
    drawLine(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y);
}

function update() {
  counter++;
  if (counter >= path.length)
    counter = 0;
  counter = counter >= path.length ? 0 : counter + 1;
  draw();
}

function hilbert(i) {
  let points = [
    new Vector(0, 0),
    new Vector(0, 1),
    new Vector(1, 1),
    new Vector(1, 0)
  ];

  let index = i & 3;
  let v = points[index];

  for (let j = 1; j < order; j++) {
    i = i >>> 2;
    index = i & 3;
    let len = Math.pow(2, j);
    if (index == 0) {
      let temp = v.x;
      v.x = v.y;
      v.y = temp;
    } else if (index == 1) {
      v.y += len;
    } else if (index == 2) {
      v.x += len;
      v.y += len;
    } else if (index == 3) {
      let temp = len - 1 - v.x;
      v.x = len - 1 - v.y;
      v.y = temp;
      v.x += len;
    }
  }
  return v;
}
