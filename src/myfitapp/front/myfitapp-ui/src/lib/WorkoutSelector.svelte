<script lang="ts">
  import { onMount } from "svelte";
  import WorkoutList from "$lib/WorkoutList.svelte";
  import AddWorkoutModal from "$lib/AddWorkoutModal.svelte";
  import DeleteWorkoutButton from "$lib/DeleteWorkoutButton.svelte";

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

  let workouts: string[] = [];
  let selectedWorkout: string | null = null;
  let schedaButtons: string[] = [];
  let selectedScheda: string | null = null;
  let showWorkouts = true;
  let showWorkoutModal = false;
  let hoveredWorkout: string | null = null;
  let isMobile: boolean;

  onMount(async () => {
    await fillListWorkouts();
  });

  async function fillListWorkouts(): Promise<void> {
    try {
      const response = await fetch("/api/workout");
      workouts = (await response.json()) as string[];
    } catch (error) {
      toggleWorkouts();
      console.error("Failed to load workouts:", error);
    }
  }

  async function selectWorkout(workoutId: string) {
    selectedWorkout = workoutId;
    schedaButtons = [];

    try {
      const response = await fetch(`/api/workout/${workoutId}`);
      const workout = (await response.json()) as Workout;
      schedaButtons = workout.schede.map((scheda) => scheda.name);
      selectedScheda = null;
    } catch (error) {
      console.error("Failed to fetch workout details:", error);
    }
  }

  function selectScheda(schedaName: string): void {
    selectedScheda = schedaName;
  }

  function handleSeriesCompleted(event: CustomEvent) {
    console.log("Series completed:", event.detail);
    // You can add logic here to handle series completion
  }

  function toggleWorkouts() {
    showWorkouts = !showWorkouts;
  }

  function openAddWorkoutModal() {
    showWorkoutModal = true;
  }

  async function handleAddWorkout(event: CustomEvent) {
    const newWorkout = event.detail;
    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        await fillListWorkouts();
        alert("New workout added successfully!");
      } else {
        alert("Failed to add new workout");
      }
    } catch (error) {
      console.error("Error submitting workout:", error);
      alert(`Error: ${error}`);
    }
    showWorkoutModal = false;
  }

  async function handleDeleteWorkout(event: CustomEvent) {
    const deletedWorkoutId = event.detail;
    workouts = workouts.filter((workout) => workout !== deletedWorkoutId);
    if (selectedWorkout === deletedWorkoutId) {
      selectedWorkout = null;
      schedaButtons = [];
    }
  }

  function handleResize() {
    isMobile = window.innerWidth < 640;
  }
</script>

<svelte:window on:resize={handleResize} />

<div
  class="workout-selector bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6"
>
  <div class="flex flex-col space-y-4">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      {#if !showWorkouts && selectedWorkout}
        <button
          type="button"
          class="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition duration-300 ease-in-out flex items-center"
          on:click={toggleWorkouts}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Back to Workouts
        </button>
      {/if}

      <button
        type="button"
        class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
        on:click={openAddWorkoutModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Add Workout
      </button>
    </div>

    <div class="flex-grow">
      {#if showWorkouts}
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {#each workouts as workout (workout)}
            <div
              class="relative group"
              on:mouseenter={() => !isMobile && (hoveredWorkout = workout)}
              on:mouseleave={() => !isMobile && (hoveredWorkout = null)}
            >
              <button
                type="button"
                class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-between"
                class:ring-2={selectedWorkout === workout}
                on:click={() => {
                  selectWorkout(workout);
                  showWorkouts = false;
                }}
              >
                <span>{workout}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              {#if hoveredWorkout === workout || isMobile}
                <div class="absolute top-0 right-0 -mt-2 -mr-2">
                  <DeleteWorkoutButton
                    workoutId={workout}
                    on:workoutDeleted={handleDeleteWorkout}
                  />
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else if selectedWorkout && schedaButtons.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each schedaButtons as scheda (scheda)}
            <button
              type="button"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm transition duration-300 ease-in-out"
              class:ring-2={selectedScheda === scheda}
              on:click={() => selectScheda(scheda)}
            >
              {scheda}
            </button>
          {/each}
        </div>
      {:else}
        <p class="text-gray-600 dark:text-gray-400 italic">
          No schedas available for this workout.
        </p>
      {/if}
    </div>
  </div>
</div>

{#if selectedWorkout && selectedScheda}
  <div class="mt-6">
    <WorkoutList
      {selectedWorkout}
      {selectedScheda}
      on:seriesCompleted={handleSeriesCompleted}
    />
  </div>
{/if}

<AddWorkoutModal
  bind:show={showWorkoutModal}
  on:addWorkout={handleAddWorkout}
/>
