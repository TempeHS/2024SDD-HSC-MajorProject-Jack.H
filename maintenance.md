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

S