<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  export let workoutId: string;

  const dispatch = createEventDispatcher();

  let showConfirmToast = false;

  function handleDelete() {
    showConfirmToast = true;
  }

  async function confirmDelete() {
    try {
      const response = await fetch(`/api/workout/${workoutId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        dispatch("workoutDeleted", workoutId);
        showNotification(result.message || "Workout Eliminato!", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossibile eliminare il workout!");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      showNotification(`Impossibile eliminare il workout :: ${error}`, "error");
    } finally {
      showConfirmToast = false;
    }
  }

  function showNotification(message: string, type: "success" | "error") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } z-50`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
</script>

<button
  class="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
  on:click={handleDelete}
  title="Delete Workout"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clip-rule="evenodd"
    />
  </svg>
</button>

{#if showConfirmToast}
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    transition:fade
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
      transition:fly={{ y: 50, duration: 300 }}
    >
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Conferma eliminazione
      </h3>
      <p class="mb-4 text-gray-700 dark:text-gray-300">
        Sei sicuro di voler eliminare questo workout?
      </p>
      <div
        class="flex flex-col sm:flex-row justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <button
          class="w-full sm:w-auto px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition duration-300 ease-in-out"
          on:click={() => (showConfirmToast = false)}
        >
          Annulla
        </button>
        <button
          class="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-300 ease-in-out"
          on:click={confirmDelete}
        >
          Elimina
        </button>
      </div>
    </div>
  </div>
{/if}
