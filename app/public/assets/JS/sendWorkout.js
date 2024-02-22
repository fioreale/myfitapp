document.addEventListener("DOMContentLoaded", () => {
  const sendWorkoutButton = document.querySelector(".sendWorkout");
  const buttonExercise = document.querySelector(".addExerciseButton");
  const buttonScheda = document.querySelector(".addSchedaButton");
  const workoutNameInput = document.querySelector("#input-workout-name");
  const alertText = document.querySelector("#alert-text");
  const modalAddWorkout = $("#modalAddWorkout");
  const alertModal = $("#alert-modal");

  const inputGroupHTML = `
      <div class="input-group input-text-exercise mb-1">
          <input type="text" aria-label="esercizio" class="form-control" placeholder="esercizio">
          <input type="text" aria-label="serie" class="form-control" placeholder="serie">
          <input type="text" aria-label="reps" class="form-control" placeholder="reps">
          <button type="button" class="btn btn-danger delete-row">Delete</button>
          <button type="button" class="btn btn-secondary move-up">&#8593;</button>
          <button type="button" class="btn btn-secondary move-down">&#8595;</button>
      </div>`;

  buttonExercise.addEventListener("click", () => {
    buttonExercise.insertAdjacentHTML("beforebegin", inputGroupHTML);
    buttonScheda.removeAttribute("hidden");
  });

  buttonScheda.addEventListener("click", () => {
    buttonExercise.insertAdjacentHTML("beforebegin", "<hr>");
    buttonExercise.insertAdjacentHTML("beforebegin", `<div class="scheda"></div>`);
  });

  document.addEventListener("click", event => {
    const target = event.target;
    if (target.classList.contains("delete-row")) {
      target.closest(".input-group").remove();
    } else if (target.classList.contains("move-up")) {
      moveElement(target.closest(".input-group"), true);
    } else if (target.classList.contains("move-down")) {
      moveElement(target.closest(".input-group"), false);
    }
  });

  sendWorkoutButton.addEventListener("click", async () => {
    const listInputWorkouts = document.querySelectorAll(".input-text-exercise");
    const workoutJSON = createSchede(listInputWorkouts);

    if (!workoutNameInput.value.trim() || !workoutJSON) {
      alertText.textContent = "Valori Mancanti!";
      alertModal.modal("show");
      return;
    }

    try {
      const response = await fetch("../workout", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: workoutJSON,
      });

      if (response.ok) {
        fillListWorkouts(); // Assuming this function refreshes some part of your UI
        modalAddWorkout.modal("hide");
        buttonScheda.hidden = true;
        alertText.textContent = "Nuovo workout aggiunto!";
      } else {
        alertText.textContent = "Impossibile inserire workout!";
      }
      alertModal.modal("show");
    } catch (error) {
      console.error("Error submitting workout:", error);
      alertText.textContent = `Errore: ${error}`;
      alertModal.modal("show");
    }
  });

  function createSchede(listInputElements) {
    let workout = {
      name: workoutNameInput.value.trim(),
      schede: [...processSchede(listInputElements)],
    };
    return JSON.stringify(workout);
  }

  function processSchede(elements) {
    const schede = []; // Array to hold all schede
    let currentSchedaExercises = []; // Temp array for current scheda exercises
    let schedaName = "A"; // Starting name for scheda, increment alphabetically for each new scheda

    elements.forEach((element, index) => {
      const exercise = createEx_JSON(element);
      currentSchedaExercises.push(exercise);

      // If the next element is a divider (e.g., <hr>) or the last element in the list,
      // it indicates the end of the current scheda.
      const isLastElement = index === elements.length - 1;
      const isNextDivider = elements[index + 1] && elements[index + 1].matches(".scheda-divider");
      if (isLastElement || isNextDivider) {
        schede.push({
          name: schedaName,
          esercizi: currentSchedaExercises,
        });
        // Reset for the next scheda
        currentSchedaExercises = [];
        schedaName = getNextSchedaName(schedaName);
      }
    });

    return schede;
  }

  function createEx_JSON(exerciseElement) {
    const inputs = exerciseElement.querySelectorAll("input");
    const titleEx = inputs[0].value.trim();
    const howMany = inputs[1].value.trim();
    const reps = inputs[2].value.trim();

    if (!titleEx || !howMany || !reps) {
      throw new Error("missing values");
    }

    return {
      name: titleEx,
      serie: {
        series: parseInt(howMany, 10),
        reps: reps,
        carico: "KG?", // Assuming 'carico' is not provided in the input, defaulting to "0"
      },
    };
  }

  function getNextSchedaName(currentName) {
    // Increment the ASCII code of the last character for the next scheda name
    return String.fromCharCode(currentName.charCodeAt(0) + 1);
  }


  function moveElement(element, isMovingUp) {
    let swapElement = isMovingUp ? element.previousElementSibling : element.nextElementSibling;
    if (swapElement) {
      isMovingUp ? swapElement.before(element) : element.before(swapElement);
    }
  }
});
