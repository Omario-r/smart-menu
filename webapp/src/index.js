import sum from './sum'

const text = document.createTextNode('Hello dO!')

const n = document.getElementById("221")


n.appendChild(text)


console.log('Sum', sum(200,6))
console.log('elem', n)
