
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// Landmark Grid - 3D Coordinations
// const grid = new LandmarkGrid(landmarkContainer);

const bodyPartList = ["rightArm", "rightForeArm", "rightHand", "leftArm", "leftForeArm", "leftHand", "rightLeg", "rightCalf", "rightFoot", "leftLeg", "leftCalf", "leftFoot", "rightShoulderToHead", "leftShoulderToHead", "rightHipToHead", "leftHipToHead"]
let benchmark_wb;
let startTime;
let endTime;
async function mediapipeInIt() {
    let mediaId = window.location.search.split('?')[1]
    const res = await fetch(`/get-video-json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId })
    })
    let data = (await res.json()).data[0]
    let poseData = data.pose_data
    startTime = data.start_time
    endTime = data.end_time

    benchmark_wb = await loadData(poseData)
    // console.log(benchmark_wb)
    // console.log("benchmark_wb: ", benchmark_wb);
}

mediapipeInIt()

let interval = 0
export function onResults(results) {
    // Landmark Grid - 3D Coordinations
    // if (!results.poseLandmarks) {
    //     grid.updateLandmarks([]);
    //     return;
    // }
    if (isStarted == true && video.currentTime > startTime && video.currentTime < endTime) {

        if (!benchmark_wb) return;
        // console.log(benchmark_wb)
        let inputLmList = []
        if (!results.poseLandmarks) {
            return;
        }
        for (let landmark of results.poseLandmarks) {
            inputLmList.push([landmark.visibility, landmark.x, landmark.y])
        }
        let frame = Math.round(interval / video.duration * benchmark_wb.length)
        let benchmarkLmList = benchmark_wb[frame]
        let result;
        if (Math.round(video.currentTime) == interval) {
            result = compareData(benchmarkLmList, inputLmList)
            console.log(result)
            console.log(interval)
            if (result) {
                danceAccuracy(result)
                gradeCounter(result)
            }
        }


        interval = Math.round(video.currentTime) + 1
    }
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
    // canvasCtx.restore();

    // Landmark Grid - 3D Coordinations
    // grid.updateLandmarks(results.poseWorldLandmarks);
    // console.log("left-wrist: ", results.poseLandmarks[15]);
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
    const res = await fetch(`/test_video_json/${filename}`)
    let data = await res.json()
    console.log(data)
    return data
}
function compareData(benchmark, input) {
    // console.log("benchmarkLmList: ", benchmarkLmList);
    let benchmarkLmList = benchmark
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
    bodyAccuracy(csRightUpperLimb, csLeftUpperLimb, csRightLowerLimb, csLeftLowerLimb, csCore)
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
    if (nj.array(benchmarkPoint).get(0) < 0.7 || nj.array(benchmarkAnchor).get(0) < 0.7) {
        return 1
    } else if (nj.array(inputPoint).get(0) < 0.7 || nj.array(inputAnchor).get(0) < 0.7) {
        return 0
    }
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
        let calculation = dotProduct.tolist()[0] / (normBenchMarkPart * normInputPart)
        calculation = (calculation + 1) / 2
        return calculation;
    }
}

// Accuracy
let historyAccuracy = 0;
let calTime = 1;
function danceAccuracy(result) {
    let accuracyCounter = document.querySelector('.accuracy-counter')
    let accuracy = Math.round(result * 100) / 100
    // console.log("accuracy: " + accuracy)
    historyAccuracy += accuracy
    // console.log("historyAccuracy: " + historyAccuracy * 100)
    // console.log("calTime: " + calTime)
    accuracyCounter.innerText = `${Math.round(historyAccuracy * 100 * 100 / calTime) / 100}%`
    calTime += 1
}

// Body part accuracy
function bodyAccuracy(RUL, LUL, RLL, LLL, Core) {
    let csRightUpperLimbNumber = document.querySelector('.csRightUpperLimb-number')
    let csLeftUpperLimbNumber = document.querySelector('.csLeftUpperLimb-number')
    let csRightLowerLimbNumber = document.querySelector('.csRightLowerLimb-number')
    let csLeftLowerLimbNumber = document.querySelector('.csLeftLowerLimb-number')
    let csCoreNumber = document.querySelector('.csCore-number')
    let csWholePostureNumber = document.querySelector('.csWholePosture-number')
    let csRightUpperLimbAccuracy = (RUL * 100).toFixed(2)
    let csLeftUpperLimbAccuracy = (LUL * 100).toFixed(2)
    let csRightLowerLimbAccuracy = (RLL * 100).toFixed(2)
    let csLeftLowerLimbAccuracy = (LLL * 100).toFixed(2)
    let csCoreAccuracy = (Core * 100).toFixed(2)
    let csWholePostureAccuracy = (Core * 100).toFixed(2)
    csRightUpperLimbNumber.innerText = `${csRightUpperLimbAccuracy}%`
    csLeftUpperLimbNumber.innerText = `${csLeftUpperLimbAccuracy}%`
    csRightLowerLimbNumber.innerText = `${csRightLowerLimbAccuracy}%`
    csLeftLowerLimbNumber.innerText = `${csLeftLowerLimbAccuracy}%`
    csCoreNumber.innerText = `${csCoreAccuracy}%`
    csWholePostureNumber.innerText = `${csWholePostureAccuracy}%`
}

// Start Menu
const playBtn = document.querySelector(".play-btn");
const startMenu = document.querySelector("#start-menu");
const endMenu = document.querySelector("#end-menu-container");
const fadeElm = document.querySelector('.fade-text');
export const video = document.querySelector('#demo_video')
const homeBtn = document.querySelector('.home-btn');
const endScore = document.querySelector('.end-score');
const endAccuracy = document.querySelector('.end-accuracy');
const endPerfectCount = document.querySelector('#perfect-count');
const endGreatCount = document.querySelector('#great-count');
const endCoolCount = document.querySelector('#cool-count');
const endBadCount = document.querySelector('#bad-count');

playBtn.addEventListener("click", playerReady)

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
    isStarted = false
    // playVideo()
    // Delay the display none
    // Start the video in upcoming seconds
    // run the mediapipe calculation
}

async function playerReady() {
    fadeElm.style.display = "block"
    playBtn.style.display = "none"
    // endMenu.style.display = 'none'
    // test
    endMenu.style.display = 'flex'
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
    resetBoard()
    playerReady()
    // reset score & calculation
}

export let scoreElm = document.querySelector('.score-counter')
export let accuracyElm = document.querySelector('.accuracy-counter')
export function resetBoard() {
    effectElm.innerText = ""
    scoreElm.innerText = "0"
    accuracyElm.innerText = "00%"
    perfectCounter = 0
    greatCounter = 0
    coolCounter = 0
    badCounter = 0
    score = 0
}

// call pause menu
export function togglePauseMenu() {
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

// grade counter
let perfectCounter = 0
let greatCounter = 0
let coolCounter = 0
let badCounter = 0
let score = 0
let firstScore
let secondScore
let thirdScore
let firstName
let secondName
let thirdName
let effectElm = document.querySelector('.grade-effect')

function gradeCounter(accuracy) {
    if (accuracy >= 0.90) {
        perfectCounter += 1
        score += 100
        effectElm.innerText = "Perfect"
        effectElm.style.color = "var(--dark-blue)"
    } else if (accuracy >= 0.66 && accuracy <= 0.89) {
        console.log("Great");
        greatCounter += 1
        score += 80
        effectElm.innerText = "Great"
        effectElm.style.color = "var(--light-blue)"
    } else if (accuracy >= 0.40 && accuracy <= 0.65) {
        coolCounter += 1
        score += 60
        effectElm.innerText = "Cool"
        effectElm.style.color = "var(--light-tone)"
    } else if (accuracy < 0.40) {
        badCounter += 1
        score += 40
        effectElm.innerText = "Bad"
        effectElm.style.color = "var(--first-red)"
    }
    updateScore(score)
}

function updateScore(score) {
    if (isLoggedIn) {
        updateLeaderboard(score)
    }
    scoreElm.innerText = `${score}`
}

// Leaderboard Section
// Get history score from DB
let firstNameElm = document.querySelector('.name1')
let firstScoreElm = document.querySelector('.score1')
let secondNameElm = document.querySelector('.name2')
let secondScoreElm = document.querySelector('.score2')
let thirdNameElm = document.querySelector('.name3')
let thirdScoreElm = document.querySelector('.score3')

function updateLeaderboard(score) {
    let userName = user.username
    if (score > firstScore) {
        if (userName != firstName) {
            thirdScoreElm.innerText = secondScore
            secondScoreElm.innerText = firstScore
            firstScoreElm.innerText = score
            thirdNameElm.innerText = secondName
            secondNameElm.innerText = firstName
            firstNameElm.innerText = userName
            firstScoreElm.parentElement.classList.add('glitched')
            secondScoreElm.parentElement.classList.remove('glitched')
            thirdScoreElm.parentElement.classList.remove('glitched')
        } else if (userName = firstName) {
            firstScoreElm.innerText = score
            firstScoreElm.parentElement.classList.add('glitched')
            secondScoreElm.parentElement.classList.remove('glitched')
            thirdScoreElm.parentElement.classList.remove('glitched')
        }
    } else if (score > secondScore) {
        if (userName != firstName && userName != secondName) {
            secondScoreElm.innerText = score
            thirdScoreElm.innerText = secondScore
            secondNameElm.innerText = userName
            thirdNameElm.innerText = secondName
            secondScoreElm.parentElement.classList.add('glitched')
            thirdScoreElm.parentElement.classList.remove('glitched')
        } else if (userName == secondName) {
            secondScoreElm.innerText = score
            secondScoreElm.parentElement.classList.add('glitched')
            thirdScoreElm.parentElement.classList.remove('glitched')
        }
    } else if (score > thirdScore) {
        if (userName != firstName && userName != secondName && userName != thirdName) {
            thirdScoreElm.innerText = score
            thirdNameElm.innerText = userName
            thirdScoreElm.parentElement.classList.add('glitched')
        } else if (userName == thirdName) {
            thirdScoreElm.innerText = score
            thirdScoreElm.parentElement.classList.add('glitched')
        }
    }
}

export async function loadHistoryScore() {
    let mediaId = window.location.search.split('?')[1]
    let res = await fetch(`/get-history-scores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId })
    })
    let historyScores = (await res.json()).data
    console.log('historyScores: ', historyScores);
    // Arrange Ranking
    firstName = historyScores[0].username
    firstScore = historyScores[0].scores
    secondName = historyScores[1].username
    secondScore = historyScores[1].scores
    thirdName = historyScores[2].username
    thirdScore = historyScores[2].scores
    firstNameElm.innerText = firstName
    firstScoreElm.innerText = firstScore
    secondNameElm.innerText = secondName
    secondScoreElm.innerText = secondScore
    thirdNameElm.innerText = thirdName
    thirdScoreElm.innerText = thirdScore
}

