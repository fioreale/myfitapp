var sendWorkout = document.querySelector('.sendWorkout')
var buttonExercise = document.querySelector('.addExerciseButton')
var buttonScheda = document.querySelector('.addSchedaButton')

var input_group = '<div class="input-group input-text-exercise mb-1"><input type="text" aria-label="esercizio" class="form-control" placeholder="esercizio"><input type="text" aria-label="serie" class="form-control" placeholder="serie"><input type="text" aria-label="reps" class="form-control" placeholder="reps"><button type="button" class="btn btn-danger delete-row">Delete</button><button type="button" class="btn btn-secondary move-up">&#8593;</button><button type="button" class="btn btn-secondary move-down">&#8595;</button></div>'


buttonExercise.onclick = function() {
    buttonExercise.insertAdjacentHTML("beforebegin", input_group)
    buttonScheda.removeAttribute('hidden')
}

buttonScheda.onclick = function() {
    buttonExercise.insertAdjacentHTML("beforebegin", '<hr>')
    buttonExercise.insertAdjacentHTML("beforebegin", '<div class="scheda"></div>')
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-row')) {
        event.target.parentNode.remove();
    }
})

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('move-up')) {
        let row = event.target.parentNode;
        let prevRow = row.previousElementSibling;
        if (prevRow && prevRow.classList.contains('input-text-exercise')) {
            row.parentNode.insertBefore(row, prevRow);
        }

    } else if (event.target.classList.contains('move-down')) {
        let row = event.target.parentNode;
        let nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains('input-text-exercise')) {
            row.parentNode.insertBefore(nextRow, row);
        }
    }
})


sendWorkout.onclick = function() {
    let listInputWorkouts = document.querySelectorAll('.input-text-exercise')
    let workoutJSON = createSchede(listInputWorkouts);
    if (listInputWorkouts.length === 0 || document.querySelector('#input-workout-name').value === '' || workoutJSON === null) {
        document.querySelector('#alert-text').textContent = 'Valori Mancanti!'
        $('#alert-modal').modal('show')
    } else {
        document.querySelector('#input-workout-name').value = ''

        fetch('../workout', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: workoutJSON
            })
            .then(function(response) {
                $('#modalAddWorkout').modal('hide');
                // from fillPage.js
                fillListWorkouts()
                buttonExercise.previousElementSibling.innerHTML = ''

                // Remove all input groups
                let inputGroups = document.querySelectorAll('.input-text-exercise');
                for (let i = 0; i < inputGroups.length; i++) {
                    inputGroups[i].remove();
                }
            })
            .catch(function(error) {
                document.querySelector('#alert-text').textContent = 'Impossibile inserire workout!'
                $('#alert-modal').modal('show')
            })
    }
}


function createSchede(listInputElements) {

    let workout = {
        name: document.querySelector('#input-workout-name').value,
        schede: []
    }

    let scheda_name = 'A'.charCodeAt(0)
    let listExercises = []

    try {
        listInputElements.forEach(element => {
            let ex_JSON = createEx_JSON(element)

            if (element.nextElementSibling.nodeName !== 'DIV') {
                listExercises.push(ex_JSON)

                let scheda = {
                    name: String.fromCharCode(scheda_name),
                    esercizi: listExercises
                }

                workout.schede.push(scheda)

                scheda_name += 1
                listExercises = []
            } else {
                listExercises.push(ex_JSON)
            }

        });

        return JSON.stringify(workout)
    } catch (error) {
        return null
    }

}

function createEx_JSON(exerciseRAW) {

    let titleEx = exerciseRAW.childNodes[0].value
    let howMany = exerciseRAW.childNodes[1].value
    let reps = exerciseRAW.childNodes[2].value

    if (titleEx === '' || howMany === '' || reps === '') {
        throw 'missing values!'
    }

    let esercizio = {
        name: titleEx,
        serie: []
    }

    let serie = {
        reps: reps,
        carico: "0"
    }

    for (let i = 0; i < howMany; i++) {
        esercizio.serie.push(serie)
    }

    return esercizio
}