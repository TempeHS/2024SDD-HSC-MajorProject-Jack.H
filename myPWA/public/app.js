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

  import sanitizeHtml from '../sanitize-html';
  var username = "Default User";
  var topScores = [ 0, 0, 0, 0, 0 ];
  var topNames = ["N/A", "N/A", "N/A", "N/A", "N/A"]
  var timesPlayed = -1;
  document.getElementById("statsPage").style.display = "none";
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
  }

  function outofhome(page) {
    document.getElementById("homescreen").style.display = "none";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "block";
    }
  }

  function homescreen(page) {
    document.getElementById("homescreen").style.display = "block";
    if (page == "stats") {
      document.getElementById("statsPage").style.display = "none";
    }
  }

  function addScore(score, name) {
    timesPlayed++;
    name = sanitizeHtml(name);
    name = "&lt" + name + "&gt";
    for (let i=0; i < topScores.length; i++) {
      if (score >= topScores[i]) {
        console.log("hi");
        topScores.splice(i, 0, score);
        topNames.splice(i, 0, name)
        break;
      }
    }
    if (topScores.length > 5) {
      topScores.splice(5, 1);
      topNames.splice(5, 1);
    }
    document.getElementById("scoreText").innerHTML = 
    '<span style="float:left">' + topNames[0] + '</span><span style="float:right">' + topScores[0] + '</span><br><br><br><span style="float:left">' + topNames[1] + '</span><span style="float:right">' + topScores[1] + '</span><br><br><br><span style="float:left">' + topNames[2] + '</span><span style="float:right">' + topScores[2] + '</span><br><br><br><span style="float:left">' + topNames[3] + '</span><span style="float:right">' + topScores[3] + '</span><br><br><br><span style="float:left">' + topNames[4] + '</span><span style="float:right">' + topScores[4] + '</span><br><br><br>';
    document.getElementById("scoreText").value = "Total Attempts: " + timesPlayed;
  }