document.addEventListener("DOMContentLoaded", () => {
  const sendWorkoutButton = document.querySelector(".sendWorkout");
  const buttonExercise = document.querySelector(".addExerciseButton");
  const buttonScheda = document.querySelector(".addSchedaButton");
  const workoutNameInput = document.querySelector("#input-workout-name")
  const alertText = document.querySelector("#alert-text");
  const modalAddWorkout = $("#modalAddWorkout");
  const alertModal = $("#alert-modal");
  let currentSchedaName = "A"; // Track the current scheda name

  function inputGroupHTML(schedaName) {
    return `
      <div class="input-group input-text-exercise mb-1" data-scheda="${schedaName}">
        <input type="text" aria-label="esercizio" class="form-control" placeholder="esercizio">
        <input type="text" aria-label="serie" class="form-control" placeholder="serie">
        <input type="text" aria-label="reps" class="form-control" placeholder="reps">
        <button type="button" class="btn btn-danger delete-row">Delete</button>
        <button type="button" class="btn btn-secondary move-up">&#8593;</button>
        <button type="button" class="btn btn-secondary move-down">&#8595;</button>
      </div>`;
  }

  buttonExercise.addEventListener("click", () => {
    // Insert the input group with the current scheda name
    buttonExercise.insertAdjacentHTML("beforebegin", inputGroupHTML(currentSchedaName));
    buttonScheda.removeAttribute("hidden");
  });

  buttonScheda.addEventListener("click", () => {
    // Insert a divider and update the current scheda name for future inputs
    buttonExercise.insertAdjacentHTML("beforebegin", "<hr class='scheda-divider'>");
    currentSchedaName = getNextSchedaName(currentSchedaName);
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

  document.addEventListener("click", event => {
    const target = event.target;
    if (target.classList.contains("delete-row")) {
      target.closest(".input-group").remove();
    } else if (target.classList.contains("move-up") || target.classList.contains("move-down")) {
      const isMovingUp = target.classList.contains("move-up");
      moveElement(target.closest(".input-group"), isMovingUp);
    }
  });

  sendWorkoutButton.addEventListener("click", async () => {
    const listInputWorkouts = document.querySelectorAll(".input-text-exercise");
    const workoutJSON = createSchede(listInputWorkouts);

    if (!workoutJSON || !workoutNameInput.value.trim().replace(/[^a-zA-Z0-9]/g, '_')) {
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
      name: workoutNameInput.value.trim().replace(/[^a-zA-Z0-9]/g, '_'),
      schede: [...processSchede(listInputElements)],
    };
    return JSON.stringify(workout);
  }

  function processSchede(elements) {
    const schedeMap = {}; // Use an object to map scheda names to their exercises

    elements.forEach((element) => {
      // Only process elements that are exercise inputs
      if (element.classList.contains("input-text-exercise")) {
        const schedaName = element.dataset.scheda;
        const exercise = createEx_JSON(element);

        // If the scheda does not exist in the map, create it
        if (!schedeMap[schedaName]) {
          schedeMap[schedaName] = [];
        }

        // Add the exercise to the correct scheda in the map
        schedeMap[schedaName].push(exercise);
      }
    });

    // Convert the map into an array of schede objects
    const schede = Object.keys(schedeMap).map((name) => ({
      name: name,
      esercizi: schedeMap[name],
    }));

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
    if (swapElement && swapElement.classList.contains("input-text-exercise")) {
      // Perform the swap
      isMovingUp ? element.parentNode.insertBefore(element, swapElement) : element.parentNode.insertBefore(swapElement, element);

      // Update `data-scheda` attribute if moving across different scheda
      if (element.dataset.scheda !== swapElement.dataset.scheda) {
        element.dataset.scheda = swapElement.dataset.scheda;
        // Optionally, adjust the currentSchedaName if needed
      }
    }
  }
});
