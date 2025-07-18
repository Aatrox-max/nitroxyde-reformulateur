export default async function handler(request, response) {
    const { text, tone } = request.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    // Prompt amélioré pour forcer une réécriture plus profonde
    const prompt = `Agis comme un expert en communication. Réécris COMPLÈTEMENT le texte suivant pour le rendre plus ${tone}. Tu dois changer la structure des phrases, enrichir le vocabulaire et améliorer l'impact général. Ne te contente pas de corriger les fautes. Voici le texte à transformer : "${text}"`;

    if (!groqApiKey) {
        return response.status(500).json({ error: 'La clé API de Groq n\'est pas configurée.' });
    }
    if (!text) {
        return response.status(400).json({ error: 'Le champ de texte est vide.' });
    }

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-8b-8192',
                temperature: 0.75 // Paramètre pour plus de créativité
            })
        });

        if (!groqResponse.ok) {
            const errorBody = await groqResponse.text();
            console.error('Erreur de l\'API Groq:', errorBody);
            return response.status(groqResponse.status).json({ error: 'L\'API de reformulation a retourné une erreur.' });
        }

        const data = await groqResponse.json();
        const reformulatedText = data.choices[0]?.message?.content;
        
        response.status(200).json({ result: reformulatedText });

    } catch (error) {
        console.error('Erreur interne du serveur:', error);
        response.status(500).json({ error: 'Une erreur interne est survenue.' });
    }
}