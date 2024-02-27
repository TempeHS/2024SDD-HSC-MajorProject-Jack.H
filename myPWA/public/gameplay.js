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
var mine = [];
var diaMove = [];
var track = [];
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
    document.getElementById("resume").style.display = "inline";
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
    document.getElementById("calibration").style.display = "none";
    gameOn = true;
    generateFrame();
  }

  function restart() {
    document.getElementById("retry").style.display = "none";
    document.getElementById("resume").style.display = "inline";
    document.getElementById("gameplayBlocker").style.display = "none";
    document.getElementById("pausePage").style.display = "none";
    document.getElementById("calibration").style.display = "none";
    addScore(score, username);
    size = 50;
    score = -1;
    xMomentum = 0;
    yMomentum = 0;
    gameOn = true;
    newLevel();
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
      if (calibrate || document.getElementById("pausePage").style.display == "none")
      defaultBeta = event.beta;
      defaultGamma = event.gamma;
      calibrate = false;
      if (document.getElementById("pausePage").style.display == "block" && !gameOn) {
        document.getElementById("calibration").style.display = "block";
      }
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
    const canvas = document.getElementById("graphics");
    const game = canvas.getContext("2d", { willReadFrequently : true });
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
    game.strokeStyle = obstacles;
    game.lineWidth = 5;
    game.beginPath();
    game.arc(xBall + size - 50, yBall + size - 50, size, 0, 2 * Math.PI);
    game.fill();
    game.fillStyle = obstacles;
    for (let i=0; i<diamond.length; i++) {
      if (diamond[i] != undefined) {
        game.beginPath();
        game.moveTo(Number(diamond[i].split(",")[0]) + (size * 1.15 / 2), diamond[i].split(",")[1]);
        game.lineTo(Number(diamond[i].split(",")[0]) + (size * 1.15), Number(diamond[i].split(",")[1]) + (size * 1.15 / 2));
        game.lineTo(Number(diamond[i].split(",")[0]) + (size * 1.15 / 2), Number(diamond[i].split(",")[1]) + (size * 1.15));
        game.lineTo(diamond[i].split(",")[0], Number(diamond[i].split(",")[1]) + (size * 1.15 / 2));
        game.fill();
      }
    }
    for (let i=0; i<wall.length; i++) {
      if (wall[i] != undefined) {
        var wallTemp;
        game.beginPath();
        game.moveTo(wall[i].split(",")[0], wall[i].split(",")[1]);
        game.lineTo(Number(wall[i].split(",")[0]) + (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)), Number(wall[i].split(",")[1]) + (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180)));
        wallTemp = Number(wall[i].split(",")[0]) + (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)) + "," + (Number(wall[i].split(",")[1]) + (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180))) + "," + wall[i].split(",")[2];
        game.lineTo(Number(wallTemp.split(",")[0]) - (size * 0.9 * (Math.cos((Number(wallTemp.split(",")[2]) + 90) * Math.PI / 180))), Number(wallTemp.split(",")[1]) - (size * 0.9 * (Math.sin((Number(wallTemp.split(",")[2]) + 90) * Math.PI / 180))));
        game.lineTo(Number(wall[i].split(",")[0]) - (size * 0.9 * (Math.cos((Number(wall[i].split(",")[2]) + 90) * Math.PI / 180))), Number(wall[i].split(",")[1]) - (size * 0.9 * (Math.sin((Number(wall[i].split(",")[2]) + 90) * Math.PI / 180))));
        game.fill();
      }
    }
    var rgb = convertRgb(obstacles);
    var image = new Image();
    image.src = "icons/mine.png";
    for (let i=0; i<mine.length; i++) {
      if (mine[i] != undefined) {
        if (mine[i].split(",")[2] == 11) {
          game.drawImage(image, mine[i].split(",")[0], mine[i].split(",")[1], size * 1.5, size * 1.5);
          var img = game.getImageData(mine[i].split(",")[0], mine[i].split(",")[1], size * 1.5, size * 1.5);
          for (let i=0; i<img.data.length; i+=4) {
              img.data[i] = rgb.r;
              img.data[i+1] = rgb.g;
              img.data[i+2] = rgb.b; 
          }
          game.putImageData(img, mine[i].split(",")[0], mine[i].split(",")[1]);
        } else {
          game.beginPath();
          game.arc(Number(mine[i].split(",")[0]) + size * 0.75, Number(mine[i].split(",")[1]) + size * 0.75, size * 0.75, 0, 2 * Math.PI);
          game.fill();
          mine[i] = mine[i].split(",")[0] + "," + mine[i].split(",")[1] + "," + (Number(mine[i].split(",")[2]) - 1);
          if (Number(mine[i].split(",")[2]) < 1) {
            mine.splice(i, 1);
          }
        }
      }
    }
    for (let i=0; i<diaMove.length; i++) {
      if (diaMove[i] != undefined) {
        game.beginPath();
        game.moveTo(Number(diaMove[i].split(",")[0]) + (size * 1.15 / 2), diaMove[i].split(",")[1]);
        game.lineTo(Number(diaMove[i].split(",")[0]) + (size * 1.15), Number(diaMove[i].split(",")[1]) + (size * 1.15 / 2));
        game.lineTo(Number(diaMove[i].split(",")[0]) + (size * 1.15 / 2), Number(diaMove[i].split(",")[1]) + (size * 1.15));
        game.lineTo(diaMove[i].split(",")[0], Number(diaMove[i].split(",")[1]) + (size * 1.15 / 2));
        game.fill();
        game.beginPath();
        game.moveTo(track[i].split(",")[0], track[i].split(",")[1]);
        game.lineTo(track[i].split(",")[2], track[i].split(",")[3]);
        game.stroke();
        diaMove[i] = (-((Number(track[i].split(",")[0]) - size * 1.15 / 2) - (Number(track[i].split(",")[2]) - size * 1.15 / 2)) * (Number(diaMove[i].split(",")[2]) / 100) + (Number(track[i].split(",")[0]) - size * 1.15 / 2)) + "," + (-((Number(track[i].split(",")[1]) - size * 1.15 / 2) - (Number(track[i].split(",")[3]) - size * 1.15 / 2)) * (Number(diaMove[i].split(",")[2]) / 100) + (Number(track[i].split(",")[1]) - size * 1.15 / 2)) + "," + (Number(diaMove[i].split(",")[2]) + 0.2 * Number(diaMove[i].split(",")[3])) + "," + diaMove[i].split(",")[3];
        if (Number(diaMove[i].split(",")[2]) > 100 || Number(diaMove[i].split(",")[2]) < 0) {
          diaMove[i] = diaMove[i].split(",")[0] + "," + diaMove[i].split(",")[1] + ","+ diaMove[i].split(",")[2] + "," + (Number(diaMove[i].split(",")[3]) * -1);
        }
      }
    }
    collision();
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
      if (i > 15) { 
        i = Math.ceil(score / 2);
      }
      diamond[i] = random(0, width - size) + "," + random(0, height - size);
      if (diamond[i].split(",")[0] < 80 + size * 3.15 && diamond[i].split(",")[1] < 100 + size * 3.15) {
        diamond.splice(i, 1);
        i--;
      } else if (diamond[i].split(",")[0] > width - size * 3.4 && diamond[i].split(",")[1] > height - size * 3.4) {
        diamond.splice(i, 1);
        i--;
      }
    }

    wall = [];
    /*for (let i=0; i<random(1, 1); i++) {
      if (i > 11) {
        i = Math.floor(score / 4);
      }
      wall[i] = 0 + "," + 0 + "," + random(0, 1);
      wall[i] = 0 + "," + 200 + "," + Number(wall[i].split(",")[2]);
      if (wall[i].split(",")[0] < 80 + size && wall[i].split(",")[i] < 100 + size) {
        wall.splice(i, 1);
        i--;
      } else if (wall[i].split(",")[0] > width - size * 4 && wall[i].split(",")[1] > height - size * 4) {
        console.log("hi");
        wall.splice(i, 1);
        i--;
      }
    }*/
    for (let i=0; i<random(Math.floor(score / 10), Math.floor(score / 4)); i++) {
      if (i > 10) {
        i = Math.floor(score / 4);
      }
      wall[i] = 0 + "," + 0 + "," + Math.round(random(1, 1));
      wall[i] = random(0, width - (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.sin((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + random(0, height - (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.cos((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + (Number(wall[i].split(",")[2]) * 90);
      if (wall[i].split(",")[0] < 80 + size * 2 && wall[i].split(",")[1] < 100 + size * 2) {
        wall.splice(i, 1);
        i--;
      } else if (wall[i].split(",")[0] > width - size * 5 && wall[i].split(",")[1] > height - size * 5) {
        wall.splice(i, 1);
        i--;
      }
    }

    mine = [];
    for (let i=0; i<random(Math.floor(score / 12), Math.floor(score / 10)); i++) {
      if (i > 10) {
        i = 1;
      }
      mine[i] = random(0, width - size * 4.2) + "," + random(0, height - size * 4.2) + "," + 11; 
      if (mine[i].split(",")[0] < 80 + size && mine[i].split(",")[1] < 100 + size) {
        mine.splice(i, 1);
        i--;
      } else if (mine[i].split(",")[0] > width - size * 3 && mine[i].split(",")[1] > height - size * 3) {
        mine.splice(i, 1);
        i--;
      }
    }

    diaMove = [];
    track = [];
    if (score >= 20) {
      for (let i=0; i<random(Math.floor(score / 20), Math.floor(score / 13)); i++) {
        if (i > 6) { 
          i = Math.ceil(score / 20);
        }
        diaMove[i] = random(0, width - size) + "," + random(0, height - size) + "," + 0 + "," + 1;
        track[i] = Number(diaMove[i].split(",")[0]) + size * 1.15 / 2 + "," + (Number(diaMove[i].split(",")[1]) + size * 1.15 / 2) + "," + random(0, width - size) + "," + random(0, height - size);
        if (diaMove[i].split(",")[0] < 80 + size * 3.15 && diaMove[i].split(",")[1] < 100 + size * 3.15) {
          diaMove.splice(i, 1);
          track.splice(i, 1);
          i--;
        } else if (diaMove[i].split(",")[0] > width - size * 3.4 && diaMove[i].split(",")[1] > height - size * 3.4) {
          diaMove.splice(i, 1);
          track.splice(i, 1);
          i--;
        }
      }
    }
   }

  function gameOver() {
    gameOn = false;
    addScore(score, username);
    document.getElementById("gameplayBlocker").style.display = "block";
    document.getElementById("resume").style.display = "none";
    document.getElementById("retry").style.display = "inline";
    document.getElementById("pausePage").style.display = "block";
  }

  function collision() {
    if (xBall > width - size * 1.56 && yBall > height - size * 1.56 || win) {
      newLevel();
      win = false;
    }
    for (let i=0; i<diamond.length; i++) {
      if (diamond[i] != undefined) {
        if (xBall - size * 0.8 < Number(diamond[i].split(",")[0]) + size * 1.15 && xBall + size * 0.8 > Number(diamond[i].split(",")[0]) && yBall + size * 0.8 > Number(diamond[i].split(",")[1]) && yBall - size * 0.8 < Number(diamond[i].split(",")[1]) + size * 1.15) {
          gameOver();
          console.log(diamond[i]);
        }
      }
    }
    for (let i=0; i<wall.length; i++) {
      console.log(wall[i].split(",")[1]);
      if (wall[i] != undefined) {
        if ((wall[i].split(",")[2] == 90 && xBall - size < Number(wall[i].split(",")[0]) + size * 0.9 && xBall + size > wall[i].split(",")[0] && yBall - size < Number(wall[i].split(",")[1]) + size * 3.5 && yBall + size > wall[i].split(",")[1]) 
        || (wall[i].split(",")[2] == 0 && xBall - size < Number(wall[i].split(",")[0]) + size * 3.5 && xBall + size > wall[i].split(",")[0] && yBall - size < wall[i].split(",")[1] && yBall + size > Number(wall[i].split(",")[1]) - size * 0.9)) {
          console.log(yBall);
          xMomentum = -(xMomentum * 0.6);
          yMomentum = -(yMomentum * 0.6);
        }
      }
    }
    for (let i=0; i<mine.length; i++) {
    if (mine[i] != undefined) {
      if (xBall - size * 0.8 < Number(mine[i].split(",")[0]) + size * 2 && xBall + size * 0.8 > Number(mine[i].split(",")[0]) && yBall - size * 0.8 < Number(mine[i].split(",")[1]) + size * 2 && yBall + size * 0.8 > Number(mine[i].split(",")[1]) && mine[i].split(",")[2] == 11) {
        xMomentum = ((xBall - (Number(mine[i].split(",")[0]) + size))^2) / 2;
        yMomentum = ((yBall - (Number(mine[i].split(",")[1]) + size))^2) / 2;
        mine[i] = mine[i].split(",")[0] + "," + mine[i].split(",")[1] + "," + 10;
      }
    }
    }
    for (let i=0; i<diaMove.length; i++) {
      if (diaMove[i] != undefined) {
        if (xBall - size * 0.8 < Number(diaMove[i].split(",")[0]) + size * 1.15 && xBall + size * 0.8 > Number(diaMove[i].split(",")[0]) && yBall + size * 0.8 > Number(diaMove[i].split(",")[1]) && yBall - size * 0.8 < Number(diaMove[i].split(",")[1]) + size * 1.15) {
          gameOver();
          console.log(diaMove[i]);
        }
      }
    }
  }

  function convertRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }