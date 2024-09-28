<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let show = false;
  const dispatch = createEventDispatcher();

  let workoutName = "";
  let exercises: Array<{
    name: string;
    series: string;
    reps: string;
    scheda: string;
  }> = [];

  function addExercise() {
    const lastScheda =
      exercises.length > 0 ? exercises[exercises.length - 1].scheda : "A";
    exercises = [
      ...exercises,
      { name: "", series: "", reps: "", scheda: lastScheda },
    ];
  }

  function addScheda() {
    const lastScheda =
      exercises.length > 0 ? exercises[exercises.length - 1].scheda : "@";
    const nextScheda = String.fromCharCode(lastScheda.charCodeAt(0) + 1);
    exercises = [
      ...exercises,
      { name: "", series: "", reps: "", scheda: nextScheda },
    ];
  }

  function removeExercise(index: number) {
    exercises = exercises.filter((_, i) => i !== index);
  }

  function moveExercise(index: number, direction: "up" | "down") {
    if (direction === "up" && index > 0) {
      [exercises[index - 1], exercises[index]] = [
        exercises[index],
        exercises[index - 1],
      ];
    } else if (direction === "down" && index < exercises.length - 1) {
      [exercises[index], exercises[index + 1]] = [
        exercises[index + 1],
        exercises[index],
      ];
    }
    exercises = [...exercises];
  }

  function sendWorkout() {
    if (!workoutName.trim() || exercises.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    const workout = {
      name: workoutName.trim().replace(/[^a-zA-Z0-9]/g, "_"),
      schede: Object.entries(
        exercises.reduce(
          (acc, exercise) => {
            if (!acc[exercise.scheda]) acc[exercise.scheda] = [];
            acc[exercise.scheda].push({
              name: exercise.name,
              serie: {
                series: parseInt(exercise.series, 10),
                reps: exercise.reps,
                carico: "KG?",
              },
              scheda: exercise.scheda,
            });
            return acc;
          },
          {} as Record<string, any>
        )
      ).map(([name, esercizi]) => ({ name, esercizi })),
    };

    dispatch("addWorkout", workout);
    closeModal();
  }

  function closeModal() {
    show = false;
    workoutName = "";
    exercises = [];
  }
</script>

{#if show}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Add New Workout
        </h3>
        <div class="mt-2 px-7 py-3">
          <form>
            <div class="mb-4">
              <label
                for="workoutName"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Workout Name</label
              >
              <input
                type="text"
                bind:value={workoutName}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="workoutName"
                placeholder="Enter workout name"
              />
            </div>

            {#each exercises as exercise, index}
              <div class="mb-4 p-4 bg-gray-100 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div
                    class="flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-1 py-1"
                  >
                    {exercise.scheda}
                  </div>
                  <input
                    type="text"
                    bind:value={exercise.name}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Exercise"
                  />
                  <input
                    type="text"
                    bind:value={exercise.series}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Series"
                  />
                  <input
                    type="text"
                    bind:value={exercise.reps}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Reps"
                  />
                  <div class="flex justify-end space-x-2">
                    <button
                      type="button"
                      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      on:click={() => removeExercise(index)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      on:click={() => moveExercise(index, "up")}
                    >
                      &#8593;
                    </button>
                    <button
                      type="button"
                      class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      on:click={() => moveExercise(index, "down")}
                    >
                      &#8595;
                    </button>
                  </div>
                </div>
              </div>
            {/each}

            <div class="mt-4 space-x-2">
              <button
                type="button"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                on:click={addExercise}
              >
                Add Exercise
              </button>
              <button
                type="button"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                on:click={addScheda}
              >
                Add Scheda
              </button>
            </div>
          </form>
        </div>
        <div class="items-center px-4 py-3">
          <button
            id="ok-btn"
            class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            on:click={sendWorkout}
          >
            Save Workout
          </button>
        </div>
        <div class="items-center px-4 py-3">
          <button
            id="cancel-btn"
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            on:click={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
