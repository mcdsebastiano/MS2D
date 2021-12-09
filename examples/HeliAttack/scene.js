let score = 0;
let count = 0;
let highscore = 9999999;

let grav;
let lift;

let MAX_HELI_HEALTH = 300;
let MAX_GUY_HEALTH = 100;
let SPAWN_TIMER = 100;
let BASELINE;

let heliDestroyedTimer = 0;
let turretAngle = 0;
let heliBoundingBox;
let guyBoundingBox;
let jumpCount = 0;
let reload = 10;
let spacing = 5;
let ticker = 0;
let angle = 0;
let mX = 0;
let mY = 0;

// booolz
let lifting = false;
let isHeld = false;
let firing = true;

// Eentities
let destroyedHeli = {}
let ammoPack = {};
let bullet = {};
let turret = {};
let rifle = {};
let heli = {};
let guy = {};

// Arrayzzzz
let turretBullets = [];
let bullets = [];
let debris = [];

let scoreBox

function setup() {
	
	function newEntity(tex) {
		return {
			pos: new Vector(),
			dir: new Vector(),
			tex
		};
	}


    grav = new Vector(0, 0.25);

    scoreBox = document.createElement("DIV");
    scoreBox.innerHTML = `
    Time: 23 seconds Helis: ${count} <br />
    Score: ${score} <br />
    Highscore: ${highscore}`;

    scoreBox.classList.add("text");
    scoreBox.style.position = "fixed";
    scoreBox.style.top = "5px";
    scoreBox.style.left = "5px";

    document.body.append(scoreBox);

    // @Cleanup @Reorg
    createSprite("assets/BG.png");
    createSprite("assets/guy.png");
    createSprite("assets/rifle.png");
    createSprite("assets/bullet.png");

    createSprite("assets/heli.png");
    createSprite("assets/prop.png");
    createSprite("assets/turret.png");

    createSprite("assets/guy_crouch.png");
    createSprite("assets/guy_jump.png");
    createSprite("assets/guy_jump2.png");
    createSprite("assets/guy_march_left.png");
    createSprite("assets/guy_march_right.png");
    createSprite("assets/deadguy.png");

    createSprite("assets/ammo_pack_rifle.png");
    createSprite("assets/healthbar_full.png");
    createSprite("assets/healthbar_empty.png");
    createSprite("assets/reload_full.png");
    createSprite("assets/reload_empty.png");

    createSprite("assets/turret_bullet.png");

    createSprite("assets/debris1.png");
    createSprite("assets/debris2.png");
    createSprite("assets/debris3.png");
    createSprite("assets/debris4.png");

    createSprite("assets/heli_destroyed.png");
	
    turret = newEntity(GL_TEXTURE[6]);
    rifle = newEntity(GL_TEXTURE[2]);
    heli = newEntity(GL_TEXTURE[4]);
    destroyedHeli = newEntity(GL_TEXTURE[23]);
    guy = newEntity(GL_TEXTURE[1]);

    ammoPack = GL_TEXTURE[13];
    healthBarFull = GL_TEXTURE[14];
    healthBarEmpty = GL_TEXTURE[15];
    reloadBarFull = GL_TEXTURE[16];
    reloadBarEmpty = GL_TEXTURE[17];
    heli.pos.y = 40;
    BASELINE = HEIGHT - guy.tex.height - 18;

    guy.pos.x = WIDTH / 2 - guy.tex.width / 2;
    guy.pos.y = BASELINE;

    guy.health = MAX_GUY_HEALTH;

    guy.crouching = false;
    guy.marching = false;
    guy.jumping = false;
    guy.dead = false;

    debris = [
        newEntity(GL_TEXTURE[19]),
        newEntity(GL_TEXTURE[20]),
        newEntity(GL_TEXTURE[21]),
        newEntity(GL_TEXTURE[22])
    ];

    heli.health = MAX_HELI_HEALTH;
}

