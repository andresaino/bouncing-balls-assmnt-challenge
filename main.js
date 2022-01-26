/*
 * Created by Carlos Florez - taking guide from other sources - as extension
 * to assesment in mozilla web development guide:
 
 * TODO - make the Ball constructor accept a radius, instead of size
*/

// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// setup Audio
// https://marcgg.com/blog/2016/11/01/javascript-audio/
let context = new AudioContext();
let o = null;
let g = null;

// function to generate an audio pulse
let audioPulse = function(type, freq, fadeTime) {
   o = context.createOscillator();
   g = context.createGain();
   o.type = type;
   o.connect(g);
   o.frequency.value = freq;
   g.connect(context.destination);
   o.start(0);

   g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + fadeTime);
}

// variable for ball count paragraph
let para_score = document.querySelector('p');

let td_coln_score_p1 = document.querySelector('table').getElementsByTagName('tr')[0].getElementsByTagName('td');
let td_coln_score_p2 = document.querySelector('table').getElementsByTagName('tr')[1].getElementsByTagName('td');


// to constrain the balls' min and max size depending on viewport's size
let bMinSize = Math.floor((width + height) / 160);
let bMaxSize = Math.floor((width + height) / 60);

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// *** CONSTRUCTORS ***

// define Shape constructor
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// define Ball constructor - inherits from Shape
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

// define EvilCircle constructor - inherits from Shape
// parameter controlKeys should be an array of 4 items, indicating the keys set
// for left, right, down, up movement in that order
function EvilCircle(x, y, velX, velY, exists, color, controlKeys) {
   Shape.call(this, x, y, velX, velY, exists);
   this.color = color;
   this.size = bMinSize;
   this.controlKeys = controlKeys;
   this.controlKeysMap = new Map([
      ["step_left", {ascii: controlKeys[0], active: false}],
      ["step_right", {ascii: controlKeys[1], active: false}],
      ["step_down", {ascii: controlKeys[2], active: false}],
      ["step_up", {ascii: controlKeys[3], active: false}]
      ]);
   // list with the valid keys that are being pressed at the moment:
   this.score = 0; // balls eaten
}

// Define Star constructor:
// with N spikes centered on a circle of radius R, centered on (x,y).  Adapted from
//https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
function Star(x, y, r, n, velX, velY, exists, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.n = n;
  this.velX = velX;
  this.velY = velY;
  this.exists = true;
  this.color = color;
}

// *** BALL METHODS ***

/* as of time of writing don't need the following 2 commands as didn't declare any
   properties in Shape.prototype:
   // Ball.prototype = Object.create(Shape.prototype);
   // Ball.prototype.constructor = Ball;
*/

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    // ball is at (or passed) right edge
    this.velX = -(this.velX);
  }
  if ((this.x - this.size) <= 0) {
    // ball is at (or passed) left edge
    this.velX = -(this.velX);
  }
  if ((this.y + this.size) >= height) {
    // ball is at (or passed) lower edge
    this.velY = -(this.velY);
  }
  if ((this.y - this.size) <= 0) {
    // ball is at (or passed) upper edge
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j]) && balls[j].exists) {
       const dx = this.x - balls[j].x;
       const dy = this.y - balls[j].y;
       const distance = Math.sqrt(dx * dx + dy * dy);

       if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
}

// *** EVILCIRCLE METHODS ***

EvilCircle.prototype.draw = function() {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {

  if ((this.x + this.size) >= width) {
     // evilcircle is at (or passed) right edge, bounce back in a bit
     this.x = width - (this.size*2);
     audioPulse('triangle', 87.31, 1);
  }
  if ((this.x - this.size) <= 0) {
     // evilcircle is at (or passed) left edge, bounce back in a bit
     this.x = this.size*2;
     audioPulse('triangle', 87.31, 1);
  }
  if ((this.y + this.size) >= height) {
     // evilcircle is at (or passed) lower edge, bounce back in a bit
     this.y = height - (this.size*2);
     audioPulse('triangle', 87.31, 1);
  }
  if ((this.y - this.size) <= 0) {
     // evilcircle is at (or passed) upper edge, bounce back in a bit
     this.y = this.size*2;
     audioPulse('triangle', 87.31, 1);
  }
}

EvilCircle.prototype.update = function() {
   for (const [key, value] of this.controlKeysMap) {
     if (key == "step_left" && value.active == true) {
       // step_left key was registered as pressed
       this.x = this.x - this.velX;
     }
     if (key == "step_right" && value.active == true) {
       // step_right key was registered as pressed
        this.x = this.x + this.velX;
     }
     if (key == "step_down" && value.active == true) {
       // step_down key was registered as pressed
        this.y = this.y - this.velY;
     }
     if (key == "step_up" && value.active == true) {
       // step_up key was registered as pressed
        this.y = this.y + this.velY;
     }
  }
}

EvilCircle.prototype.collisionDetect = function() {
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
       const dx = this.x - balls[i].x;
       const dy = this.y - balls[i].y;
       const distance = Math.sqrt(dx * dx + dy * dy);

       if (distance < this.size + balls[i].size) {
         this.score++; // increase the score per instance
         audioPulse('sawtooth', 2794, 1);
         balls[i].exists = false;
         let star = ballToStar(balls[i]);
         formedStars.push(star);
      }
    }
  }
}

