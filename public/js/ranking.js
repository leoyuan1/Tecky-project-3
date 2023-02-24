const songListElm = document.querySelector('.select-ranking')

async function getSongList() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList
    for (let song of songList) {
        songListElm.innerHTML += `
        <a class = "song-list-btn">
        <button class = "select-song-btn">${song.song_name}</button>
        </a>
        `
    }
}

function init() {
    getSongList()
}
init()