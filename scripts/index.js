/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    let nowPlaying = document.createElement("div")
}
/**
 * Creates a song DOM element based on a song object.
 */
 const durationFormat = (duration) => {                          //Subfunction to convert from duration in seconds to "mm:ss" string
    let min = ""
    if (Math.floor(duration/60)>=10) min = `${Math.floor(duration/60)}`
    if (Math.floor(duration/60)>=1 && Math.floor(duration/60)<10) min = `0${Math.floor(duration/60)}`
    if (Math.floor(duration/60)==0) min = "00"
    let sec = ""
    if ((duration%60)>=10) sec = `${duration%60}`
    if ((duration%60)>=1 && (duration%60)<10) sec = `0${duration%60}`
    if ((duration%60)==0) sec = `00`
    return min+":"+sec
}

function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const coverArtPic = coverArt
    const children = [title, album, artist,durationFormat(duration)]
    const classes = ["songs"]
    const attrs = { onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs, coverArtPic)
}


/**
 * Creates a playlist DOM element based on a playlist object.
 */
 const identifySong = (id) => {                                  //identify a song in the player and returns all the information about it
    let song = {}
    for (let i of player.songs) if (i.id === id) {song = {id,title,album,artist,duration} = i}
    return song
}
 const playlistDuration = (playlisySongs) => {
    let time=0
    for (let song of playlisySongs){
      time += identifySong(song).duration
    }
    return time
}

function createPlaylistElement({ id, name, songs }) {
    const children = [name, `${songs.length} songs`, durationFormat(playlistDuration(songs))]
    const classes = ["playlists"] 
    const attrs = {id}
    return createElement("div", children, classes, attrs)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
function createElement(tagName, children = [], classes = [], attributes = {}, coverArtPic = "") {
    let newElement = document.createElement(tagName)
    for (let [att, value] of Object.entries(attributes)){
        newElement.setAttribute(`${att}`, `${value}`)
    }
    for (let c of classes){
        newElement.classList.add(`${c}`)
    }
    for (let child of children){
        const newChild = document.createElement(tagName)
        newChild.textContent = `${child}`
        newElement.appendChild(newChild)
    }
    if (coverArtPic.length>0){
        const coverArt = document.createElement("img")
        coverArt.setAttribute("src", `${coverArtPic}`)
        newElement.appendChild(coverArt)
    }
    return newElement
}

// You can write more code below this line
for (let s of player.songs){
    const songsElement = document.getElementById("songs")
    const song = createSongElement(s)
    songsElement.appendChild(song)
}
for (let pl of player.playlists){
    const playlistElement = document.getElementById("playlists")
    const playlist = createPlaylistElement(pl)
    playlistElement.appendChild(playlist)
}
