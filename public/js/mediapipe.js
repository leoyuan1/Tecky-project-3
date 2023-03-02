const nj = require('numjs');

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
// const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// Landmark Grid - 3D Coordinations
// const grid = new LandmarkGrid(landmarkContainer);

let camera_data = []

let benchmark_wb;
async function mediapipeInIt() {
    benchmark_wb = await loadData("test1_wb_data.json")
}

mediapipeInIt()

export function onResults(results) {
    // Landmark Grid - 3D Coordinations
    // if (!results.poseLandmarks) {
    //     grid.updateLandmarks([]);
    //     return;
    // }

    let result = compareData(benchmark_wb, results.poseLandmarks)
    // camera_data.push(results.poseLandmarks)
    // console.log(camera_data)
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
    // console.log("results: ", results.poseLandmarks);
}

export const pose = new Pose({
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

export const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
    frameRate: 30,
});

async function loadData(filename) {
    const res = await fetch(`../test_video_json/${filename}`)
    data = await res.json()
    return data
}

const bodyPartList = ["rightArm", "rightForeArm", "rightHand", "leftArm", "leftForeArm", "leftHand", "rightLeg", "rightCalf", "rightFoot", "leftLeg", "leftCalf", "leftFoot", "rightShoulderToHead", "leftShoulderToHead", "rightHipToHead", "leftHipToHead"]

function compareData(benchmark, input) {
    let benchmarkLmList = benchmark[benchmarkFrameCounter]
    let inputLmList = input
    let cosineSimDict = {}
    for (let bodyPart of bodyPartList) {
        cosineSimDict[bodyPart] = findCosineSimilarityByPart(benchmarkLmList, inputLmList, bodyPart)
    }
    let csRightUpperLimb = 0.45 * cosineSimDict["rightArm"] + 0.45 * cosineSimDict["rightForeArm"] + 0.1 * cosineSimDict["rightHand"]
    let csLeftUpperLimb = 0.45 * cosineSimDict["LeftArm"] + 0.45 * cosineSimDict["leftForeArm"] + 0.1 * cosineSimDict["leftHand"]
    let csRightLowerLimb = 0.45 * cosineSimDict["rightLeg"] + 0.45 * cosineSimDict["rightCalf"] + 0.1 * cosineSimDict["rightFoot"]
    let csLeftLowerLimb = 0.45 * cosineSimDict["leftLeg"] + 0.45 * cosineSimDict["leftCalf"] + 0.1 * cosineSimDict["leftFoot"]
    let csCore = 0.25 * cosineSimDict["rightShoulderToHead"] + 0.25 * cosineSimDict["leftShoulderToHead"] + 0.25 * cosineSimDict["rightHipToHead"] + 0.25 * cosineSimDict["leftHipToHead"]
    let csWholePosture = 0.2 * csRightUpperLimb + 0.2 * csLeftUpperLimb + 0.2 * csRightLowerLimb + 0.2 * csLeftLowerLimb + 0.2 * csCore
    return csWholePosture
}

function findCosineSimilarityByPart(benchmarkLmList, inputLmList, bodyPart) {
    let csValue;
    switch (bodyPart) {
        case "rightArm":
            csValue = cosineSim(benchmarkLmList[14], benchmarkLmList[12], inputLmList[14], inputLmList[12])
            break;
        case "rightForeArm":
            csValue = cosineSim(benchmarkLmList[16], benchmarkLmList[14], inputLmList[16], inputLmList[14])
            break;
        case "rightHand":
            csValue = cosineSim(benchmarkLmList[20], benchmarkLmList[16], inputLmList[20], inputLmList[16])
            break;
        case "leftArm":
            csValue = cosineSim(benchmarkLmList[13], benchmarkLmList[11], inputLmList[13], inputLmList[11])
            break;
        case "leftForeArm":
            csValue = cosineSim(benchmarkLmList[15], benchmarkLmList[13], inputLmList[15], inputLmList[13])
            break;
        case "leftHand":
            csValue = cosineSim(benchmarkLmList[19], benchmarkLmList[15], inputLmList[19], inputLmList[15])
            break;
        case "rightLeg":
            csValue = cosineSim(benchmarkLmList[26], benchmarkLmList[24], inputLmList[26], inputLmList[24])
            break;
        case "rightCalf":
            csValue = cosineSim(benchmarkLmList[28], benchmarkLmList[26], inputLmList[28], inputLmList[26])
            break;
        case "rightFoot":
            csValue = cosineSim(benchmarkLmList[32], benchmarkLmList[28], inputLmList[32], inputLmList[28])
            break;
        case "leftLeg":
            csValue = cosineSim(benchmarkLmList[25], benchmarkLmList[23], inputLmList[25], inputLmList[23])
            break;
        case "leftCalf":
            csValue = cosineSim(benchmarkLmList[27], benchmarkLmList[25], inputLmList[27], inputLmList[25])
            break;
        case "leftFoot":
            csValue = cosineSim(benchmarkLmList[31], benchmarkLmList[29], inputLmList[31], inputLmList[29])
            break;
        case "rightShoulderToHead":
            csValue = cosineSim(benchmarkLmList[12], benchmarkLmList[0], inputLmList[12], inputLmList[0])
            break;
        case "leftShoulderToHead":
            csValue = cosineSim(benchmarkLmList[11], benchmarkLmList[0], inputLmList[11], inputLmList[0])
            break;
        case "rightHipToHead":
            csValue = cosineSim(benchmarkLmList[24], benchmarkLmList[0], inputLmList[24], inputLmList[0])
            break;
        case "leftHipToHead":
            csValue = cosineSim(benchmarkLmList[23], benchmarkLmList[0], inputLmList[23], inputLmList[0])
            break;
        default:
            csValue = 0
            return csValue
    }
}

function cosineSim(benchmarkPoint, benchmarkAnchor, inputPoint, inputAnchor) {
    let njBenchmarkPart = nj.array(benchmarkPoint).slice(1).subtract(nj.array(benchmarkAnchor).slice(1))
    let njInputPart = nj.array(inputPoint).slice(1).subtract(nj.array(inputAnchor).slice(1))
    let dotProduct = nj.dot(njBenchmarkPart, njInputPart);
    let normBenchMarkPart = Math.sqrt(njBenchmarkPart.get(0) * njBenchmarkPart.get(0) + njBenchmarkPart.get(1) * njBenchmarkPart.get(1))
    let normInputPart = Math.sqrt(njInputPart.get(0) * njInputPart.get(0) + njInputPart.get(1) * njInputPart.get(1))
    if (normBenchMarkPart == 0 || normInputPart == 0) {
        return 0;
    } else {
        return dotProduct.list()[0] / (normBenchMarkPart * normInputPart);
    }
}

