// Assuming all option buttons share a common class 'time-option'
document.querySelectorAll(".time-option").forEach((button) => {
  button.addEventListener("click", () => {
    const secStep = parseInt(button.dataset.time, 10); // Use data attributes e.g., data-time="5"
    setTime(secStep);
  });
});

function setTime(secStep) {
  const restTimeElement = document.querySelector("#rest-time");
  let [minutes, seconds] = restTimeElement.textContent
    .split(":")
    .map((num) => parseInt(num, 10));
  let totalTime = minutes * 60 + seconds + secStep;

  minutes = parseInt(totalTime / 60, 10);
  seconds = totalTime % 60;

  restTimeElement.textContent = `${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}
