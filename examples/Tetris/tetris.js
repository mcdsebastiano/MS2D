// collisions and rotations all completed..
// all thats left to do is scoring and win conditions

include('inc/Pieces.js');

let refreshRate = 60;
let tile_size = 25;
let ticker = 0;

let needPiece = false;
let playedPieces = [];
let allPieces = [];

let curr;

function setup() {
  allPieces = [J, L, S, Z, T, I, O];
  curr = newPiece();
}

function draw() {
  setColor(BLACK);
  drawPiece(curr);

  for (let i = 0; i < playedPieces.length; i++) {
    drawPiece(playedPieces[i]);
  }

  drawBorder();
}

function update() {
  ticker++;
  if (ticker % refreshRate === 0) {
    if (needPiece === true) {
      curr = newPiece();
      needPiece = false;

    } else {
      if (shiftPiece(0, 1) === false) {
        playedPieces.push(clone(curr));
        needPiece = true;
      }
    }
  }

  draw();
}

function keyPressed() {
  let dir = 1;

  switch (keyCode()) {
    //////////////////
  case 90: // z
    dir = -1;
  case 88: // x
    curr = rotatePiece(dir);
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
    // case ARROW_UP:
    // curr.y -= tile_size;
    // break;
    //////////////////
  case SPACE_BAR:
    dropPiece();
    break;
    //////////////////
  default:
    break;
  }
}

function newPiece() {
  let piece = allPieces[Math.floor(Math.random() * allPieces.length)];
  piece.height = calculateHeight(piece.rotation);
  piece.width = calculateWidth(piece.rotation);

  let ratio = Math.floor((piece.width / tile_size) / 2); // number of blocks
  if (ratio === 0) {
    ratio = 1; // the darn vertical line
  }
  piece.x = WIDTH / 2 - (ratio * tile_size);

  ratio = Math.floor((piece.height / tile_size) / 2);
  piece.y = 50 - (ratio * tile_size);

  return piece;
}

function drawPiece(piece) {
  for (let y = 0; y < piece.rotation.length; y++) {
    for (let x = 0; x < piece.rotation.length; x++) {
      if (piece.rotation[y][x] == 1) {
        setColor(piece.color);
        fillRect(tile_size, tile_size, piece.x + x * tile_size, piece.y + y * tile_size);
        setColor(BLACK);
        Rect(tile_size, tile_size, piece.x + x * tile_size, piece.y + y * tile_size);
      }
    }
  }
}

function dropPiece() {
  while (true) {
    if (shiftPiece(0, 1) === false) {
      break;
    }
  }
}

function shiftPiece(xdir, ydir) {
  let topMost = topMostBlock(getBlocks(curr));
  if (topMost + curr.height >= HEIGHT) {
    return false;
  }

  let x = tile_size * xdir;
  let y = tile_size * ydir;

  let blocks = getBlocks(curr);
  let rightMost = rightMostBlock(blocks);
  let leftMost = rightMost - curr.width;

  let piece = clone(curr);
  piece.x += x;
  piece.y += y;

  if (collides(piece)) {
    return false;
  }

  if (rightMost + x <= WIDTH && leftMost + x >= 0) {
    curr.x += x;
    curr.y += y;
    return true;
  }

  return false;
}

function rotatePiece(direction) {
  if (needPiece === true) {
    return curr;
  }

  let newRotation = [];

  if (direction > 0) { // clockwise
    for (let i = 0; i < curr.rotation.length; i++) {
      newRotation[i] = [];
      for (let j = 0; j < curr.rotation.length; j++) {
        newRotation[i][j] = curr.rotation[curr.rotation.length - j - 1][i];
      }
    }
  } else {
    for (let i = 0; i < curr.rotation.length; i++) {
      newRotation[i] = [];
      for (let j = 0; j < curr.rotation.length; j++) {
        newRotation[i][j] = curr.rotation[j][curr.rotation.length - i - 1];
      }
    }
  }

  let piece = clone(curr);
  piece.rotation = newRotation;
  piece.height = calculateHeight(newRotation);
  piece.width = calculateWidth(newRotation);

  if (checkRotation(piece)) {
    return piece;
  } else {
    return curr;
  }
}

function checkRotation(piece) {
  let blocks = getBlocks(piece);

  let rightMost = rightMostBlock(blocks);
  let topMost = topMostBlock(blocks);

  let lowerMost = topMost + piece.height;
  let leftMost = rightMost - piece.width;

  if (leftMost < 0) {
    piece.x += -leftMost;
  } else if (rightMost > WIDTH) {
    piece.x -= rightMost - WIDTH;
  } else if (lowerMost > HEIGHT) {
    piece.y -= lowerMost - HEIGHT;
  }

  if (collides(piece)) {
    return false;
  }

  return true;
}

function collides(piece) {
  let blocks = getBlocks(piece)
    for (let i = 0; i < playedPieces.length; i++) {
      let pp = playedPieces[i];
      let ppBlocks = getBlocks(pp);
      for (block of blocks) {
        for (ppBlock of ppBlocks) {
          if (ppBlock.x == block.x && ppBlock.y == block.y) {

            return true;
          }
        }
      }
    }
    return false;
}

function getBlocks(piece) {
  let coords = [];
  for (let y = 0; y < piece.rotation.length; y++) {
    for (let x = 0; x < piece.rotation.length; x++) {
      if (piece.rotation[y][x] === 1) {
        coords.push({
          x: piece.x + (x * tile_size),
          y: piece.y + (y * tile_size)
        });
      }
    }
  }
  return coords;
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
  return tile_size * h;
}

function calculateWidth(rotation) {
  let w = 0;
  for (let x = 0; x < rotation.length; x++) {
    for (let y = 0; y < rotation.length; y++) {
      if (rotation[y][x] == 1) {
        w++;
        break;
      }
    }
  }
  return tile_size * w;
}

function rightMostBlock(blocks) {
  let rightMost = 0;
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block.x > rightMost) {
      rightMost = block.x;
    }
  }
  return rightMost + tile_size;
}

function topMostBlock(blocks) {
  let topMost = HEIGHT;
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block.y < topMost) {
      topMost = block.y;
    }
  }
  return topMost;
}