  // This js file handles everything outside of the game screen
  var username = "Default User";
  var topScores = [ 0, 0, 0, 0, 0 ];
  var topNames = ["N/A", "N/A", "N/A", "N/A", "N/A"];
  var timesPlayed = -1;
  var currentId = 1;
  var ballCoulor = "#ff5757";
  const width = window.innerWidth;
  const height = window.innerHeight;
  var homeX = random(50, width - 50);
  var homeY = random(50, height - 50);
  var angle = random(0, 360);
  var move = true;
  var sfx = document.getElementById("sfx");
  sfx.src = document.getElementById("menu").src;
  var music = document.getElementById("music");
  music.loop = true;
  music.src = document.getElementById("homeTheme").src;

  addLocalStorage();
  addScore(0, "N/A");
  getThemes(currentId);
  moveBall();

  window.addEventListener("click", () => {
    music.play();
  }, { once: true });

  function addLocalStorage() {
    if (localStorage.currentUsername != undefined) { 
      username = localStorage.currentUsername;
    }
    if (localStorage.currentScores != undefined) { 
      topScores = localStorage.currentScores.split(",");
    }
    if (localStorage.currentNames != undefined) { 
      topNames = localStorage.currentNames.split(",");
    }
    if (localStorage.currentTimes != undefined) { 
      timesPlayed = localStorage.currentTimes - 1;
    }
    if (localStorage.currentBallCoulor != undefined) { 
      ballCoulor = localStorage.currentBallCoulor;
    } 
    if (localStorage.currentCurrentId != undefined) { 
      currentId = localStorage.currentCurrentId;
    }
  }

  function signIn() {
    sfx.volume = 1.0;
    sfx.play();
    document.getElementById("namePage").style.display = "block";
    document.getElementById("blocker").style.display = "block";
    document.getElementById("nameText").textContent = username;
  }

  function homeFromSign() {
    sfx.volume = 1.0;
    sfx.play();
    document.getElementById("namePage").style.display = "none";
    document.getElementById("blocker").style.display = "none";
    document.getElementById("usernameText").value = document.getElementById("usernameText").defaultValue;
  }

  function changeName() {
    if (document.getElementById("usernameText").value != document.getElementById("usernameText").defaultValue) {
      username = document.getElementById("usernameText").value;
      document.getElementById("nameText").textContent = username;
    }
    localStorage.currentUsername = username;
  }

  function outofhome(page) {
    getThemes(currentId);
    move = false;
    sfx.volume = 1.0;
    sfx.play();
    document.getElementById("homescreen").style.display = "none";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "block";
    } else if (page == "tutorial") {
      document.getElementById("tutorialPage").style.display = "block";
    } else if (page == "settings") {
      document.getElementById("settingsPage").style.display = "block";
      document.getElementById("ballCoulor").value = ballCoulor;
      getThemes(0);
    } else if (page == "gameplay") {
      document.getElementById("gameplay").style.display = "block";
      document.getElementById("calibration").style.display = "none";
      music.src = document.getElementById("gameTheme").src;
      music.play();
      enter();
    }
  }

  function homescreen(page) {
    getThemes(currentId);
    move = true;
    moveBall();
    sfx.volume = 1.0;
    sfx.play();
    document.getElementById("homescreen").style.display = "block";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "none";
    } else if (page == "tutorial") {
      document.getElementById("tutorialPage").style.display = "none";
    } else if (page == "settings") {
      document.getElementById("settingsPage").style.display = "none"; 
    } else if (page == "gameplay") {
      document.getElementById("gameplay").style.display = "none";  
      document.getElementById("gameplayBlocker").style.display = "none"; 
      document.getElementById("pausePage").style.display = "none";
      document.getElementById("retry").style.display = "none";
      music.src = document.getElementById("homeTheme").src;
      music.play();
      quit();
    }
  }

  function addScore(score, name) {
    timesPlayed++;
    for (let i=0; i < topScores.length; i++) {
      if (score >= topScores[i]) {
        topScores.splice(i, 0, score);
        topNames.splice(i, 0, name);
        break;
      }
    }
    if (topScores.length > 5) {
      topScores.splice(6, 1);
      topNames.splice(6, 1);
    }
    document.getElementById("scoreText").innerHTML = 
    '<span style="float:left">' + topNames[0] + '</span><span style="float:right">' + topScores[0] + '</span><br><br><br><span style="float:left">' + topNames[1] + '</span><span style="float:right">' + topScores[1] + '</span><br><br><br><span style="float:left">' + topNames[2] + '</span><span style="float:right">' + topScores[2] + '</span><br><br><br><span style="float:left">' + topNames[3] + '</span><span style="float:right">' + topScores[3] + '</span><br><br><br><span style="float:left">' + topNames[4] + '</span><span style="float:right">' + topScores[4] + '</span><br><br><br>';
    document.getElementById("attemptCount").innerHTML = "Total Attempts: " + timesPlayed;
    localStorage.currentTimes = timesPlayed;
    localStorage.currentScores = topScores.join();
    localStorage.currentNames = topNames.join();
  }

  // Gets data from json file
  function getThemes(send) {
    if (send == 0) {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => defineButtons(data))
    .catch(error => console.error('Error fetching JSON:', error));
    } else if (send == 7) {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => setBall(data))
    .catch(error => console.error('Error fetching JSON:', error));
    } else {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => setTheme(data, send))
    .catch(error => console.error('Error fetching JSON:', error));
    }
  }

  // Loads buttons on settings page
  function defineButtons(levels) {
    var time = new Date();
    var currentTheme;
    if (time.getHours() >= 10 && time.getHours() <= 16) {
      time = "day";
    } else if (time.getHours() <= 4 || time.getHours() >= 20) {
      time = "night";
    } else {
      time = "change";
    }
    for (let i = 0; i < 6; i++) {
      const theme = document.getElementById("levelCanvas" + (i+1)).getContext("2d");
      theme.clearRect(-10, -10, 100, 100);
      if (time == "day") {
        currentTheme = levels[i].day;
      } else if (time == "night") {
        currentTheme = levels[i].night;
      } else {
        currentTheme = levels[i].change;
      }
      theme.fillStyle = "#" + currentTheme.slice(0, 6);
      theme.fillRect(0, 0, 80, 80);
      theme.fillStyle = "#" + currentTheme.slice(12, 18);
      theme.beginPath();
      theme.moveTo(55, 40);
      theme.lineTo(70, 70);
      theme.lineTo(40, 70);
      theme.fill();
      theme.fillStyle = "#" + currentTheme.slice(6, 12);
      theme.beginPath();
      theme.arc(25, 25, 15, 0, 2 * Math.PI);
      theme.fill();
      if (i == currentId - 1) {
        theme.strokeStyle = "yellow";
        theme.lineWidth = 8.0;
        theme.strokeRect(0, 0, 80, 80);
      } else {
        theme.strokeStyle = "black";
        theme.lineWidth = 4.0;
        theme.strokeRect(0, 0, 80, 80);
      }
    }
  }

  // Changes all elements to the theme coulors
  function setTheme(levels, id) {
    if (currentId != id) {
      getThemes(7);
    }
    if (document.getElementById("settingsPage").style.display == "block") {
      getThemes(0);
    }
    currentId = id;
    localStorage.currentCurrentId = currentId;
    id --;
    var time = new Date();
    var currentTheme;
    var cssClass;
    if (time.getHours() >= 10 && time.getHours() <= 16) {
      currentTheme = levels[id].day;
    } else if (time.getHours() <= 4 || time.getHours() >= 20) {
      currentTheme = levels[id].night;
    } else {
      currentTheme = levels[id].change;
    }
    obstacles = "#" + currentTheme.slice(12, 18);
    cssClass = document.querySelectorAll('*');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.slice(0, 6);
      if (id == 2 || id > 3) {
        cssClass[i].style.color = "white";
      } else {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.homeButton');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.slice(12, 18);
      if (id == 1) {
        cssClass[i].style.color = "white";
      } else if (id == 2 || id == 5) {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.settingsButton');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.slice(12, 18);
      if (id == 1) {
        cssClass[i].style.color = "white";
      } else if (id == 2 || id == 5) {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.changeButton');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.slice(12, 18);
      if (id == 1) {
        cssClass[i].style.color = "white";
      } else if (id == 2 || id == 5) {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.blocker');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "black";
    }

    cssClass = document.querySelectorAll('.calibration');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "black";
      cssClass[i].style.color = "white";
    }

    cssClass = document.querySelectorAll('.scoreDisplay');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    cssClass = document.querySelectorAll('.pause');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    cssClass = document.querySelectorAll('.title');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    cssClass = document.querySelectorAll('.settings');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    cssClass = document.querySelectorAll('.signIn');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    if (id == 5) {
      cssClass = document.querySelectorAll('.tutorialImage');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].style.backgroundColor = "white";
      }
      cssClass = document.querySelectorAll('.xImage');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/x_button_invert.png";
      }
      cssClass = document.querySelectorAll('.backButton');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/back_arrow_invert.png";
      }
      cssClass = document.querySelectorAll('.settings');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/settings_invert.png";
      }
      cssClass = document.querySelectorAll('.signIn');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/signIn_invert.png";
      }
      cssClass = document.querySelectorAll('.pause');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/pause_invert.png";
      }
    } else {
      cssClass = document.querySelectorAll('.xImage');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/x_button.png";
      }
      cssClass = document.querySelectorAll('.backButton');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/back_arrow.png";
      }
      cssClass = document.querySelectorAll('.settings');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/settings.png";
      }
      cssClass = document.querySelectorAll('.signIn');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/signIn.png";
      }
      cssClass = document.querySelectorAll('.pause');
      for(var i=0; i<cssClass.length; i++) {
        cssClass[i].src = "icons/pause.png";
      }
    }
  }

  // Changes ball coulor
  function setBall(info) {
    ballCoulor = document.getElementById("ballCoulor").value;
    if (info != "n/a") {
      var time = new Date();
      var currentTime;
      if (time.getHours() >= 10 && time.getHours() <= 16) {
        currentTime = info[currentId-1].day;
      } else if (time.getHours() <= 4 || time.getHours() >= 20) {
        currentTime = info[currentId-1].night;
      } else {
        currentTime = info[currentId-1].change;
      }
      ballCoulor = "#" + currentTime.slice(6, 12);
    }
    localStorage.currentBallCoulor = ballCoulor;
  }

  function random(min, max) {
    var number = Math.random() * (max - min) + min;
    return number;
  }

  // Handles ball on homescreen
  function moveBall() {
    const canvas = document.getElementById("homeBall");
    const ball = canvas.getContext("2d");
    ball.canvas.width = width;
    ball.canvas.height = height;
    ball.clearRect(0, 0, width, height);
    ball.fillStyle = ballCoulor;
    ball.beginPath();
    ball.arc(homeX, homeY, 50, 0, 2 * Math.PI);
    ball.fill();
    homeX += 1.5 * Math.sin(angle * Math.PI / 180);
    homeY -= 1.5 * Math.cos(angle * Math.PI / 180);
    if (homeX < 50) {
      homeX = 50;
      if (angle >= 270) {
        angle = random(0, 90);
      } else {
        angle = random(90, 180);
      }
    } else if (homeX > width - 50) {
      homeX = width - 50;
      if (angle >= 90) {
        angle = random(180, 270);
      } else {
        angle = random(270, 360);
      }
    }
    if (homeY < 50) {
      homeY = 50;
      if (angle >= 0 && angle <= 180) {
        angle = random(90, 180);
      } else {
        angle = random(180, 270);
      }
    } else if (homeY > height - 50) {
      homeY = height - 50;
      if (angle >= 180) {
        angle = random(270, 360);
      } else {
        angle = random(0, 90);
      }
    }
    if (move) {
      window.requestAnimationFrame(moveBall);
    }
  }