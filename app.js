//get elements needed from html
const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const overlay = document.getElementById('overlay');
let letterElements = document.getElementsByClassName('letter');
const qwertyButtons = document.getElementById('qwerty').getElementsByTagName('button');
const restartBtn = document.querySelector('.btn__restart');
const startBtn = document.querySelector('.btn__reset');

//create missed variable initialized to 0
let missed = 0;

//create letter found variable
let letterFound;

//phrases array
const phrases = ['fish out of water', 'the end justifies the means', 'it takes two to tango', 'misery loves company', 'no man is an island'];

//hide overlay when start button is clicked
startBtn.addEventListener('click', (e) => {
    overlay.style.display = 'none';
});


//function to get random phrase and turn it into an array of characters
function getRandomPhraseAsArray(arr) {
    let randomNo = Math.floor(Math.random() * arr.length);
    let randomPhrase = arr[randomNo];
    let randomLetters = randomPhrase.split('');
    return randomLetters;
}

//function to add the phrase to the game display
function addPhraseToDisplay(arr) {
    for (let i = 0; i < arr.length; i++) {
        let listItem = document.createElement('li');
        let listContent = document.createTextNode(arr[i]);
        listItem.append(listContent);
        document.querySelector('#phrase ul').append(listItem);

        if (arr[i] !== ' ') {
            listItem.className = 'letter';
        } else {
            listItem.className = 'space';
        }
    }
}

//get random phrase as array and pass it to the addphrasetodisplay function
const phraseArray = getRandomPhraseAsArray(phrases);
addPhraseToDisplay(phraseArray);

//function to check the letter guessed against array letters
function checkLetter(letter) {
    //create array of correct letters
    let correctLetters = [];

    for (let i = 0; i < letterElements.length; i++) {
        correctLetters.push(letterElements[i].textContent);
    }
    //remove repeated letters from array so that all blanks matching the letter are revealed
    let uniqueCorrectLetters = [...new Set(correctLetters)];
    //check pressed letter against uniquecorrectletters array
    if (uniqueCorrectLetters.includes(letter)) {
        //if letter matches, add class name "show" and return letter
        //if it doesn't, return null
        for (let i = 0; i < letterElements.length; i++) {
            if (letterElements[i].textContent === letter) {
                letterElements[i].className += ' show';
                letterFound = letter;
            }
        }
    } else {
        letterFound = null;
    }
    return letterFound;
}

//add event listener to keyboard
qwerty.addEventListener('click', function (e) {
    //call checkletter function
    let attempt = checkLetter(e.target.textContent);

    //don't count clicks outside of the keyboard box
    if (e.target.classList == 'keyrow') {
        return false;
    } 

    //count misses
    if (attempt == null && missed < 5) {
        let tries = document.querySelector('#scoreboard ol').children;
        let heart = tries[missed].childNodes[0];
        heart.src = 'images/lostHeart.png';
        missed++;
    }

    //disable already selected buttons
    for (let i = 0; i < qwertyButtons.length; i++) {
        if (e.target.textContent == qwertyButtons[i].textContent) {
            qwertyButtons[i].className += 'chosen';
            qwertyButtons[i].disabled = 'true';
        }
    }

    checkWin();

    return missed;
});

//check wins
function checkWin() {
    let shownLetters = document.getElementsByClassName('show');
    //show win or lose overlay
    if (letterElements.length === shownLetters.length) {
        overlay.className = 'win';
        overlay.style.display = 'flex';
        restartBtn.style.display = 'block';
        startBtn.style.display = 'none';
        document.querySelector('.title').textContent = 'You win! :)';
    } else if (missed >= 5) {
        overlay.className = 'lose';
        overlay.style.display = 'flex';
        restartBtn.style.display = 'block';
        startBtn.style.display = 'none';
        document.querySelector('.title').textContent = 'You lose :(';
    }
}

//reset everything
function restartGame() {
    //hide overlay again
    overlay.style.display = 'none';

    //remove all letters & spaces
    document.querySelector('#phrase ul').innerHTML = '';

    //get new phrase and add it to the display
    const phraseArray = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(phraseArray);

    //reset all buttons
    for (let i = 0; i < qwertyButtons.length; i++) {
        qwertyButtons[i].classList.remove('chosen');
        qwertyButtons[i].removeAttribute('disabled');
    }

    //reset missed count
    missed = 0;

    //reset hearts
    document.querySelectorAll('.tries img').forEach(e => e.src = 'images/liveHeart.png');

}

//restart when restart btn is clicked
restartBtn.addEventListener('click', function() {
    restartGame();
})