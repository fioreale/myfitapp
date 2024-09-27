<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let show = false;
  export let currentWeight = "";
  export let currentReps = "";

  const dispatch = createEventDispatcher();

  let weight = currentWeight;
  let reps = currentReps;

  $: if (show) {
    weight = currentWeight;
    reps = currentReps;
  }

  function handleSave() {
    dispatch("save", { weight, reps });
    show = false;
  }

  function handleClose() {
    show = false;
  }
</script>

{#if show}
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    transition:fade
  >
    <div
      class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Modify Serie
        </h3>
        <div class="mt-2 px-7 py-3">
          <form class="space-y-4">
            <div>
              <label
                for="weight"
                class="block text-sm font-medium text-gray-700">Weight</label
              >
              <input
                type="text"
                id="weight"
                bind:value={weight}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="reps" class="block text-sm font-medium text-gray-700"
                >Reps</label
              >
              <input
                type="text"
                id="reps"
                bind:value={reps}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </form>
        </div>
        <div class="items-center px-4 py-3">
          <button
            type="button"
            class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            on:click={handleSave}
          >
            Save Changes
          </button>
        </div>
        <div class="items-center px-4 py-3">
          <button
            type="button"
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            on:click={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
