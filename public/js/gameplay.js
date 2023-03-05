import { pose, onResults, camera, loadVideo, video, resetBoard, loadHistoryScore } from "/js/mediapipe.js"

async function getUserInfo() {
    let res = await fetch('/session')
    let user = (await res.json()).user
    console.log("user: ", user);
}

// Preloader -- 
$(window).on('load', async function () {
    getUserInfo()
    await pose.onResults(onResults);
    await camera.start();
    $(".loader").fadeOut();
    $("#preloder").delay(400).fadeOut("slow");
    loadVideo()
    loadHistoryScore()
    resetBoard()
});

// End Game Sec

// Pop out End Game Menu
