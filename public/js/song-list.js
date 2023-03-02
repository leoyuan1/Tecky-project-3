const songPost = document.querySelector('.song-list')
let offset = 0
async function getSong() {
    let res = await fetch('/get-song', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offset })
    })
    let songLists = await res.json()
    let songList = songLists.songList
    for (let song of songList) {
        songPost.innerHTML +=
            `<div class="col-md-6" id="song-post-${song.id}">
        <div class="review-item">
        <button class="image-button">
            <img src="/img/${song.image}" alt="Button Image">
        </button>
            <div class="review-text">
                <h4 class="song-name-text">${song.song_name}</h4>
            </div>
        </div>
    </div>`
    }
}


window.onscroll = function () {
    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
        offset += 6
        getSong()
    }
}

function init() {
    getSong()
}
init()

let songListElem = document.querySelector('.song-list')

songListElem.addEventListener('click', async (e) => {
    let songId
    // 1. Clicked Photo -  http://localhost:8080/img/baby-shark-2.gif
    if (e.target.src !== undefined) {
        songId = e.target.parentElement.parentElement.parentElement.id.split("song-post-")[1]
        window.location.replace(`/gameplay.html?${songId}`)
        // 2. Clicked Text - e.target.innerText - Baby Shark Difficult
    } else if (e.target.id !== "") {
        songId = e.target.id.split("song-post-")[1]
        window.location.replace(`/gameplay.html?${songId}`)

        // 3. Clicked 邊 - e.target.id - song-post-23
    } else if (e.target.innerText !== "") {
        songId = e.target.innerText.split("song-post-")[1]
        window.location.replace(`/gameplay.html?${songId}`)
    }
})