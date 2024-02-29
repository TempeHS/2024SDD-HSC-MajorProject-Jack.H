// This js file handles everything in the game screen
var gameOn = false;
var defaultBeta;
var defaultGamma;
var xMomentum = 0;
var yMomentum = 0;
var xBall = 80;
var yBall = 100;
var score = 0;
var size = 50;
var xSave = 80;
var ySave = 100;
var calibrate = true;
var hitOn = true;
var obstacles = "#ffffff"
var diamond = [];
var wall = [];
var mine = [];
var diaMove = [];
var track = [];
var hit = document.getElementById("hit");
hit.src = document.getElementById("hitFX").src;
hit.volume = 1.0;

function quit() {
    addScore(score, username);
    gameOn = false;
    xMomentum = 0;
    yMomentum = 0;
    xBall = 80;
    yBall = 100;
    score = 0;
    sfx.src = document.getElementById("menu").src;
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
    sfx.src = document.getElementById("menu").src;
    sfx.volume = 1.0;
    sfx.play();
    music.pause();
    document.getElementById("gameplayBlocker").style.display = "block";
    document.getElementById("pausePage").style.display = "block";
    gameOn = false;
  }
  
  function gameFromPause() {
    sfx.src = document.getElementById("menu").src;
    sfx.volume = 1.0;
    sfx.play();
    music.play();
    document.getElementById("gameplayBlocker").style.display = "none";
    document.getElementById("pausePage").style.display = "none";
    document.getElementById("calibration").style.display = "none";
    gameOn = true;
    generateFrame();
  }

  function restart() {
    music.currentTime = 0;
    music.play();
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
      if (!(document.getElementById("pausePage").style.display == "block" && !calibrate)) {
        document.getElementById("calibration").style.display = "block";
        defaultBeta = event.beta;
        defaultGamma = event.gamma; 
        calibrate = false;
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

  // Speed calculations for ball
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

  // Loads graphics
  function generateFrame() {
    xBall += xMomentum;
    yBall += yMomentum;
    
    // Checks for screen borders
    if (xBall < 50) {
      xBall = 50;
      xMomentum = -(xMomentum * 0.6);
      if (hitOn) {
        hit.play();
      }
      hitOn = false;
    } else if (xBall > width - 50 - (size * 2 - 100)) {
      xBall = width - 50 - (size * 2 - 100);
      xMomentum = -(xMomentum * 0.6);
      if (hitOn) {
        hit.play();
      }
      hitOn = false;
    } else {
      hitOn = true;
    }
    if (yBall < 50) {
      yBall = 50;
      yMomentum = -(yMomentum * 0.6);
      if (hitOn) {
        hit.play();
      }
      hitOn = false;
    } else if (yBall > height - 50 - (size * 2 - 100)) {
      yBall = height - 50 - (size * 2 - 100);
      yMomentum = -(yMomentum * 0.6);
      if (hitOn) {
        hit.play();
      }
      hitOn = false;
    } else {
      hitOn = true;
    }

    // Canvas generation
    const canvas = document.getElementById("graphics");
    const game = canvas.getContext("2d", { willReadFrequently : true });
    game.canvas.width = width;
    game.canvas.height = height;
    game.clearRect(0, 0, width, height);

    // Draw goal
    game.fillStyle = "#000000";
    if (currentId == 6) {
      game.fillStyle = "#ffffff";
    }
    game.beginPath();
    game.arc(width - size * 1.2 - 3, height - size * 1.2 - 8, size * 1.2, 0, 2 * Math.PI);
    game.fill();

    // Draw ball
    game.fillStyle = ballCoulor;
    game.strokeStyle = obstacles;
    game.lineWidth = 5;
    game.beginPath();
    game.arc(xBall + size - 50, yBall + size - 50, size, 0, 2 * Math.PI);
    game.fill();

    // Draw diamonds
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

    // Draw walls
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

    // Draw mines
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

    // Draw moving diamonds
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

    // Generate diamonds
    diamond = [];
    for (let i=0; i<random(Math.ceil(score / 20), Math.ceil(score / 2)); i++) {
      if (i > 15) { 
        i = Math.ceil(score / 2);
      }
      diamond[i] = random(0, width - size) + "," + random(0, height - size);
      if (diamond[i].split(",")[0] < 80 + size * 3.15 && diamond[i].split(",")[1] < 100 + size * 3.15) {
        diamond.splice(i, 1);
        i--;
      } else if (diamond[i].split(",")[0] > width - size * 4 && diamond[i].split(",")[1] > height - size * 4) {
        diamond.splice(i, 1);
        i--;
      }
      if (diamond.length > 1 && (diamond[i].split(",")[0] > width - size * 6 || diamond[i].split(",")[1] > height - size * 6)) {
        for (let j=0; j<diamond.length-1; j++) {
          if (diamond[j].split(",")[0] > width - size * 6 || diamond[j].split(",")[1] > height - size * 6) {
            diamond.splice(i, 1);
            j = diamond.length-1;
            i--;
          }
        }
      }
    }

    // Generate walls
    wall = [];
    for (let i=0; i<random(Math.floor(score / 10), Math.floor(score / 4)); i++) {
      if (i > 10) {
        i = Math.floor(score / 4);
      }
      wall[i] = 0 + "," + 0 + "," + (Math.round(random(0, 1)) * 90);
      wall[i] = random(0, width - (size * 3.5 * Math.cos((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.sin((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + random(0, height - (size * 3.5 * Math.sin((Number(wall[i].split(",")[2])) * Math.PI / 180)) - (size * 0.9 * Math.cos((Number(wall[i].split(",")[2]))) * Math.PI / 180)) + "," + wall[i].split(",")[2];
      if (wall[i].split(",")[0] < 80 + size * 2 && wall[i].split(",")[1] < 100 + size * 2) {
        wall.splice(i, 1);
        i--;
      } else if (wall[i].split(",")[0] > width - size * 5 && wall[i].split(",")[1] > height - size * 5) {
        wall.splice(i, 1);
        i--;
      } 
      if (wall.length > 1) {
        for (let j=0; j<wall.length-1; j++) {
          if (wall[i].split(",")[0] - wall[j].split(",")[0] < 5 && wall[i].split(",")[2] == 0 && wall[j].split(",")[2] == 0) {
            wall.splice(i, 1);
            j = wall.length-1;
            i--;
          } else if (wall[i].split(",")[1] - wall[j].split(",")[1] < 5 && wall[i].split(",")[2] == 90 && wall[j].split(",")[2] == 90) {
            wall.splice(i, 1);
            j = wall.length-1;
            i--;
          }
        }
      }
    }


    // Generate mines
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

    // Generate moving diamonds
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
    sfx.src = document.getElementById("death").src;
    sfx.volume = 0.4;
    sfx.play();
    gameOn = false;
    addScore(score, username);
    document.getElementById("gameplayBlocker").style.display = "block";
    document.getElementById("resume").style.display = "none";
    document.getElementById("retry").style.display = "inline";
    document.getElementById("pausePage").style.display = "block";
    music.pause();
    navigator.vibrate(200);
  }

  // Checks for collision between ball and obstacles
  function collision() {
    // Goal collision
    if (xBall > width - size * 1.56 && yBall > height - size * 1.56) {
      newLevel();
    }

    // Diamond collision
    for (let i=0; i<diamond.length; i++) {
      if (diamond[i] != undefined) {
        if (xBall - size * 0.8 < Number(diamond[i].split(",")[0]) + size * 1.15 && xBall + size * 0.8 > Number(diamond[i].split(",")[0]) && yBall + size * 0.8 > Number(diamond[i].split(",")[1]) && yBall - size * 0.8 < Number(diamond[i].split(",")[1]) + size * 1.15) {
          gameOver();
        }
      }
    }

    // Wall collision
    for (let i=0; i<wall.length; i++) {
      if (wall[i] != undefined) {
        if ((wall[i].split(",")[2] == 90 && xBall - size < Number(wall[i].split(",")[0]) + size * 0.9 && xBall + size > wall[i].split(",")[0] && yBall - size * 0.8 < Number(wall[i].split(",")[1]) + size * 3.5 && yBall + size * 0.8 > wall[i].split(",")[1])) {
          if ((xBall < wall[i].split(",")[0] || xBall > Number(wall[i].split(",")[0]) + size * 0.9) && !(yBall < wall[i].split(",")[1] || yBall > Number(wall[i].split(",")[1]) + size * 3.5)) {
            xBall = xSave;
            xMomentum = -(xMomentum * 0.9);
          } else if (!(xBall < wall[i].split(",")[0] || xBall > Number(wall[i].split(",")[0]) + size * 0.9) && (yBall < wall[i].split(",")[1] || yBall > Number(wall[i].split(",")[1]) + size * 3.5)) {
            yBall = ySave
            yMomentum = -(yMomentum * 0.9);
          } else {
            xBall = xSave;
            yBall = ySave;
            xMomentum = -(xMomentum * 0.9); 
            yMomentum = -(yMomentum * 0.9);
          }
          if (hitOn) {
            hit.play();
          }
          hitOn = false;
        } else if ((wall[i].split(",")[2] == 0 && xBall - size * 0.8 < Number(wall[i].split(",")[0]) + size * 3.5 && xBall + size * 0.8 > wall[i].split(",")[0] && yBall - size < wall[i].split(",")[1] && yBall + size > Number(wall[i].split(",")[1]) - size * 0.9)) {
          if ((xBall < wall[i].split(",")[0] || xBall > Number(wall[i].split(",")[0]) + size * 3.5) && !(yBall < wall[i].split(",")[1] || yBall > Number(wall[i].split(",")[1]) + size * 0.9)) {
            xBall = xSave;
            xMomentum = -(xMomentum * 0.9);
          } else if (!(xBall < wall[i].split(",")[0] || xBall > Number(wall[i].split(",")[0]) + size * 3.5) && (yBall < wall[i].split(",")[1] || yBall > Number(wall[i].split(",")[1]) + size * 0.9)) {
            yBall = ySave;
            yMomentum = -(yMomentum * 0.9);
          } else {
            xBall = xSave;
            yBall = ySave;
            xMomentum = -(xMomentum * 0.9); 
            yMomentum = -(yMomentum * 0.9);
          }
          if (hitOn) {
            hit.play();
          }
          hitOn = false;
        } else {
          xSave = xBall;
          ySave = yBall;
          hitOn = true;
        }
      } 
    }

    // Mine collision
    for (let i=0; i<mine.length; i++) {
    if (mine[i] != undefined) {
      if (xBall - size * 0.8 < Number(mine[i].split(",")[0]) + size * 2 && xBall + size * 0.8 > Number(mine[i].split(",")[0]) && yBall - size * 0.8 < Number(mine[i].split(",")[1]) + size * 2 && yBall + size * 0.8 > Number(mine[i].split(",")[1]) && mine[i].split(",")[2] == 11) {
        xMomentum = ((xBall - (Number(mine[i].split(",")[0]) + size * 1.5))^2) / 5;
        yMomentum = ((yBall - (Number(mine[i].split(",")[1]) + size * 1.5))^2) / 5;
        mine[i] = mine[i].split(",")[0] + "," + mine[i].split(",")[1] + "," + 10;
        sfx.src = document.getElementById("explode").src;
        sfx.volume = 0.3;
        sfx.play();
      }
    }
    }

    // Moving diamond collision
    for (let i=0; i<diaMove.length; i++) {
      if (diaMove[i] != undefined) {
        if (xBall - size * 0.8 < Number(diaMove[i].split(",")[0]) + size * 1.15 && xBall + size * 0.8 > Number(diaMove[i].split(",")[0]) && yBall + size * 0.8 > Number(diaMove[i].split(",")[1]) && yBall - size * 0.8 < Number(diaMove[i].split(",")[1]) + size * 1.15) {
          gameOver();
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