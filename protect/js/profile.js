const userEmailElm = document.querySelector('.user-email')
const userNameElm = document.querySelector('.user-username')
const totalSongElm = document.querySelector('.total-song')
const SongListElm = document.querySelector('.song-list')
async function getUserInfo() {
    let res = await fetch('/session')
    let user = await res.json()
    userEmailElm.innerHTML = `Email: ${user.user.email}`
    userNameElm.innerHTML = `User Name: ${user.user.username}`
}

async function getUserTotalSong() {
    let res = await fetch('/get-user-total-song')
    let userAllSongs = await res.json()
    let userAllSongsList = userAllSongs.userTotalSong
    totalSongElm.innerText = `Total Songs: ${userAllSongsList.length + 1}`
    for (let userSong of userAllSongsList) {
        console.log(userSong);
        SongListElm.innerHTML += `
        <td>${userSong.song_name}</td>
        <td>${userSong.scores}</td>
        <td><a href="/gameplay.html?${userSong.id}" class="play-btn">Play</a></td>
        `
    }
}

function init() {
    getUserInfo()
    getUserTotalSong()
}

init()