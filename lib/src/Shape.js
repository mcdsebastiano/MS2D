class Shape {
    // @Cleanup, excess
    constructor() {
        this.angle = 0;
        this.matrix = new Matrix4();
        this.offset = 0;
        this.index = 0;
        this.mode = 0;
        this.x = 0;
        this.y = 0;
        // TODO: v array needs to update on transformations
        this.v = [];
        this.w = 0;
        this.h = 0;
        this.r = 0;
        this.d = 0;
        this.cX = 0;
        this.cY = 0;
        this.d1 = 0;
        this.d2 = 0;
    }


    setIdentity() {
        this.matrix.setIdentity();
        return this;
    }
    setTranslate(x, y) {
        this.matrix.setTranslate(x, y, 0);
        return this;
    }
    setRotate(angle, x, y, z) {
        this.matrix.setRotate(angle, x, y, z);
        return this;
    }
    setScale(x, y) {
        this.matrix.setScale(x, y, 1);
        return this;
    }
    moveTo(x, y) {
        let dY = y - HEIGHT / 2;
        let dX = x - WIDTH / 2;
        this.matrix.translate(convertX(WIDTH + dX - this.x), convertY(HEIGHT + dY - this.y), 0);
        return this;
    }
    translate(x, y) {
        this.matrix.translate(x, y, 0);
        return this;
    }
    rotate(angle, x, y, z) {
        this.matrix.rotate(angle, x, y, z);
        return this;
    }
    rotateZ(angle) {
        this.matrix.rotate(-angle, 0, 0, 1);
        return this;
		  // if (origin)
            // this.translate(this.x - WIDTH / 2, this.y - HEIGHT / 2);
        // this.matrix.rotate(angle, 0, 0, 1);
        // if (origin)
            // this.translate(WIDTH / 2 - this.x - this.w / 2, HEIGHT / 2 - this.y - this.h / 2);

        // return this;
		
    }
    rotateX(angle, x, y, z) {
        this.matrix.rotate(angle, 1, 0, 0);
        return this;
    }
    rotateY(angle, x, y, z) {
        this.matrix.rotate(angle, 0, 1, 0);
        return this;
    }
    scale(x, y) {
        this.matrix.scale(x, y, 1);
        return this;
    }

    triangles() {
        this.mode = gl.TRIANGLES;
    }
    triangleStrip() {
        this.mode = gl.TRIANGLE_STRIP;
    }
    fill() {
        this.mode = gl.TRIANGLE_FAN;
    }
    lines() {
        this.mode = gl.LINES;
    }
    lineStrip() {
        this.mode = gl.LINE_STRIP;
    }
    noFill() {
        this.mode = gl.LINE_LOOP;
    }
    points() {
        this.mode = gl.POINTS;
    }

};
