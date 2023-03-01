// const rankingElm = document.querySelector('.news-ticker')
const rankingElm = document.querySelector('.news-ticker-contant')
window.onload = async () => {
    const html = await getRanking()
    rankingElm.innerHTML += html

    $('.news-ticker-contant').marquee({
        //speed in milliseconds of the marquee
        duration: 19000,
        //gap in pixels between the tickers
        gap: 1100,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'right',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true
    });
}
async function getRanking() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList
    let counter = 3
    let html = ''
    for (let song of songList) {
        let songName = song.song_name
        let res = await fetch('/get-ranking', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songName })
        })
        let ranking = await res.json()
        let rankingTopOne = ranking.getRankingInfo[0]
        if (rankingTopOne) {
            if (counter % 3 == 0) {
                console.log(counter);
                html += `
                <div class="nt-item">
                <span class="new">${rankingTopOne.song_name}</span> User: ${rankingTopOne.username}
            </div>`
                counter++
            } else if (counter % 3 == 1) {
                html += `
                <div class="nt-item">
                <span class="strategy">${rankingTopOne.song_name}</span>User: ${rankingTopOne.username}
            </div>`
                counter++
            } else if (counter % 3 == 2) {
                html += `
                <div class="nt-item">
                <span class="racing">${rankingTopOne.song_name}</span>User: ${rankingTopOne.username}
            </div>`
                counter++
            }
        }
    }
    return html
}