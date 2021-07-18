// API
const API_ENDPOINT = 'https://yesno.wtf/api';
const inputSelector = document.querySelector('#input');
const answerSelector = document.querySelector('#answer');

const cleanAnswer = () => {
    setTimeout(() => {
        inputSelector.value = '';
        answerSelector.innerHTML = ' ';
    }, 2000)
}

const showAnswer = answer => {
    setTimeout(() => {
        answerSelector.innerHTML = `<span>${answer}</span>`;
        inputSelector.value = '';
        cleanAnswer();
    }, 1000)
}

const fetchAnswer = () => {
    fetch(API_ENDPOINT)
        .then(response => response.json())
        .then(data => showAnswer(data.answer))
        .catch((err) => {
            console.log(err)
        })
};


const btn = document.querySelector('button');
btn.addEventListener('click', fetchAnswer);



