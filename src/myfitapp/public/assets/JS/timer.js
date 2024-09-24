class Timer {
  constructor(displayElement, restTimeElement) {
    this.displayElement = displayElement;
    this.restTimeElement = restTimeElement
    this.reset();
  }

  start(duration) {
    this.endTime = Date.now() + duration * 1000;
    if (this.intervalId) this.stop(); // Ensure any existing timer is stopped before starting a new one
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null; // Clear the interval ID
  }

  reset() {
    this.stop(); // Stop any running interval
    this.endTime = Date.now();
    this.displayElement.textContent = "0:00"; // Reset display
    this.restTimeElement.textContent = "0:00"; // Reset display
  }

  tick() {
    const timeLeft = Math.round((this.endTime - Date.now()) / 1000);
    if (timeLeft <= 0) {
      this.stop();
      this.displayElement.textContent = "TIME!";
      alert("Time!")
    } else {
      this.updateDisplay(timeLeft);
    }
  }

  updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.displayElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}

// Instantiate the Timer with the display element
const display = document.querySelector("#time");
const restTimeElement = document.querySelector("#rest-time");
const timer = new Timer(display, restTimeElement);


// ─── Timer Settings ────────────────────────────────────────────────────── ✣ ─
document.querySelectorAll(".time-option").forEach((button) => {
  button.addEventListener("click", () => {
    const secStep = parseInt(button.dataset.time, 10); // Use data attributes e.g., data-time="5"
    setTime(secStep);
  });
});

function setTime(secStep) {
  let [minutes, seconds] = restTimeElement.textContent
    .split(":")
    .map((num) => parseInt(num, 10));
  let totalTime = minutes * 60 + seconds + secStep;

  minutes = parseInt(totalTime / 60, 10);
  seconds = totalTime % 60;

  restTimeElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""
    }${seconds}`;
}

// Setup start and reset event listeners
document.querySelector("#start").addEventListener("click", () => {
  $("#collapseTimer").collapse("show");
  const [minutes, seconds] = document.querySelector("#rest-time").textContent.split(":").map(Number);
  const durationInSeconds = minutes * 60 + seconds;
  timer.start(durationInSeconds);
});

document.querySelector("#reset").addEventListener("click", () => {
  $("#collapseTimer").collapse("hide");
  timer.reset(); // Timer class handles reset logic
});
