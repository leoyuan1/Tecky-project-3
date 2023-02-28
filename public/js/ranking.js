const songListElm = document.querySelector('#list-tab')
const songListPage = document.querySelector('#nav-tabContent')

async function getSongListAndRanking() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList.splice(1)
    let songFirst = songLists.songList[0]
    let songFirstName = songFirst.song_name
    songListElm.innerHTML = `
    <a class="list-group-item list-group-item-action active" id="list-${songFirstName}-list" data-toggle="list"
    href="#${songFirstName}" role="tab" aria-controls="${songFirstName}">${songFirstName}
    </a>`
    songListPage.innerHTML = `
        <div class="tab-pane fade show active" id = "${songFirstName}" role = "tabpanel" aria - labelledby="list-${songFirstName}-list" >
            <div class="col-md-9">
                <h2>${songFirstName}</h2>
                <main>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody id="ranking${songFirstName}">
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </main>
            </div >
        </div>`
    let resFirst = await fetch('/get-first-ranking', {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songFirstName })
    })
    let firstRanking = await resFirst.json()
    let songRankingEln = document.querySelector(`#ranking${songFirstName}`)
    let i = 1
    for (let ranking of firstRanking.getRankingInfo) {
        songRankingEln.innerHTML += `
        <td> ${i}</td>
        <td>${ranking.username}</td>
        <td>${ranking.scores}</td>
    `
        i++
    }

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
            </div >
        </div>`
        let songFirstName = song.song_name
        let resFirst = await fetch('/get-first-ranking', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songFirstName })
        })
        let firstRanking = await resFirst.json()
        for (let ranking of firstRanking.getRankingInfo) {
            let songRankingEln = document.querySelector(`#ranking${song.song_name}`)
            let i = 1
            songRankingEln.innerHTML += `
                <td> ${i}</td>
                <td>${ranking.username}</td>
                <td>${ranking.scores}</td>
            `
            i++
        }
    }
}

function init() {
    getSongListAndRanking()
}
init()

