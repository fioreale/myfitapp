let option1 = document.querySelector("#option1")
let option2 = document.querySelector('#option2')
let option3 = document.querySelector('#option3')
let option4 = document.querySelector('#option4')
let option5 = document.querySelector('#option5')

let rest = document.querySelector('#rest-time')

option1.onclick = function() {
    minutes = parseInt(rest.innerText.split(':')[0])
    seconds = parseInt(rest.innerText.split(':')[1])
    time = seconds + minutes * 60

    time += 5

    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    rest.innerText = minutes + ':' + seconds
}

option2.onclick = function() {
    minutes = parseInt(rest.innerText.split(':')[0])
    seconds = parseInt(rest.innerText.split(':')[1])
    time = seconds + minutes * 60

    time += 10

    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    rest.innerText = minutes + ':' + seconds
}

option3.onclick = function() {
    minutes = parseInt(rest.innerText.split(':')[0])
    seconds = parseInt(rest.innerText.split(':')[1])
    time = seconds + minutes * 60

    time += 15

    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    rest.innerText = minutes + ':' + seconds
}

option4.onclick = function() {
    minutes = parseInt(rest.innerText.split(':')[0])
    seconds = parseInt(rest.innerText.split(':')[1])
    time = seconds + minutes * 60

    time += 30

    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    rest.innerText = minutes + ':' + seconds
}

option5.onclick = function() {
    minutes = parseInt(rest.innerText.split(':')[0])
    seconds = parseInt(rest.innerText.split(':')[1])
    time = seconds + minutes * 60

    time += 60

    minutes = parseInt(time / 60, 10)
    seconds = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    rest.innerText = minutes + ':' + seconds
}