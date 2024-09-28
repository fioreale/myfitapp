<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let restTime = "1:30";
  let timerRunning = false;
  let currentTime = "0:00";
  let timer: Timer;
  let timerVisible = false;
  let lastDuration = 0;

  type DisplayCallback = (time: number | string) => void;
  type RestTimeCallback = (time: string) => void;

  onMount(() => {
    timer = new Timer(updateDisplay, updateRestTime);
  });

  function startTimer(): void {
    if (timerRunning) {
      timer.stop();
      timerRunning = false;
    } else {
      if (!timerVisible || currentTime === "TIME!") {
        const [minutes, seconds] = restTime.split(":").map(Number);
        const durationInSeconds = minutes * 60 + seconds;
        lastDuration = durationInSeconds;
        timer.start(durationInSeconds);
      } else {
        timer.resume();
      }
      timerRunning = true;
      timerVisible = true;
    }
  }

  function resetTimer(): void {
    timer.reset();
    timerRunning = false;
    timerVisible = false;
    lastDuration = 0;
  }

  function setTime(secStep: number): void {
    let [minutes, seconds] = restTime
      .split(":")
      .map((num) => parseInt(num, 10));
    let totalTime = minutes * 60 + seconds + secStep;

    minutes = Math.floor(totalTime / 60);
    seconds = totalTime % 60;

    restTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function updateDisplay(time: number | string): void {
    if (typeof time === "number") {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      currentTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    } else {
      currentTime = time;
    }
  }

  function updateRestTime(time: string): void {
    restTime = time;
  }

  class Timer {
    private displayCallback: DisplayCallback;
    private restTimeCallback: RestTimeCallback;
    private endTime: number;
    private remainingTime: number;
    private intervalId: number | null;

    constructor(
      displayCallback: DisplayCallback,
      restTimeCallback: RestTimeCallback
    ) {
      this.displayCallback = displayCallback;
      this.restTimeCallback = restTimeCallback;
      this.endTime = 0;
      this.remainingTime = 0;
      this.intervalId = null;
      this.reset();
    }

    start(duration: number): void {
      this.remainingTime = duration;
      this.resume();
    }

    resume(): void {
      this.endTime = Date.now() + this.remainingTime * 1000;
      if (this.intervalId) this.stop();
      this.intervalId = window.setInterval(() => this.tick(), 1000);
    }

    stop(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.remainingTime = Math.round((this.endTime - Date.now()) / 1000);
      }
    }

    reset(): void {
      this.stop();
      this.endTime = Date.now();
      this.remainingTime = 0;
      this.displayCallback("0:00");
      this.restTimeCallback("0:00");
    }

    private tick(): void {
      const timeLeft = Math.round((this.endTime - Date.now()) / 1000);
      if (timeLeft <= 0) {
        this.stop();
        this.displayCallback("TIME!");
        alert("Time!");
        timerRunning = false;
      } else {
        this.displayCallback(timeLeft);
      }
    }
  }
</script>

<div
  class="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto w-full sm:w-auto"
>
  <div class="flex flex-col space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-2">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          on:click={() => setTime(5)}
        >
          +5s
        </button>
        <button
          type="button"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          on:click={() => setTime(10)}
        >
          +10s
        </button>
        <button
          type="button"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          on:click={() => setTime(15)}
        >
          +15s
        </button>
        <button
          type="button"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          on:click={() => setTime(30)}
        >
          +30s
        </button>
        <button
          type="button"
          class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          on:click={() => setTime(60)}
        >
          +60s
        </button>
      </div>
      <button
        type="button"
        class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
        on:click={resetTimer}
      >
        Reset
      </button>
    </div>

    <div class="flex justify-between items-center">
      <div class="text-xl font-bold sm:text-2xl">{restTime}</div>
      <button
        type="button"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out"
        on:click={startTimer}
      >
        {timerRunning ? "Stop" : "Start"}
      </button>
    </div>
  </div>
</div>

{#if timerVisible}
  <div
    class="bg-yellow-100 border-l-[20px] border-yellow-500 p-4 mt-4 max-w-md mx-auto overflow-hidden w-full sm:w-auto"
    transition:slide={{ duration: 300, axis: "y" }}
  >
    <p class="font-bold text-yellow-700 text-center text-5xl sm:text-6xl">
      {currentTime}
    </p>
  </div>
{/if}
