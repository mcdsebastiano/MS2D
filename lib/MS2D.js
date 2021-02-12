(function (MS2D) {

  MS2D = MS2D || window;

  document.body.setAttribute('onload', 'main()');

  let canvas = document.getElementById('webgl');
  
  if(typeof canvas === 'undefined' || canvas === null) {
    canvas = {
      width: 0,
      height: 0,
      getContext: function() {
        return;
      }
    };
  }

  const __Location = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/'));
  MS2D.MS2DLocation = __Location;

  MS2D.WIDTH = canvas.width;
  MS2D.HEIGHT = canvas.height;

  MS2D.include = file => {
    if (document.currentScript === null) {
      console.error(`Error: No context found for 'include(${file})'`);
      return;
    }
    const imported = document.createElement('script');
    imported.src = file;
    const fileLocation = imported.src.substring(0, document.currentScript.src.lastIndexOf('/'));
    const fileName = imported.src.substring(document.currentScript.src.lastIndexOf('/'));
    imported.src = `${fileLocation}${fileName}`;
    document.head.appendChild(imported);
  };

  MS2D.addEventListener('DOMContentLoaded', () => {
    
    MS2D.gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('Failed to get the rendering context for WebGL');
      return;
    }
      
    const dragCoords = {
      x: 0,
      y: 0
    };

    MS2D.dragX = () => dragCoords.x;
    MS2D.dragY = () => dragCoords.y;

    let dragging = false;

    MS2D.isDragging = () => dragging === true;

    MS2D.dragStart = (startX, startY, shapeX, shapeY, shapeWidth, shapeHeight) => {
      if (startX >= shapeX && startX <= shapeX + shapeWidth && startY >= shapeY && startY <= shapeY + shapeHeight) {
        dragging = true;
        dragCoords.x = startX - shapeX;
        dragCoords.y = startY - shapeY;
        return {};
      }
      return undefined;
    };

    MS2D.dragMove = (xOffset, yOffset) => {

      if (mouseX() <= 0 || mouseX() >= WIDTH - 1 || mouseY() <= 0 || mouseY() >= HEIGHT - 1) {
        dragging = false;
      }

      if (dragging === true) {
        x = mouseX() - xOffset;
        y = mouseY() - yOffset;

        return {
          x,
          y
        };
      }

      return undefined;
    };

    MS2D.dragEnd = () => {
      if (dragging === true) {
        dragging = false;
      }
    };

    const getCanvasRect = () => canvas.getBoundingClientRect();
    MS2D.canvasRectBottom = () => getCanvasRect().bottom;
    MS2D.canvasRectRight = () => getCanvasRect().right;
    MS2D.canvasRectLeft = () => getCanvasRect().left;
    MS2D.canvasRectTop = () => getCanvasRect().top;

    MS2D.ARROW_RIGHT = 39;
    MS2D.ARROW_LEFT = 37;
    MS2D.ARROW_DOWN = 40;
    MS2D.ARROW_UP = 38;
    MS2D.SPACE_BAR = 32;

    MS2D.initControllers = () => {
      if (typeof keyPressed === 'function') {
        if (window.onkeydown === null) {
          window.onkeydown = keyPressed;
        }
      }
      if (typeof keyReleased === 'function') {
        if (window.onkeyup === null) {
          window.onkeyup = keyReleased;
        }
      }
      if (typeof mousePressed === 'function') {
        if (window.onmousedown === null) {
          canvas.onmousedown = mousePressed;
        }
      }
      if (typeof mouseReleased === 'function') {
        if (window.onmouseup === null) {
          canvas.onmouseup = mouseReleased;
        }
      }
      if (typeof mouseMove === 'function') {
        if (window.onmousemove === null) {
          canvas.onmousemove = mouseMove;
        }
      }
    };

    MS2D.keyCode = () => {
      if (typeof window.event !== 'undefined') {
        return window.event.keyCode;
      }
      return null;
    };

    MS2D.key = () => {
      if (typeof window.event !== 'undefined') {
        return window.event.key;
      }
      return null;
    };

    MS2D.mouseX = () => {
      if (typeof window.event !== 'undefined') {
        return window.event.clientX - canvasRectLeft();
      }
      return null;
    };

    MS2D.mouseY = () => {
      if (typeof window.event !== 'undefined') {
        return window.event.clientY - canvasRectTop();
      }
      return null;
    };

    MS2D.clone = originalObject => {
      if (originalObject === null || typeof originalObject !== 'object') {
        return originalObject;
      }
      let cloneObject = originalObject.constructor();
      for (let key in originalObject) {
        cloneObject[key] = clone(originalObject[key]);
      }
      return cloneObject;
    };

    MS2D.cloneClass = obj => {
      return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj));
    };

    var __index = 0;

    var refresh = true;
    MS2D.gl.refresh = () => refresh === true;

    var newBuffer = true;
    MS2D.gl.isNewBuffer = () => newBuffer === true;

    var sizeChange = true;
    MS2D.gl.sizeChanged = () => sizeChange === true;

    var vertexBuffer = null;
    MS2D.gl.vertexBuffer = () => vertexBuffer;

    MS2D.gl.createEmptyVertexBuffer = () => {
      vertexBuffer = gl.createBuffer();
      newBuffer = true;
    };

    MS2D.gl.adjustSize = val => {
      sizeChange = val;
      vertexBuffer = null;
    };

    MS2D.gl.adjustBuffer = val => {
      newBuffer = val;
    };

    var drawingInfo = [];
    MS2D.getDrawingInfo = () => drawingInfo;

    MS2D.getPixelData = () => {};

    var drawing = false;
    var shapes = [];

    MS2D.debugShapesInfo = shapes;

    const vertexDataSize = 6;

    var _color = {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    };

    MS2D.color = _color;

    MS2D.colorVal = value => value / 255;
    MS2D.setAlpha = alpha => color.a = alpha;
    MS2D.setColor = newColor => color = newColor;
    MS2D.clearColor = (c, a) => gl.clearColor(c.r, c.g, c.b, !a ? c.a : a);

    MS2D.rgba = (r, g, b, a) => {
      return {
        r: MS2D.colorVal(r),
        g: MS2D.colorVal(g),
        b: MS2D.colorVal(b),
        a: !a ? 1 : a
      };
    };

    MS2D.clear = () => {
      __index = 0;
      drawingInfo = [];
      shapes = [];
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    MS2D.reset = () => {
      clear();
      setup();
    };

    MS2D.DIMGRAY = {
      r: 105 / 255,
      g: 105 / 255,
      b: 105 / 255,
      a: 1.0
    };
    MS2D.GRAY = {
      r: 128 / 255,
      g: 128 / 255,
      b: 128 / 255,
      a: 1.0
    };
    MS2D.LIGHTGRAY = {
      r: 223 / 255,
      g: 224 / 255,
      b: 220 / 255,
      a: 1.0
    };
    MS2D.SILVER = {
      r: 192 / 255,
      g: 192 / 255,
      b: 192 / 255,
      a: 1.0
    };
    MS2D.WHITE = {
      r: 1,
      g: 1,
      b: 1,
      a: 1.0
    };
    MS2D.LIGHTTAN = {
      r: 198 / 255,
      g: 189 / 255,
      b: 156 / 255,
      a: 1.0
    };
    MS2D.TAN = {
      r: 210 / 255,
      g: 180 / 255,
      b: 140 / 255,
      a: 1.0
    };
    MS2D.GOLD = {
      r: 212 / 255,
      g: 175 / 255,
      b: 55 / 255,
      a: 1.0
    };
    MS2D.VIOLET = {
      r: 105 / 255,
      g: 73 / 255,
      b: 124 / 255,
      a: 1.0
    };
    MS2D.DARKGREEN = {
      r: 34 / 255,
      g: 139 / 255,
      b: 34 / 255,
      a: 1.0
    };
    MS2D.BROWN = {
      r: 165 / 255,
      g: 42 / 255,
      b: 42 / 255,
      a: 1.0
    };
    MS2D.LIGHTBROWN = {
      r: 165 / 255,
      g: 132 / 255,
      b: 99 / 255,
      a: 1.0
    };
    MS2D.BLACK = {
      r: 0,
      g: 0,
      b: 0,
      a: 1.0
    };
    MS2D.PURPLE = {
      r: 160 / 255,
      g: 0,
      b: 240 / 255,
      a: 1.0
    };
    MS2D.BLUE = {
      r: 45 / 255,
      g: 100 / 255,
      b: 235 / 255,
      a: 1.0
    };
    MS2D.ORANGE = {
      r: 255 / 255,
      g: 165 / 255,
      b: 0,
      a: 1.0
    };
    MS2D.YELLOW = {
      r: 255 / 255,
      g: 255 / 255,
      b: 0,
      a: 1.0
    };
    MS2D.GREEN = {
      r: 115 / 255,
      g: 245 / 255,
      b: 20 / 255,
      a: 1.0
    };
    MS2D.RED = {
      r: 255 / 255,
      g: 0,
      b: 0,
      a: 1.0
    };
    MS2D.MAROON = {
      r: 106 / 255,
      g: 30 / 255,
      b: 32 / 255,
      a: 1.0
    };
    MS2D.BEIGE = {
      r: 229 / 255,
      g: 198 / 255,
      b: 170 / 255,
      a: 1.0
    };
    MS2D.OFFWHITE = {
      r: 248 / 255,
      g: 248 / 255,
      b: 1,
      a: 1.0
    };
    MS2D.WHITESMOKE = {
      r: 245 / 255,
      g: 245 / 255,
      b: 245 / 255,
      a: 1.0
    };
    MS2D.CHARCOAL = {
      r: 24 / 255,
      g: 24 / 255,
      b: 24 / 255,
      a: 1.0
    };
    MS2D.CYAN = {
      r: 0,
      g: 1,
      b: 1,
      a: 1.0
    };

    MS2D.getFirstY = () => {
      const len = drawingInfo.length;
      return drawingInfo[len - (vertexDataSize * shapes[__index].v.length) + 1];
    };

    MS2D.getFirstX = () => {
      const len = drawingInfo.length;
      return drawingInfo[len - (vertexDataSize * shapes[__index].v.length)];
    };

    MS2D.convertX = x => (x / (canvas.width / 2)) - 1;
    MS2D.convertY = y => 1 - (y / (canvas.height / 2));

    MS2D.isDrawing = val => drawing = val;

    MS2D.vertexAt = (x, y) => {
      if (drawing === true) {
        let xx = convertX(x);
        let yy = convertY(y);
        drawingInfo.push(xx, yy, color.r, color.g, color.b, color.a);
        shapes[__index].v.push({
          x,
          y
        });
      }
    };

    MS2D.noFill = (newColor) => {
      newColor = newColor || color;
      setColor(newColor);
      shapes[__index].noFill();
    };

    MS2D.fill = (newColor, alpha) => {
      newColor = newColor || color;
      setColor(newColor);
      shapes[__index].fill();
    };

    MS2D.pt = newColor => {
      newColor = newColor || color;
      setColor(newColor);
      shapes[__index].pt();
    };

    MS2D.drawShapeArray = () => {
      for (let i = 0; i < __index; i++) {
        gl.uniformMatrix4fv(gl.program.u_ModelMatrix, false, shapes[i].matrix.elements);
        gl.drawArrays(shapes[i].mode, shapes[i].offset, shapes[i].v.length);
      }

    };

    MS2D.lastShape = () => shapes[__index - 1];
    MS2D.currentShape = () => shapes[__index];

    // TODO: check if the current shape has been closed before a new one
    // can be created.
    MS2D.newShape = () => {
      drawing = true;
      sizeChange = true;
      refresh = false;
      shapes[__index] = new Shape();
      let offset;
      if (__index > 0) {
        offset = shapes[__index - 1].offset + shapes[__index - 1].v.length;
      } else {
        offset = 0;
      }
      shapes[__index].offset = offset;
      return shapes[__index];
    };

    MS2D.endShape = () => {
      refresh = true;
      drawing = false;
      shapes[__index].x = (WIDTH / 2) * (getFirstX() + 1);
      shapes[__index].y = HEIGHT - (1 + getFirstY()) * (HEIGHT / 2);
      __index++;
    };

    MS2D.drawLine = (x0, y0, x1, y1) => {
      // this means we're drawing without having made a shape so..
      if (__index == shapes.length) {
        // even a line is a shape
        const line = newShape();
        line.noFill();
        vertexAt(x0, y0);
        vertexAt(x1, y1);
        endShape();
        return line;
      }
      // otherwise just add the vertices
      vertexAt(x0, y0);
      vertexAt(x1, y1);
    };

    MS2D.Triangle = (x1, y1, x2, y2, x3, y3) => {
      const triangle = newShape();
      triangle.noFill();
      vertexAt(x1, y1);
      vertexAt(x2, y2);
      vertexAt(x3, y3);
      endShape();
      return triangle;
    };

    MS2D.fillTriangle = (x1, y1, x2, y2, x3, y3) => {
      const triangle = newShape();
      triangle.fill();
      vertexAt(x1, y1);
      vertexAt(x2, y2);
      vertexAt(x3, y3);
      endShape();
      return triangle;
    };

    MS2D.Rect = (x, y, w, h) => {
      const rect = newShape();
      noFill();
      rect.w = w;
      rect.h = h;
      drawLine(x, y, x + w, y);
      drawLine(x + w, y + h, x, y + h);
      endShape();
      return rect;
    };

    MS2D.fillRect = (x, y, w, h) => {
      const rect = newShape();
      rect.fill();
      rect.w = w;
      rect.h = h;
      drawLine(x, y, x + w, y);
      drawLine(x + w, y + h, x, y + h);
      endShape();
      return rect;
    };

    MS2D.Circle = (x, y, r, pts = 360) => {
      const circle = newShape();
      circle.noFill();
      circle.cX = x + r;
      circle.cY = y + r;
      circle.r = r;
      circle.w = r * 2;
      circle.h = r * 2;
      circle.d = r * 2;
      for (let i = 0; i < pts; i++) {
        let angle = i * Math.PI / 180;
        let xx = r * Math.sin(angle);
        let yy = r * Math.cos(angle);
        xx += x;
        yy += y;
        vertexAt(xx + circle.r, yy + circle.r);
      }
      endShape();
      return circle;
    };

    MS2D.fillCircle = (x, y, r, pts = 360) => {
      const circle = newShape();
      circle.fill();
      circle.cX = x + r;
      circle.cY = y + r;
      circle.r = r;
      circle.w = r * 2;
      circle.h = r * 2;
      circle.d = r * 2;
      for (let i = 0; i < pts; i++) {
        let angle = i * Math.PI / 180;
        let xx = r * Math.sin(angle);
        let yy = r * Math.cos(angle);
        xx += x;
        yy += y;
        vertexAt(xx + circle.r, yy + circle.r);
      }
      endShape();
      return circle;
    };

    MS2D.noLoop = () => refresh = false;
    MS2D.loop = () => {
      refresh = true
        requestAnimationFrame(updateLoop);
    };

    MS2D.map = (n, start1, end1, start2, end2) => ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

    MS2D.drawBorder = () => {
      setColor(BLACK);
      Rect(0, 0, WIDTH, HEIGHT);
    };


    MS2D.putImageData = (imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) => {
    console.log(imageData);

    dx = dx || 0;
    dy = dy || 0;
    const {
      data,
      height,
      width
    } = imageData;

    console.log(data, height, width);

    dirtyX = dirtyX || 0;
    dirtyY = dirtyY || 0;

    dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
    dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;

    var limitBottom = dirtyY + dirtyHeight;
    var limitRight = dirtyX + dirtyWidth;

    for (var y = dirtyY; y < limitBottom; y++) {
      for (var x = dirtyX; x < limitRight; x++) {
        let pos = y * width + x;
        // setColor(BLACK);
        setColor(rgba(data[pos * 4 + 0], data[pos * 4 + 1], data[pos * 4 + 2], data[pos * 4 + 3]));
        newShape();
        vertexAt(x + dx, y + dy, 1, 1);
        endShape();

      }
    }
  };

  });

  // let __developerModeOn = false;
  // MS2D.developerMode = () => {
    // if (__developerModeOn === false) {
      // TODO: do a check to see if the server/script is running
      // const __livereload = document.createElement('script');
      // __livereload.innerText = `document.write('<script src="http://${(location.host || 'localhost').split(':')[0]}:35729/livereload.js?snipver=1"></script>')`;
      // document.body.appendChild(__livereload);
      // developerModeOn = true;
    // } else {
      // developerModeOn = false;
    // }

  // }

})();

include(`${MS2DLocation}/src/WebGL-setup.js`);
include(`${MS2DLocation}/src/cuon-matrix.js`);
include(`${MS2DLocation}/src/Vector.js`);
include(`${MS2DLocation}/src/Shape.js`);
