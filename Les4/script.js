
let regExp = /\B'|'\B/g;

document.querySelector('.container').addEventListener('click', (event) => {
    if (event.target.classList.contains('replace-btn')) replaceFunc();
})

function replaceFunc() {
    var textToReplace = document.querySelector('.text');
    textToReplace.textContent = textToReplace.textContent.replace(regExp, '"')
}