export let user
export let isLoggedIn = false

export async function getUserInfo() {
    let res = await fetch('/session')
    let result = await res.json()
    if (result.message != 'no session data') {
        user = result.user
        isLoggedIn = true
        console.log("user: ", user);
        console.log("isLoggedIn: ", isLoggedIn);
    }
}

// update Score if Breaks new record
async function getUserScore() {
    let userId = user.id
    let mediaId = window.location.search.split('?')[1]
    let res = await fetch('/get-user-score', {
        method: "post",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ userId, mediaId })
    })
    let result = (await res.json())
    console.log("result: ", result);
    if (result.message == 'success') {

        let personalScore = result.scores[0].scores
        console.log("personalScore: ", personalScore);
        if (score > personalScore) {
            console.log("Run updateUserScore");
            updateUserScore(score)
        }
    } else if (result.message == 'no result') {
        console.log("Run createUserScore");
        createUserScore(score)
    }
}
async function updateUserScore(newScore) {
    let mediaId = window.location.search.split('?')[1]
    let updatedScore = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: user.id,
            mediaId,
            newScore
        })
    }

    let res = await fetch('/update-user-record', updatedScore)
    if (res.ok) {
        let data = await res.json()
        console.log(data);
    }
}

async function createUserScore(score) {
    let userId = user.id
    let mediaId = window.location.search.split('?')[1]
    console.log("userId: ", userId);
    console.log("mediaId: ", mediaId);
    let res = await fetch(`/create-user-score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, mediaId, score })
    })
    let result = await res.json()
    console.log("createUserScore - result: ", result);
}

video.onended = function () {
    console.log("onended Run");
    if (isLoggedIn) {
        getUserScore()
    }
    endgame()
    // getUserScore()

}

function endgame() {
    endMenu.style.display = 'flex'
    endScore.innerHTML = scoreElm.innerHTML
    endAccuracy.innerHTML = accuracyElm.innerHTML
    endPerfectCount.innerHTML = perfectCounter
    endGreatCount.innerHTML = greatCounter
    endCoolCount.innerHTML = coolCounter
    endBadCount.innerHTML = badCounter
}