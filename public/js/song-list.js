const songPost = document.querySelector('.song-list')

async function getSong() {
    // songPost.innerHTML = ""
    let res = await fetch('/get-song')
    let songLists = await res.json()
    let songList = songLists.songList
    for (let song of songList) {
        songPost.innerHTML +=
            `<div class="col-md-6">
        <div class="review-item">
            <div class="review-cover set-bg" data-setbg="/img/${song.image}" style="background-image: url(img/${song.image});">
            </div>
            <div class="review-text">
                <h4>${song.song_name}</h4>
            </div>
        </div>
    </div>`
    }
}

function init() {
    getSong()
}

init()