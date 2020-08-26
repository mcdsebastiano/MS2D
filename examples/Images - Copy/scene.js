function setup() {
  let offscreenCanvas = document.createElement('canvas');
  const ctx = offscreenCanvas.getContext('2d');

  let img = new Image();
  img.src = '../chess/pieces/knight.png';

  img.onload = () => {
    offscreenCanvas.width = ctx.width = img.width * (WIDTH / img.width);
    offscreenCanvas.height = ctx.height = img.height * (HEIGHT / img.height);
    ctx.drawImage(img, 0, 0, ctx.width * (WIDTH / img.width), ctx.height);
    let imgData = ctx.getImageData(0, 0, ctx.width / 4, ctx.height).data;

    let lion = newShape();
    for (let i = 0; i < imgData.length; i++) {
      if (i % 4 == 0) {
      setColor({
        r: colorVal(imgData[i]),
        g: colorVal(imgData[i + 1]),
        b: colorVal(imgData[i + 2]),
        a: 1
      });
      }
      vertexAt(i % WIDTH, (i / WIDTH));
    }
    endShape();
    // lion.translate(250,250)
    // lion.scale(0.25, 0.25);
  };

}

function draw() {
  // drawBorder();
}
