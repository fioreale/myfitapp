function setDeleteWorkout() {
  document
    .querySelector(".deleteButton")
    .addEventListener("click", function () {
      $("#delete-toast").toast("show");

      // ─── Set Listener For Removal Confirm ────────────────
      deleteWorkout();
    });
}

function deleteWorkout() {
  document
    .querySelector(".toast .btn-primary")
    .addEventListener("click", function (event) {
      let workout_id = document
        .querySelector(".deleteButton")
        .getAttribute("workout");

      fetch("../workout/" + workout_id, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 200) {
            document.querySelector("#alert-text").textContent =
              "Workout Eliminato!";
            $("#alert-modal").modal("show");
          } else {
            document.querySelector("#alert-text-error").textContent =
              "Impossibile eliminare il workout!";
            $("#alert-modal-error").modal("show");
          }
        })
        .catch((error) => {
          document.querySelector("#alert-text-error").textContent =
            "Impossibile eliminare il workout :: " + error;
          $("#alert-modal-error").modal("show");
        });

      $("#delete-toast").toast("hide");

      // ─── Clean Display ───────────────────────────────────────────
      let list_ex = document.querySelector(".listExercises");
      list_ex.innerHTML = "";
      let schedaButtons = document.querySelector("#schedeButtons");
      while (schedaButtons.previousElementSibling !== null) {
        schedaButtons.previousElementSibling.remove();
      }
      document.querySelector("#updateScheda").setAttribute("hidden", "");
      fillListWorkouts();
    });
}
