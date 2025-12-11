(function () {
  const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.8";

  const styleText = `
  * { box-sizing: border-box; }
  .hls-player-root {
    position: relative;
    width: 100%;
    max-width: 100vw;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .hls-player-root video {
    width: 100%;
    height: 100%;
    background: #000;
  }
  .hls-player-controls {
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
  .hls-player-controls-left,
  .hls-player-controls-right {
    display: flex;
    align-items: center;
    gap: 18px;
    pointer-events: auto;
  }
  .hls-player-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .hls-player-btn svg {
    width: 24px;
    height: 24px;
    stroke: #fff;
    stroke-width: 2;
    fill: none;
  }
  .hls-player-live {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    font-size: 13px;
  }
  .hls-player-live-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ff2b2b;
    box-shadow: 0 0 6px #ff2b2b;
  }
  .hls-player-volume {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hls-player-volume-slider {
    width: 130px;
    display: flex;
    align-items: center;
  }
  .hls-player-volume-slider input[type="range"] {
    width: 100%;
    height: 4px;
    background: #444;
    border-radius: 4px;
    accent-color: #fff;
    cursor: pointer;
  }
  `;

  function injectStyles() {
    if (document.getElementById("hls-player-style")) return;
    const style = document.createElement("style");
    style.id = "hls-player-style";
    style.textContent = styleText;
    document.head.appendChild(style);
  }

  function createSvgPlay() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    return svg;
  }

  function createSvgPause() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    `;
    return svg;
  }

  function createSvgVolHigh() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    `;
    return svg;
  }

  function createSvgVolMedium() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    `;
    return svg;
  }

  function createSvgVolMute() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    `;
    return svg;
  }

  function createSvgFsEnter() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    `;
    return svg;
  }

  function createSvgFsExit() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML = `
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
    `;
    return svg;
  }

  function initSinglePlayer(container, src) {
    injectStyles();

    const root = document.createElement("div");
    root.className = "hls-player-root";

    const video = document.createElement("video");
    video.playsInline = true;

    const controls = document.createElement("div");
    controls.className = "hls-player-controls";

    const left = document.createElement("div");
    left.className = "hls-player-controls-left";

    const right = document.createElement("div");
    right.className = "hls-player-controls-right";

    const btnPlay = document.createElement("button");
    btnPlay.className = "hls-player-btn";
    const iconPlay = createSvgPlay();
    const iconPause = createSvgPause();
    iconPause.style.display = "none";
    btnPlay.appendChild(iconPlay);
    btnPlay.appendChild(iconPause);

    const volWrap = document.createElement("div");
    volWrap.className = "hls-player-volume";

    const btnVol = document.createElement("button");
    btnVol.className = "hls-player-btn";

    const iconVolHigh = createSvgVolHigh();
    const iconVolMedium = createSvgVolMedium();
    const iconVolMute = createSvgVolMute();

    iconVolMedium.style.display = "none";
    iconVolMute.style.display = "none";

    btnVol.appendChild(iconVolHigh);
    btnVol.appendChild(iconVolMedium);
    btnVol.appendChild(iconVolMute);

    const volSliderWrap = document.createElement("div");
    volSliderWrap.className = "hls-player-volume-slider";
    const volInput = document.createElement("input");
    volInput.type = "range";
    volInput.min = "0";
    volInput.max = "100";
    volInput.value = "100";
    volSliderWrap.appendChild(volInput);

    volWrap.appendChild(btnVol);
    volWrap.appendChild(volSliderWrap);

    const live = document.createElement("div");
    live.className = "hls-player-live";
    live.innerHTML = `<div class="hls-player-live-dot"></div><span>LIVE</span>`;

    const btnFs = document.createElement("button");
    btnFs.className = "hls-player-btn";
    const iconFsEnter = createSvgFsEnter();
    const iconFsExit = createSvgFsExit();
    iconFsExit.style.display = "none";
    btnFs.appendChild(iconFsEnter);
    btnFs.appendChild(iconFsExit);

    left.appendChild(btnPlay);
    left.appendChild(volWrap);
    left.appendChild(live);

    right.appendChild(btnFs);

    controls.appendChild(left);
    controls.appendChild(right);

    root.appendChild(video);
    root.appendChild(controls);

    container.innerHTML = "";
    container.appendChild(root);

    function updatePlayIcon() {
      if (video.paused) {
        iconPlay.style.display = "block";
        iconPause.style.display = "none";
      } else {
        iconPlay.style.display = "none";
        iconPause.style.display = "block";
      }
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

    function updateFsIcon() {
      const isFs = !!document.fullscreenElement;
      iconFsEnter.style.display = isFs ? "none" : "block";
      iconFsExit.style.display = isFs ? "block" : "none";
    }

    btnPlay.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });

    video.addEventListener("play", updatePlayIcon);
    video.addEventListener("pause", updatePlayIcon);

    volInput.addEventListener("input", () => {
      const v = volInput.value / 100;
      video.volume = v;
      video.muted = v === 0;
      updateVolumeIcon();
    });

    btnVol.addEventListener("click", () => {
      video.muted = !video.muted;
      if (video.muted) volInput.value = "0";
      else if (video.volume === 0) {
        video.volume = 1;
        volInput.value = "100";
      }
      updateVolumeIcon();
    });

    btnFs.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        root.requestFullscreen && root.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", updateFsIcon);

    // Init defaults
    video.volume = 1;
    volInput.value = 100;
    updatePlayIcon();
    updateVolumeIcon();
    updateFsIcon();

    // HLS load
    function startHls() {
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        console.error("HLS not supported in this browser");
      }
    }

    if (window.Hls) startHls();
    else loadHlsLib(startHls);
  }

  function loadHlsLib(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    const existing = document.querySelector('script[data-hls-loaded]');
    if (existing) {
      existing.addEventListener("load", callback);
      return;
    }
    const s = document.createElement("script");
    s.src = HLS_CDN;
    s.async = true;
    s.setAttribute("data-hls-loaded", "1");
    s.onload = callback;
    document.head.appendChild(s);
  }

  function initEmbeds() {
    const container = document.getElementById("hls-player");
    if (!container) return;
    const src = container.getAttribute("data-src") || "https://tv.econet.hr/Arena1/index.m3u8";
    initSinglePlayer(container, src);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmbeds);
  } else {
    initEmbeds();
  }
})();
