/*let result = ""; 

fetch('./frontEndData.json') 

  .then(function (response) { 

    return response.json(); 

  }) 

  .then(function (data) { 

    appendData(data); 

  }) 

  .catch(function (err) { 

    console.log('error: ' + err); 

  }); 

  function appendData(data) { 

    data.forEach(({ nesaID, name, age } = rows) => { 

      result += ` 

       <div class="card"> 

            <img class="card-image" src="https://windsorpreschool.com/teachers/generic-profile-image-7" alt=""/> 

            <h1 class="card-name">${name}</h1> 

            <p class="card-about">${age}</p> 

            <a class="card-link" ${nesaID}</a> 

        </div> 

       `; 

    }); 

    document.querySelector(".container").innerHTML = result; 

  } 

   

  if ("serviceWorker" in navigator) { 

    window.addEventListener("load", function () { 

      navigator.serviceWorker 

        .register("/serviceWorker.js") 

        .then((res) => console.log("service worker registered")) 

        .catch((err) => console.log("service worker not registered", err)); 

    }); 

  } */

  var username = "Default User";
  var topScores = [ 0, 0, 0, 0, 0 ];
  var topNames = ["N/A", "N/A", "N/A", "N/A", "N/A"]
  var timesPlayed = -1;
  if (localStorage.currentUsername != undefined) { 
    username = localStorage.currentUsername;
    topScores = localStorage.currentScores.split(",");
    topNames = localStorage.currentNames.split(",");
    timesPlayed = localStorage.currentTimes - 1;
  }
  var hi;
  fetch('frontEndData.json') 
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching JSON:', error));
  addScore(0, "N/A");

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
    document.getElementById("homescreen").style.display = "none";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "block";
    } else if (page == "tutorial") {
      document.getElementById("tutorialPage").style.display = "block";
    } else if (page == "settings") {
      document.getElementById("settingsPage").style.display = "block";
      defineButtons();
    }
  }

  function homescreen(page) {
    document.getElementById("homescreen").style.display = "block";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "none";
    } else if (page == "tutorial") {
      document.getElementById("tutorialPage").style.display = "none";
    } else if (page == "settings") {
      document.getElementById("settingsPage").style.display = "none"; 
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

  function defineButtons() {
    var time = new Date();
    if (time.getHours() >= 10 && time.getHours() <= 16) {
      time = 0;
    } else if (time.getHours() <= 4 || time.getHours() >= 20) {
      time = 11;
    } else {
      time = 5;
    }
    console.log(time);
    for (let i = 1; i < 7; i++) {
      const theme = document.getElementById("levelCanvas" + i).getContext("2d");
      theme.fillStyle = "green";
      theme.fillRect(0, 0, 80, 80);
      theme.fillStyle = "yellow";
      theme.beginPath();
      theme.moveTo(55, 40);
      theme.lineTo(70, 70);
      theme.lineTo(40, 70);
      theme.fill();
      theme.fillStyle = "red";
      theme.beginPath();
      theme.arc(25, 25, 15, 0, 2 * Math.PI);
      theme.fill();
      theme.strokeStyle = "black";
      theme.lineWidth = 4.0;
      theme.strokeRect(0, 0, 80, 80);
    }
  }