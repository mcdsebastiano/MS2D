include('inc/Pieces.js');

let refreshRate = 60;
let tile_size = 25;
let ticker = 0;

let needPiece = false;
let playedPieces = []
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
      if (curr.y + curr.height < HEIGHT) {
        curr.y += tile_size;
      } else {
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
  case 88: // X
    dir = -1;
  case 90: // Z
    curr = rotatePiece(dir);
    break;
  //////////////////
  case ARROW_LEFT:
    dir = -1;
  case ARROW_RIGHT:
    shiftPiece(dir);
    break;
  //////////////////
  case ARROW_DOWN:
    curr.y += tile_size;
    break;
  //////////////////
  case ARROW_UP:
    curr.y -= tile_size;
    break;
  //////////////////
  case SPACE_BAR:
    break;
  //////////////////
  default:
    break;
  }
}

function drawPiece(piece) {
  for (let y = 0; y < piece.rotation.length; y++) {
    for (let x = 0; x < piece.rotation.length; x++) {
      if (piece.rotation[y][x] == 1) {
        Rect(tile_size, tile_size, piece.x + x * tile_size, piece.y + y * tile_size);
      }
    }
  }
}

function shiftPiece(direction) {
  if (needPiece === true) {
    return;
  }

  let x = tile_size * direction;
  let coords = getBlocks(curr);
  let rightMost = curr.x;
  
  for (let i = 0; i < coords.length; i++) {
    let block = coords[i];
    if (block.x >= rightMost) {
      rightMost = block.x + tile_size;
    }
  }
  
  let leftMost = rightMost - curr.width;
  
  if (rightMost + x <= WIDTH && leftMost + x >= 0) {
    curr.x += x;
  }

  return;
}

function rotatePiece(direction) {
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
  
  // get the new dimensions of the new rotation
  let nHeight = calculateHeight(newRotation);
  let nWidth = calculateWidth(newRotation);
  
  // find out where the heck the rotation lives relative to the current piece
  let coords     = getBlocks({rotation: newRotation, x: curr.x, y: curr.y});
  let bottomMost = curr.y + nHeight;
  let rightMost  = curr.x;
  
  for (let i = 0; i < coords.length; i++) {
    let block = coords[i];
    if (block.x >= rightMost) {
      rightMost = block.x + tile_size;
    }
  }
  
  let leftMost   = rightMost - nWidth;
  
  // if the new rotation lies outside the boundaries bring it back into view
  if (curr.x < 0) {
    curr.x += -leftMost;
  } else if (rightMost > WIDTH) {
    let diff = rightMost - WIDTH;
    curr.x -= diff;
  } else if (bottomMost > HEIGHT) {
    let diff = bottomMost - HEIGHT;
    curr.y -= diff;
  }
  
  return {
    rotation: newRotation,
    height: nHeight,
    width:  nWidth,
    x: curr.x,
    y: curr.y
  };
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

function getBlocks(piece) {
  let coords = [];
  for (let y = 0; y < piece.rotation.length; y++) {
    for (let x = 0; x < piece.rotation.length; x++) {
      if (piece.rotation[y][x] === 1) {
        coords.push({
          x: piece.x + (x * tile_size),
          y: piece.y + (y * tile_size)
        })
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