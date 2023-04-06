var list = document.querySelector(".listExercises");
var schedaButtons = document.querySelector("#schedeButtons");
list.innerHTML = "";
schedaButtons.innerHTML = "";
fillListWorkouts();

function fillPage(workout_id) {
  list.innerHTML = "";
  schedaButtons.innerHTML = "";
  setTimeout(() => {
    fetch("../workout/" + workout_id, {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
        // return response
      })
      .then(function (json) {
        fillButtons(json);

        let arraySchede = document.querySelectorAll(".schedaButton");

        arraySchede.forEach((el) => {
          el.onclick = (event) => {
            list.innerHTML = "";
            let schedaName = event.target.textContent;
            fillScheda(json, schedaName);
            // from modifySerie.js
            modifySerie();
            updateScheda(workout_id);
            sendUpdate.parentElement.removeAttribute("hidden");
          };
        });
      });
  }, 1000);
}

function fillScheda(workout, name) {
  list.setAttribute("scheda", name);
  for (let i = 0; i < workout.schede.length; i++) {
    if (workout.schede[i].name === name) {
      workout.schede[i].esercizi.forEach((el) => {
        let elJSON = fillExercise(el.name, el.serie);
        list.appendChild(elJSON);
      });
    }
  }
}

function fillExercise(name, serie) {
  let li = document.createElement("li");
  let h5 = document.createElement("h5");
  h5.textContent = name;

  li.setAttribute("class", "list-group-item esercizi");
  li.appendChild(h5);
  for (let i = 0; i < serie.length; i++) {
    li.innerHTML =
      li.innerHTML +
      completeElement(name, i + 1, serie[i].carico, serie[i].reps);
  }

  return li;
}

function completeElement(name, num, carico, reps) {
  let nameToPlace = name.replace(/[^a-zA-Z0-9]+/g, "");
  let exElement =
    '<div class="d-flex align-items-center flex-row bd-highlight mb-1">' +
    '<div class="custom-control custom-checkbox">' +
    '<input type="checkbox" class="custom-control-input" id="' +
    nameToPlace +
    num +
    '">' +
    '<label class="custom-control-label ' +
    nameToPlace +
    "Serie" +
    '" for="' +
    nameToPlace +
    num +
    '">' +
    "<kbd>" +
    carico +
    "</kbd>\n" +
    "<kbd>" +
    reps +
    "</kbd>\n" +
    "</label></div>" +
    '<button type="button" class="btn btn-outline-dark btn-sm ml-1 modalMOD" data-toggle="modal" data-target="#modalModifySerie">\naggiorna</button></div>';

  return exElement;
}

function fillButtons(json) {
  json.schede.forEach((scheda) => {
    let name = scheda.name;
    let button =
      '<button type="button" class="btn btn-outline-secondary schedaButton">' +
      name +
      "</button>";

    schedaButtons.innerHTML += button;
  });
}

function fillListWorkouts() {
  let list = document.querySelector(".listWorkouts");
  list.innerHTML = "";

  fetch("../workout")
    .then(function (response) {
      return response.json();
      // return response
    })
    .then(function (array) {
      array.forEach((el) => {
        let button =
          '<button type="button" class="btn-sm list-group-item list-group-item-action workoutEl">' +
          el +
          "</button>";

        list.innerHTML += button;
      });
      // from changeWorkout.js
      changeWorkout();
    });
}
