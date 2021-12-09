/*
 * Original code is based off the Coding Train Coding Challenge
 * TODO: Logic should be separated from the draw function
 */

include('Collisions.js');
include('Ship.js');
include('Asteroid.js');
include('Debris.js');

let nextLevelWait = 0;
let MIN_ASTEROIDS = 6;
let MIN_ONE_UP = 10000;
let numberOfAsteroids = MIN_ASTEROIDS;
let respawnTimer = 0;
let gameOver = true;
let asteroids = [];
let debris = [];
let stars = [];
let ship;

let fireRate = 0;
let score = 0;

let gameOverBox;
let scoreBox;
let lifeBox;

let level = 1;

scoreBox = document.createElement("DIV");
scoreBox.style.position = "fixed";
scoreBox.style.color = "#fff";
scoreBox.style.left = "10px";
scoreBox.style.top = "10px";
document.body.appendChild(scoreBox);

lifeBox = document.createElement("DIV");
lifeBox.style.position = "fixed";
lifeBox.style.color = "#fff";
lifeBox.style.left = "10px";
lifeBox.style.top = `${HEIGHT - 25}px`;
lifeBox.textContent = "Lives: ";
document.body.appendChild(lifeBox);

gameOverBox = document.createElement("DIV");
gameOverBox.style.position = "fixed";
gameOverBox.style.display = "none";
gameOverBox.style.fontSize = "18pt";
gameOverBox.style.color = "#fff";
gameOverBox.innerHTML = `ASTEROIDS<br><span style='font-size: 8px'>&nbsp;Press any key to continue</span>`;
document.body.appendChild(gameOverBox);

function setup() {
    clearColor(BLACK);
    ship = new Ship();

    for (let i = 0; i < numberOfAsteroids; i++) {
        asteroids.push(new Asteroid());
    }

    for (let i = 0; i < 75; i++) {
        stars.push({
            x: Math.floor(Math.random() * WIDTH) + 1,
            y: Math.floor(Math.random() * HEIGHT) + 1
        });
    }

    gameOverBox.style.left = `${WIDTH / 2 - 100}px`;
    gameOverBox.style.top = `${HEIGHT / 2 - 25}px`;
    updateScore();
    updateLives();

}

function draw() {
    if (gameOver === false) {

        if (score >= MIN_ONE_UP) {
            ship.lives += 1;
            MIN_ONE_UP += 10000;
        }

        if (asteroids.length === 0 && nextLevelWait === 0) {
            nextLevelWait = 50;
            level++;
        }
        if (nextLevelWait === 1) {
            numberOfAsteroids += 1;
            for (let i = 0; i < numberOfAsteroids; i++) {
                asteroids.push(new Asteroid());
            }
            nextLevelWait -= 1;
        } else if (nextLevelWait > 0) {
            nextLevelWait -= 1;
        }

        let bgUpperGradient = newShape();
        bgUpperGradient.fill();
        setColor(BLACK)
        drawLine(0, 0, WIDTH, 0);
        setColor(rgba(0, 0, 35, 0.95))
        drawLine(WIDTH, HEIGHT / 2, 0, HEIGHT / 2)
        endShape();

        let bgBottomGradient = newShape();
        bgBottomGradient.fill();
        setColor(rgba(0, 0, 35, 0.95))
        drawLine(0, HEIGHT / 2, WIDTH, HEIGHT / 2);
        setColor(BLACK)
        drawLine(WIDTH, HEIGHT, 0, HEIGHT)
        endShape();

        if (respawnTimer === 1) {
            ship.lives -= 1;
            ship.pos.x = WIDTH / 2;
            ship.pos.y = HEIGHT / 2;
            ship.vel.x = 0;
            ship.vel.y = 0;
            ship.heading = 90;
            respawnTimer -= 1;
        } else if (respawnTimer === 0) {
            ship.paint();
            ship.edges();
            ship.update()

        } else {
            respawnTimer -= 1;
        }

        for (let i = 0; i < ship.lasers.length; i++) {
            ship.lasers[i].paint()
            ship.lasers[i].update();

            for (let j = 0; j < asteroids.length; j++) {
                if (ship.lasers[i].hits(asteroids[j])) {

                    // add debris to be painted
                    debris.push(new Debris(ship.lasers[i].pos.x, ship.lasers[i].pos.y));

                    // accrue score
                    if (asteroids[j].r === 32) {
                        score += 20;
                    } else if (asteroids[j].r === 21) {
                        score += 50;
                    } else if (asteroids[j].r === 14) {
                        score += 100;
                    }

                    updateScore();

                    // generate pieces;
                    let pieces = asteroids[j].divide();

                    if (pieces !== null) {
                        asteroids.splice(j, 1, pieces[0], pieces[1]);
                    } else {
                        asteroids.splice(j, 1);
                    }

                    // remove laser from scene
                    ship.lasers.splice(i, 1);
                    break;
                }
            }
        }

        if (ship.lives === 0) {
            gameOver = true;
        }

        asteroids.forEach(asteroid => {
            asteroid.paint()
            asteroid.edges();
            if (polyPoly(asteroid.shape.v, ship.shape.v)) {
                respawnTimer = 50;
            }
            asteroid.update();

        });

        debris.forEach(d => {
            d.update();
            d.paint();
        });

        stars.forEach(star => {
            setColor(WHITE);
            fillRect(star.x, star.y, 1.5, 1.5);
        });

        updateLives();

    } else {
        gameOverBox.style.display = "initial";
        noLoop();
    }
}

function keyPressed() {
    if (gameOver === true) {
        stars = [];
        debris = [];
        asteroids = [];
        score = 0;
        gameOver = false;
        numberOfAsteroids = MIN_ASTEROIDS;
        gameOverBox.innerHTML = `GAME OVER<br><span style='font-size: 8px'>&nbsp;Press any key to continue</span>`;
        gameOverBox.style.display = "none";
        setup();
        loop();
        return;
    }

    switch (keyCode()) {
    case ARROW_UP:
        ship.thrusting(true);
        break;
    case ARROW_LEFT:
        ship.setRotation(4);
        break;
    case ARROW_RIGHT:
        ship.setRotation(-4);
        break;
    case ARROW_DOWN:
        break;
    case SPACE_BAR:
        if (fireRate == 0 && respawnTimer === 0) {
            ship.fire();
            fireRate = 5;
        }
        fireRate -= 1;
        break;
    default:
        break;
    }
}

function keyReleased() {
    switch (keyCode()) {
    case ARROW_UP:
        ship.thrusting(false);
        break;
    case ARROW_LEFT:
    case ARROW_RIGHT:
        ship.setRotation(0);
        break;
    case SPACE_BAR:
        fireRate = 0;
    }

}

function update() {
    draw();

}

function updateScore() {
    scoreBox.innerHTML = `Score: ${score}`;
}

function updateLives() {

    for (let i = 0; i < ship.lives; i++) {
        Triangle(-ship.r, -ship.r + 2, ship.r, 0, -ship.r, ship.r - 2).translate(80 + ((ship.r * 2) + 5) * i, HEIGHT - 20).rotateZ(35, this);
    }

}
