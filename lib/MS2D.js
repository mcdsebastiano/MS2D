/* TODO:
 * 1. Culling/Clipping
 * 2. Support spritesheets for textures;
 * 3. eliminate use of "window." */

(function () {

    document.body.setAttribute("onload", "main()");

    var drawing = false;
    var shapes = [];

    window.canvas = document.getElementById('webgl');

    window.WIDTH = canvas.clientWidth;
    window.HEIGHT = canvas.clientHeight;
    window.ARROW_RIGHT = 39;
    window.ARROW_LEFT = 37;
    window.ARROW_DOWN = 40;
    window.ARROW_UP = 38;
    window.SPACE_BAR = 32;

    window.drawingInfo = [];
    window.eye = {

        x: 0,
        y: 0
    };

    window.sourceLocation = document.currentScript.src.substring(0, document.currentScript.src.lastIndexOf('/'));

    window.include = file => {
        if (document.currentScript === null) {
            console.error(`Error: No context found for 'include(${file})'`);
            return;
        }
        const fileLocation = file.substring(0, document.currentScript.src.lastIndexOf('/'));
        const fileName = file.substring(document.currentScript.src.lastIndexOf('/'));
        const imported = document.createElement('script');
        imported.src = `${fileLocation}${fileName}`;
        document.head.appendChild(imported);
    };

    window.addEventListener('DOMContentLoaded', () => {

        window.gl = canvas.getContext("webgl");

        if (!gl) {
            console.error('Failed to get the rendering context for WebGL');
            return;
        }

        window.clone = originalObject => {
            if (originalObject === null || typeof originalObject !== 'object') {
                return originalObject;
            }
            let cloneObject = originalObject.constructor();
            for (let key in originalObject) {
                cloneObject[key] = clone(originalObject[key]);
            }
            return cloneObject;
        };

        window.cloneClass = obj => {
            return Object.create(
                Object.getPrototypeOf(obj),
                Object.getOwnPropertyDescriptors(obj));
        };

        window.initControllers = () => {
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

        window.keyCode = () => {
            if (typeof window.event !== 'undefined') {
                return window.event.keyCode;
            }
            return null;
        };

        window.key = () => {
            if (typeof window.event !== 'undefined') {
                return window.event.key;
            }
            return null;
        };

        window.mouseX = () => {
            if (typeof window.event !== 'undefined') {
                return window.event.clientX - canvasRectLeft();
            }
            return null;
        };

        window.mouseY = () => {
            if (typeof window.event !== 'undefined') {
                return window.event.clientY - canvasRectTop();
            }
            return null;
        };

        var __index = 0;

        var vertexBuffer = null;
        window.getBufferData = () => vertexBuffer;

        var refresh = true;
        window.needRefresh = () => refresh === true;

        var newBuffer = true;
        window.isNewBuffer = () => newBuffer === true;

        var sizeChange = true;
        window.changedBufferSizes = () => sizeChange === true;

        window.createEmptyVertexBuffer = () => {
            vertexBuffer = gl.createBuffer();
            newBuffer = true;
        };

        window.setBufferSizeChangedFlag = flag => {
            sizeChange = flag;
            vertexBuffer = null;
        };

        window.setNewBufferFlag = flag => {
            newBuffer = flag;
        };

        var _color = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        };
        window.color = _color;
        window.colorVal = value => value / 255;
        window.setAlpha = alpha => _color.a = alpha;
        window.setColor = newColor => _color = newColor;
        window.clearColor = (c, a) => gl.clearColor(c.r, c.g, c.b, !a ? c.a : a);

        window.rgba = (r, g, b, a) => {
            return {
                r: colorVal(r),
                g: colorVal(g),
                b: colorVal(b),
                a: !a ? 1 : a
            };
        };

        window.clearCanvas = () => {
            __index = 0;
            drawingInfo = [];
            shapes = [];
            gl.clear(gl.COLOR_BUFFER_BIT);
        };

        window.resetCanvas = () => {
            clearCanvas();
            setup();
        };

        window.DIMGRAY = {
            r: 105 / 255,
            g: 105 / 255,
            b: 105 / 255,
            a: 1.0
        };
        window.GRAY = {
            r: 128 / 255,
            g: 128 / 255,
            b: 128 / 255,
            a: 1.0
        };
        window.LIGHTGRAY = {
            r: 223 / 255,
            g: 224 / 255,
            b: 220 / 255,
            a: 1.0
        };
        window.SILVER = {
            r: 192 / 255,
            g: 192 / 255,
            b: 192 / 255,
            a: 1.0
        };
        window.WHITE = {
            r: 1,
            g: 1,
            b: 1,
            a: 1.0
        };
        window.LIGHTTAN = {
            r: 198 / 255,
            g: 189 / 255,
            b: 156 / 255,
            a: 1.0
        };
        window.TAN = {
            r: 210 / 255,
            g: 180 / 255,
            b: 140 / 255,
            a: 1.0
        };
        window.GOLD = {
            r: 212 / 255,
            g: 175 / 255,
            b: 55 / 255,
            a: 1.0
        };
        window.VIOLET = {
            r: 105 / 255,
            g: 73 / 255,
            b: 124 / 255,
            a: 1.0
        };
        window.DARKGREEN = {
            r: 34 / 255,
            g: 139 / 255,
            b: 34 / 255,
            a: 1.0
        };
        window.BROWN = {
            r: 165 / 255,
            g: 42 / 255,
            b: 42 / 255,
            a: 1.0
        };
        window.LIGHTBROWN = {
            r: 165 / 255,
            g: 132 / 255,
            b: 99 / 255,
            a: 1.0
        };
        window.BLACK = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };
        window.PURPLE = {
            r: 160 / 255,
            g: 0,
            b: 240 / 255,
            a: 1.0
        };
        window.BLUE = {
            r: 45 / 255,
            g: 100 / 255,
            b: 235 / 255,
            a: 1.0
        };
        window.ORANGE = {
            r: 255 / 255,
            g: 165 / 255,
            b: 0,
            a: 1.0
        };
        window.YELLOW = {
            r: 255 / 255,
            g: 255 / 255,
            b: 0,
            a: 1.0
        };
        window.GREEN = {
            r: 115 / 255,
            g: 245 / 255,
            b: 20 / 255,
            a: 1.0
        };
        window.RED = {
            r: 255 / 255,
            g: 0,
            b: 0,
            a: 1.0
        };
        window.MAROON = {
            r: 106 / 255,
            g: 30 / 255,
            b: 32 / 255,
            a: 1.0
        };
        window.BEIGE = {
            r: 229 / 255,
            g: 198 / 255,
            b: 170 / 255,
            a: 1.0
        };
        window.OFFWHITE = {
            r: 248 / 255,
            g: 248 / 255,
            b: 1,
            a: 1.0
        };
        window.WHITESMOKE = {
            r: 245 / 255,
            g: 245 / 255,
            b: 245 / 255,
            a: 1.0
        };
        window.CHARCOAL = {
            r: 24 / 255,
            g: 24 / 255,
            b: 24 / 255,
            a: 1.0
        };
        window.CYAN = {
            r: 0,
            g: 1,
            b: 1,
            a: 1.0
        };

        window.CLEAR = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        };

        window.noFill = (newColor) => {
            newColor = newColor || _color;
            setColor(newColor);
            shapes[__index].noFill();
        };

        window.fill = (newColor, alpha) => {
            newColor = newColor || _color;
            setColor(newColor);
            shapes[__index].fill();
        };

        window.pt = newColor => {
            newColor = newColor || _color;
            setColor(newColor);
            shapes[__index].pt();
        };

        // lookAt = function(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        // setOrtho = function(left, right, bottom, top, near, far) {
        window.drawContent = () => {
            globals.VpMatrix.setOrtho(0, 1, 0, 1, 1, -1);
            globals.VpMatrix.lookAt(eye.x / WIDTH, 1, 0, eye.x / WIDTH, 1, 1, 0, -1, 0);
            globals.VpMatrix.translate(1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight, 1);
            globals.VpMatrix.scale(1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight, 1)

            for (let i = 0; i < shapes.length; i++) {

                let verticesPastBounds = shapes[i].v.filter(vertex => vertex.x < -shapes[i].w || vertex.x > WIDTH + shapes[i].w || vertex.y < -shapes[i].h || vertex.y > HEIGHT + shapes[i].h);

                if (verticesPastBounds.length === shapes[i].v.length) {
                    continue;
                }

                if (typeof shapes[i].texture != "undefined") {
                    gl.uniform1f(uniforms.UseTexture, 1.0);
                    gl.bindTexture(gl.TEXTURE_2D, shapes[i].texture.image);
                    gl.uniform1i(uniforms.Texture, 0);
                };

                gl.uniformMatrix4fv(uniforms.ModelMatrix, false, shapes[i].matrix.elements);
                gl.uniformMatrix4fv(uniforms.VpMatrix, false, globals.VpMatrix.elements);
                gl.drawArrays(shapes[i].mode, shapes[i].offset, shapes[i].v.length);

                // @Cleanup
                // @Speed
                // because im lazy this works for now.
                gl.uniform1f(uniforms.UseTexture, 0.0);
            }

        };

        window.lastShape = () => shapes[__index - 1];
        window.currentShape = () => shapes[__index];

        // TODO: check if the current shape has been closed before a new one can be created.
        window.newShape = () => {

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

        window.endShape = () => {
            refresh = true;
            drawing = false;

            let vertMaxX = Number.MIN_SAFE_INTEGER;
            let vertMinX = Number.MAX_SAFE_INTEGER;

            let vertMaxY = Number.MIN_SAFE_INTEGER;
            let vertMinY = Number.MAX_SAFE_INTEGER;

            shapes[__index].v.forEach(vertex => {

                if (vertex.x > vertMaxX) {
                    vertMaxX = vertex.x;
                }
                if (vertex.x < vertMinX) {
                    vertMinX = vertex.x;
                }

                if (vertex.y > vertMaxY) {
                    vertMaxY = vertex.y;
                }
                if (vertex.y < vertMinY) {
                    vertMinY = vertex.y;
                }

            });

            shapes[__index].w = vertMaxX - vertMinX;
            shapes[__index].h = vertMaxY - vertMinY;

            __index++;
        };
        let tIdx = 0;
        window.vertexAt = (x, y) => {
            if (drawing === true) {
                let tx = 0;
                let ty = 0;

                // TODO: spritesheets/texture maps
                if (typeof shapes[__index].texture != "undefined") {
                    let w = shapes[__index].texture.width;
                    let h = shapes[__index].texture.height;

                    let textureCoords = [
                        0.0, 0.0,
                        1.0, 0.0,
                        1.0, 1.0,
                        0.0, 1.0,
                    ];

                    tx = textureCoords[tIdx];
                    ty = textureCoords[tIdx + 1];

                    tIdx += 2;
                    tIdx %= 8;
                }

                drawingInfo.push(x, y, _color.r, _color.g, _color.b, _color.a, tx, ty);
                shapes[__index].v.push(new Vector(x, y));
            }
        };

        window.drawLine = (x0, y0, x1, y1) => {
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

        window.Triangle = (x1, y1, x2, y2, x3, y3) => {
            const triangle = newShape();
            triangle.noFill();
            vertexAt(x1, y1);
            vertexAt(x2, y2);
            vertexAt(x3, y3);
            endShape();
            return triangle;
        };

        window.fillTriangle = (x1, y1, x2, y2, x3, y3) => {
            const triangle = newShape();
            triangle.fill();
            vertexAt(x1, y1);
            vertexAt(x2, y2);
            vertexAt(x3, y3);
            endShape();
            return triangle;
        };

        window.Quad = (x, y, w) => {
            const quad = newShape();
            noFill();
            quad.w = w;
            quad.h = w;

            vertexAt(x, y + w);
            vertexAt(x, y);
            vertexAt(x + w, y);

            vertexAt(x, y + w);
            vertexAt(x + w, y);
            vertexAt(x + w, y + w);

            endShape();
            return quad;
        };

        window.Rect = (x, y, w, h) => {
            const rect = newShape();
            noFill();
            rect.w = w;
            rect.h = h;
            drawLine(x, y, x + w, y);
            drawLine(x + w, y + h, x, y + h);
            rect.x = rect.v[0].x
                rect.y = rect.v[0].y
                endShape();
            return rect;
        };

        window.fillRect = (x, y, w, h) => {
            const rect = newShape();
            rect.fill();
            rect.w = w;
            rect.h = h;
            drawLine(x, y, x + w, y);
            drawLine(x + w, y + h, x, y + h);
            endShape();
            return rect;
        };

        window.Circle = (x, y, r, pts = 360) => {
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

        window.fillCircle = (x, y, r, pts = 360) => {
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

        window.noLoop = () => refresh = false;
        window.loop = () => {
            refresh = true;
            requestAnimationFrame(updateLoop);
        };

        window.map = (n, start1, end1, start2, end2) => ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

        window.drawBorder = () => {
            Rect(eye.x, eye.y, WIDTH - 2, HEIGHT - 2);

        };

        window.getCanvasRect = () => canvas.getBoundingClientRect();
        window.canvasRectBottom = () => getCanvasRect().bottom;
        window.canvasRectRight = () => getCanvasRect().right;
        window.canvasRectLeft = () => getCanvasRect().left;
        window.canvasRectTop = () => getCanvasRect().top;

        window.dragCoords = {
            x: 0,
            y: 0
        };

        window.dragX = () => dragCoords.x;
        window.dragY = () => dragCoords.y;

        window.dragging = false;
        window.isDragging = () => dragging === true;

        window.dragStart = (startX, startY, shapeX, shapeY, shapeWidth, shapeHeight) => {
            if (startX >= shapeX && startX <= shapeX + shapeWidth && startY >= shapeY && startY <= shapeY + shapeHeight) {
                dragging = true;
                dragCoords.x = startX - shapeX;
                dragCoords.y = startY - shapeY;
                return {};
            }
            return undefined;
        };

        window.dragMove = (xOffset, yOffset) => {
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

        window.dragEnd = () => {
            if (dragging === true) {
                dragging = false;
            }
        };

        window.GL_TEXTURE = [];
        window.createSprite = (path) => {

            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            var image = new Image();
            image.src = path;
            image.onload = function () {

                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);

            };

            GL_TEXTURE.push({
                width: image.width,
                height: image.height,
                image: texture
            });

        };

        window.drawSprite = (x, y, texture, w, h) => {
            w = w || texture.width;
            h = h || texture.height;
            const sprite = newShape();
            sprite.fill();
            sprite.texture = texture;
            sprite.w = w;
            sprite.h = h;
            drawLine(x, y, x + w, y);
            drawLine(x + w, y + h, x, y + h);
            sprite.x = sprite.v[0].x;
            sprite.y = sprite.v[0].y;
            endShape();
            return sprite;
        };
    });

})();

include(`${sourceLocation}/src/WebGL-setup.js`);
include(`${sourceLocation}/src/cuon-matrix.js`);
include(`${sourceLocation}/src/Vector.js`);
include(`${sourceLocation}/src/Shape.js`);
