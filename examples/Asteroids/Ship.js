include('Laser.js');

class Ship {
    constructor() {
        this.lasers = [];
        this.lives = 3;
        this.pos = new Vector(WIDTH / 2, HEIGHT / 2);
        this.heading = 90;
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0); ;
        this.r = 10;
        this.rotation = 0;
        this.isThrusting = false;
        this.thrustAudio = document.createElement('audio');
        this.thrustAudio.src = 'assets/thrust.wav';
    }

    fire() {
        this.lasers.push(new Laser(this.pos, this.heading));
        this.lasers[this.lasers.length - 1].audio.play();
    
    }

    setRotation(angle) {
        this.rotation = angle;
    }

    turn() {
        this.heading += this.rotation;
    }

    thrusting(value) {
        this.isThrusting = value;
    }

    edges() {
        if (this.pos.x > WIDTH + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = WIDTH + this.r;
        }

        if (this.pos.y > HEIGHT + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = HEIGHT + this.r;
        }
    }

    thrust() {
        this.thrustAudio.play();
        let radian = ((360 - this.heading) * Math.PI / 180);
        let force = new Vector(Math.cos(radian), Math.sin(radian));
        force.mult(0.1);
        this.vel.add(force);
    }

    update() {
        if (this.isThrusting === true) {
            this.thrust();
        }
        this.pos.add(this.vel);
        this.vel.mult(0.995);
        this.turn();
    }


    paint() {
        setColor(WHITE);
        this.shape = Triangle(-this.r, -this.r + 2, this.r, 0, -this.r, this.r - 2);
        this.shape.translate(this.pos.x + this.shape.w / 2, this.pos.y + this.shape.h / 2);
        this.shape.rotateZ(this.heading);
        for(let i = 0; i < this.shape.v.length; i++) {
            this.shape.v[i].add(this.pos);
        }
    }
}
