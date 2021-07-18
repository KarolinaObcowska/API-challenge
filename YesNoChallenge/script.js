const API_ENDPOINT = 'https://yesno.wtf/api';
const inputSelector = document.querySelector('#input');
const answerSelector = document.querySelector('#answer');
const btn = document.querySelector('button');


//STATE
let loading = false;

const setLoading = value => {
    loading = value;
}

const disableBtn = disable => {
    if (disable) {
        btn.setAttribute('disabled', 'disabled')
    } else {
        btn.removeAttribute('disabled')
    }
}

// CLEAN AFTER RESPONSE
const cleanAnswer = () => {
    setTimeout(() => {
        inputSelector.value = '';
        answerSelector.innerHTML = '';
        setLoading(false);
        disableBtn(false);
    }, 2000)
}

//SHOW RESPONSE
const showAnswer = answer => {
    setTimeout(() => {
        answerSelector.innerHTML = `<span>${answer}</span>`;
        inputSelector.value = '';
        cleanAnswer();
    }, 1000)
}

//FETCH RESPONSE
const fetchAnswer = () => {
    setLoading(true);
    disableBtn(true);

    fetch(API_ENDPOINT)
        .then(response => response.json())
        .then(data => showAnswer(data.answer))
        .catch((err) => {
            console.log(err)
        })
};

//EVENT LISTENER
btn.addEventListener('click', fetchAnswer);



