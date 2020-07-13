/* TODO: canvas clipping -- if a shape/vertex is not in sight then do not draw
 * it! */
const VSHADER_SOURCE = `
  uniform mat4 u_ModelMatrix;
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  
  void main() {
  	v_Color = a_Color;
    gl_Position = u_ModelMatrix * a_Position;
  	gl_PointSize = 1.0;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
  gl_FragColor = v_Color;
  }
`;

function main() {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Failed to intialize shaders.');
    return;
  }

  gl.program.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.program.a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  if (gl.program.a_Position < 0 || !gl.program.a_Color) {
    console.error('failed');
    return;
  }

  gl.uniform1f(gl.program.u_Width, gl.drawingBufferWidth);
  gl.uniform1f(gl.program.u_Height, gl.drawingBufferHeight);

  setup();
  draw();

  const updateLoop = () => {
    if (gl.refresh()) {
      if (typeof update === 'function') {
        clear();
        update();
        initBuffers(gl, getDrawingInfo());
        drawShapeArray();
        requestAnimationFrame(updateLoop);
      } else {
        initBuffers(gl, getDrawingInfo());
        drawShapeArray();
      }
    }
  }
  updateLoop();
  initControllers();
}

function initBuffers(gl, data) {
  for (let i = 0; i < data.length; i += 6) {
    data[i] *= aspectRatio < 1 ? aspectRatio : 1;
    data[i + 1] /= aspectRatio > 1 ? aspectRatio : 1;
  }
  // console.log(data);

  const vertices = new Float32Array(data);
  const FSIZE = vertices.BYTES_PER_ELEMENT;

  if (gl.sizeChanged() === true && gl.vertexBuffer()) {
    gl.disableVertexAttribArray(gl.program.a_Position);
    gl.disableVertexAttribArray(gl.program.a_Color);
    gl.deleteBuffer(gl.vertexBuffer());
    gl.adjustSize(false);
  }

  if (gl.vertexBuffer() === null) {
    gl.createEmptyVertexBuffer();
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer());

  if (gl.isNewBuffer() === true) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
    gl.vertexAttribPointer(gl.program.a_Position, 2, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.vertexAttribPointer(gl.program.a_Color, 4, gl.FLOAT, false, 6 * FSIZE, 2 * FSIZE);
    gl.adjustBuffer(false);
  } else {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  }

  gl.enableVertexAttribArray(gl.program.a_Position);
  gl.enableVertexAttribArray(gl.program.a_Color);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.viewport(0, 0, WIDTH, HEIGHT)
}

function initShaders(gl, vshader, fshader) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return false;
  }

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    console.log(`Failed to link program: ${info}`);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return false;
  }
  gl.useProgram(program);
  gl.program = program;

  return true;
}

function createShader(gl, type, sourceCode) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    console.log(`Failed to compile shader: ' ${info}`);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
