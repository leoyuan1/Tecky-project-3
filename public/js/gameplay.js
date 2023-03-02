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

