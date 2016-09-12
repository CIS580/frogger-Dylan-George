# Frogger
An clone of the Konami classic [Frogger](https://en.wikipedia.org/wiki/Frogger) in HTML5,
created for the Fall 2016 class of CIS 580 at Kansas State University.

## Requirements

You will be building a clone of Frogger, where the purpose is to move the player from the left side of the screen to the right, while avoiding obstacles traveling vertically between.

You may use the art provided, or your own.  Additionally, you do not need to make your game concern frogs and traffic - as long as the core game mechanic is the same, feel free to explore.

1. Your game should involve an animated player sprite with at least five frames of animation (10 points).

2. Movement for the player should proceed in fixed increments, i.e. 'hopping', rather than 'walking'. Pushing the forward button should start a hop, which is then interpolated over several frames before a landing.  While hopping, the player cannot change the action their sprite is taking (10 points).

3. Multiple obstacles appear in the game, and move vertically.  Obstacles are implemented as classes in their own modules (10 points).

4. A background appropriate to the game is provided, with clear cues to where obstacles will appear (i.e. cars appear on a road, logs in a river) (10 points).

5. Some obstacles, i.e. cars, kill the player sprite when collided with (10 points).

6. Other obstacles (i.e. logs, which keep the frog protagonist from drowning), are necessary to collide with (10 points).

7. The player begins with three lives.  Dying restarts the player at the beginning with one less life (10 points).

8. The player's score and level is displayed on the game screen in some fashion - either through the _drawText()_ method or via an HTML element overlayed on the game screen (10 points).

9. Instructions on how to play the game appear in some easily-accessible fashion, i.e. on the page, or over the game screen accessed with the _esc_ key (10 points).

10. Reaching the far side of the screen awards the player with points, advances the level, and restarts the player at the initial point with the obstacles moving faster (10 points).

### Extra Credit

1. Adding an obstacle that has two or more states that can be helpful or harmful, i.e. an alligator whose head can be rode upon, but eats you when its mouth is open, (10 points).

2. There is an additional bonus of 10 points that can be awarded for an exceptional game design (10 points).

## Bundling
The source code in the src directory is bundled into a single file using **Browserify**.  The Browserify tools must first be installed on your system:

```$ npm install -g browserify``` (for OSX and linus users, you may need to preface this command with ```sudo```)

Once installed, you can bundle the current source with the command:

```$ browserify src/app.js -o bundle.js```

Remember, the browser must be refreshed to receive the changed javascript file.

## Watching

You may prefer to instead _watch_ the files for changes using **Watchify**.  This works very similarily to Browserify.  It first must be installed:

```$ npm install -g watchify``` (again, ```sudo``` may need to be used on linux and OSX platforms)

Then run the command:

```watchify src/app.js -o bundle.js```

The bundle will automatically be re-created every time you change a source file.  However, you still need to refresh your browser for the changed bundle to take effect.

## Credits
The frog art was provided by [tgfcoder](http://opengameart.org/users/tgfcoder) of [Open Game Art](http://opengameart.org) as a public domain work.

Mini and Sports Car art was provided by  [bahi](http://opengameart.org/users/bahi) of [Open Game Art](http://opengameart.org) under a CC-BY license.

Sedan and Pickup art was provided by  [bahi](http://opengameart.org/users/bahi) of [Open Game Art](http://opengameart.org) under a CC-BY license.

Game framework HTML5/CSS3/Javascript code was written by course instructor Nathan Bean, and released under a CC-BY license.
