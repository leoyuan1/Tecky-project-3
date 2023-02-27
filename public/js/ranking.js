const songListElm = document.querySelector('#list-tab')
const songListPage = document.querySelector('#nav-tabContent')

async function getSongList() {
    let res = await fetch('/get-song-list')
    let songLists = await res.json()
    let songList = songLists.songList
    let songFirstActive = songList[0]
    songListElm.innerHTML += `
    <a class="list-group-item list-group-item-action active" id="list-${songFirstActive.song_name}-list" data-toggle="list"
	href="#${songFirstActive.song_name}" role="tab" aria-controls="${songFirstActive.song_name}">${songFirstActive.song_name}
    </a>
    `
    songListPage.innerHTML += `		
    <div class="tab-pane fade show active" id="${songFirstActive.song_name}" role="tabpanel" aria-labelledby="list-${songFirstActive.song_name}-list">
    	<div class="col-md-9">
						<h2>Song Name</h2>
						<main>
							<table>
								<thead>
									<tr>
										<th>Rank</th>
										<th>Name</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1</td>
										<td>John Doe</td>
										<td>100</td>
									</tr>
									<tr>
										<td>2</td>
										<td>Jane Smith</td>
										<td>95</td>
									</tr>
									<tr>
										<td>3</td>
										<td>Bob Johnson</td>
										<td>90</td>
									</tr>
									<tr>
										<td>4</td>
										<td>Sara Lee</td>
										<td>85</td>
									</tr>
									<tr>
										<td>5</td>
										<td>Tom Jones</td>
										<td>80</td>
									</tr>
								</tbody>
							</table>
						</main>
					</div>
				</div>`

    for (let song of songList) {
        songListElm.innerHTML += `
        <a class="list-group-item list-group-item-action" id="list-${song.song_name}-list" data-toggle="list"
        href="#${song.song_name}" role="tab" aria-controls="${song.song_name}">${song.song_name}
        </a>
        `
        songListPage.innerHTML += `		
        <div class="tab-pane fade" id="${song.song_name}" role="tabpanel" aria-labelledby="list-${song.song_name}-list">
            <div class="col-md-9">
                            <h2>Song Name</h2>
                            <main>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Name</th>
                                            <th>Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>John Doe</td>
                                            <td>100</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Jane Smith</td>
                                            <td>95</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Bob Johnson</td>
                                            <td>90</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Sara Lee</td>
                                            <td>85</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Tom Jones</td>
                                            <td>80</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </main>
                        </div>
                    </div>`
    }
}

function init() {
    getSongList()
}
init()

