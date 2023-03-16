function modifySerie() {
    var elements = document.querySelectorAll(".modalMOD");
    var save_changes = document.querySelector('.saveChanges')
    var weightMOD = null
    var repsMOD = null

    let weight = document.querySelector('.inputWeight')
    let reps = document.querySelector('.inputReps')

    elements.forEach(el => {
        el.onclick = event => {
            weightMOD = event.target.parentElement.firstElementChild.firstElementChild.nextElementSibling.firstElementChild

            repsMOD = weightMOD.nextElementSibling

            weight.placeholder = weightMOD.textContent
            reps.placeholder = repsMOD.textContent
        }
    })

    // -------------------------------------------------------------

    save_changes.onclick = function() {

        if (weight.value.length === 0 && reps.value.length > 0) {
            weightMOD.textContent = weight.placeholder
            repsMOD.textContent = reps.value
        } else if (reps.value.length === 0 && weight.value.length > 0) {
            weightMOD.textContent = weight.value
            repsMOD.textContent = reps.placeholder
        } else if (reps.value.length > 0 && weight.value.length > 0) {
            weightMOD.textContent = weight.value
            repsMOD.textContent = reps.value
        } else {
            weightMOD.textContent = weight.placeholder
            repsMOD.textContent = reps.placeholder
        }

        weight.value = ''
        reps.value = ''

        // close the modal window
        $('#modalModifySerie').modal('hide')
    }
}