function draw() {
    // TODO:
    // tiles & aesthetics

    drawSprite(eye.x, eye.y, GL_TEXTURE[0]);

    // Heli & Turret
    //

    // @Cleanup
    if (heliDestroyedTimer < SPAWN_TIMER) {
        heli.spr = drawSprite(0, 0, heli.tex)
            .scale(0.8, 0.8)
            .translate(heli.pos.x, heli.pos.y);

        drawSprite(heli.pos.x + 22, heli.pos.y, GL_TEXTURE[5])
        .scale(0.8, 0.8);

        turret.pos = new Vector(heli.pos.x + heli.tex.width / 2 + 35, heli.pos.y + heli.tex.height / 2 + 8);

        drawSprite(0, 0, turret.tex)
        .scale(0.8, 0.8)
        .translate(turret.pos.x - turret.tex.width / 2 + 25, turret.pos.y - turret.tex.height / 2 - 5)
        .rotateZ(turretAngle)
        .translate(-turret.tex.width / 2 + 18, -turret.tex.height / 2);
    }

    if (heliDestroyedTimer > 0) {
        drawSprite(0, 0, destroyedHeli.tex)
        .translate(destroyedHeli.pos.x - 35, destroyedHeli.pos.y + heli.tex.height)
        .scale(0.8, -0.8);

        for (chunk of debris) {
            drawSprite(0, 0, chunk.tex).translate(chunk.pos.x, chunk.pos.y);
        }
    }

    //
    // Guy
    //

    let rifleSpace = 0;

    guy.spr = drawSprite(0, 0, guy.tex).translate(guy.pos.x, guy.pos.y);

    if (guy.crouching === true) {
        guy.spr.translate(0, 13);
    } else if (guy.marching === true) {
        guy.spr.translate(0, 1);
    }

    for (b of turretBullets) {
        drawSprite(0, 0, GL_TEXTURE[18]).translate(b.pos.x, b.pos.y);
    }

    //
    // Rifle & Bullets
    //

    if (guy.dead === false) {

        for (b of bullets) {
            drawSprite(0, 0, GL_TEXTURE[3]).translate(b.pos.x, b.pos.y);
        }

        rifle.spr = drawSprite(0, 0, rifle.tex);
        rifle.spr.translate(rifle.pos.x - rifle.tex.width / 2, rifle.pos.y - rifle.tex.height / 2 + rifleSpace)

        if (guy.pos.x + 12 > mX) {
            rifle.spr.scale(-1, 1)
            rifle.spr.rotateZ(180 - angle)
        } else {
            rifle.spr.rotateZ(angle);
        }

        rifle.spr.translate(-rifle.tex.width / 2 + 8, -rifle.tex.height / 2 - 3);
    } else {
        guy.spr.rotateZ(90).translate(-guy.tex.width * 2, 0);
    }

    //
    // HUD
    //

    drawSprite(eye.x + WIDTH - reloadBarFull.width - spacing, eye.y + HEIGHT - reloadBarFull.height - spacing, reloadBarFull, reloadBarFull.width, reloadBarFull.height);
    drawSprite(eye.x + WIDTH - healthBarFull.width - spacing, eye.y + spacing, healthBarFull);
    drawSprite(eye.x + WIDTH - ammoPack.width - spacing, eye.y + HEIGHT - ammoPack.height - reloadBarFull.height - spacing - spacing, ammoPack);

    setColor(CLEAR);

    let hX = heli.pos.x * 0.8;
    let hY = heli.pos.y * 0.8;

    heliBoundingBox = [
        Rect(hX + 65, hY + 25, 75, 36),
        Rect(hX + 10, hY + 25, 55, 24),
        Rect(hX + 140, hY + 35, 20, 20)
    ];

    guyBoundingBox = Rect(guy.pos.x + 2, guy.pos.y + 2, guy.tex.width - 4, guy.tex.height - 4);
}

