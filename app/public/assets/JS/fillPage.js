var list = document.querySelector(".listExercises");
list.innerHTML = "";
var schedaButtons = document.querySelector("#schedeButtons");
if (schedaButtons.previousElementSibling !== null) {
  schedaButtons.previousElementSibling.remove();
}
fillListWorkouts();

function fillPage(workout_id) {
  list.innerHTML = "";
  if (schedaButtons.previousElementSibling !== null) {
    schedaButtons.previousElementSibling.remove();
  }

  setTimeout(() => {
    fetch("../workout/" + workout_id, {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        fillButtons(json);

        let arraySchede = document.querySelectorAll(".schedaButton");

        arraySchede.forEach((el) => {
          el.onclick = (event) => {
            list.innerHTML = "";
            let schedaName = event.target.textContent;
            fillScheda(json, schedaName);
            // ─── From Modifyserie.js ─────
            modifySerie();
            updateScheda(workout_id);
            sendUpdate.parentElement.removeAttribute("hidden");
            // ─────────────────────────────
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
    '<div class="d-flex flex-row justify-content-center align-items-center">' +
    '<div class="p-2">' +
    '<div class="form-check">' +
    '<input type="checkbox" class="form-check-input" id="' +
    nameToPlace +
    num +
    '">' +
    '<label class="form-check-label ' +
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
    "</label></div></div>" +
    '<div class="p-2"><button type="button" class="btn btn-secondary btn-sm modalMOD" data-bs-toggle="modal" data-bs-target="#modalModifySerie">\naggiorna</button></div></div>';

  return exElement;
}

function fillButtons(json) {
  // ─── Create Button Group ─────────────────────────────────────────────
  let new_buttons = document.createElement("div");
  new_buttons.className = "p-2";
  let new_btn_group = document.createElement("div");
  new_btn_group.className = "btn-group";
  new_btn_group.role = "group";

  // ─── Add Buttons ─────────────────────────────────────────────────────
  json.schede.forEach((scheda) => {
    let name = scheda.name;
    let button =
      '<button type="button" class="btn btn-secondary schedaButton">' +
      name +
      "</button>";

    new_btn_group.innerHTML += button;
  });

  new_buttons.insertAdjacentElement("afterbegin", new_btn_group);
  schedaButtons.insertAdjacentElement("beforebegin", new_buttons);
}

function fillListWorkouts() {
  let list = document.querySelector(".listWorkouts");
  list.innerHTML = "";

  fetch("../workout")
    .then(function (response) {
      return response.json();
    })
    .then(function (array) {
      array.forEach((el) => {
        let button =
          '<button type="button" class="btn-sm list-group-item list-group-item-action workoutEl">' +
          el +
          "</button>";

        list.innerHTML += button;
      });
      // ─── From Changeworkout.js ───────────────────────────
      changeWorkout();
      // ─────────────────────────────────────────────────────
    });
}
