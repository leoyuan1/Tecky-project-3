import { pose, onResults, camera } from "/js/mediapipe.js"

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

// Start Menu
const playBtn = document.querySelector(".play-btn");
const startMenu = document.querySelector("#start-menu");
const fadeElm = document.querySelector('.fade-text');
const homeBtn = document.querySelector('.home-btn');
const video = document.querySelector('#demo_video')

playBtn.addEventListener("click", playerReady)
homeBtn.addEventListener('click', home)

function playVideo() {
    console.log("video.currentime - play: ", video.currentTime);
    console.log("video.duration: ", video.duration);
    video.play()
}

function pauseVideo() {
    console.log("video.currentime - pause: ", video.currentTime);
    video.pause()
}

function startGame() {
    console.log("Run Game Lor")
    playVideo()
    // Delay the display none
    // Start the video in upcoming seconds
    // run the mediapipe calculation
}

async function playerReady() {
    fadeElm.style.display = "block"
    playBtn.style.display = "none"
    await fadeOut(fadeElm)
}

async function fadeOut(element) {
    // Amend the fade-out effect
    await setTimeout(function () {
        element.style.display = "none";
        startMenu.style.display = 'none'
        startGame()
    }, 3000)
}

function home() {
    console.log("Home");
    // Redirect back to songlist
    window.location.href = "http://localhost:8080/song-list.html"
}


// Pause Function
let pauseMenu = document.querySelector('#pause-menu-container')
let restartBtn = document.querySelector('#restart-btn')
let exitBtn = document.querySelector('#exit-btn')

restartBtn.addEventListener('click', restartGame)
exitBtn.addEventListener('click', exitGame)

// set keypress to call pauseMenu
$(document).keyup(function (e) {
    if (e.key === "Escape" || e.keyCode == "32") {
        togglePauseMenu()
        // Pause Game(?)
    }
});

function exitGame() {
    console.log("Exit");
    // Redirect back to songlist page
    window.location.href = "http://localhost:8080/song-list.html"
}

function restartGame() {
    console.log("Restart la.");
    pauseMenu.style.display = 'none'
    video.currentTime = '0'
    startMenu.style.display = 'flex'
    playerReady()
    // reset score & calculation
}

// call pause menu
function togglePauseMenu() {
    console.log("Paused");
    if (pauseMenu.style.display === "none") {
        pauseMenu.style.display = "flex";
        pauseVideo()
    } else {
        pauseMenu.style.display = "none";
        playVideo()
    }
}

// load video
async function loadVideo() {
    let mediaId = window.location.search.split('?')[1]
    console.log("videoId: ", mediaId);
    let res = await fetch(`/get-video`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId })
    })
    let videoPath = (await res.json()).data[0].video
    video.innerHTML = `
    <source src = "${videoPath}" type = "video/mp4">
    `
}

// Leaderboard Section
// Get history score from DB
let rankingElems = document.querySelectorAll('.cyberpunk-ranking')

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
    // Arrange Ranking
    let firstName = historyScores[0].username
    let firstScore = historyScores[0].scores
    let secondName = historyScores[1].username
    let secondScore = historyScores[1].scores
    let thirdName = historyScores[2].username
    let thirdScore = historyScores[2].scores
    rankingElems[0].innerText = `No.1 ${firstName} ${firstScore}`
    rankingElems[1].innerText = `No.2 ${secondName} ${secondScore}`
    rankingElems[2].innerText = `No.3 ${thirdName} ${thirdScore}`
}
