import { pose, onResults, camera, loadVideo, resetBoard, loadHistoryScore, getUserInfo } from "/js/mediapipe.js"

// Preloader -- 
$(window).on('load', async function () {
    await getUserInfo()
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
