var gameOn = false;
var defaultBeta;
var defaultGamma;
var xMomentum = 0;
var yMomentum = 0;
var xBall = 80;
var yBall = 100;
var score = 0;
var size = 50;
var calibrate = true;
var obstacles = "#ffffff"
var diamond = ["1,0"];
const width = window.innerWidth;
const height = window.innerHeight;
var win = false;

function quit() {
    addScore(score, username);
    gameOn = false;
    xMomentum = 0;
    yMomentum = 0;
    xBall = 80;
    yBall = 100;
    score = 0;
    document.getElementById("scoreDisplay").innerHTML = "Current Score: 0";
    size = 50;
    diamond = [];
}

function enter() {
    gameOn = true;
    score = -1;
    newLevel();
    generateFrame();
}

function pauseMenu() {
    document.getElementById("gameplayBlocker").style.display = "block";
    document.getElementById("pausePage").style.display = "block";
    gameOn = false;
  }
  
  function gameFromPause() {
    document.getElementById("gameplayBlocker").style.display = "none";
    document.getElementById("pausePage").style.display = "none";
    gameOn = true;
    generateFrame();
  }

  function random(min, max) {
    var number = Math.random() * (max - min) + min;
    return number;
  }

  ondeviceorientation = (event) => {
    if (gameOn && !calibrate) {
      generateMomentum(defaultGamma - event.gamma, defaultBeta - event.beta);
    } else {
      defaultBeta = event.beta;
      defaultGamma = event.gamma;
      calibrate = false;
    }
  };

  function requestDeviceOrientation() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
    if (permissionState === 'granted') {
    window.addEventListener('deviceorientation', () => {});
    }
    })
    .catch(console.error);
    } else {
    // handle regular non iOS 13+ devices
    console.log ("not iOS");
    }
  }

  function generateMomentum(x, y) {
    xMomentum -= (x^(1/3)) / 110;
    yMomentum -= (y^(1/3)) / 110;
    if (xMomentum > 0) {
      xMomentum -= 0.07;
      if (xMomentum < 0) {
        xMomentum = 0;
      }
    } else if (xMomentum < 0) {
      xMomentum += 0.07;
      if (xMomentum > 0) {
        xMomentum = 0;
      }
    }
    if (yMomentum > 0) {
      yMomentum -= 0.07;
      if (yMomentum < 0) {
        yMomentum = 0;
      }
    } else if (yMomentum < 0) {
      yMomentum += 0.07;
      if (yMomentum > 0) {
        yMomentum = 0;
      }
    }

    if (xMomentum > 15) {
      xMomentum = 15;
    } else if (xMomentum < -15) {
      xMomentum = -15;
    }
    if (yMomentum > 15) {
      yMomentum = 15;
    } else if (yMomentum < -15) {
      yMomentum = -15;
    }
  }

  function generateFrame() {
    xBall += xMomentum;
    yBall += yMomentum;
    if (xBall < 50) {
      xBall = 50;
      xMomentum = -(xMomentum * 0.6);
    } else if (xBall > width - 50 - (size * 2 - 100)) {
      xBall = width - 50 - (size * 2 - 100);
      xMomentum = -(xMomentum * 0.6);
    }
    if (yBall < 50) {
      yBall = 50;
      yMomentum = -(yMomentum * 0.6);
    } else if (yBall > height - 50 - (size * 2 - 100)) {
      yBall = height - 50 - (size * 2 - 100);
      yMomentum = -(yMomentum * 0.6);
    }
    if (xBall > width - size * 1.56 && yBall > height - size * 1.56 || win) {
      newLevel();
      win = false;
    }
    const canvas = document.getElementById("graphics");
    const game = canvas.getContext("2d");
    game.canvas.width = width;
    game.canvas.height = height;
    game.clearRect(0, 0, width, height);
    game.fillStyle = "#000000";
    if (currentId == 6) {
      game.fillStyle = "#ffffff";
    }
    game.beginPath();
    game.arc(width - size * 1.2 - 3, height - size * 1.2 - 8, size * 1.2, 0, 2 * Math.PI);
    game.fill();
    game.fillStyle = ballCoulor;
    game.beginPath();
    game.arc(xBall + size - 50, yBall + size - 50, size, 0, 2 * Math.PI);
    game.fill();
    game.fillStyle = obstacles;
    for (let i=0; i<diamond.length; i++) {
      game.beginPath();
      game.moveTo(Number(diamond[i].split(",")[0]) + (size * 1.15 / 2), diamond[i].split(",")[1]);
      game.lineTo(Number(diamond[i].split(",")[0]) + (size * 1.15), Number(diamond[i].split(",")[1]) + (size * 1.15 / 2));
      game.lineTo(Number(diamond[i].split(",")[0]) + (size * 1.15 / 2), Number(diamond[i].split(",")[1]) + (size * 1.15));
      game.lineTo(diamond[i].split(",")[0], Number(diamond[i].split(",")[1]) + (size * 1.15 / 2));
      game.fill();
    }
    if (gameOn) {
      window.requestAnimationFrame(generateFrame);
    }
  }

  function newLevel() {
    xBall = 80;
    yBall = 100;
    xMomentum = 0;
    yMomentum = 0;
    score++;
    document.getElementById("scoreDisplay").innerHTML = "Current Score: " + score;
    if (size > 20) {
      size -= 1;
    }
    for (let i=0; i<random(0, Math.ceil(score / 2)); i++) {
      diamond[i] = random(size + 30, width - size * 1.2 - 3) + "," + random(size + 50, height - size * 1.2 - 8); 
    }
  }