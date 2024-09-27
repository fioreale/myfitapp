<script lang="ts">
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
        alert(result.message || "Workout Eliminato!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossibile eliminare il workout!");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert(`Impossibile eliminare il workout :: ${error}`);
    } finally {
      showConfirmToast = false;
    }
  }
</script>

<button class="btn btn-danger btn-sm deleteButton" on:click={handleDelete}>
  <i class="bi bi-trash"></i>
</button>

{#if showConfirmToast}
  <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-body">
      Il workout sta per essere eliminato. Confermi?
      <div class="mt-2 pt-2 border-top">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          on:click={confirmDelete}>Cancella</button
        >
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          on:click={() => (showConfirmToast = false)}
        >
          Chiudi
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
  }
</style>
