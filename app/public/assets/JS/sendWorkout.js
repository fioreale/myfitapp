var sendWorkout = document.querySelector('.sendWorkout')
var buttonExercise = document.querySelector('.addExerciseButton')
var buttonScheda = document.querySelector('.addSchedaButton')

var input_group = '<div class="input-group input-text-exercise mb-1"><input type="text" aria-label="esercizio" class="form-control"placeholder="esercizio"><input type="text" aria-label="serie" class="form-control"placeholder="serie"><input type="text" aria-label="reps"class="form-control"placeholder="reps"></div>'

buttonExercise.onclick = function() {
    buttonExercise.insertAdjacentHTML("beforebegin", input_group)
    buttonScheda.removeAttribute('hidden')
}

buttonScheda.onclick = function() {
    buttonExercise.insertAdjacentHTML("beforebegin", '<hr>')
}

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
            })
            .catch(function(error) {
                document.querySelector('#alert-text').textContent = 'Impossibile inserire workout!'
                $('#alert-modal').modal('show')
            })
    }
}

function createSchede(listInputElements) {

    let workout = {
        id: document.querySelector('#input-workout-name').value,
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
                    scheda_name: String.fromCharCode(scheda_name),
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
        esercizio_name: titleEx,
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