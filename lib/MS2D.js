
(function (MS2D) {

  MS2D = MS2D || window;

  document.body.setAttribute('onload', 'main()');

  const __Location = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/'));
  MS2D.MS2DLocation = __Location;

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

  const canvas = document.getElementById('webgl');

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

    MS2D.WIDTH = clone(gl.drawingBufferWidth);
    MS2D.HEIGHT = clone(gl.drawingBufferHeight);

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

    MS2D.DIM_GRAY = rgba(105, 105, 105, 1.0);
    MS2D.SILVER = rgba(192, 192, 192, 1.0);
    MS2D.LIGHT_GRAY = rgba(223, 224, 220, 1.0);
    MS2D.WHITE = rgba(255, 255, 255, 1.0);
    MS2D.LIGHT_TAN = rgba(198, 189, 156, 1.0);
    MS2D.TAN = rgba(210, 180, 140, 1.0);
    MS2D.GOLD = rgba(212, 175, 55, 1.0);
    MS2D.VIOLET = rgba(105, 73, 124, 1.0);
    MS2D.DARK_GREEN = rgba(34, 139, 34, 1.0);
    MS2D.BROWN = rgba(165, 42, 42, 1.0);
    MS2D.LIGHT_BROWN = rgba(165, 132, 99, 1.0);
    MS2D.BLACK = rgba(0, 0, 0, 1.0);
    MS2D.PURPLE = rgba(160, 0, 240, 1.0);
    MS2D.CYAN = rgba(0, 255, 255, 1.0);
    MS2D.BLUE = rgba(45, 100, 235, 1.0);
    MS2D.ORANGE = rgba(255, 165, 0, 1.0);
    MS2D.YELLOW = rgba(255, 255, 0, 1.0);
    MS2D.GREEN = rgba(115, 245, 20, 1.0);
    MS2D.RED = rgba(255, 0, 0, 1.0);
    MS2D.MAROON = rgba(106, 30, 32, 1.0);
    MS2D.BEIGE = rgba(229, 198, 170, 1.0);
    MS2D.OFF_WHITE = rgba(248, 248, 255, 1.0);
    MS2D.CHARCOAL = rgba(24, 24, 24, 1.0);

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
        shapes[i].paint();
      }
    };

    MS2D.getLastShape = () => shapes[__index - 1];
    MS2D.getShape = () => shapes[__index];

    MS2D.newShape = () => {
      //check if the current shape has been closed before a new one can be
      //created.
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
    MS2D.loop = () => refresh = true;

    MS2D.map = (n, start1, end1, start2, end2) => ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

    MS2D.drawBorder = () => {
      setColor(BLACK);
      Rect(0, 0, WIDTH, HEIGHT);
    };

  });

})();

include(`${MS2DLocation}/src/WebGL-setup.js`);
include(`${MS2DLocation}/src/cuon-matrix.js`);
include(`${MS2DLocation}/src/Vector.js`);
include(`${MS2DLocation}/src/Shape.js`);
