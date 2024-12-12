// Variable to hold the lyrics
let lyrics = [];

// Fetch the lyrics from the JSON file
fetch("lyrics.json")
  .then((response) => response.json())
  .then((data) => {
    lyrics = data;
    displayLyrics();
    initializeLyrics();
  })
  .catch((error) => console.error("Error fetching lyrics:", error));

// Function to display lyrics in the container
function displayLyrics() {
  const lyricsContainer = document.getElementById("lyrics-container");
  lyricsContainer.innerHTML = lyrics
    .map(
      (lyric) =>
        `<div class="lyric" data-time="${lyric.time}">${lyric.text}</div>`
    )
    .join("");
}

// Function to initialize the lyrics handling
function initializeLyrics() {
  const audio = document.getElementById("audio");
  audio.addEventListener("timeupdate", updateLyrics);
}

// Function to update the lyrics
function updateLyrics() {
  const audio = document.getElementById("audio");
  const currentTime = audio.currentTime;
  const lyricsElements = document.querySelectorAll(".lyric");
  let activeElement;

  lyricsElements.forEach((element, index) => {
    const time = parseFloat(element.getAttribute("data-time"));
    const nextTime =
      index < lyrics.length - 1
        ? parseFloat(lyricsElements[index + 1].getAttribute("data-time"))
        : Infinity;

    if (currentTime >= time && currentTime < nextTime) {
      element.classList.add("active");
      activeElement = element;
    } else {
      element.classList.remove("active");
    }
  });

  if (activeElement) {
    activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
