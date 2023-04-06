let sendUpdate = document.querySelector("#updateScheda");
sendUpdate.parentElement.setAttribute("hidden", "");

function updateScheda(workout_id) {
  sendUpdate.onclick = function () {
    let exercisesArray = document.querySelectorAll(".esercizi");
    let scheda_name = document
      .querySelector(".listExercises")
      .getAttribute("scheda");

    if (scheda_name !== "") {
      let Scheda = {
        name: scheda_name,
        esercizi: [],
      };

      exercisesArray.forEach((el) => {
        let exerciseName = el.firstElementChild.textContent;

        let exercise = {
          name: exerciseName,
          serie: [],
        };

        let arraySerie = document.querySelectorAll(
          "." + exerciseName.replace(/[^a-zA-Z0-9]+/g, "") + "Serie"
        );

        arraySerie.forEach((serie) => {
          let carico = serie.firstElementChild.textContent;
          let reps = serie.firstElementChild.nextElementSibling.textContent;

          exercise.serie.push({
            reps: reps,
            carico: carico,
          });
        });

        Scheda.esercizi.push(exercise);
      });

      fetch("../workout/" + workout_id, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Scheda),
      })
        .then(function (response) {
          // from fillPage.js
          fillPage(workout_id);
          sendUpdate.parentElement.setAttribute("hidden", "");
          document.querySelector("#alert-text").textContent =
            "Aggiornamento eseguito!";
          $("#alert-modal").modal("show");
        })
        .catch(function (error) {
          document.querySelector("#alert-text").textContent =
            "Impossibile inserire workout!";
          $("#alert-modal").modal("show");
        });
    }
  };
}
