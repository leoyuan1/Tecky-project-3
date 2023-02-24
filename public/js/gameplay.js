import { pose, onResults, camera } from "/js/mediapipe.js"

// Preloader -- 
$(window).on('load', async function () {
    await pose.onResults(onResults);
    await camera.start();
    animate()
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