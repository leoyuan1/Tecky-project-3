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
                <h4>${song.song_name}</h4>
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

