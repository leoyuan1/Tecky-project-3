import { pose, onResults, camera, loadVideo } from "/js/mediapipe.js"

// Preloader -- 
$(window).on('load', async function () {
    await pose.onResults(onResults);
    await camera.start();
    // animate()
    $(".loader").fadeOut();
    $("#preloder").delay(400).fadeOut("slow");
    loadVideo()
    loadHistoryScore()
});

// Detect FPS
var lastFrameTime = performance.now();
var fpsInterval = 1000 / 30; // target FPS = 30

function animate() {
    var now = performance.now();
    var elapsed = now - lastFrameTime;

    if (elapsed > fpsInterval) {
        lastFrameTime = now - (elapsed % fpsInterval);

        // update FPS
        var currentFPS = Math.round(1000 / elapsed);
        console.log("FPS: " + currentFPS)
    }

    window.requestAnimationFrame(animate);
}

// Leaderboard Section
// Get history score from DB
let firstNameElm = document.querySelector('.name1')
let firstScoreElm = document.querySelector('.score1')
let secondNameElm = document.querySelector('.name2')
let secondScoreElm = document.querySelector('.score2')
let thirdNameElm = document.querySelector('.name3')
let thirdScoreElm = document.querySelector('.score3')

let firstScore
let secondScore
let thirdScore

async function loadHistoryScore() {
    let mediaId = window.location.search.split('?')[1]
    let res = await fetch(`/get-history-scores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId })
    })
    let historyScores = (await res.json()).data
    console.log('historyScores: ', historyScores);
    // Arrange Ranking
    let firstName = historyScores[0].username
    firstScore = historyScores[0].scores
    let secondName = historyScores[1].username
    secondScore = historyScores[1].scores
    let thirdName = historyScores[2].username
    thirdScore = historyScores[2].scores
    firstNameElm.innerText = firstName
    firstScoreElm.innerText = firstScore
    secondNameElm.innerText = secondName
    secondScoreElm.innerText = secondScore
    thirdNameElm.innerText = thirdName
    thirdScoreElm.innerText = thirdScore
}

// Score Section
let scoreElm = document.querySelector('.score-counter')
let score = 0

// Random score function for testing
function getRandomInt() {
    return Math.floor(Math.random() * 4);
}

function scoreGenerator() {
    let ranNum = getRandomInt()
    if (ranNum === 0) {
        console.log('Grade: Perfect');
        score += 100
    } else if (ranNum === 1) {
        console.log('ranNum: Great');
        score += 90
    } else if (ranNum === 2) {
        console.log('Grade: Good');
        score += 80
    } else {
        console.log('Grade: Cool');
        score += 50
    }
    updateScore(score)
}

function updateScore(score) {
    updateLeaderboard(score)
    scoreElm.innerText = `${score}`
}

video.onplay = function () {
    setInterval(scoreGenerator, 2000)
}

function updateLeaderboard(score) {
    if (score > firstScore) {
        thirdScoreElm.innerText = secondScore
        secondScoreElm.innerText = firstScore
        firstScoreElm.innerText = score
        firstScoreElm.parentElement.classList.add('glitched')
        secondScoreElm.parentElement.classList.remove('glitched')
        thirdScoreElm.parentElement.classList.remove('glitched')
    } else if (score > secondScore) {
        secondScoreElm.innerText = score
        thirdScoreElm.innerText = secondScore
        secondScoreElm.parentElement.classList.add('glitched')
        thirdScoreElm.parentElement.classList.remove('glitched')
    } else if (score > thirdScore) {
        thirdScoreElm.innerText = score
        thirdScoreElm.parentElement.classList.add('glitched')
    }
}