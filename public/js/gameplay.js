import { pose, onResults, camera } from "/js/mediapipe.js"

// Preloader -- 
$(window).on('load', async function () {
    await pose.onResults(onResults);
    await camera.start();
    // animate()
    $(".loader").fadeOut();
    $("#preloder").delay(400).fadeOut("slow");
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
    }

    console.log("FPS: " + currentFPS)
    window.requestAnimationFrame(animate);
}

// Start Menu
const playBtn = document.querySelector(".play-btn")
const startMenu = document.querySelector("#start-menu")
const fadeElm = document.querySelector('.fade-text')
const homeBtn = document.querySelector('.home-btn')

playBtn.addEventListener("click", playerReady)
homeBtn.addEventListener('click', home)

function startGame() {
    console.log("Run Game Lor")
    // Delay the display none
    // Start the video in upcoming seconds
    // run the mediapipe calculation
}

async function playerReady() {
    fadeElm.style.display = "block"
    playBtn.style.display = "none"
    await fadeOut(fadeElm)
    startGame()
}

async function fadeOut(element) {
    // Amend the fade-out effect
    await setTimeout(function () {
        element.style.display = "none";
        startMenu.style.display = 'none'
    }, 3000)
}

function home() {
    console.log("Home");
    // Redirect back to songlist
}


// Pause Function
let isPaused = false;

function pauseGame() {
    isPaused = true;

}