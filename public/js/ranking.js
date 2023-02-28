const songListElm = document.querySelector('#list-tab')
const songListPage = document.querySelector('#nav-tabContent')

async function getSongListAndRanking() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList

    for (let song of songList) {
        songListElm.innerHTML += `
        <a class="list-group-item list-group-item-action" id="list-${song.song_name}-list" data-toggle="list"
        href="#${song.song_name}" role="tab" aria-controls="${song.song_name}">${song.song_name}
        </a>`
        songListPage.innerHTML += `
        <div class="tab-pane fade" id = "${song.song_name}" role = "tabpanel" aria - labelledby="list-${song.song_name}-list" >
            <div class="col-md-9">
                <h2>${song.song_name}</h2>
                <main>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody id="ranking${song.song_name}">
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </main>
            </div>
        </div>`
        let songName = song.song_name
        let resFirst = await fetch('/get-ranking', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songName })
        })
        let rankings = await resFirst.json()
        let songRankingEln = document.querySelector(`#ranking${song.song_name}`)
        let i = 0
        for (let ranking of rankings.getRankingInfo) {
            i++
            if (i > 10) {
                continue
            }
            songRankingEln.innerHTML += `
        <td>${i}</td>
        <td>${ranking.username}</td>
        <td>${ranking.scores}</td>
        `
            if (i == 10) {
                let res = await fetch('/session')
                let isUser = await res.json()
                console.log(isUser);
                if (isUser.user) {
                    let rankingTopTens = rankings.getRankingInfo.splice(0, 10)
                    console.log(rankingTopTens);
                    let rankingOutOfTopTen = rankings.getRankingInfo
                    let rankingInTopTen = true
                    for (let rankingTopTen of rankingTopTens) {
                        if (isUser.user.username == rankingTopTen.username) {
                            rankingInTopTen = false
                        }
                    }
                    if (rankingInTopTen) {
                        songRankingEln.innerHTML += `<td></td><td><div>.</div><div>.</div><div>.</div></td><td></td>`
                        let countRanking = 11
                        for (let userRanking of rankingOutOfTopTen) {
                            if (userRanking.username == isUser.user.username) {
                                songRankingEln.innerHTML += `<td>${countRanking}</td>
                            <td>${userRanking.username}</td>
                            <td>${userRanking.scores}</td>`
                            }
                            countRanking++
                        }
                    }
                }
            }
        }
    }
}

function init() {
    getSongListAndRanking()
}
init()
