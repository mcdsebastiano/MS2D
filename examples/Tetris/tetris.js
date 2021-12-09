include('inc/Pieces.js');

const state = {
    newPiece: false,
    newGame: true,
    currPiece: {},
    nextPiece: {},
    gameMode: {}
};

const GameMode = {
    MENU: 'menu',
    TIMED: 'timed',
    ENDLESS: 'endless',
    GAMEOVER: 'gameover',
};

let allPieces = [];
let playedBlocks = [];
let refreshRate = 45;
let tileSize = 25;
let ticker = 0;
let score = 0;
let preview;
// not actually a grid
let grid;

let menuWidth = 300;
let menuHeight = 200;

let menuBox = document.createElement("DIV");

menuBox.style.backgroundColor = "#fff";
menuBox.style.position = "fixed";
menuBox.style.left = `${WIDTH / 2 - menuWidth / 2}px`;
menuBox.style.top = `${HEIGHT / 2 - menuHeight / 2}px`;
menuBox.style.height = "200px";
menuBox.style.width = "300px";
menuBox.style.textAlign = "center";
menuBox.style.alignItems = "center";
menuBox.style.flexDirection = "column";
menuBox.style.justifyContent = "center";
menuBox.style.fontSize = "18pt";
menuBox.style.color = "black";
menuBox.innerHTML = "Tetris<br><span style='font-size: 10px;'>Press any key to play</span>";
document.body.appendChild(menuBox);


let scoreBox = document.createElement("DIV");
scoreBox.style.color = "#000";
scoreBox.style.position = "fixed";
scoreBox.innerHTML = `Score:<br>${score}`;
document.body.appendChild(scoreBox);

let nextBox = document.createElement("DIV");
nextBox.style.color = "#000";
nextBox.style.position = "fixed";
nextBox.textContent = "Next:";
document.body.appendChild(nextBox);

state.gameMode = GameMode.MENU;

function setup() {
    function Box(w, h, s, e, c) {
        this.width = w;
        this.height = h;
        this.start = s;
        this.end = e;
        this.color = c;
    }

    grid = new Box(400, HEIGHT, tileSize * 2, (tileSize * 2) + 400, {});
    preview = new Box(150, 100, grid.end + tileSize);

    allPieces = [J, L, I, T, O, Z, S];
	
    state.nextPiece = allPieces[0];
    
    scoreBox.style.top = "50px";
    scoreBox.style.left = `${preview.start}px`;
    
    nextBox.style.left = `${preview.start}px`;
    nextBox.style.top = `${HEIGHT - 150}px`;
    
}

function drawBounds() {
    setColor(grid.color)
    fillRect(0, 0, WIDTH, HEIGHT);
    setColor(BLACK);
    fillRect(grid.start - 1, 0, grid.width + 2, grid.height);
    fillRect(preview.start, HEIGHT - 125, preview.width, preview.height);
    drawBorder();
}

function draw() {
	setColor(GRAY);
	drawBorder();
    const nextBlocks = getBlocks(state.nextPiece);
    const currBlocks = getBlocks(state.currPiece);
    drawBlocks(playedBlocks)
    drawBlocks(nextBlocks);
    drawBlocks(currBlocks);
}

function update() {

    drawBounds();

    switch (state.gameMode) {

    case GameMode.MENU:
        grid.color = CHARCOAL;
        menuBox.style.display = "flex";
        break;

    case GameMode.GAMEOVER:
        menuBox.style.display = "flex";
        menuBox.innerHTML = "Game Over<br><span style='font-size: 10px;'>Press any key to play</span>";
        break;

    case GameMode.TIMED:
    case GameMode.ENDLESS:
        
        for (let i = 0; i < playedBlocks.length; i++) {
            if (playedBlocks[i].y <= 25) {
                state.gameMode = GameMode.GAMEOVER;
                break;
            }
        }
    

        if (state.newGame === true) {
            grid.color = rgba(130, 130, 130, 1);
            state.currPiece = assignPiece();
            state.newGame = false;
        }

        ticker++;

        if (ticker % refreshRate === 0) {
            if (state.newPiece === true) {
                state.currPiece = assignPiece();
                state.newPiece = false;
                clearLines();

            } else {
                if (shiftPiece(0, 1) === false) {
                    pushBlocks(state.currPiece);
                    state.newPiece = true;
                }
            }
        }

        draw();
        break;

    default:
        break;
    }
}

function keyPressed() {
    
    if(state.gameMode === GameMode.MENU || state.gameMode === GameMode.GAMEOVER) {
        state.gameMode = GameMode.ENDLESS;
        state.currPiece = allPieces[0];
        state.nextPiece = allPieces[0];
        score = 0;
        updateScore();
        playedBlocks = [];
        menuBox.style.display = "none";
        return;
    }

    let dir = 1;

    switch (keyCode()) {
        //////////////////
    case 90: // z
        dir = -1;
    case 88: // x
        state.currPiece = rotatePiece(dir);
        break;
        //////////////////
    case ARROW_LEFT:
        dir = -1;
    case ARROW_RIGHT:
        shiftPiece(dir, 0);
        break;
        //////////////////
    case ARROW_DOWN:
        shiftPiece(0, dir);
        break;
        //////////////////
    case SPACE_BAR:
        dropPiece();
        break;
        //////////////////
    default:
        break;
    }
}

function assignPiece() {
    let piece = state.nextPiece;
    state.nextPiece = clone(allPieces[Math.floor(Math.random() * allPieces.length)]);
    state.nextPiece.height = calculateHeight(state.nextPiece.rotation);
    state.nextPiece.width = calculateWidth(state.nextPiece.rotation);
    state.nextPiece.x = preview.start + grid.start;
    state.nextPiece.y = HEIGHT - 125;

    let ratio = Math.floor((piece.width / tileSize) / 2); // number of blocks
    if (ratio === 0) {
        ratio = 1; // the darn vertical line
    }
    piece.x = grid.end / 2 - (ratio * tileSize) + tileSize;

    ratio = Math.floor((piece.height / tileSize) / 2);
    piece.y = 50 - (ratio * tileSize);

    return piece;
}

