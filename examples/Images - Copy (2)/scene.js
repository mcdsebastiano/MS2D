let img;
function setup() {
  // clearColor(WHITE);
  let offscreenCanvas = document.createElement('canvas');
  const ctx = offscreenCanvas.getContext('2d');

  img = new Image();
  img.src = '../chess/pieces/knight.png';

  img.onload = () => {

    let wratio = 1;
    let hratio = 1;

    if (img.width > WIDTH) {
      wratio = WIDTH / img.width;

      // p.scale(0.25, 0.25);
      // p.translate(this.x, this.y);

      // return p;
    }
    img.width = Math.floor(img.width * wratio);
    img.height = Math.floor(img.height * wratio);

    offscreenCanvas.width = ctx.width = img.width;
    offscreenCanvas.height = ctx.height = img.height;
    ctx.drawImage(img, 0, 0, Math.floor(ctx.width / 4), Math.floor(ctx.height));
    let imgData = ctx.getImageData(0, 0, Math.floor(img.width / 4), Math.floor(img.height * 4)).data;
    let p = newShape();
console.log(img);
    for (let i = 0; i < imgData.length / 4; i++) {
      // setColor(BLACK);
      // p.line();
      if (i % 4 == 0) {
        setColor(rgba(imgData[i], imgData[i + 1], imgData[i + 2]));
      }
      
      
      vertexAt(i % img.height, Math.floor(i / img.height));
    }
    endShape();
  };
}

// img.width = Math.floor(img.width * wratio);
// img.height = Math.floor(img.height * wratio);

// offscreenCanvas.width = ctx.width = img.width;
// offscreenCanvas.height = ctx.height = img.height;
// ctx.drawImage(img, 0, 0, Math.floor(ctx.width / 4), Math.floor(ctx.height));
// let imgData = ctx.getImageData(0, 0, Math.floor(img.width / 4), Math.floor(img.height * 4)).data;
// let p = newShape();
// for (let i = 0; i < imgData.length / 4; i++) {
// if (i % 4 == 0) {
// setColor(rgba(imgData[i], imgData[i + 1], imgData[i + 2]));
// }
// vertexAt(i % img.width, Math.floor(i / img.width));
// }
// endShape();
// p.scale(0.25, 0.25);
// p.translate(this.x, this.y);

// return p;
// };
// }

function draw() {
  drawBorder();
}

function mousePressed() {}
