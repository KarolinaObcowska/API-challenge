//BUTTON

const btn = document.querySelector('.button');
const joke = document.getElementById('joke');
const error = document.getElementById('error-message');
const errorContainer = document.getElementById('error-container');
const loader = document.getElementById('loader');


const API_ENDPOINT = 'https://icanhazdadjoke.com/';
const request = new XMLHttpRequest();

//EMPTY STATE
function setState(state) {
    setLoader(state);
    setButton(state);
}

function setLoader(state) {
    const displayState = state ? 'block' : 'none';
    loader.style.display = displayState;
}

function setButton(state) {
    state ? btn.setAttribute('disabled', 'disabled') : btn.removeAttribute('disabled')
}

//SHOW JOKE
function displayJoke(el) {
    setState(false)
    joke.innerHTML = el;
}

//SHOW ERROR
function displayError(err) {
    setState(false);
    error.innerHTML = err;
    errorContainer.style.display = 'block';
}

//REQUEST
function sendRequest() {
    request.open("GET", API_ENDPOINT, true);
    request.setRequestHeader("Accept", "application/json")
    request.responseType = 'json';

    request.onload = function () {
        console.log(request.response.joke)
        displayJoke(request.response.joke);
    }

    request.onerror = function () {
        displayError('Request failed')
    }

    request.send();
}


btn.addEventListener('click', function () {
    setState(true);
    sendRequest()
}
)