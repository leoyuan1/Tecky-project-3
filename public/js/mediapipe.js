
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// Landmark Grid - 3D Coordinations
// const grid = new LandmarkGrid(landmarkContainer);

let camera_data = []
const bodyPartList = ["rightArm", "rightForeArm", "rightHand", "leftArm", "leftForeArm", "leftHand", "rightLeg", "rightCalf", "rightFoot", "leftLeg", "leftCalf", "leftFoot", "rightShoulderToHead", "leftShoulderToHead", "rightHipToHead", "leftHipToHead"]
let benchmark_wb;
async function mediapipeInIt() {
    let mediaId = window.location.search.split('?')[1]
    const res = await fetch(`/get-video-json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId })
    })
    let data = (await res.json()).data[0].pose_data
    console.log(data)
    benchmark_wb = await loadData(data)
    console.log(benchmark_wb)
    // console.log("benchmark_wb: ", benchmark_wb);
}

mediapipeInIt()

export function onResults(results) {
    // Landmark Grid - 3D Coordinations
    // if (!results.poseLandmarks) {
    //     grid.updateLandmarks([]);
    //     return;
    // }
    if (isStarted == true) {

        if (!benchmark_wb) return;
        // console.log(benchmark_wb)
        let inputLmList = []
        if (!results.poseLandmarks) {
            return;
        }
        for (let landmark of results.poseLandmarks) {
            inputLmList.push([landmark.visibility, landmark.x, landmark.y])
        }

        let result = compareData(benchmark_wb, inputLmList)
        console.log(result)
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
        // canvasCtx.globalCompositeOperation = 'source-over';
        // Joint 線
        // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        //     { color: '#00FF00', lineWidth: 2 });
        // Pose landmarks 
        // drawLandmarks(canvasCtx, results.poseLandmarks,
        //     { color: '#FF0000', lineWidth: 1 });
        canvasCtx.restore();

        // Landmark Grid - 3D Coordinations
        // grid.updateLandmarks(results.poseWorldLandmarks);
        benchmarkFrameCounter += 1
        danceAccuracy(result)
        // console.log("left-wrist: ", results.poseLandmarks[15]);
    }
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

async function loadData(filename) {
    const res = await fetch(`../test_video_json/${filename}`)
    let data = await res.json()
    console.log(data)
    return data
}
let benchmarkFrameCounter = 0
function compareData(benchmark, input) {
    console.log(benchmarkFrameCounter)
    let benchmarkLmList = benchmark[benchmarkFrameCounter]
    // console.log("benchmarkLmList: ", benchmarkLmList);
    if (benchmarkLmList.length == 0) {
        return
    }
    let inputLmList = input
    let cosineSimDict = {}
    for (let bodyPart of bodyPartList) {
        cosineSimDict[bodyPart] = findCosineSimilarityByPart(benchmarkLmList, inputLmList, bodyPart)
    }
    // console.log("cosineSimDict: ", cosineSimDict);

    let csRightUpperLimb = 0.45 * cosineSimDict["rightArm"] + 0.45 * cosineSimDict["rightForeArm"] + 0.1 * cosineSimDict["rightHand"]
    // console.log("csRightUpperLimb: ", csRightUpperLimb);

    let csLeftUpperLimb = 0.45 * cosineSimDict["leftArm"] + 0.45 * cosineSimDict["leftForeArm"] + 0.1 * cosineSimDict["leftHand"]
    // console.log("csLeftUpperLimb: ", csLeftUpperLimb);

    let csRightLowerLimb = 0.45 * cosineSimDict["rightLeg"] + 0.45 * cosineSimDict["rightCalf"] + 0.1 * cosineSimDict["rightFoot"]
    // console.log("csRightLowerLimb: ", csRightLowerLimb);

    let csLeftLowerLimb = 0.45 * cosineSimDict["leftLeg"] + 0.45 * cosineSimDict["leftCalf"] + 0.1 * cosineSimDict["leftFoot"]
    // console.log("csLeftLowerLimb: ", csLeftLowerLimb);

    let csCore = 0.25 * cosineSimDict["rightShoulderToHead"] + 0.25 * cosineSimDict["leftShoulderToHead"] + 0.25 * cosineSimDict["rightHipToHead"] + 0.25 * cosineSimDict["leftHipToHead"]
    // console.log("csCore: ", csCore);

    let csWholePosture = 0.2 * csRightUpperLimb + 0.2 * csLeftUpperLimb + 0.2 * csRightLowerLimb + 0.2 * csLeftLowerLimb + 0.2 * csCore
    // console.log("csWholePosture: ", csWholePosture);

    benchmarkFrameCounter += 1
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
    }
    return csValue

}

function cosineSim(benchmarkPoint, benchmarkAnchor, inputPoint, inputAnchor) {
    // console.log("benchmarkPoint" + benchmarkPoint)
    let njBenchmarkPart = nj.array(benchmarkPoint).slice(1).subtract(nj.array(benchmarkAnchor).slice(1))
    // console.log(njBenchmarkPart.tolist())
    // console.log(inputPoint)
    // console.log(inputAnchor)
    let njInputPart = nj.array(inputPoint).slice(1).subtract(nj.array(inputAnchor).slice(1))
    // console.log(njInputPart.tolist())
    let dotProduct = nj.dot(njBenchmarkPart, njInputPart);
    let normBenchMarkPart = Math.sqrt(njBenchmarkPart.get(0) * njBenchmarkPart.get(0) + njBenchmarkPart.get(1) * njBenchmarkPart.get(1))
    let normInputPart = Math.sqrt(njInputPart.get(0) * njInputPart.get(0) + njInputPart.get(1) * njInputPart.get(1))
    if (normBenchMarkPart == 0 || normInputPart == 0) {
        return 0;
    } else {
        return dotProduct.tolist()[0] / (normBenchMarkPart * normInputPart);
    }
}

function danceAccuracy(result) {
    let accuracyCounter = document.querySelector('.accuracy-counter')
    let accuracy = (result * 100).toFixed(2)
    accuracyCounter.innerText = `${accuracy}%`
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
let isStarted = false
function startGame() {
    console.log("Run Game Lor")
    isStarted = true
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
export async function loadVideo() {
    let mediaId = window.location.search.split('?')[1]
    // console.log("videoId: ", mediaId);
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