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

const updateLoop = () => {
  if (gl.refresh()) {
    switch (typeof update) {
    case 'function':
      clear();
      update();
    default:
      initBuffers(gl, getDrawingInfo());
      drawShapeArray();
      break;
    }
  }
  requestAnimationFrame(updateLoop);
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

  vpMatrix = new Matrix4();
  vpMatrix.setOrtho(-1, 1, -1, 1, 1, 2);

  gl.program.u_AspectRatio = gl.getUniformLocation(gl.program, 'u_AspectRatio');
  gl.uniform2fv(gl.program.u_AspectRatio, [1, 1]);

  if (typeof setup === 'function') {
    setup();
    initControllers();
    if (typeof draw === 'function') {
      draw();
      updateLoop();
    }
  }
  vpMatrix.setIdentity();
  gl.viewport(0, 0, WIDTH, HEIGHT);
}

function initBuffers(gl, data) {
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