// *** STAR METHODS ***

Star.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.x + this.r, this.y);
  let _this = this;

  let xStroke;
  let yStroke;

  for(let i = 1; i <= _this.n * 2; i++)
  {
    let theta;
    if(i % 2 == 0){
      theta = i * (Math.PI * 2) / (_this.n * 2);
      xStroke = _this.x + (_this.r * Math.cos(theta));
      yStroke = _this.y + (_this.r * Math.sin(theta));
    } else {
      theta = i * (Math.PI * 2) / (_this.n * 2);
      xStroke = _this.x + ((_this.r/2) * Math.cos(theta));
      yStroke = _this.y + ((_this.r/2) * Math.sin(theta));
    }

    ctx.lineTo(xStroke, yStroke);
  }

  ctx.fillStyle = this.color;
  ctx.closePath();
  ctx.fill();
}

Star.prototype.update = function() {
  if ((this.x + this.r) >= width) {
    // ball is at (or passed) right edge
    this.velX = -(this.velX);
  }
  if ((this.x - this.r) <= 0) {
    // ball is at (or passed) left edge
    this.velX = -(this.velX);
  }
  if ((this.y + this.r) >= height) {
    // ball is at (or passed) lower edge
    this.velY = -(this.velY);
  }
  if ((this.y - this.r) <= 0) {
    // ball is at (or passed) upper edge
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// *** OTHER GAME-SPECIFIC FUNCTIONS ***

// converts given ball to a star
let ballToStar = function(ball) {
   return new Star(ball.x, ball.y, ball.size, random(4, 8), ball.velX/2, ball.velY/2, true, ball.color)
}

// *** DEAL WITH INTERACTIVITY ***

// add valid keys to the list when they are pressed
document.addEventListener('keydown', pressed);
function pressed(e) {
  let pressedKey = e.keyCode;
  // evilCircle1
  for (const [key, value] of evilCircle1.controlKeysMap) {
    if (pressedKey === value.ascii) {
      value.active = true;
    }
  }
  // evilCircle2
  for (const [key, value] of evilCircle2.controlKeysMap) {
    if (pressedKey === value.ascii) {
      value.active = true;
    }
  }
}

// remove valid keys when they are released
document.addEventListener('keyup', released);
function released(e) {
  let releasedKey = e.keyCode;
  // evilCircle1
  for (const [key, value] of evilCircle1.controlKeysMap) {
    if (releasedKey === value.ascii) {
      value.active = false;
    }
  }
  // evilCircle2
  for (const [key, value] of evilCircle2.controlKeysMap) {
    if (releasedKey === value.ascii) {
      value.active = false;
    }
  }
}

// define two evilcircles, and specify their respective control keys

// speed for movement of evil circles
const evilsSpeedXY = 4; // set a default speed for evilCircles

// enum (equivalent) containing keycodes for two evilCirlces -
// arrow keys (indexed with "0"), WASD keys (indexed with "1")
let keysEvils = {left: [65,37], right: [68,39], down: [87,38], up: [83,40]}


let evilCircle1 = new EvilCircle (
  random(0, width),
  random(0, height),
  evilsSpeedXY,
  evilsSpeedXY,
  true,
  'red',
  [keysEvils.left[0], keysEvils.right[0], keysEvils.down[0], keysEvils.up[0]],
);

let evilCircle2 = new EvilCircle (
  random(0, width),
  random(0, height),
  evilsSpeedXY,
  evilsSpeedXY,
  true,
  'green',
  [keysEvils.left[1], keysEvils.right[1], keysEvils.down[1], keysEvils.up[1]],
);

// define array to store formed stars (evilcircle hits a ball- ball becomes a star)
let formedStars = [];
// define array to store balls
let balls = [];

// create 20 balls with random features (colour, size, etc)
while (balls.length < 20) {
    let size = random(bMinSize, bMaxSize);
    let ball = new Ball(
      // ball position always drawn at least one ball width away
      // from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(0.2, 1),
      random(0.2, 1),
      true,
      `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`,
      size
    );
    balls.push(ball);
}

// define loop that keeps drawing the scene constantly
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < formedStars.length; i++) {
    formedStars[i].draw();
    formedStars[i].update();
  }

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  evilCircle1.draw();
  evilCircle1.checkBounds();
  evilCircle1.collisionDetect();
  evilCircle2.draw();
  evilCircle2.checkBounds();
  evilCircle2.collisionDetect();

  evilCircle1.update();
  evilCircle2.update();


  // update score text
  td_coln_score_p1[1].textContent = evilCircle1.score;
  td_coln_score_p2[1].textContent = evilCircle2.score;

  // todo- get rid of the magic number here
  if((evilCircle1.score + evilCircle2.score) === 20) {
    evilCircle1.score > evilCircle2.score? td_coln_score_p1[2].textContent = "*winner*"
      : td_coln_score_p2[2].textContent = "*winner*";
  }

  //para_score.innerHTML = "Player 1: " + evilCircle1.score + "<br>Player 2: " + evilCircle2.score;

  requestAnimationFrame(loop);
}

loop();
