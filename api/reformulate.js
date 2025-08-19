export default async function handler(request, response) {
    const { text, tone } = request.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    const prompt = `Agis comme un expert en communication, rédaction et adaptation de contenu. Réécris intégralement le texte suivant pour qu'il soit plus ${tone}, quel que soit son contexte d’origine (professionnel, personnel, créatif, technique, etc.). Tu dois restructurer les phrases, enrichir le vocabulaire, adapter le style au ton souhaité et optimiser la clarté et l’impact global. Ne te contente pas de corriger : transforme le texte en profondeur, tout en respectant l’intention initiale et le niveau de langage de l’utilisateur. Voici le texte à réécrire : "${text}"`;


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
                temperature: 0.75 
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