function shiftPiece(xdir, ydir) {
    if (state.newPiece === true) {
        return false;
    }

    const {
        currPiece
    } = state;

    let x = tileSize * xdir;
    let y = tileSize * ydir;

    let blocks = getBlocks(currPiece);
    let rightMost = rightMostBlock(blocks);
    let leftMost = rightMost - currPiece.width;

    let piece = clone(currPiece);
    piece.x += x;
    piece.y += y;

    if (collides(piece)) {
        return false;
    }

    let topMost = topMostBlock(getBlocks(piece));

    if (leftMost + x >= grid.start && rightMost + x <= grid.end) {
        if (topMost + currPiece.height > grid.height) {
            return false;

        }
        currPiece.x += x;
        currPiece.y += y;

        return true;
    }

    return false;
}

function rotatePiece(direction) {
    if (state.newPiece === true) {
        return state.currPiece;
    }

    const {
        currPiece
    } = state;

    let newRotation = [];

    if (direction > 0) { // clockwise
        for (let i = 0; i < currPiece.rotation.length; i++) {
            newRotation[i] = [];
            for (let j = 0; j < currPiece.rotation.length; j++) {
                newRotation[i][j] = currPiece.rotation[currPiece.rotation.length - j - 1][i];
            }
        }
    } else {
        for (let i = 0; i < currPiece.rotation.length; i++) {
            newRotation[i] = [];
            for (let j = 0; j < currPiece.rotation.length; j++) {
                newRotation[i][j] = currPiece.rotation[j][currPiece.rotation.length - i - 1];
            }
        }
    }

    let piece = clone(currPiece);
    piece.rotation = newRotation;
    piece.height = calculateHeight(newRotation);
    piece.width = calculateWidth(newRotation);

    if (checkRotation(piece)) {
        return piece;
    } else {
        return currPiece;
    }
}

function dropPiece() {
    while (true) {
        if (shiftPiece(0, 1) === false) {
            break;
        }
    }
}



function getBlocks(piece) {
    let blocks = [];
    for (let y = 0; y < piece.rotation.length; y++) {
        for (let x = 0; x < piece.rotation.length; x++) {
            if (piece.rotation[y][x] === 1) {
                blocks.push({
                    color: piece.color,
                    x: piece.x + (x * tileSize),
                    y: piece.y + (y * tileSize)
                });
            }
        }
    }
    return blocks;
}

function drawBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        setColor(block.color)
        fillRect(block.x + 1, block.y + 1, tileSize - 2, tileSize - 2);
    }
}

function pushBlocks(piece) {
    let blocks = getBlocks(clone(piece));
    for (let block of blocks) {
        let x = block.x;
        let y = block.y;
        let color = piece.color;
        playedBlocks.push({
            color,
            x,
            y
        });
    }
}

function rightMostBlock(blocks) {
    let rightMost = 0;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.x > rightMost) {
            rightMost = block.x;
        }
    }
    return rightMost + tileSize;
}

function topMostBlock(blocks) {
    let topMost = grid.height;
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        if (block.y < topMost) {
            topMost = block.y;
        }
    }
    return topMost;
}

function clearLines() {
    for (let y = HEIGHT; y >= tileSize; y -= tileSize) {
        let line = playedBlocks.filter(c => c.y === y - tileSize);

        if (line.length === 16) {
            score += 1000;
            updateScore();
            playedBlocks.sort((a, b) => b.y - a.y);

            let idx = playedBlocks.findIndex(a => {
                return a.x === line[0].x && a.y === line[0].y
            });

            playedBlocks.splice(idx, 16);

            playedBlocks.forEach(block => {
                if (block.y < y) {
                    block.y += tileSize;
                }
            });

            y += tileSize; // reset the line index
        }
    }
}

function checkRotation(piece) {
    let blocks = getBlocks(piece);

    let rightMost = rightMostBlock(blocks);
    let topMost   = topMostBlock(blocks);
    let lowerMost = topMost + piece.height;
    let leftMost  = rightMost - piece.width;

    if (leftMost < grid.start) {
        piece.x += leftMost;
    } else if (rightMost > grid.end) {
        piece.x -= rightMost - grid.end;
    } else if (lowerMost > grid.height) {
        piece.y -= lowerMost - grid.height;
    }

    if (collides(piece)) {
        if (shiftPiece(tileSize, 0) || shiftPiece(-tileSize, 0)) {
            return true;
        }

        return false;
    }

    return true;
}

function collides(piece) {
    let blocks = getBlocks(piece);
    for (block of blocks) {
        for (pBlock of playedBlocks) {
            if (pBlock.x == block.x && pBlock.y == block.y) {
                return true;
            }
        }
    }
    return false;
}

function calculateHeight(rotation) {
    let h = 0;
    for (let y = 0; y < rotation.length; y++) {
        for (let x = 0; x < rotation.length; x++) {
            if (rotation[y][x] == 1) {
                h++;
                break;
            }
        }
    }
    return tileSize * h;
}

function calculateWidth(rotation) {
    let w = 0;
    // NOTE:  These loops are reversed intentionally,
    //        Read the function name!
    for (let x = 0; x < rotation.length; x++) {
        for (let y = 0; y < rotation.length; y++) {
            if (rotation[y][x] == 1) {
                w++;
                break;
            }
        }
    }
    return tileSize * w;
}

function updateScore() {
    scoreBox.innerHTML = `Score:<br>${score}`;
}