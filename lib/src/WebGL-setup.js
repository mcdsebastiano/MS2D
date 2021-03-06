const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute float a_PointSize;
  
  uniform mat4 u_ModelMatrix;
  uniform vec2 u_AspectRatio;
  uniform mat4 u_VpMatrix;
  
  varying vec4 v_Color;
  
  void main() {
    
  	v_Color = a_Color;
    
    mat4 mvpMatrix = u_VpMatrix * u_ModelMatrix;
    vec4 adjustedPosition = mvpMatrix * a_Position;
    gl_Position = adjustedPosition * vec4(u_AspectRatio, 0,1.0);
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

let drawingInfo;
let need_update = false;
window.onpageshow = () => {
  if (typeof setup === 'function') {
    setup();
    initControllers();
    if (typeof draw === 'function') {

      need_update = true;
      updateLoop();
    }
  }
}
const updateLoop = () => {
  if (gl.refresh()) {

    if (typeof keyPressed === 'function'
       || typeof keyReleased === 'function'
       || typeof mousePressed === 'function'
       || typeof mouseMove === 'function'
       || typeof mouseReleased === 'function'
       || typeof update === 'function') {
      need_update = true;
    }

    if (need_update === true) {
      clear();
      if (typeof update === 'function') {
        update();
      } else {
        draw();
      }

      drawingInfo = getDrawingInfo();
      requestAnimationFrame(updateLoop);
      need_update = false;
    }

    initBuffers(gl, drawingInfo);
    drawShapeArray();

  }
}

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

  gl.modelMatrix = new Matrix4();
  gl.program.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  vpMatrix = new Matrix4();
  vpMatrix.setOrtho(-1, 1, -1, 1, 1, 2);

  gl.program.u_AspectRatio = gl.getUniformLocation(gl.program, 'u_AspectRatio');
  gl.uniform2fv(gl.program.u_AspectRatio, [1, 1]);

  gl.uniformMatrix4fv(gl.getUniformLocation(gl.program, 'u_VpMatrix'), false, vpMatrix.elements);

  vpMatrix.setIdentity();
  gl.viewport(0, 0, WIDTH, HEIGHT);

 

}

let vertices;
let FSIZE;
function initBuffers(gl, data) {

  if (gl.sizeChanged() === true && gl.vertexBuffer()) {
    gl.disableVertexAttribArray(gl.program.a_Position);
    gl.disableVertexAttribArray(gl.program.a_Color);
    gl.deleteBuffer(gl.vertexBuffer());
    gl.adjustSize(false);
  }

  if (gl.vertexBuffer() === null) {
    gl.createEmptyVertexBuffer();
    gl.adjustBuffer(true)
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer());

  if (gl.isNewBuffer() === true) {
    vertices = new Float32Array(data);
    FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.adjustBuffer(false);
  }

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(gl.program.a_Position, 2, gl.FLOAT, false, 6 * FSIZE, 0);
  gl.vertexAttribPointer(gl.program.a_Color, 4, gl.FLOAT, false, 6 * FSIZE, 2 * FSIZE);

  gl.enableVertexAttribArray(gl.program.a_Position);
  gl.enableVertexAttribArray(gl.program.a_Color);

  // return data.length / 5;
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
