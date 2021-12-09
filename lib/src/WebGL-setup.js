const VSHADER_SOURCE = `
    attribute vec2 a_TextureCoords;
    attribute float a_PointSize;
    attribute vec4 a_Position;
    attribute vec4 a_Color;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_VpMatrix;

    varying vec2 v_TextureCoords;
    varying vec4 v_Color;

    void main() {
        mat4 mvpMatrix = u_VpMatrix * u_ModelMatrix;
        vec4 adjustedPosition = mvpMatrix * a_Position;
        gl_Position = adjustedPosition;
        gl_PointSize = a_PointSize;

        v_TextureCoords = a_TextureCoords;
        v_Color = a_Color;
    }
`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;

    uniform sampler2D u_Texture;
    uniform float u_UseTexture;

    varying vec2 v_TextureCoords;

    void main() {
        if(u_UseTexture == 1.0) {
            gl_FragColor = texture2D(u_Texture, v_TextureCoords);
        } else {
            gl_FragColor = v_Color;
        }

}
`;
// @Cleanup -- Everything below should be in the IIFE
let attributes = {};
let uniforms = {};
let globals = {};
let vertices;
let FSIZE;
let program;
let need_update = false;
document.body.onpageshow = () => {
	
    if (typeof setup === 'function') {
        setup();
        initControllers();
        if (typeof draw === 'function') {
            // true so we always paint at least once.
			// draw();
            need_update = true;
            requestAnimationFrame(updateLoop);
        }
    }
}
const updateLoop = () => {
    try {
        if (needRefresh() === true) {
            if (typeof keyPressed === 'function'
                 || typeof keyReleased === 'function'
                 || typeof mousePressed === 'function'
                 || typeof mouseMove === 'function'
                 || typeof mouseReleased === 'function'
                 || typeof update === 'function') {
                need_update = true;
            }
			
				
            if (need_update === true) {
                clearCanvas();
                if (typeof update === 'function') {
                    update();
                } else {
                    draw();
                }
                requestAnimationFrame(updateLoop);
                need_update = false;
            }

            initBuffer(gl, drawingInfo);
            drawContent();
        }
    } catch (err) {
        console.error(err);
        noLoop();
    }
}

function main() {
    try {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        program = createProgramFromSource(gl, VSHADER_SOURCE, FSHADER_SOURCE);

        gl.useProgram(program);

        attributes.TextureCoords = gl.getAttribLocation(program, 'a_TextureCoords');
        attributes.PointSize = gl.getAttribLocation(program, 'a_PointSize');
        attributes.Position = gl.getAttribLocation(program, 'a_Position');
        attributes.Color = gl.getAttribLocation(program, 'a_Color');

        uniforms.ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
        uniforms.VpMatrix = gl.getUniformLocation(program, 'u_VpMatrix');
		
        uniforms.UseTexture = gl.getUniformLocation(program, "u_UseTexture");
        uniforms.Texture = gl.getUniformLocation(program, 'u_Texture');

        gl.vertexAttrib1f(attributes.PointSize, 1.0);
        
        // not sure if this is doing anything
        resizeCanvasToDisplaySize(canvas);

        globals.VpMatrix = new Matrix4();

        gl.viewport(0, 0, WIDTH, HEIGHT);

    } catch (err) {
        console.error(err);
		noLoop();
    }
}


function initBuffer(gl, data) {
    if (changedBufferSizes() === true && getBufferData()) {
        gl.disableVertexAttribArray(attributes.Position);
        gl.disableVertexAttribArray(attributes.Color);
        gl.deleteBuffer(getBufferData());
        setBufferSizeChangedFlag(false);
    }

    if (getBufferData() === null) {
        createEmptyVertexBuffer();
        setNewBufferFlag(true);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, getBufferData());

    if (isNewBuffer() === true) {
        vertices = new Float32Array(data);
        FSIZE = vertices.BYTES_PER_ELEMENT;
        setNewBufferFlag(false);
    }

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(attributes.Position, 2, gl.FLOAT, false, 8 * FSIZE, 0);
    gl.vertexAttribPointer(attributes.Color, 4, gl.FLOAT, true, 8 * FSIZE, 2 * FSIZE);
    gl.vertexAttribPointer(attributes.TextureCoords, 2, gl.FLOAT, false, 8 * FSIZE, 6 * FSIZE);

    gl.enableVertexAttribArray(attributes.TextureCoords);
    gl.enableVertexAttribArray(attributes.Position);
    gl.enableVertexAttribArray(attributes.Color);
}

function createProgramFromSource(gl, vshader, fshader) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
    program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        throw `Failed to link program: ${info}`;
    }

    return program;
}

function createShader(gl, type, sourceCode) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw `Failed to compile shader: '${type == gl.VERTEX_SHADER ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER'}' ${info}`;
    }
    return shader;
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize === true) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
