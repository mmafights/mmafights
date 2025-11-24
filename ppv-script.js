document.getElementById('ppv-code-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ppvCode = document.getElementById('ppvCode').value.trim();
    const messageElement = document.getElementById('message');

    messageElement.textContent = 'Ověřuji kód, čekejte prosím...';
    messageElement.style.color = '#00bfff';

    // *** KLÍČOVÝ KROK: ZDE BY PROBĚHLA KOMUNIKACE SE SERVERLESS FUNKCÍ ***
    
    // PŘÍKLAD - TOTO BUDE NUTNÉ NAHRADIT SKUTEČNOU FUNKCÍ
    // Předpokládejme, že Serverless Function je dostupná na: 
    // const VERIFY_API_URL = 'https://tvuj-serverless-endpoint.vercel.app/api/verify-code';

    /*
                                                    
    fetch(VERIFY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ppvCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            // KÓD JE PLATNÝ: PŘESMĚROVÁNÍ NA ZABEZPEČENÝ STREAM
            messageElement.textContent = 'Kód ověřen! Přesměrovávám...';
            messageElement.style.color = '#00ff00';
            // data.streamUrl by měla přijít ze Serverless funkce
            window.location.href = data.streamUrl; 
        } else {
            // KÓD JE NEPLATNÝ
            messageElement.textContent = 'Chyba: Kód je neplatný nebo již byl použit.';
            messageElement.style.color = '#ff4500';
        }
    })
    .catch(error => {
        messageElement.textContent = 'Chyba při komunikaci se serverem.';
        messageElement.style.color = '#ff4500';
    });
    */

    // DOČASNÁ SIMULACE (SMAŽTĚ PO IMPLEMENTACI SERVERLESS)
    // Toto je jen ukázka pro otestování vzhledu, po 3 vteřinách simuluje chybu
    setTimeout(() => {
        messageElement.textContent = 'Chyba: Kód je neplatný nebo již byl použit (chyba komunikace s backendem).';
        messageElement.style.color = '#ff4500';
    }, 3000);

});
