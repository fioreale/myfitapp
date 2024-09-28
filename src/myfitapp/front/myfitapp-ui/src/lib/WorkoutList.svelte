<script lang="ts">
  import { onMount, createEventDispatcher, afterUpdate } from "svelte";
  import ModifySerieModal from "./ModifySerieModal.svelte";

  export let selectedWorkout: string | null = null;
  export let selectedScheda: string | null = null;

  interface Serie {
    series: number;
    reps: string;
    carico: string;
  }

  interface Esercizio {
    name: string;
    serie: Serie;
  }

  interface Scheda {
    name: string;
    esercizi: Esercizio[];
  }

  interface Workout {
    name: string;
    schede: Scheda[];
  }

  let exercises: Esercizio[] = [];
  let currentExercise: Esercizio | null = null;
  let showModifyModal = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (selectedWorkout && selectedScheda) {
      fetchExercises();
    }
  });

  afterUpdate(() => {
    fetchExercises();
  });

  async function fetchExercises() {
    if (!selectedWorkout || !selectedScheda) return;

    try {
      const response = await fetch(`/api/workout/${selectedWorkout}`);
      const workout: Workout = await response.json();
      const scheda = workout.schede.find((s) => s.name === selectedScheda);
      if (scheda) {
        exercises = scheda.esercizi;
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    }
  }

  function incrementSeries(exerciseName: string, increment: number) {
    const progressBar = document.getElementById(
      `progress${exerciseName.replace(/[^a-zA-Z0-9]+/g, "")}`
    );
    if (progressBar) {
      let currentProgress = parseFloat(progressBar.style.width) || 0;
      let newProgress = Math.min(currentProgress + increment, 100);
      progressBar.style.width = `${newProgress}%`;
      progressBar.setAttribute("aria-valuenow", newProgress.toString());

      if (newProgress === 100) {
        console.log("Series completed for", exerciseName);
      }

      dispatch("seriesCompleted", { exerciseName, progress: newProgress });
    }
  }

  function updateExercise(exercise: Esercizio) {
    currentExercise = exercise;
    showModifyModal = true;
  }

  async function handleSaveModifiedSerie(event: CustomEvent) {
    const { weight, reps } = event.detail;
    if (currentExercise) {
      currentExercise.serie.carico = weight;
      currentExercise.serie.reps = reps;

      try {
        const updatedScheda = {
          name: selectedScheda,
          esercizi: exercises.map((e) =>
            e.name === currentExercise!.name ? currentExercise : e
          ),
        };

        const response = await fetch(`/api/workout/${selectedWorkout}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScheda),
        });

        if (!response.ok) {
          throw new Error(`Failed to update workout: ${response.statusText}`);
        }

        console.log("Workout updated successfully");
        await fetchExercises(); // Refresh the exercises list
        showModifyModal = false;
      } catch (error) {
        console.error("Error updating workout:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  }
</script>

<div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
  <ul class="space-y-4">
    {#each exercises as exercise (exercise.name)}
      <li class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow">
        <div class="flex flex-col space-y-4">
          <h5 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {exercise.name}
          </h5>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out"
              on:click={() =>
                incrementSeries(exercise.name, 100 / exercise.serie.series)}
            >
              &#10003;
            </button>
            <div class="flex flex-col sm:flex-row sm:gap-2 w-full sm:w-auto">
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 dark:text-gray-300"
                  ><i class="bi bi-list-ol"></i></span
                >
                <span
                  class="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full dark:bg-red-700 dark:text-red-100"
                >
                  {exercise.serie.series}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 dark:text-gray-300"
                  ><i class="bi bi-download"></i></span
                >
                <span
                  class="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full dark:bg-gray-600 dark:text-gray-100"
                >
                  {exercise.serie.carico}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-600 dark:text-gray-300"
                  ><i class="bi bi-arrow-repeat"></i></span
                >
                <span
                  class="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full dark:bg-gray-600 dark:text-gray-100"
                >
                  {exercise.serie.reps}
                </span>
              </div>
            </div>
            <button
              type="button"
              class="w-full sm:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out"
              on:click={() => updateExercise(exercise)}
            >
              Aggiorna
            </button>
          </div>
          <div
            class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4"
          >
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              id="progress{exercise.name.replace(/[^a-zA-Z0-9]+/g, '')}"
              style="width: 0%"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

<ModifySerieModal
  bind:show={showModifyModal}
  currentWeight={currentExercise?.serie.carico || ""}
  currentReps={currentExercise?.serie.reps || ""}
  on:save={handleSaveModifiedSerie}
/>
