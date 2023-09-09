document.querySelector("#option1").addEventListener("click", () => {
  setTime(5);
});
document.querySelector("#option2").addEventListener("click", () => {
  setTime(10);
});
document.querySelector("#option3").addEventListener("click", () => {
  setTime(15);
});
document.querySelector("#option4").addEventListener("click", () => {
  setTime(30);
});
document.querySelector("#option5").addEventListener("click", () => {
  setTime(60);
});

function setTime(sec_step) {
  minutes = parseInt(
    document.querySelector("#rest-time").innerText.split(":")[0]
  );
  seconds = parseInt(
    document.querySelector("#rest-time").innerText.split(":")[1]
  );
  time = seconds + minutes * 60;

  time += sec_step;

  minutes = parseInt(time / 60, 10);
  seconds = parseInt(time % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.querySelector("#rest-time").innerText = minutes + ":" + seconds;
}
