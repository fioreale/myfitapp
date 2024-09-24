const workoutsContainer = document.querySelector(".listWorkouts");

if (workoutsContainer) {
  workoutsContainer.addEventListener("click", (event) => {
    // Ensure the clicked element is one of the workout buttons
    if (event.target.matches(".workoutButton")) { // Assuming `.workoutButton` class exists on each button
      fillPage(event.target.textContent);
      $("#modalAddWorkout").modal("hide");
    }
  });
}
