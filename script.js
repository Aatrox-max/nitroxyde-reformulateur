document.getElementById('submitButton').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value;
    const tone = document.getElementById('toneSelector').value;
    const resultBox = document.getElementById('result');

    resultBox.textContent = 'Réflexion en cours...';

    const response = await fetch('/api/reformulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone })
    });

    const data = await response.json();

    if (data.result) {
        resultBox.textContent = data.result;
    } else {
        resultBox.textContent = 'Erreur. Veuillez réessayer.';
    }
});