function update() {

    ticker++;

    if (guy.dead === true) {
        guy.tex = GL_TEXTURE[12];
    } else if (guy.crouching === true) {
        guy.tex = GL_TEXTURE[7];

    } else if (guy.marching === true && guy.jumping === false) {
        if (ticker % 20 < 10) {
            guy.tex = GL_TEXTURE[10];
        } else {
            guy.tex = GL_TEXTURE[11];
        }
    } else if (guy.jumping === true) {

        if (jumpCount === 1) {
            guy.tex = GL_TEXTURE[8];
        } else {
            guy.tex = GL_TEXTURE[9];
        }
    } else {
        guy.tex = GL_TEXTURE[1];
    }

    //
    // Update Guy
    //

    if (guy.crouching === true && guy.jumping === false) {

        guy.dir.x = 0;
    } else if (guy.crouching === false) {
        guy.dir.x = 2 * dir;
    }

    // Guy Boundaries

    guy.pos.add(guy.dir);

    if (guy.pos.x < 0) {
        guy.pos.x = 0;
    } else if (guy.pos.x > WIDTH - guy.tex.width) {
        guy.pos.x = WIDTH - guy.tex.width;
    }

    if (guy.pos.y < BASELINE) {
        guy.dir.add(grav);
    } else if (guy.pos.y > BASELINE) {
        guy.pos.y = BASELINE;
        guy.jumping = false;
        guy.dir.y = 0;
        jumpCount = 0;
    }

    guy.pos.x = Math.floor(guy.pos.x);
    guy.pos.y = Math.ceil(guy.pos.y);

    //
    // Update Rifle
    //

    rifle.pos.x = guy.pos.x + 25;
    rifle.pos.y = guy.pos.y + 35;
    angle = 360 - Math.atan2(mY - rifle.pos.y + rifle.tex.height / 2, mX - rifle.pos.x + rifle.tex.width / 2) * 180 / Math.PI;

    //
    // Update Heli & Turret
    //


    if (heliDestroyedTimer == SPAWN_TIMER) {
        let startingPosition;
        let w;

        if (Math.random() < 0.5) {
            startingPosition = WIDTH;
            w = heli.tex.width / 2 + 10;
        } else {
            startingPosition = 0;
            w = -heli.tex.width - 20
        }
        heli.pos.x = startingPosition + w;
        heliDestroyedTimer--;

    } else if (heliDestroyedTimer > 0) {

        //
        // Debris
        //
        // TODO: Needs to be more violent!

        for (chunk of debris) {
            chunk.dir.add(grav)
            chunk.pos.add(chunk.dir);

            if (chunk.pos.y > HEIGHT - chunk.tex.height - 10) {
                chunk.pos.y = HEIGHT - chunk.tex.height - 10;
                chunk.dir.mult(0.965);
            }
        }

        destroyedHeli.dir.add(grav);
        destroyedHeli.pos.add(destroyedHeli.dir)
        heliDestroyedTimer--;

    } else {

        if (guy.dead === false) {

            turretAngle = 360 - Math.atan2(guy.pos.y + turret.pos.y, guy.pos.x - turret.pos.x) * 180 / Math.PI;

            firing = true;

            heli.dir = new Vector(dir * Math.floor(-heli.tex.width - heli.tex.width), 0);
            heli.dir.add(new Vector(guy.pos.x - heli.pos.x, 0))
            heli.dir.normalize();
            heli.dir.mult(0.8);
            heli.dir.mult(2);
        }

    }

    for (let i = 0; i < turretBullets.length; i++) {
        let b = turretBullets[i];
        b.pos.add(b.dir);

        if (b.pos.x >= guyBoundingBox.x && b.pos.x <= guyBoundingBox.x + guy.tex.width && b.pos.y >= guyBoundingBox.y && b.pos.y <= guyBoundingBox.y + guy.tex.height) {
            turretBullets.splice(i, 1)
            guy.health -= 10;
        }
    }

    heli.pos.add(heli.dir);

    if (destroyedHeli.pos.y > HEIGHT - heli.tex.height) {
        destroyedHeli.pos.y = HEIGHT - heli.tex.height;
        destroyedHeli.dir.mult(0.94);
    }

    //
    // Update Projectiles
    //

    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];
        b.pos.add(b.dir);

        //
        // Apply Damage to Heli.
        //

        heliBoundingBox.forEach(box => {
            if (b.pos.x >= box.x && b.pos.x <= box.x + box.w && b.pos.y >= box.y && b.pos.y <= box.y + box.h) {
                bullets.splice(i, 1);
                heli.health -= 10;
                score += 1000;
                updateScore();

            }
        });

    }

    if (guy.health <= 0) {
        // guy.jumping = false;
        guy.health = MAX_GUY_HEALTH;
        guy.dead = true;
        // guy.crouching = false;
        // guy.marching = false;
        guy.pos.y *= 0.9;
        destroyHeli();
    }

    if (heli.health <= 0) {
        destroyHeli();
    }

    if (isHeld === true) {
        if (ticker % reload === 0) {
            let bulletX = rifle.pos.x - rifle.tex.width / 2;
            let bulletY = rifle.pos.y - rifle.tex.height;
            bullets.push({
                pos: new Vector(bulletX, bulletY),
                dir: new Vector(mX - bulletX, mY - bulletY).normalize().mult(4)
            });
        }
    }

    if (firing === true) {
        if (ticker % 25 === 0) {
            let bulletX = turret.pos.x * 0.8;
            let bulletY = (turret.pos.y - 10) * 0.8;
            turretBullets.push({
                pos: new Vector(bulletX, bulletY),
                dir: new Vector(guy.pos.x - bulletX, guy.pos.y - bulletY).normalize().mult(3)
            });

        }
    }

    draw();
}

