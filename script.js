let videoPlayer = null;
let popupAdInterval = null; 

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleStreamClose() {
    hideModal('stream-modal');
    if (videoPlayer) videoPlayer.pause();
}

// Funkce pro zobrazení Free Stream sekce a spuštění Pop-up reklam
function showFreeStreamSection() {
    const section = document.getElementById('free-stream-section');
    const embed = document.getElementById('free-stream-embed');
    
    // !!! ZDE VLOŽTE URL VAŠEHO FREE STREAM EMBEDU !!!
    const freeEmbedUrl = "https://[ZDE_BUDE_ADRESA_VAŠEHO_FREE_EMBEDU]/stream"; 
    
    // 1. Zobrazíme sekci a vložíme stream
    section.style.display = 'block';
    embed.src = freeEmbedUrl;
    
    // 2. Skrolujeme k sekci
    section.scrollIntoView({ behavior: 'smooth' });
    
    // 3. Spustíme Pop-up reklamy
    startPopupAds();
}

// Funkce pro PPV stream (používá Video.js pro M3U8)
function showStream(version) {
    const playerElement = document.getElementById('mma-stream');
    const streamInfo = document.getElementById('stream-info');

    // Ujistíme se, že PPV vypne Free sekci a Pop-up reklamy
    if (popupAdInterval) {
        clearInterval(popupAdInterval);
        popupAdInterval = null;
    }
    document.getElementById('free-stream-section').style.display = 'none';

    showModal('stream-modal');
    
    const ppvStreamUrl = 'http://[VÁŠ_SERVER]/fnc26_secured_live.m3u8'; 

    if (version === 'ppv') {
        streamInfo.innerHTML = '<h2>PREMIUM LIVE STREAM FNC 26 (PPV)</h2>';
        setupPlayer(playerElement, ppvStreamUrl);
    } 
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

function startPopupAds() {
    if (popupAdInterval) return;

    // !!! ZDE VLOŽTE URL VAŠÍ POP-UP REKLAMY !!!
    const popupUrl = "https://[VASE_REKLAMNI_URL]/popup"; 
    const interval = 600000; // 10 minut

    function showPopup() {
        // Kontrola, zda je uživatel stále na stránce a neotevřel PPV
        if (document.getElementById('free-stream-section').style.display === 'block') {
            window.open(popupUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
        } else {
             clearInterval(popupAdInterval);
             popupAdInterval = null;
        }
    }

    // První reklama se spustí po 30 sekundách, poté každých 10 minut
    setTimeout(showPopup, 30000); 
    popupAdInterval = setInterval(showPopup, interval);
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
