// API
const API_ENDPOINT = 'https://yesno.wtf/api';

const fetchAnswer = fetch(API_ENDPOINT)
    .then(response => response.json())
    .then(data => console.log(data.answer))
    .catch((err) => {
        console.log(err)
    })


const btn = document.querySelector('button');
btn.addEventListener('click', fetchAnswer);

//  * 3. Attach fetchAnswer to an event listener
//     * 4. Clear output after 3 seconds
//         * 5. Optional: add loading / error states
//             *
//  * /