function updateScore() {
    scoreBox.innerHTML = `
                Time: 23 seconds Helis: ${count} <br />    
                Score: ${score} <br />     
                Highscore: ${highscore}
                `;
}

function destroyHeli() {
    count += 1;
    heli.health = MAX_HELI_HEALTH;
    heliDestroyedTimer = 150;

    let x = heli.pos.x;
    let y = heli.pos.y;

    let xx = heli.dir.x;
    let yy = heli.dir.y;

    destroyedHeli.pos = new Vector(x, y);
    destroyedHeli.dir = new Vector(xx, yy);

    heli.dir = new Vector();
    heli.pos = new Vector(0, 40);
    firing = false;

    updateScore();

    for (chunk of debris) {
        chunk.pos = new Vector(x + Math.random() * (heli.tex.width - heli.tex.width / 2), y + 35);
        chunk.dir = new Vector(Math.random() * 200 - 100, yy + Math.random() * 50 - 25);
        chunk.dir.normalize();
        chunk.dir.mult(2);
    }
}

//
// Controls
//

function mousePressed() {
    mX = mouseX();
    mY = mouseY();
    isHeld = true;
}

function mouseReleased() {
    isHeld = false;
}

function mouseMove() {
    mX = mouseX();
    mY = mouseY();
}

let dir = 0;
function keyPressed() {
    if (guy.dead === false) {
        switch (key()) {
        case 'w':
            if (jumpCount < 2) {
                guy.jumping = true;
                guy.dir.y = -5;
                jumpCount++;
            }
            break;
        case 'a':
            dir = -1;
            guy.marching = true;
            break;
        case 's':
            guy.crouching = true;
            dir = 0;
            break;
        case 'd':
            dir = 1;
            guy.marching = true;
            break;
        }

    }
}

function keyReleased() {
    switch (key()) {
    case 'a':
        dir = 0;
        guy.marching = false;
        break;
    case 's':
        guy.crouching = false;
        break;
    case 'd':
        dir = 0;
        guy.marching = false;
        break;
    }
}
