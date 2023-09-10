var list = document.querySelector(".listExercises");
list.innerHTML = "";
var schedaButtons = document.querySelector("#schedeButtons");
while (schedaButtons.previousElementSibling !== null) {
  schedaButtons.previousElementSibling.remove();
}
fillListWorkouts();

function fillPage(workout_id) {
  list.innerHTML = "";
  while (schedaButtons.previousElementSibling !== null) {
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
          el.addEventListener("click", (event) => {
            list.innerHTML = "";
            let schedaName = event.target.textContent;
            fillScheda(json, schedaName);
            // ─── From Modifyserie.js ─────
            modifySerie();
            updateScheda(workout_id);
            sendUpdate.parentElement.removeAttribute("hidden");
            // ─────────────────────────────
          });
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
    li.innerHTML += completeElement(
      name,
      i + 1,
      serie[i].carico,
      serie[i].reps
    );
  }

  return li;
}

function completeElement(name, num, carico, reps) {
  let nameToPlace = name.replace(/[^a-zA-Z0-9]+/g, "");
  let exElement = `<div class="d-flex flex-row justify-content-center align-items-center"><div class="p-2">\
    <div class="form-check"><input type="checkbox" class="form-check-input" id="${nameToPlace}${num}">\
    <label class="form-check-label ${nameToPlace}Serie" for="${nameToPlace}${num}"><kbd>${carico}</kbd>\n<kbd>${reps}</kbd></label></div></div>\
    <div class="p-2"><button type="button" class="btn btn-secondary btn-sm modalMOD" data-bs-toggle="modal" data-bs-target="#modalModifySerie">aggiorna</button></div></div>`;

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
    let button = `<button type="button" class="btn btn-secondary schedaButton">${name}</button>`;
    new_btn_group.innerHTML += button;
  });
  new_buttons.insertAdjacentElement("afterbegin", new_btn_group);

  // ─── Create Delete Button ────────────────────────────────────────────
  let delete_button = document.createElement("div");
  delete_button.className = "p-2";
  delete_button.innerHTML = `<button type="button" class="btn deleteButton" workout="${json.name}">\
    <i><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAm0lEQVR4nK1TQQ7DIAzjR0v+EquH7R+9dTvuzy31hCokOlKG1kaKhIiTOA6EcKVRMFExHMYVQ8K4wah4rQpGwULFoy5uiIJ5w9i76rwqmD0BSybpnJOz75hQYN+AzKTsvIvd7F7NF2vg7N0d6kSHyc/OvUW6kpN5M7e205XcVYRnRGRjVa0VX/eQwgYaW2qXTBaxp6/Dmc/0r30ABUY5+6pBXusAAAAASUVORK5CYII="></i>\
    </button>`;

  schedaButtons.insertAdjacentElement("beforebegin", new_buttons);
  new_buttons.insertAdjacentElement("beforebegin", delete_button);

  // ─── Create Listener For Workout Deletion ────────────────────────────
  setDeleteWorkout();
}

function fillListWorkouts() {
  let list_workouts = document.querySelector(".listWorkouts");
  list_workouts.innerHTML = "";

  fetch("../workout")
    .then(function (response) {
      return response.json();
    })
    .then(function (array) {
      array.forEach((el) => {
        let button = `<button type="button" class="btn-sm list-group-item list-group-item-action workoutEl">${el}</button>`;
        list_workouts.innerHTML += button;
      });
      // ─── From Changeworkout.js ───────────────────────────
      changeWorkout();
      // ─────────────────────────────────────────────────────
    });
}
