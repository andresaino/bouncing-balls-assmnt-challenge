Created by Carlos Florez -
taking guide from other sources - as extension
to assesment in mozilla web development guide:
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features
01/11/2021
Some ideas from:
https://github.com/2alin/2alin.github.io/blob/master/learn/mozilla/improve-bouncing-balls/main-finished.js

# App Description
A game that consists of randomly coloured/sized/speed balls moving across browser wdw.
when two balls collide the balls will change colour.  There are also two EvilCircles that
can move in all directions when controlled with assigned control keys.  Since there are
two EvilCircles, two players can play. When an EvilCircle collides with a Ball a
Star will be formed. The goal of the game is to get to the point where there are no balls
around (i.e all balls have been converted to stars). The goal of the game may in most cases
be reached without any User interaction since Balls can just ranmomly hit static EvilCircles.
By controlling the EvilCircles users can hit the Balls purposely and transform them to stars.
At the end the EvilCircle with more ball hits, will win the game. The current score is displayed.
Collisions of Superballs with other balls, or against the wdw. edges will generate sounds.
Collisions of stars won't cause any effect or generate any sound.

Note. For this version the html and style have been modified sligthly.

TODO - make the Ball constructor accept a radius, instead of size
