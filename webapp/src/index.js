import sum from './js/sum';
import './scss/main.scss';

const text = document.createTextNode('Hi Bro!')

const n = document.getElementById("221")


n.appendChild(text)


console.log('Sum', sum(200,6))

