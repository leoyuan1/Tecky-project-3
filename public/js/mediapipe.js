const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
// const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// Landmark Grid - 3D Coordinations
// const grid = new LandmarkGrid(landmarkContainer);

export function onResults(results) {
    // Landmark Grid - 3D Coordinations
    // if (!results.poseLandmarks) {
    //     grid.updateLandmarks([]);
    //     return;
    // }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // 綠點 - Segmentation Mask
    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //     canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    // source-in = Only the parts of the new image that overlap with the existing image are drawn.
    canvasCtx.globalCompositeOperation = 'source-in';
    // Red
    canvasCtx.fillStyle = '#FF0000';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // The existing image is drawn on top of the new image, but only where the two images overlap
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    // drawn on top of the existing image.
    canvasCtx.globalCompositeOperation = 'source-over';
    // Joint 線
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 2 });
    // Pose landmarks 
    drawLandmarks(canvasCtx, results.poseLandmarks,
        { color: '#FF0000', lineWidth: 1 });
    canvasCtx.restore();

    // Landmark Grid - 3D Coordinations
    // grid.updateLandmarks(results.poseWorldLandmarks);
    console.log("left-wrist: ", results.poseLandmarks[15]);
}

export const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});
pose.setOptions({
    modelComplexity: 1,
    selfieMode: false,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

export const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
    frameRate: 30,
});