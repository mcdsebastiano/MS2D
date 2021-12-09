

function setup() {
    setColor(BLACK)
}
let x;
let y;

function draw() {
    Rect(x, y, 50, 50);
}

function mousePressed() {

    x = mouseX();
    y = mouseY();

    draw();

}
