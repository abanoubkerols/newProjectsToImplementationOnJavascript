const form = document.getElementById('form')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')

function showError(input, message) {
    const formControl = input.parentElement
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small')
    small.innerText = message
}


function showSuccess(input) {
    const formControl = input.parentElement
    formControl.className = 'form-control success'
}


function ValidationEmail(input) {
    const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (check.test(input.value.trim())) {
        showSuccess(input)
    } else {
        showError(input, 'Email is not Valid')
    }
}

function checkRequired(inputArr) {
    inputArr.forEach(element => {
        if (element.value.trim() == '') {
            showError(element, `${getFieldName(element)} IS Required`)
        } else {
            showSuccess(element)
        }
    });
}


function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1)
}


function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)}  must be at least ${min} char`)
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)}  must be less than  ${max} char`)
    } else {
        showSuccess(input)
    }
}

function checkPasswordMAtch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Password does Not Match')
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault()
    checkRequired([username, email, password, password2])
    checkLength(username, 3, 15)
    checkLength(password, 6, 25)
    ValidationEmail(email)
    checkPasswordMAtch(password, password2)
})