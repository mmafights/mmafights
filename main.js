document.addEventListener('DOMContentLoaded', function(){

  document.addEventListener('contextmenu', function(e){
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e){

    if(e.key === 'F12'){
      e.preventDefault();
      return;
    }

    if(e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')){
      e.preventDefault();
      return;
    }
    if(e.ctrlKey && (e.key === 'U' || e.key === 'u')){
      e.preventDefault();
      return;
    }
  });

  const vipBtn = document.getElementById('vipBtn');
  const vipModal = document.getElementById('vipModal');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const vipForm = document.getElementById('vipForm');
  const vipResult = document.getElementById('vipResult');
  const toggleChat = document.getElementById('toggleChat');
  const mainGrid = document.querySelector('.main-grid');

  // HLS Stream URL
  const HLS_STREAM_URL = 'https://15-str07-prod.tv.cetin.cz/tok_eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIzNTI0MDc1NDYzIiwic2lwIjoiIiwicGF0aCI6IiIsInNlc3Npb25fY2RuX2lkIjoiZmUwODM3MThmNjM5ZDM0ZCIsInNlc3Npb25faWQiOiIiLCJjbGllbnRfaWQiOiI4MDA0OTMzIiwiZGV2aWNlX2lkIjoiY2ZlZTE0YmEtZjI5Mi00ZWQxLWFiZjgtMzVkMjlhODZkMjU1IiwibWF4X3Nlc3Npb25zIjoxMDAsInVybCI6Imh0dHBzOi8vMTk0LjIyOC43Ny4zMCIsInNlc3Npb25fdGltZW91dCI6MzYwMCwiYXVkIjoiNzMiLCJzb3VyY2VzIjpbODRdfQ==.xCBOvfLeP6OQUjTQMPojqWNKi9nk3VYbfpQjYFyMjM71UlEylrDDKYTD3yq1_7rFNpa6cp9AavuPh60OV8byDw==/live/2051/hls-aes/index.m3u8';

  let player;
  
  // Initialize HLS.js player
  function initHLSPlayer(){
    const videoEl = document.getElementById('hlsPlayer');
    if(!videoEl) return;
    
    if(Hls.isSupported()){
      const hls = new Hls({
        autoStartLoad: true,
        startPosition: -1,
        debug: false,
        lowLatencyMode: true
      });
      
      hls.loadSource(HLS_STREAM_URL);
      hls.attachMedia(videoEl);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.play();
        onPlayerReady();
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
      
      player = hls;
      player.videoEl = videoEl;
    }else if(videoEl.canPlayType('application/vnd.apple.mpegurl')){
      // Native HLS support (Safari)
      videoEl.src = HLS_STREAM_URL;
      videoEl.addEventListener('loadedmetadata', onPlayerReady);
      player = { videoEl: videoEl };
    }
  }
  
  initHLSPlayer();

  function onPlayerReady(){
    if(player && player.videoEl){
      player.videoEl.volume = 1.0;
    }

    try{ if(typeof showControls === 'function') showControls(); }catch(e){}
  }

  function onPlayerStateChange(){
    const playPauseBtn = document.getElementById('playPauseBtn');
    if(playPauseBtn && player && player.videoEl){
      if(player.videoEl.paused){
        playPauseBtn.textContent = '▶';
      }else{
        playPauseBtn.textContent = '⏸';
      }
    }

    try{
      if(player && player.videoEl && player.videoEl.paused){
        if(typeof showControls === 'function') showControls();
      }else if(player && player.videoEl && !player.videoEl.paused){
        if(typeof showControls === 'function') showControls();
      }
    }catch(e){/* ignore */}
  }


  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if(playPauseBtn){
    playPauseBtn.addEventListener('click', ()=>{
      if(player && player.videoEl){
        if(player.videoEl.paused){
          player.videoEl.play();
          playPauseBtn.textContent = '⏸';
        }else{
          player.videoEl.pause();
          playPauseBtn.textContent = '▶';
        }
        onPlayerStateChange();
      }
    });
  }

  if(volumeSlider){
    volumeSlider.addEventListener('input', (e)=>{
      if(player && player.videoEl){
        player.videoEl.volume = e.target.value / 100;
      }
    });
  }
  const videoContainer = document.querySelector('.video');
  const controlsEl = document.querySelector('.video-controls');
  const topbarEl = document.querySelector('.video-topbar');
  const videoEl = document.getElementById('hlsPlayer');
  let _hideControlsTimeout = null;

  function showControls(){
    if(!videoContainer) return;
    videoContainer.classList.remove('controls-hidden');
    if(_hideControlsTimeout) { clearTimeout(_hideControlsTimeout); _hideControlsTimeout = null; }
    _hideControlsTimeout = setTimeout(()=>{
      try{
        if(videoEl && !videoEl.paused){
          videoContainer.classList.add('controls-hidden');
        }
      }catch(e){ videoContainer.classList.add('controls-hidden'); }
    }, 3000);
  }

  function hideControlsImmediate(){
    if(!videoContainer) return;
    if(_hideControlsTimeout) { clearTimeout(_hideControlsTimeout); _hideControlsTimeout = null; }
    videoContainer.classList.add('controls-hidden');
  }

  if(videoContainer){
    videoContainer.classList.add('controls-hidden');
    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('mouseenter', showControls);
    videoContainer.addEventListener('mouseleave', ()=>{
      try{
        if(videoEl && !videoEl.paused){
          hideControlsImmediate();
        }
      }catch(e){ hideControlsImmediate(); }
    });
    videoContainer.addEventListener('touchstart', showControls, {passive:true});
  }
  
  // Update play/pause icon when video state changes
  if(videoEl){
    videoEl.addEventListener('play', () => {
      if(playPauseBtn) playPauseBtn.textContent = '⏸';
    });
    videoEl.addEventListener('pause', () => {
      if(playPauseBtn) playPauseBtn.textContent = '▶';
      showControls();
    });
  }

  if(fullscreenBtn){
    fullscreenBtn.addEventListener('click', async ()=>{
      try{
        if(!document.fullscreenElement){
          const videoEl = document.querySelector('.video');
          if(videoEl && videoEl.requestFullscreen){
            await videoEl.requestFullscreen();
          }
        }else{
          if(document.exitFullscreen) await document.exitFullscreen();
        }
      }catch(err){
        console.warn('Fullscreen toggle failed', err);
      }
    });

    document.addEventListener('fullscreenchange', ()=>{
      if(document.fullscreenElement){
        fullscreenBtn.textContent = '⤡';
      }else{
        fullscreenBtn.textContent = '⛶';
      }
    });
  }

  // === MODERÁTOŘI ===
  const MODERATORS = new Set([
    'adam.slanar@gmail.com',
  ]);
  let currentUserEmail = null;
  let isCurrentUserMod = false;

  const authBtn = document.getElementById('authBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const msgForm = document.getElementById('msgForm');
  const msgInput = document.getElementById('msgInput');
  const sendMsg = document.getElementById('sendMsg');
  const messagesEl = document.getElementById('messages');
  const chatNotice = document.getElementById('chatNotice');

  vipBtn.addEventListener('click', ()=>{
    vipModal.setAttribute('aria-hidden','false');
  });
  closeModal.addEventListener('click', ()=>{ vipModal.setAttribute('aria-hidden','true'); resetForm(); });
  cancelBtn.addEventListener('click', ()=>{ vipModal.setAttribute('aria-hidden','true'); resetForm(); });

  function resetForm(){
    vipForm.reset();
    vipResult.hidden = true;
    vipResult.textContent = '';
    vipForm.style.display = '';
  }

  vipForm.addEventListener('submit', function(e){
    e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        if(!name || !email){
          vipResult.hidden = false;
          vipResult.textContent = 'Please provide name and email.';
          return;
        }
        vipResult.hidden = false;
        vipResult.textContent = 'Processing payment...';
        setTimeout(()=>{
          vipResult.textContent = `Thank you ${name}! Payment simulated. Confirmation sent to ${email}.`;
          vipForm.style.display = 'none';
        }, 1400);
  });

  if(toggleChat){
    toggleChat.addEventListener('click', function(){
      const collapsed = mainGrid.classList.toggle('chat-collapsed');
      toggleChat.textContent = collapsed ? 'Expand chat' : 'Collapse chat';
    });
  }

  const PAGE_ORIGIN = window.location.origin || window.location.href;
  console.log('Page origin:', PAGE_ORIGIN);

  if(window.FIREBASE_CONFIG){
    try{
      firebase.initializeApp(window.FIREBASE_CONFIG);
      const auth = firebase.auth();
      const db = firebase.firestore();

      auth.onAuthStateChanged(user => {
        if(user){
          currentUserEmail = user.email;
          isCurrentUserMod = MODERATORS.has(currentUserEmail);
          
          authBtn.hidden = true;
          signOutBtn.hidden = false;
          msgForm.style.display = 'flex';
          msgInput.removeAttribute('disabled');
          sendMsg.removeAttribute('disabled');
          if(chatNotice) chatNotice.hidden = true;
        }else{
          currentUserEmail = null;
          isCurrentUserMod = false;
          
          authBtn.hidden = false;
          signOutBtn.hidden = true;
          msgForm.style.display = 'none';
          msgInput.setAttribute('disabled','');
          sendMsg.setAttribute('disabled','');
          if(chatNotice){
            chatNotice.hidden = false;
            chatNotice.textContent = 'Login with your Google account to chat.';
          }
        }
      });

      let signingIn = false;
      const provider = new firebase.auth.GoogleAuthProvider();
      authBtn.addEventListener('click', async ()=>{
        if(signingIn) return;
        signingIn = true;
        authBtn.disabled = true;
        try{
          await auth.signInWithPopup(provider);
        }catch(err){
          console.warn('Sign-in error', err);
          if(err && (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-blocked')){
            try{
              await auth.signInWithRedirect(provider);
              return;
            }catch(redirectErr){
              console.error('Redirect fallback failed', redirectErr);
              alert('Přihlášení selhalo: '+(redirectErr.message || redirectErr));
            }
          }else{
            alert('Přihlášení selhalo: '+(err.message || err));
          }
        }finally{
          signingIn = false;
          authBtn.disabled = false;
        }
      });

      signOutBtn.addEventListener('click', ()=> auth.signOut());

      msgForm.addEventListener('submit', async function(e){
        e.preventDefault();
        const text = msgInput.value.trim();
        const user = auth.currentUser;
        if(!user || !text) return;
        
        const banned = await isUserBanned(user.uid);
        if(banned){
          alert('Nemáš přístup k chatu (jsi banován).');
          return;
        }
        
        msgInput.value = '';
        try{
          await db.collection('messages').add({
            text: text,
            uid: user.uid,
            name: user.displayName || 'Anon',
            email: user.email || '',
            photo: user.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            deleted: false
          });
        }catch(err){
          console.error('send error', err);
        }
      });

      db.collection('messages')
        .orderBy('createdAt', 'asc')
        .limit(100)
        .onSnapshot(snap => {
          messagesEl.innerHTML = '';
          snap.forEach(doc => {
            const d = doc.data();
            const docId = doc.id;

            if(d.deleted) return;

            const el = document.createElement('div');
            el.className = 'msg';
            el.dataset.msgId = docId;
            el.dataset.msgUid = d.uid;
            
            let msgContent = `
              <div class="avatar"><img src="${d.photo || 'https://www.gravatar.com/avatar/?d=mp'}" alt="avatar" onerror="this.src='https://www.gravatar.com/avatar/?d=mp'" /></div>
              <div class="msg-body">
                <div class="meta"><strong>${escapeHtml(d.name||'Anon')}</strong> <span class="muted">${d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString('cs-CZ') : ''}</span></div>
                <div class="bubble">${escapeHtml(d.text)}</div>
            `;

            if(isCurrentUserMod && currentUserEmail){
              msgContent += `
                <div class="mod-actions">
                  <button class="btn-delete-msg" data-msg-id="${docId}">Delete MSG</button>
                  <button class="btn-ban-user" data-user-uid="${d.uid}" data-user-name="${escapeHtml(d.name||'Anon')}">Ban</button>
                </div>
              `;
            }

            msgContent += '</div>';
            el.innerHTML = msgContent;

            if(isCurrentUserMod){
              const deleteBtn = el.querySelector('.btn-delete-msg');
              const banBtn = el.querySelector('.btn-ban-user');

              if(deleteBtn){
                deleteBtn.addEventListener('click', async ()=>{
                  try{
                    await db.collection('messages').doc(docId).update({ deleted: true });
                  }catch(err){
                    console.error('Delete error', err);
                  }
                });
              }

              if(banBtn){
                banBtn.addEventListener('click', async ()=>{
                  const userUid = d.uid;
                  const userName = d.name || 'Anon';
                  const action = prompt(`Akce pro ${userName}:\n\n1 = banovat\n2 = odbanovat\n\nZadej 1 nebo 2:`);
                  
                  if(action === '1'){
                    try{
                      await db.collection('banned_users').doc(userUid).set({
                        uid: userUid,
                        name: userName,
                        bannedAt: firebase.firestore.FieldValue.serverTimestamp()
                      });
                      alert(`${userName} byl banován.`);
                    }catch(err){
                      console.error('Ban error', err);
                    }
                  }else if(action === '2'){
                    try{
                      await db.collection('banned_users').doc(userUid).delete();
                      alert(`${userName} byl odbanován.`);
                    }catch(err){
                      console.error('Unban error', err);
                    }
                  }
                });
              }
            }

            messagesEl.appendChild(el);
          });
          messagesEl.scrollTop = messagesEl.scrollHeight;
        });

      async function isUserBanned(uid){
        try{
          const doc = await db.collection('banned_users').doc(uid).get();
          return doc.exists;
        }catch(err){
          console.error('Ban check error', err);
          return false;
        }
      }

    }catch(err){
      console.error('Firebase init error', err);
      if(chatNotice){
        chatNotice.hidden = false;
        chatNotice.textContent = 'Chyba Firebase: ' + err.message;
      }
    }
  }else{
    if(chatNotice){
      chatNotice.hidden = false;
      chatNotice.textContent = 'Firebase is not configured.';
    }
  }

  function escapeHtml(s){
    if(!s) return '';
    return s.replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","`":"&#96;"})[c]);
  }
});
