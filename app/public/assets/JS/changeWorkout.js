function changeWorkout() {
  var list_workouts = document.querySelectorAll(".listWorkouts");

  list_workouts.forEach((workout_button) => {
    workout_button.onclick = (event) => {
      // from FillPage.js
      fillPage(event.target.textContent);
      $("#modalAddWorkout").modal("hide");
    };
  });
}
