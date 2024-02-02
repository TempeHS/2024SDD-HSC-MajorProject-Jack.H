  var username = "Default User";
  var topScores = [ 0, 0, 0, 0, 0 ];
  var topNames = ["N/A", "N/A", "N/A", "N/A", "N/A"];
  var timesPlayed = -1;
  var currentId = 1;
  var ballCoulor;
  var gameOn = false;
  var defaultBeta;
  var defaultGamma;
  if (localStorage.currentUsername != undefined) { 
    username = localStorage.currentUsername;
    topScores = localStorage.currentScores.split(",");
    topNames = localStorage.currentNames.split(",");
    timesPlayed = localStorage.currentTimes - 1;
    ballCoulor = localStorage.currentBallCoulor;
    currentId = localStorage.currentCurrentId;
  }
  addScore(0, "N/A");
  getThemes(currentId);

  function signIn() {
    document.getElementById("namePage").style.display = "block";
    document.getElementById("blocker").style.display = "block";
    document.getElementById("nameText").textContent = username;
  }

  function homeFromSign() {
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
    document.getElementById("homescreen").style.display = "none";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "block";
    } else if (page == "tutorial") {
      document.getElementById("tutorialPage").style.display = "block";
    } else if (page == "settings") {
      document.getElementById("settingsPage").style.display = "block";
      if (ballCoulor == "default") {
        document.getElementById("ballCoulor").value = "#000000";
      } else {
        document.getElementById("ballCoulor").value = ballCoulor;
      }
      getThemes(0);
    } else if (page == "gameplay") {
      document.getElementById("gameplay").style.display = "block";
      generateGraphics();
      gameOn = true;
    }
  }

  function homescreen(page) {
    getThemes(currentId);
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
      gameOn = false;
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

  function getThemes(send) {
    if (send == 0) {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => defineButtons(data))
    .catch(error => console.error('Error fetching JSON:', error));
    } else if (send == 7) {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => setBall(true, data))
    .catch(error => console.error('Error fetching JSON:', error));
    } else {
      fetch('frontEndData.json') 
    .then(response => response.json())
    .then(data => setTheme(data, send))
    .catch(error => console.error('Error fetching JSON:', error));
    }
  }

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
      if (time == "day") {
        currentTheme = levels[i].day;
      } else if (time == "night") {
        currentTheme = levels[i].night;
      } else {
        currentTheme = levels[i].change;
      }
      theme.fillStyle = "#" + currentTheme.substr(0, 6);
      theme.fillRect(0, 0, 80, 80);
      theme.fillStyle = "#" + currentTheme.substr(12, 6);
      theme.beginPath();
      theme.moveTo(55, 40);
      theme.lineTo(70, 70);
      theme.lineTo(40, 70);
      theme.fill();
      theme.fillStyle = "#" + currentTheme.substr(6, 6);
      theme.beginPath();
      theme.arc(25, 25, 15, 0, 2 * Math.PI);
      theme.fill();
      theme.strokeStyle = "black";
      theme.lineWidth = 4.0;
      theme.strokeRect(0, 0, 80, 80);
    }
  }

  function setTheme(levels, id) {
    currentId = id;
    localStorage.currentCurrentId = currentId;
    id --;
    var time = new Date();
    var currentTheme;
    var cssClass;
    getThemes(7);
    if (time.getHours() >= 10 && time.getHours() <= 16) {
      currentTheme = levels[id].day;
    } else if (time.getHours() <= 4 || time.getHours() >= 20) {
      currentTheme = levels[id].night;
    } else {
      currentTheme = levels[id].change;
    }

    cssClass = document.querySelectorAll('*');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.substr(0, 6);
      if (id == 2 || id > 3) {
        cssClass[i].style.color = "white";
      } else {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.homeButton');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.substr(12, 6);
      if (id == 1) {
        cssClass[i].style.color = "white";
      } else if (id == 2 || id == 5) {
        cssClass[i].style.color = "black";
      }
    }

    cssClass = document.querySelectorAll('.settingsButton');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "#" + currentTheme.substr(12, 6);
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

    cssClass = document.querySelectorAll('.scoreDisplay');
    for(var i=0; i<cssClass.length; i++) {
      cssClass[i].style.backgroundColor = "transparent";
    }

    cssClass = document.querySelectorAll('.pause');
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

  function setBall(original, info) {
    ballCoulor = document.getElementById("ballCoulor").value;
    if (original == true) {
      var time = new Date();
      var currentTime;
      if (time.getHours() >= 10 && time.getHours() <= 16) {
        currentTime = info[currentId-1].day;
      } else if (time.getHours() <= 4 || time.getHours() >= 20) {
        currentTime = info[currentId-1].night;
      } else {
        currentTime = info[currentId-1].change;
      }
      ballCoulor = "#" + currentTime.substr(6, 6);
    }
    localStorage.currentBallCoulor = ballCoulor;
  }

  function pauseMenu() {
    document.getElementById("gameplayBlocker").style.display = "block";
    document.getElementById("pausePage").style.display = "block";
  }
  
  function gameFromPause() {
    document.getElementById("gameplayBlocker").style.display = "none";
    document.getElementById("pausePage").style.display = "none";
  }

  function generateGraphics() {
    const canvas = document.getElementById("graphics");
    const game = canvas.getContext("2d");
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
    game.fillStyle = ballCoulor;
    game.beginPath();
    game.arc(random(50, (window.innerWidth-51)), random(50, (window.innerHeight-55)), 50, 0, 2 * Math.PI);
    game.fill();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  ondeviceorientation = (event) => {
    requestDeviceOrientation();
    if (gameOn && defaultBeta != undefined) {
      document.getElementById("scoreDisplay").innerHTML = "Orientation: " + event.beta;
    } else {
      defaultBeta = event.beta;
      defaultGamma = event.gamma;
    }
  };

  function requestDeviceOrientation () {
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