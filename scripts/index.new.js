//          ---------- SUBFUNCTIONS ----------          //
const identifySong = (id=0) => {                                  //identify a song in the player and returns all the information about it
    for (let i of player.songs) if (i.id === id) return i
    return false
}
const playlistDuration = (playlisySongs) => {                   //calculates playlist duration
    let time=0
    for (let song of playlisySongs){
      time += identifySong(song).duration
    }
    return time
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
const createPlayDeleteButtons = () => {
    const playButton = createElement("button", [], ["play-button"], {}, {click: handleSongClickEvent })
    playButton.textContent = "▶"
    const deleteButton = createElement("button", [], ["delete-button"], {}, {click: handleSongClickEvent })
    deleteButton.textContent = "💥"
    const buttonDiv = createElement("div", [playButton, deleteButton], ["button-div"])
    return buttonDiv
}
const mmssToS = (duration) => {                                 //Subfunction to convert from "mm:ss" string to duration in seconds
    return parseInt(duration.slice(0,duration.indexOf(":"))*60)+parseInt(duration.slice(duration.indexOf(":")+1))
  }


/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {Number} songId - the ID of the song to play
 */
function playSong(songId) {
    if (document.getElementsByClassName("nowPlaying").length!==0){
        const previuslyPlayed = document.getElementsByClassName("nowPlaying")
        previuslyPlayed[0].classList.remove("nowPlaying")
    }
    const song = document.getElementById(`${songId}`)
    song.classList.add("nowPlaying")
}

/**
 * Removes a song from the player, and updates the DOM to match.
 *
 * @param {Number} songId - the ID of the song to remove
 */
function removeSong(songId) {
    // Your code here
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ id, title, album, artist, duration, coverArt }) {
    const song = createSongElement({ id, title, album, artist, duration, coverArt })
    const songsElement = document.getElementById("songs")
    player.songs.push({ id, title, album, artist, duration, coverArt })
    songsElement.appendChild(song)
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    const thisButton = event.target.closest("button")
    if (thisButton.classList.contains("play-button")){
        const thisButtonDoes = event.target.closest("div .song")
        console.log(`play ${thisButtonDoes.id}`)
    }
    if (thisButton.classList.contains("delete-button")){
        const thisButtonDoes = event.target.closest("div .song")
        console.log(`delete ${thisButtonDoes.id}`)
    }
        
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    const title = document.querySelector("#inputs > input:nth-child(1)").value
    const album = document.querySelector("#inputs > input:nth-child(2)").value
    const artist = document.querySelector("#inputs > input:nth-child(3)").value
    const durationMMSS = document.querySelector("#inputs > input:nth-child(4)").value
    const duration = mmssToS(durationMMSS)
    const coverArt = document.querySelector("#inputs > input:nth-child(5)").value
    let id = 0
    while (id === 0/* && !(identifySong(id).id)*/){                         //Gerenrates a random ID based on how many songs there are in the player
        id = Math.floor(Math.random()*10**(Math.floor(1+player.songs.length/10)))
    }
    addSong({id, title, album, artist, duration, coverArt})
}


/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const buttonDiv = createPlayDeleteButtons()
    const imgEl = createElement("img", [] ,["album-art"], {src: coverArt});
    const children = [title, album, artist,durationFormat(duration), imgEl, buttonDiv]
    const classes = ["song"]
    const attrs = {id}
    const eventListeners = {}
    return createElement("div", children, classes, attrs, eventListeners)
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const buttonDiv = createPlayDeleteButtons()
    const children = [name, `${songs.length} songs`, durationFormat(playlistDuration(songs)), buttonDiv]
    const classes = ["playlist"] 
    const attrs = {id: `playlist${id}`}
    const eventListeners = {}
    return createElement("div", children, classes, attrs, eventListeners)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"}, {click: (...) => {...}})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 * @param {Object} eventListeners - the event listeners on the element
 */
function createElement(tagName, children = [], classes = [], attributes = {}, eventListeners = {}) {
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
    for (let [event, func] of Object.entries(eventListeners)){
        newElement.addEventListener(`${event}`, func)
    }
    return newElement
}

/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
function generateSongs() {
    for (let s of player.songs){
        const songsElement = document.getElementById("songs")
        const song = createSongElement(s)
        songsElement.appendChild(song)
    }
}

/**
 * Inserts all playlists in the player as DOM elements into the playlists list.
 */
function generatePlaylists() {
    for (let pl of player.playlists){
        const playlistElement = document.getElementById("playlists")
        const playlist = createPlaylistElement(pl)
        playlistElement.appendChild(playlist)
    }
}

// Creating the page structure
generateSongs()
generatePlaylists()

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)
