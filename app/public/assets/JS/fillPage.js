// Use const for elements that do not change
const list = document.querySelector(".listExercises");
const schedaButtons = document.querySelector("#schedeButtons");

// Refactor repetitive DOM manipulation into functions
function clearElement(element) {
  element.innerHTML = "";
}

function removeAllPreviousSiblings(element) {
  while (element.previousElementSibling !== null) {
    element.previousElementSibling.remove();
  }
}

// Initial cleanup
clearElement(list);
removeAllPreviousSiblings(schedaButtons);
fillListWorkouts();

// Refactored to use async/await for readability
async function fillPage(workoutId) {
  clearElement(list);
  removeAllPreviousSiblings(schedaButtons);

  // Simulate delay if needed
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch(`../workout/${workoutId}`);
    const json = await response.json();
    fillButtons(json);

    document.querySelectorAll(".schedaButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        clearElement(list);
        const schedaName = event.target.textContent;
        fillScheda(json, schedaName);

        modifySerie(workoutId);
      });
    });
  } catch (error) {
    console.error("Failed to fetch workout details:", error);
  }
}

function fillScheda(workout, name) {
  list.setAttribute("scheda", name);
  workout.schede
    .find((s) => s.name === name)
    ?.esercizi.forEach((exercise) => {
      const exerciseElement = createExerciseElement(
        exercise.name,
        exercise.serie
      );
      list.appendChild(exerciseElement);
    });
}

function createExerciseElement(name, serie) {
  const li = document.createElement("li");
  li.className = "list-group-item esercizi";
  li.innerHTML =
    completeElement(name, serie.series, serie.carico, serie.reps);
  return li;
}

// Refactor to use template literals and extract similar functionality
function completeElement(name, series_num, carico, reps) {
  const nameToPlace = name.replace(/[^a-zA-Z0-9]+/g, "");
  const increment = 100 / series_num; // Calculate increment per series completion

  // Button to mark a series as completed, with an onclick event calling incrementSeries function
  const buttonHTML = `
    <button type="button" class="btn btn-outline-success w-100" onclick="incrementSeries('${nameToPlace}', ${increment})">&#10003;</button>
  `;

  // Exercise details with badges and update button
  const exerciseDetailsHTML = `
  <div class="container-fluid px-0">
      <div class="row gx-0 gy-2 align-items-center">
          <div class="col-12">
              ${buttonHTML}
          </div>
          <div class="col-12 col-md exercise-details">
              <ul class="list-unstyled mb-0">
                  <li class="d-flex justify-content-start align-items-center mb-2">
                      <span><i class="bi bi-list-ol me-2"></i></span> 
                      <span class="badge text-bg-danger px-2 text-wrap series">${series_num}</span>
                  </li>
                  <li class="d-flex justify-content-start align-items-center mb-2">
                      <span><i class="bi bi-download me-2"></i></span>  
                      <span class="badge text-bg-light px-2 text-wrap weight">${carico}</span>
                  </li>
                  <li class="d-flex justify-content-start align-items-center">
                      <span><i class="bi bi-arrow-repeat me-2"></i></span> 
                      <span class="badge text-bg-light px-2 text-wrap reps">${reps}</span>
                  </li>
              </ul>
          </div>
          <div class="col-12 d-flex justify-content-end">
              <button type="button" class="btn btn-warning btn-sm w-100 modalMOD" data-bs-toggle="modal" data-bs-target="#modalModifySerie">Aggiorna</button>
          </div>
      </div>
  </div>
  `;

  // Progress bar HTML, placed in its own 'row' under the exercise details
  const progressBarHTML = `
    <div class="progress mt-2" role="progressbar" aria-label="Exercise progress" aria-valuenow="0" aria-valuemin="0"
      aria-valuemax="100">
      <div class="progress-bar progress-bar-striped progress-bar-animated" id="progress${nameToPlace}" style="width: 0%">
      </div>
    </div>
  `;

  // Combine exercise details and progress bar. To ensure the div covers the entire width on mobile and has a fixed length on desktop,
  // use Bootstrap's grid system and responsive utility classes.
  return `
    <div class="container col-12 col-md-6 text-center">
      <div class="title-container">
        <h5 class="fs-4">${name}</h5>
      </div>
      ${exerciseDetailsHTML}
      ${progressBarHTML}
    </div>
  `;
}

// Function to increment series progress
function incrementSeries(nameToPlace, increment) {
  const progressBar = document.getElementById(`progress${nameToPlace}`);
  let currentProgress = parseFloat(progressBar.style.width) || 0;
  let newProgress = currentProgress + increment;
  newProgress = newProgress > 100 ? 100 : newProgress; // Ensure progress does not exceed 100%

  progressBar.style.width = `${newProgress}%`;
  progressBar.setAttribute("aria-valuenow", newProgress);

  // Optional: Perform additional actions when series is completed
  if (newProgress === 100) {
    // Example: Alert completion or disable button
    console.log("Series completed for", nameToPlace);
  }

  $("#collapseTimer").collapse("show");
  const [minutes, seconds] = document.querySelector("#rest-time").textContent.split(":").map(Number);
  const durationInSeconds = minutes * 60 + seconds;
  timer.start(durationInSeconds);
}

// ─── Populate Series Buttons ───────────────────────────────────────────── ✣ ─
function fillButtons(json) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "btn-group";
  buttonContainer.setAttribute("role", "group");

  // Use a document fragment to minimize DOM manipulation
  const fragment = document.createDocumentFragment();

  json.schede.forEach((scheda) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary schedaButton";
    button.textContent = scheda.name;
    fragment.appendChild(button);
  });

  buttonContainer.appendChild(fragment);
  schedaButtons.insertAdjacentElement("beforebegin", buttonContainer);

  // ─── Create Listener For Workout Deletion ────────────────────────────
  // setDeleteWorkout();
}

// ─── Populate Workouts Buttons ─────────────────────────────────────────── ✣ ─
async function fillListWorkouts() {
  const listWorkouts = document.querySelector(".listWorkouts");
  clearElement(listWorkouts); // Reusing the clearElement function from the previous refactor

  try {
    const response = await fetch("../workout");
    const workouts = await response.json();

    // Similar to fillButtons, use a document fragment for efficiency
    const fragment = document.createDocumentFragment();

    workouts.forEach((workout) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "btn-sm list-group-item list-group-item-action workoutButton";
      button.textContent = workout;
      fragment.appendChild(button);
    });

    listWorkouts.appendChild(fragment);

  } catch (error) {
    console.error("Failed to load workouts:", error);
  }
}
