/* WebGL 2D library,
 * Written By: Montana Sebastiano
 * Last Updated: 2020-07-13 */

// TODO:
//  [x]   1. Fix aspect ratio 
//  [ ]   2. Audio Decoder.
//  [ ]   3. Image Decoder.
//  [ ]   4. Load images.
//  [ ]     i.  Sprites.
//  [ ]     ii. Spritesheets.
//  [ ]   5. Animations.
//  [ ]   6. Clipping (only draw what is needed)
//          i.  Canvas specific.
//          ii. Shape specific clipping (if two shapes intersect, do not draw the
//          section belonging to the shape which is drawn before/beneath the other.)
//     
//          Fig.1
//                  ____
//               __|__  |
//              |     | |
//              |_____| |
//                 |____|
//     
//          This illustration depicts a situation wherein a clipping method
//          should be implemented.
//          
//  [ ]   7. Move transformations and vertex calculations to GPU shader(s).


(function (MS2D) {
  document.body.setAttribute('onload', 'main()');

  MS2D = MS2D || window;
  const canvas = document.getElementById('webgl');
  MS2D.gl = canvas.getContext('webgl');

  if (!gl) {
    console.error('Failed to get the rendering context for WebGL');
    return;
  }

  const listenerWarningMsg = (type, elem) => {
    console.warn(`Ignoring instruction: ${type} is already bound to the ${elem} object`);
  }

  MS2D.LEFT_ARROW = 37;
  MS2D.UP_ARROW = 38;
  MS2D.RIGHT_ARROW = 39;
  MS2D.DOWN_ARROW = 40;
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
    if (typeof mousePressed === 'function') {}
    if (typeof mouseReleased === 'function') {}
  }

  MS2D.keyCode = () => {
    if (typeof window.event !== 'undefined') {
      return window.event.keyCode;
    }
    return null;
  }

  MS2D.key = () => {
    if (typeof window.event !== 'undefined') {
      return window.event.key;
    }
    return null;
  }

  const __Location = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/'));
  MS2D.getMS2DLocation = () => __Location;

  MS2D.MS2DLocation = getMS2DLocation();

  const __WIDTH = gl.drawingBufferWidth;
  const getWidth = () => __WIDTH;

  const __HEIGHT = gl.drawingBufferHeight;
  const getHeight = () => __HEIGHT;

  MS2D.WIDTH = getWidth();
  MS2D.HEIGHT = getHeight();

  MS2D.aspectRatio = WIDTH / HEIGHT;

  MS2D.xAspectRatio = aspectRatio < 1 ? aspectRatio : 1;
  MS2D.yAspectRatio = aspectRatio > 1 ? aspectRatio : 1;

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
  }

  MS2D.gl.adjustSize = val => {
    sizeChange = val;
    vertexBuffer = null;
  }

  MS2D.gl.adjustBuffer = val => {
    newBuffer = val
  }

  var drawingInfo = [];
  MS2D.getDrawingInfo = () => drawingInfo;

  MS2D.getPixelData = () => {}

  var drawing = false;
  var shapes = [];

  const vertexDataSize = 6;

  var _color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  };

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
  }

  MS2D.reset = () => {
    clear();
    setup();
  }

  MS2D.DIM_GRAY = rgba(105, 105, 105, 1.0);
  MS2D.SILVER = rgba(192, 192, 192, 1.0);
  MS2D.LIGHT_GRAY = rgba(223, 224, 220, 1.0);
  MS2D.WHITE = rgba(255, 255, 255, 1.0);
  MS2D.TAN = rgba(210, 180, 140, 1.0);
  MS2D.GOLD = rgba(212, 175, 55, 1.0);
  MS2D.VIOLET = rgba(105, 73, 124, 1.0);
  MS2D.DARK_GREEN = rgba(34, 139, 34, 1.0);
  MS2D.BROWN = rgba(165, 42, 42, 1.0);
  MS2D.BLACK = rgba(0, 0, 0, 1.0);
  MS2D.PURPLE = rgba(160, 0, 240, 1.0);
  MS2D.CYAN = rgba(0, 255, 255, 1.0);
  MS2D.BLUE = rgba(45, 100, 235, 1.0);
  MS2D.ORANGE = rgba(255, 165, 0, 1.0);
  MS2D.YELLOW = rgba(255, 255, 0, 1.0);
  MS2D.GREEN = rgba(115, 245, 20, 1.0);
  MS2D.RED = rgba(255, 0, 0, 1.0);

  MS2D.getFirstY = () => {
    const len = drawingInfo.length
      return drawingInfo[len - (vertexDataSize * shapes[__index].v.length) + 1]
  }

  MS2D.getFirstX = () => {
    const len = drawingInfo.length
      return drawingInfo[len - (vertexDataSize * shapes[__index].v.length)];
  }

  MS2D.convertX = x => (x / (canvas.width / 2)) - 1;
  MS2D.convertY = y => 1 - (y / (canvas.height / 2));

  MS2D.vertexAt = (x, y) => {
    if (drawing) {
      drawingInfo.push(convertX(x));
      drawingInfo.push(convertY(y));
      drawingInfo.push(color.r);
      drawingInfo.push(color.g);
      drawingInfo.push(color.b);
      drawingInfo.push(color.a);
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
  }
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
  }

  MS2D.fillTriangle = (x1, y1, x2, y2, x3, y3) => {
    const triangle = newShape();
    triangle.fill();
    vertexAt(x1, y1);
    vertexAt(x2, y2);
    vertexAt(x3, y3);
    endShape();
    return triangle;
  }

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

  MS2D.Circle = (x, y, r, pts = 361) => {
    const circle = newShape();
    circle.noFill();
    circle.cX = x + r;
    circle.cY = y + r;
    circle.r = r;
    circle.w,
    circle.h,
    circle.d = r * 2;
    for (let i = 0; i <= pts - 1; i++) {
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

  MS2D.fillCircle = (x, y, r, pts = 361) => {
    const circle = newShape();
    circle.fill();
    circle.cX = x + r;
    circle.cY = y + r;
    circle.r = r;
    circle.w,
    circle.h,
    circle.d = r * 2;
    for (let i = 0; i <= pts - 1; i++) {
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
    Rect(0, 0, canvas.width, canvas.height);
  };

  MS2D.include = file => {
    if (document.currentScript === null) {
      console.error('Error: No context found for `include(...)`')
      return;
    }
    const imported = document.createElement('script');
    imported.src = file;
    const fileLocation = imported.src.substring(0, document.currentScript.src.lastIndexOf('/'));
    const fileName = imported.src.substring(document.currentScript.src.lastIndexOf('/'));
    imported.src = `${fileLocation}${fileName}`;
    document.head.appendChild(imported);
  };

  MS2D.clone = originalObject => {
    if (originalObject === null || typeof originalObject !== 'object') {
      return originalObject
    }
    let cloneObject = originalObject.constructor();
    for (let key in originalObject) {
      cloneObject[key] = clone(originalObject[key]);
    }
    return cloneObject
  }
})();

include(`${MS2DLocation}/src/WebGL-setup.js`);
include(`${MS2DLocation}/src/cuon-matrix.js`);
include(`${MS2DLocation}/src/Vector.js`);
include(`${MS2DLocation}/src/Shape.js`);
include(`${MS2DLocation}/src/Controller.js`);
