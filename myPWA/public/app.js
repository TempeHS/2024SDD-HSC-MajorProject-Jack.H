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

  function signIn() {
    document.getElementById("namePage").style.display = "block";
    document.getElementById("blocker").style.display = "block";
  }

  function homeFromSign() {
    document.getElementById("namePage").style.display = "none";
    document.getElementById("blocker").style.display = "none";
  }
