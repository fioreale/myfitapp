function modifySerie(workoutId) {
  const elements = document.querySelectorAll(".modalMOD");
  const saveChanges = document.querySelector(".saveChanges");

  let weightMOD, repsMOD;

  // Reference to the input fields in the modal
  const weightInput = document.querySelector(".inputWeight");
  const repsInput = document.querySelector(".inputReps");

  elements.forEach((el) => {
    el.addEventListener("click", (event) => {
      // Navigate the DOM to find the corresponding weight and reps badges
      const exerciseDetail = event.target
        .closest(".d-flex.align-items-center")
        .querySelector(".exercise-details");
      weightMOD = exerciseDetail.querySelector(".weight");
      repsMOD = exerciseDetail.querySelector(".reps");

      // Set input placeholders to current values
      weightInput.placeholder = weightMOD.textContent;
      repsInput.placeholder = repsMOD.textContent;

      // Optionally, set input values to current values for direct editing
      weightInput.value = weightMOD.textContent;
      repsInput.value = repsMOD.textContent;
    });
  });

  saveChanges.addEventListener("click", () => {
    // Update textContent based on input values or revert to placeholders if inputs are empty
    weightMOD.textContent = weightInput.value || weightInput.placeholder;
    repsMOD.textContent = repsInput.value || repsInput.placeholder;

    // Reset input fields
    weightInput.value = "";
    repsInput.value = "";

    // Close the modal window using jQuery
    $("#modalModifySerie").modal("hide");

    // Update scheda in the backend
    updateScheda(workoutId)
  });
}
