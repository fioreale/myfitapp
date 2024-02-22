async function updateScheda(workoutId) {
  const sendUpdate = document.querySelector("#updateScheda");
  sendUpdate.addEventListener("click", async () => {
    const exercisesList = document.querySelectorAll(".esercizi");
    const schedaName = document.querySelector(".listExercises").getAttribute("scheda");

    if (schedaName) {
      const updatedScheda = {
        name: schedaName,
        esercizi: Array.from(exercisesList).map((el) => {
          const exerciseName = el.querySelector("h5").textContent;
          const weightBadge = el.querySelector(".weight").textContent;
          const repsBadge = el.querySelector(".reps").textContent;
          const seriesBadge = el.querySelector(".series").textContent;

          return {
            name: exerciseName,
            serie: {
              series: parseInt(seriesBadge, 10), // Ensure series is an integer
              carico: weightBadge,
              reps: repsBadge,
            },
          };
        }),
      };

      console.log(JSON.stringify(updatedScheda)); // Debugging line to verify data structure

      try {
        const response = await fetch(`../workout/${workoutId}`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScheda),
        });

        if (!response.ok) {
          throw new Error(`Failed to update workout: ${response.statusText}`);
        }

        fillPage(workoutId);
        showAlert("Aggiornamento eseguito!", "success");
      } catch (error) {
        console.error(error); // Log the error for debugging
        showAlert("Impossibile aggiornare il workout!", "danger");
      }
    }
  });
}


function showAlert(message, type) {
  const alertText = document.querySelector("#alert-text");
  alertText.textContent = message;
  // Use Bootstrap's modal and alert classes to show the message
  // Adjust according to your modal setup
  const alertModal = $("#alert-modal");
  alertModal.find(".modal-body").className = `modal-body text-${type}`;
  alertModal.modal("show");
}
