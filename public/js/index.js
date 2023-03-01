async function getRanking() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList
    console.log(songList);
}

getRanking()