let r, rX, rY, rW;

function setup() {
    rW = rY = rX = 100;
}

function draw() {
    setColor(BLACK);
    r = fillRect(rX, rY, rW, rW);
}

function update() {
    draw();
}

function mousePressed() {
    dragStart(mouseX(), mouseY(), rX, rY, rW, rW);
}

function mouseMove() {
    let move;
    if (move = dragMove(dragX(), dragY())) {
        rX = move.x;
        rY = move.y;
    }
}

function mouseReleased() {
    dragEnd();
}
