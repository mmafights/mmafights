<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8">
<title>ArenaSport1</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #000;
    font-family: system-ui, sans-serif;
  }

  .player {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #000;
  }

  video {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
  }

  .controls-left,
  .controls-right {
    display: flex;
    align-items: center;
    gap: 18px;
    pointer-events: auto;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button svg {
    width: 24px;
    height: 24px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }

  .live {
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 13px;
  }

  .live-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ff2b2b;
    box-shadow: 0 0 6px #ff2b2b;
  }

  .volume-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .volume-slider {
    width: 130px;
    display: flex;
    align-items: center;
  }

  .volume-slider input[type="range"] {
    width: 100%;
    height: 4px;
    background: #444;
    border-radius: 4px;
    accent-color: white;
    cursor: pointer;
  }
</style>
</head>
<body>

<div class="player" id="player">

  <video id="video" playsinline></video>

  <div class="controls">

    <div class="controls-left">

      <button id="btnPlay">
        <svg id="iconPlay" viewBox="0 0 24 24">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>

        <svg id="iconPause" viewBox="0 0 24 24" style="display:none;">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>

      <div class="volume-container">

        <button id="btnVolume">

          <svg id="iconVolHigh" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>

          <svg id="iconVolMedium" viewBox="0 0 24 24" style="display:none;">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>

          <svg id="iconVolMute" viewBox="0 0 24 24" style="display:none;">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>

        </button>

        <div class="volume-slider">
          <input type="range" id="volumeRange" min="0" max="100" value="100">
        </div>

      </div>

      <div class="live">
        <div class="live-dot"></div> LIVE
      </div>
    </div>

    <div class="controls-right">

      <button id="btnFullscreen">

        <svg id="iconFsEnter" viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>

        <svg id="iconFsExit" viewBox="0 0 24 24" style="display:none;">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>

      </button>

    </div>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/hls.js@1.5.8"></script>
<script>

const video = document.getElementById("video");

const btnPlay = document.getElementById("btnPlay");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");

const btnVolume = document.getElementById("btnVolume");
const volumeRange = document.getElementById("volumeRange");

const iconVolHigh = document.getElementById("iconVolHigh");
const iconVolMedium = document.getElementById("iconVolMedium");
const iconVolMute = document.getElementById("iconVolMute");

const btnFullscreen = document.getElementById("btnFullscreen");
const iconFsEnter = document.getElementById("iconFsEnter");
const iconFsExit = document.getElementById("iconFsExit");

function updatePlayIcon() {
  iconPlay.style.display = video.paused ? "block" : "none";
  iconPause.style.display = video.paused ? "none" : "block";
}

function updateVolumeIcon() {
  if (video.muted || video.volume === 0) {
    iconVolMute.style.display = "block";
    iconVolMedium.style.display = "none";
    iconVolHigh.style.display = "none";
  } else if (video.volume < 0.5) {
    iconVolMedium.style.display = "block";
    iconVolHigh.style.display = "none";
    iconVolMute.style.display = "none";
  } else {
    iconVolHigh.style.display = "block";
    iconVolMedium.style.display = "none";
    iconVolMute.style.display = "none";
  }
}

function updateFullscreenIcon() {
  const fs = !!document.fullscreenElement;
  iconFsEnter.style.display = fs ? "none" : "block";
  iconFsExit.style.display = fs ? "block" : "none";
}

function loadStream() {
  const url = "https://tv.econet.hr/Arena1/index.m3u8";

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else video.src = url;
}

btnPlay.onclick = () => video.paused ? video.play() : video.pause();
video.onplay = updatePlayIcon;
video.onpause = updatePlayIcon;

volumeRange.oninput = () => {
  video.volume = volumeRange.value / 100;
  video.muted = video.volume === 0;
  updateVolumeIcon();
};

btnVolume.onclick = () => {
  video.muted = !video.muted;
  if (video.muted) volumeRange.value = 0;
  updateVolumeIcon();
};

btnFullscreen.onclick = () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};

document.onfullscreenchange = updateFullscreenIcon;

document.addEventListener("DOMContentLoaded", () => {
  video.volume = 1;
  volumeRange.value = 100;
  updateVolumeIcon();
  updatePlayIcon();
  updateFullscreenIcon();
  loadStream();
});

</script>
</body>
</html>
