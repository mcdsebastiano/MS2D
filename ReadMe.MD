## This is a very naive 2D WebGL renderer.

This library was built for my own interest to explore WebGL and JavaScript. It is intended strictly as a learning resource.

### Setup
1. Clone the project.
```
git clone https://github.com/mcdsebastiano/MS2D.git
```
2. Ensure your canvas HTML element has the id "webgl" as well as a width and height.
```
<canvas id="webgl" width="500" height="500"></canvas>
```
3. Include the MS2D.js file in your HTML file <b>before</b> your scene.
```
<script src="MS2D/lib/MS2D.js"></script>
<script src="scene.js"></script>
```
4. Setup your scene

```
function setup() {

}

function draw() {

}

function update() {
}
```
### Events
Handling keyboard and mouse events is easy, just add the appropriate helper functions.
```
function keyPressed() {}
function keyReleased() {}
function mousePressed() {}
function mouseReleased() {}
function mouseMove() {}
```
Additionally, there are built in drag & drop functions, see the examples on how to use them.

```mouseX()``` and  ```mouseY()``` capture mouse coordinates<br>
```key()``` and ```keyCode()``` correspond to the event variables of the same name.

### Sprites
To create a sprite call ```createSprite('path/to/asset.png')``` in the ```setup()``` function to create a single instance of that texture. The texture will be added to the GL_TEXTURE array and can be used similarly to how one implements a texture with raw GL -- by indicies -- So keep track of your assets! then simply call ```drawSprite(x, y, GL_TEXTURE[0])``` from inside ```draw()```


### Tip
Instead of adding additional ```<script></script>``` tags to your HTML file, if your project uses more than one JS source file, try using the ``include()`` function at the top of the file. This will ensure the file is loaded before the scene. 

#### Note: Be thoughtful about the order of your includes if there are any files that depend upon each other.

```
include('path/to/your/file.js');

function setup() {
  ...
}

```

