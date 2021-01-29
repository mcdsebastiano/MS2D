include('inc/Pieces.js');

let curr;
let next;

let ticker = 0;
let tile_size = 25;
let refreshRate = 45;

let game_state;

let menu_width = WIDTH - 200;
let menu_height = HEIGHT - 200;
let menu_start = 100;
let menu_end = menu_start + menu_width;

let allPieces = [];
let playedBlocks = [];
let needPiece = false;

let grid_color;
let grid_width = 400;
let grid_height = HEIGHT;
let grid_start = tile_size * 2;
let grid_end = grid_start + grid_width;

let preview_width = 150;
let preview_height = 100;
let preview_start = grid_end + tile_size;

let start_game = false;

function setup() {
  grid_color = CHARCOAL;
  allPieces = [J, L, I, T, O, Z, S];
  next = allPieces[0];
  game_state = 'menu';
}

function mousePressed() {
  if (game_state === 'menu' && mouseX() >= menu_start && mouseX() <= menu_end) {
    new_game = true;
    game_state = 'endlessplay';
    let audio = document.createElement('audio');
    audio.src = 'korobeiniki.mp3';
    audio.loop = true;
    audio.play();

  }
}

function drawBounds() {
  setColor(grid_color)
  fillRect(0, 0, WIDTH, HEIGHT);
  setColor(BLACK);
  fillRect(grid_start - 1, 0, grid_width + 2, grid_height);
  fillRect(preview_start, grid_start, preview_width, preview_height);
  drawBorder();
}

function draw() {
  drawBlocks(playedBlocks)
  drawBlocks(getBlocks(next));
  drawBlocks(getBlocks(curr));
}

function update() {

  drawBounds();

  switch (game_state) {

  case 'menu':
    grid_color = CHARCOAL;
    setColor(OFFWHITE);
    fillRect(menu_start, 100, menu_width, menu_height);

    break;
  case 'gameover':
    // popup score & shit
    break;
  case 'timedplay':
  case 'endlessplay':

    if (new_game === true) {
      grid_color = rgba(130,130,130,1);
      curr = newPiece();
      new_game = false;
    }

    ticker++;

    if (refreshRate > 5 && ticker % 5000 === 0) {
      refreshRate -= 10;
    }

    if (ticker % refreshRate === 0) {

      if (needPiece === true) {
        curr = newPiece();
        needPiece = false;
        clearLines();

      } else {
        if (shiftPiece(0, 1) === false) {
          pushBlocks(curr);
          needPiece = true;
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
  case SPACE_BAR:
    dropPiece();
    break;
    //////////////////
  default:
    break;
  }
}

function newPiece() {
  let piece = next;
  next = clone(allPieces[Math.floor(Math.random() * allPieces.length)]);
  next.height = calculateHeight(next.rotation);
  next.width = calculateWidth(next.rotation);
  next.x = preview_start + grid_start;
  next.y = grid_start;

  let ratio = Math.floor((piece.width / tile_size) / 2); // number of blocks
  if (ratio === 0) {
    ratio = 1; // the darn vertical line
  }
  piece.x = grid_end / 2 - (ratio * tile_size) + tile_size;

  ratio = Math.floor((piece.height / tile_size) / 2);
  piece.y = 50 - (ratio * tile_size);

  return piece;
}

function shiftPiece(xdir, ydir) {
  if (needPiece === true) {
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

  let topMost = topMostBlock(getBlocks(piece));

  if (leftMost + x >= grid_start && rightMost + x <= grid_end) {
    if (topMost + curr.height > grid_height) {
      return false;

    }
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
          x: piece.x + (x * tile_size),
          y: piece.y + (y * tile_size)
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
    fillRect(block.x + 1, block.y + 1, tile_size - 2, tile_size - 2);
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
  return rightMost + tile_size;
}

function topMostBlock(blocks) {
  let topMost = grid_height;
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block.y < topMost) {
      topMost = block.y;
    }
  }
  return topMost;
}

function clearLines() {
  for (let y = HEIGHT; y >= tile_size; y -= tile_size) {
    let line = playedBlocks.filter(c => c.y === y - tile_size);
    
    if (line.length === 16) {
      
      playedBlocks.sort((a, b) => b.y - a.y);
      
      let idx = playedBlocks.findIndex(a => {
        return a.x === line[0].x && a.y === line[0].y
      });
      
      playedBlocks.splice(idx, 16);

      playedBlocks.forEach(block => {
        if (block.y < y) {
          block.y += tile_size;
        }
      });

      y += tile_size; // reset the line index
    }
  }
}

function checkRotation(piece) {
  let blocks = getBlocks(piece);

  let rightMost = rightMostBlock(blocks);
  let topMost = topMostBlock(blocks);

  let lowerMost = topMost + piece.height;
  let leftMost = rightMost - piece.width;

  if (leftMost < grid_start) {
    piece.x += leftMost;
  } else if (rightMost > grid_end) {
    piece.x -= rightMost - grid_end;
  } else if (lowerMost > grid_height) {
    piece.y -= lowerMost - grid_height;
  }

  if (collides(piece)) {
    if (shiftPiece(tile_size, 0) || shiftPiece(-tile_size, 0)) {
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
