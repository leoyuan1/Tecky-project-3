const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer); ``
// Testing
// const videoFile = "/video/benchmark_dance.mp4";

function onResults(results) {
    if (!results.poseLandmarks) {
        grid.updateLandmarks([]);
        return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // 綠點 - Segmentation Mask
    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //     canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillStyle = '#FF0000';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    // Joint 線
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 2 });
    // Pose landmarks 
    drawLandmarks(canvasCtx, results.poseLandmarks,
        { color: '#FF0000', lineWidth: 1 });
    canvasCtx.restore();

    grid.updateLandmarks(results.poseWorldLandmarks);
}

// videoElement.src = videoFile

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});
camera.start();


// Demo
// const demoVideoElement = document.getElementById("demo_video");
// const demoCanvasElement = document.getElementById("demo_output");
// const demoCanvasCtx = demoCanvasElement.getContext("2d");

// // function onResults(results) {
// //     if (!results.poseLandmarks) {
// //         grid.updateLandmarks([]);
// //         return;
// //     }

// //     demoCanvasCtx.save();
// //     demoCanvasCtx.clearRect(0, 0, demoCanvasElement.width, demoCanvasElement.height);
// //     // 綠點
// //     // canvasCtx.drawImage(results.segmentationMask, 0, 0,
// //     //     canvasElement.width, canvasElement.height);

// //     // Only overwrite existing pixels.
// //     demoCanvasCtx.globalCompositeOperation = 'source-in';
// //     demoCanvasCtx.fillStyle = '#FF0000';
// //     demoCanvasCtx.fillRect(0, 0, demoCanvasElement.width, demoCanvasElement.height);

// //     // Only overwrite missing pixels.
// //     demoCanvasCtx.globalCompositeOperation = 'destination-atop';
// //     demoCanvasCtx.drawImage(
// //         results.image, 0, 0, demoCanvasElement.width, demoCanvasElement.height);

// //     demoCanvasCtx.globalCompositeOperation = 'source-over';
// //     // Joint 線
// //     drawConnectors(demoCanvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
// //         { color: '#00FF00', lineWidth: 2 });
// //     // Pose landmarks 
// //     drawLandmarks(demoCanvasCtx, results.poseLandmarks,
// //         { color: '#FF0000', lineWidth: 1 });
// //     demoCanvasCtx.restore();

// //     grid.updateLandmarks(results.poseWorldLandmarks);
// // }

// // Load the video file
// const videoFile = "/video/benchmark_dance.mp4";
// demoVideoElement.src = videoFile;

// // Set up the Pose detection pipeline
// const demoPose = new Pose({
//     locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//     }
// });
// demoPose.setOptions({
//     upperBodyOnly: false,
//     smoothLandmarks: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5,
// });
// demoPose.onResults(onResults);

// // Start the video playback and process each frame
// demoVideoElement.addEventListener("loadedmetadata", () => {
//     pose.initialize();
//     setInterval(() => {
//         pose.send({ image: demoVideoElement });
//     }, 1000 / 30);
// });