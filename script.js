let videoPlayer = null;
let adTimerInterval = null;

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleStreamClose() {
    hideModal('stream-modal');
    if (videoPlayer) videoPlayer.pause();
    if (adTimerInterval) clearInterval(adTimerInterval);
}

function showStream(version) {
    const playerElement = document.getElementById('mma-stream');
    const streamInfo = document.getElementById('stream-info');
    const adOverlay = document.getElementById('ad-overlay');

    if (adTimerInterval) clearInterval(adTimerInterval);
    adOverlay.style.display = 'none';
    showModal('stream-modal');
    
    const ppvStreamUrl = 'http://[VÁŠ_SERVER]/fnc26_secured_live.m3u8'; 
    const freeStreamUrl = 'http://[VÁŠ_SERVER]/fnc26_low_res_ad.m3u8'; 

    if (version === 'ppv') {
        streamInfo.innerHTML = '<h2>PREMIUM LIVE STREAM FNC 26 (PPV)</h2>';
        setupPlayer(playerElement, ppvStreamUrl);
    } else {
        streamInfo.innerHTML = '<h2 class="error-text">FREE LIVE STREAM FNC 26</h2>';
        setupPlayer(playerElement, freeStreamUrl);
        startAdTimer(adOverlay);
    }
}

function handleFreeStream() {
    showStream('free');
}

function setupPlayer(element, url) {
    if (videoPlayer) {
        videoPlayer.dispose();
        videoPlayer = null;
    }
    
    videoPlayer = videojs(element.id, { 
        techOrder: ["html5"],
        sources: [{ src: url, type: 'application/x-mpegURL' }] 
    }, function() {
        this.play();
    });
}

function startAdTimer(adOverlay) {
    const adDuration = 30;
    const adInterval = 900000;

    function showAd() {
        if (videoPlayer) videoPlayer.pause();
        
        adOverlay.style.display = 'flex';
        let timer = adDuration;
        const timerElement = document.getElementById('ad-timer');
        timerElement.textContent = timer;

        const countdown = setInterval(() => {
            timer--;
            timerElement.textContent = timer;
            if (timer <= 0) {
                clearInterval(countdown);
                adOverlay.style.display = 'none';
                if (videoPlayer) videoPlayer.play();
            }
        }, 1000);
    }
    
    adTimerInterval = setInterval(showAd, adInterval);
}

async function checkCode() {
    const code = document.getElementById('ppv-code').value.trim().toUpperCase();
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'Ověřuji kód...';

    if (code.length < 10) {
        messageElement.textContent = 'Kód je příliš krátký. Zkontrolujte prosím správnost.';
        return;
    }

    const deviceFingerprint = getDeviceFingerprint(); 

    try {
        const codeDoc = await db.collection('ppv_codes').doc(code).get();

        if (!codeDoc.exists) {
            messageElement.textContent = 'Chyba: Zadaný kód nebyl nalezen.';
            return;
        }

        const data = codeDoc.data();

        if (data.status === 'použitý' && data.device_fingerprint !== deviceFingerprint) {
            messageElement.textContent = 'Tento kód je již používán na jiném zařízení. Sdílení není povoleno.';
            return;
        } 
        
        if (data.status === 'aktivní') {
            await db.collection('ppv_codes').doc(code).update({
                status: 'použitý',
                device_fingerprint: deviceFingerprint
            });

            messageElement.textContent = 'Kód byl poprvé aktivován! Spouštím PPV stream...';
            
        } else if (data.status === 'použitý' && data.device_fingerprint === deviceFingerprint) {
            messageElement.textContent = 'Vítejte zpět! Spouštím PPV stream...';
        }

        setTimeout(() => {
            hideModal('ppv-code-modal');
            showStream('ppv');
        }, 1500);


    } catch (e) {
        console.error("Firebase chyba:", e);
        messageElement.textContent = 'Nastala chyba při komunikaci se serverem. Zkontrolujte konzoli.';
    }
}

function getDeviceFingerprint() {
    const userAgent = navigator.userAgent;
    const screenRes = screen.width + 'x' + screen.height;
    const timeZone = new Date().getTimezoneOffset();
    
    const hashString = userAgent + screenRes + timeZone;
    return btoa(hashString); 
}
