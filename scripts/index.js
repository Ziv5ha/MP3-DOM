/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */

//     ----- Subfunctions -----     //
const identifySong = (id) => {                                  //identify a song in the player and returns all the information about it
    for (let i of player.songs) if (i.id === id) return i
}
const durationFormat = (duration) => {                          //convert from duration in seconds to "mm:ss" string
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
const playlistDuration = (playlisySongs) => {                   //calculates playlist duration
    let time=0
    for (let song of playlisySongs){
      time += identifySong(song).duration
    }
    return time
}
const stopPlaying = (songId) => {
    const song = document.getElementById(`${songId}`)
    song.classList.remove("nowPlaying")
    const previusQueue = document.getElementById("queue")
    previusQueue.parentElement.removeChild(previusQueue)
}
const createQueueFromSong = (songId) => {
    let queue = []
    for (const song of player.songs) {
        queue.push(song.id)
    }
    queue = queue.slice(queue.indexOf(songId))
    return queue
}
const createQueueElement = (queue) => {
    let queueSongs = []
        for (let song of queue) {
            queueSongs.push(identifySong(song).title)
        }
        return createElement("div", queueSongs)
}
const addQueueToDOM = (queue) => {
    if(document.getElementById("queue")){
        const previusQueue = document.getElementById("queue")
        previusQueue.parentElement.removeChild(previusQueue)
    }
    const queueElement = createElement("div",[],["queue"], {id: "queue"})
    const queueList = createQueueElement(queue)
    queueElement.appendChild(queueList)
    document.body.appendChild(queueElement)
}
const playing = (songId) => {
    if (document.getElementsByClassName("nowPlaying").length!==0){
            const previuslyPlayed = document.getElementsByClassName("nowPlaying")
            previuslyPlayed[0].classList.remove("nowPlaying")
        }
        const song = document.getElementById(`${songId}`)
        song.classList.add("nowPlaying")
}
const playNext = (queue) => {
    if (queue.length>1){
        playing(queue[1])
    } else {
        stopPlaying(queue[0])
    }
}


function playSong(songId) {
    let queue = createQueueFromSong(songId)
    addQueueToDOM(createQueueFromSong(songId))
    playing(songId)
    queue.shift()
    setTimeout(()=>{playNext(createQueueFromSong(songId))}, dentifySong(songId).duration*1000)
    if (queue.length>=1){
        setTimeout(()=>{playSong(queue[0])}, dentifySong(songId).duration*1000)
    }
}
    
/**
 * Creates a song DOM element based on a song object.
 */
 

function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const imgEl = createElement("img", [] ,["album-art"], {src: coverArt});
    const children = [title, album, artist,durationFormat(duration), imgEl]
    const classes = ["songs"]
    const attrs = { id ,onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs,)
}


/**
 * Creates a playlist DOM element based on a playlist object.
 */
 

function createPlaylistElement({ id, name, songs }) {
    const children = [name, `${songs.length} songs`, durationFormat(playlistDuration(songs))]
    const classes = ["playlists"] 
    const attrs = {id: `playlist${id}`}
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
function createElement(tagName, children = [], classes = [], attributes = {}) {
    let newElement = document.createElement(tagName)
    for (let child of children){
        if (typeof child === "string"){
            const childtext = child
            child = document.createElement(tagName)
            child.textContent = `${childtext}`
  
        }
        newElement.appendChild(child)
    }
    for (let c of classes){
        newElement.classList.add(`${c}`)
    }
    for (let [att, value] of Object.entries(attributes)){
        newElement.setAttribute(`${att}`, `${value}`)
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
