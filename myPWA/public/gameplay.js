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
var diamond = [];
var wall = [];
const width = window.innerWidth;
console.log(width);
const height = window.innerHeight;
var win = false;
console.log(Math.tan(90 * Math.PI / 180))
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
    collision();
    // xBall < -Math.tan(Number(wall[i].split(",")[2]) * Math.PI / 180) * yBall + Number(wall[i].split(",")[0]) && xBall + size * 2 > -Math.tan(Number(wall[i].split(",")[2]) * Math.PI / 180) * yBall + Number(wall[i].split(",")[0]) - size * 0.9 * (Math.cos((Number(wall[i].split(",")[2]) * Math.PI / 180))) && yBall < Math.tan((90 - Number(wall[i].split(",")[2])) * Math.PI / 180) * xBall + Number(wall[i].split(",")[1]) && yBall + size * 1.8 > Math.tan((90 - Number(wall[i].split(",")[2])) * Math.PI / 180) * xBall + Number(wall[i].split(",")[1]) - size * 0.9 * (Math.cos((Number(wall[i].split(",")[2]) * Math.PI / 180)))
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
    for (let i=0; i<wall.length; i++) {
      var wallTemp;
      game.beginPath();
      game.moveTo(wall[i].split(",")[0], wall[i].split(",")[1]);
      game.lineTo(Number(wall[i].split(",")[0]) + (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)), Number(wall[i].split(",")[1]) + (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180)));
      wallTemp = Number(wall[i].split(",")[0]) + (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)) + "," + (Number(wall[i].split(",")[1]) + (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180))) + "," + wall[i].split(",")[2];
      game.lineTo(Number(wallTemp.split(",")[0]) - (size * 0.9 * (Math.cos((Number(wallTemp.split(",")[2]) + 90) * Math.PI / 180))), Number(wallTemp.split(",")[1]) - (size * 0.9 * (Math.sin((Number(wallTemp.split(",")[2]) + 90) * Math.PI / 180))));
      game.lineTo(Number(wall[i].split(",")[0]) - (size * 0.9 * (Math.cos((Number(wall[i].split(",")[2]) + 90) * Math.PI / 180))), Number(wall[i].split(",")[1]) - (size * 0.9 * (Math.sin((Number(wall[i].split(",")[2]) + 90) * Math.PI / 180))));
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
    diamond = [];
    for (let i=0; i<random(Math.ceil(score / 20), Math.ceil(score / 2)); i++) {
      if (i > 19) { 
        i = Math.ceil(score / 2);
      }
      diamond[i] = random(0, width - size) + "," + random(0, height - size);
      if (diamond[i].split(",")[0] < 80 + size * 2.15 && diamond[i].split(",")[1] < 100 + size * 2.15) {
        i--;
      } else if (diamond[i].split(",")[0] > width - size * 3.4 && diamond[i].split(",")[1] > height - size * 3.4) {
        i--;
      }
    }

    wall = [];
    for (let i=0; i<random(1, 1); i++) {
      if (i > 10) {
        i = Math.floor(score / 4);
      }
      wall[i] = 0 + "," + 0 + "," + random(90, 90);
      wall[i] = 200 + "," + 100 + "," + wall[i].split(",")[2];
      if (wall[i].split(",")[0] < 80 + size * 2 && wall[i].split(",")[i] < 100 + size * 2) {
        i--;
      } else if (wall[i].split(",")[0] > width - size * 5 && wall[i].split(",")[1] > height - size * 5) {
        i--;
      }
    }
    /*for (let i=0; i<random(Math.floor(score / 10), Math.floor(score / 4)); i++) {
      if (i > 10) {
        i = Math.floor(score / 4);
      }
      wall[i] = 0 + "," + 0 + "," + random(0, 90);
      wall[i] = random(0, width - (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.sin((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + random(0, height - (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.cos((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + wall[i].split(",")[2];
      if (wall[i].split(",")[0] < 80 + size * 2 && wall[i].split(",")[i] < 100 + size * 2) {
        i--;
      } else if (wall[i].split(",")[0] > width - size * 5 && wall[i].split(",")[1] > height - size * 5) {
        i--;
      }
    }*/
  }

  function gameOver() {
    gameOn = false;
    addScore(score, username);
    document.getElementById("gameplayBlocker").style.display = "block";
  }

  function collision() {
    if (xBall > width - size * 1.56 && yBall > height - size * 1.56 || win) {
      newLevel();
      win = false;
    }
    for (let i=0; i<diamond.length; i++) {
      if (xBall - size * 0.8 < Number(diamond[i].split(",")[0]) + size * 1.15 && xBall + size * 0.8 > Number(diamond[i].split(",")[0]) && yBall + size * 0.8 > Number(diamond[i].split(",")[1]) && yBall - size * 0.8 < Number(diamond[i].split(",")[1]) + size * 1.15) {
        gameOver();
        console.log(diamond[i]);
      }
    }
    for (let i=0; i<wall.length; i++) {
      console.log(Number(wall[i].split(",")[0]) + Math.cos(Number(wall[i].split(",")[2]) * Math.PI / 180) * size * 3.5 * Math.abs((yBall-wall[i].split(",")[1])/(wall[i].split(",")[1]-Math.sin(Number(wall[i].split(",")[2]*Math.PI/180))*size*3.5)));
      if (xBall - size < Number(wall[i].split(",")[0]) + Math.cos(Number(wall[i].split(",")[2]) * Math.PI / 180) * size * 3.5 * Math.abs((yBall-wall[i].split(",")[1])/(wall[i].split(",")[1]-Math.sin(Number(wall[i].split(",")[2]*Math.PI/180))*size*3.5)) && xBall + size > Number(wall[i].split(",")[0]) + Math.cos(Number(wall[i].split(",")[2]) * Math.PI / 180) * size * 3.5 * Math.abs((yBall-wall[i].split(",")[1])/(wall[i].split(",")[1]-Math.sin(Number(wall[i].split(",")[2]*Math.PI/180))*size*3.5)) - size * 0.9 * Math.sin(wall[i].split(",")[2] * Math.PI / 180)) {
        //gameOver();
        console.log(xBall);
        console.log(wall[i]);
      }
    }
  }