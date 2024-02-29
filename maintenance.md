# Maintenance
## Device Requirements

This game is entirely optimised for landscape mobile use, and will have strange formatting if used with other formats. If your device does not contain a gyroscope, the game will not be able to function. There are specific fixes put in place to make this game work with iOS devices, including the button in settings labled "iOS Support" which requests permission to get gyroscope information, and having the music only play once the user has interacted with the website.

## Running

This app is run off of a web server, built from node.js, and is using the Tempe High School server to run publicly on GitHub. 
It is mainly run during testing with LocalHost through the "Preview on Web Server" extension.

## File Information

All of the code for the app itself is located at "myPWA/public", including the HTML page, the CSS file, and the two Javascript files which run the app. website.js is used to run everything outside of the game, while gameplay.js runs everything inside of it.
Within public, there also exists 3 folders, containing the sources for the elements in HTML. Many of the images located in "icons" contain an inverted variant, which used for the darker themes the user can choose.
These themes were created on a backend SQL database, and extracted through the json file "frontEndData.json", to be accessed by the Javascript files.

# website.js
## addLocalStorage

Only runs once when opening the page.
This will set all relavent variables to the saved ones in Local Storage.

## signIn/homeFromSign

Opens/closes the sign-in page, blocking/giving back the options available on the home screen. Also plays the menu sound effect.

## changeName

Called from sign-in page, saves name to the game and Local Storage.

## outofhome/homescreen

Handles all interactions which branch off from or in to the homescreen. At the beginning, it calls a function to set the theme in case the time has changed to a later coulor. Also plays menu sound effect, and changes the song if the interaction is going to or from the game screen.

## addScore

Called on reload in order to set scores from Local Storage, and called after a game to check for a new high score, and to add to attempt counter. Updates the score HTML element.

## getThemes

Handles any function which needs the backend data from the SQL database/json file. Does not do anything by itself besides gather the data.

## defineButtons

Uses a canvas element in the settings page to draw the various themes which you can select. Changes based on time and on if that theme is currently selected. Called from getThemes.

## setTheme

Sets the coulor of every element in the app. It will change the chosen coulor based on the theme and time, from the data given to it from getThemes. Will also change some items from white to black if the chosen theme is dark enough.
Only called from getThemes, and uses the number it was called from to find which theme to set everything to.

## setBall

Can be called from getThemes if the theme is changed, or from HTML if a unique ball coulor is being set.

## random

Used to make functions which choose a random value cleaner. Chooses a random value between the set values "min" and "max".

## moveBall

Handles the bouncing ball seen on the homescreen. Draws the ball with a canvas element. Each time the ball reaches a corner, a new angle is randomly chosen.

# gameplay.js
## quit/enter

Called when either entering into the game page or when leaving it. Sets up the main app or the game canvas respectively.

## pauseMenu/gameFromPause

Stops/starts the music and animations from playing out.

## restart

Used after a game over, in order to set up the game to be reset.

## ondeviceorientation

Activates whenever the device orientation is updated, which will be generally all the time when using a mobile device. Will usually call generateMomentum, but if the game is currently paused, or if the default orientation needs to be reset, it will instead do that.

## requestDeviceOrientation

Called from the iOS Support button, if the device being used is an iOS device, it will open an option for the player to allow device orientation to be read. If the device is not iOS, it won't do anything.

## generateMomentum

Adds x and y momentum based on the difference between the current device orientation, and the default orientation. It also lowers momentum against the direction you're moving to replicate friction, and will cap the speed out at a certain value.

## generateFrame

Controls the movement and generation of all of the elements contained within the main canvas element. Begins by changing the position of the ball based off of the momentum generated, and checking if it goes past a screen boundary. It then goes into the main canvas drawing, starting with the goal, then the ball, and then the various obstacles. The generation of each of the obstacles is contained within a for loop, which goes through each of the obstacles within its own array. The mine object, being an image instead of drawn in canvas, has its own function to convert the theme to an rgb format in order to coulor it correctly. At the end of the generation it calls for collision checking.

## newLevel

Handles resetting the level when first entering the game or when completing the previous level. It resets the ball's movement, updates the score, and generates new obstacles. The amount of obstacles and position are determined randomly, and only become available past a certain score.

## gameOver

Plays a death sound, and opens up the game over menu, which is a deviation off of the normal pause menu.

## collision

As canvas doesn't have a way to check for overlap between its elements, this function has manually had the hitboxes for each element added, and it checks for collision between the ball and the obstacles one after the other. Due to the complex shape of most of the obstacles and the ball, the hitboxes are simplified to squares.

## convertRgb

Handles the conversion between hex coulor codes and rbg formats.