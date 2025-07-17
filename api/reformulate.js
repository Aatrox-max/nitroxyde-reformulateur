// This is a Vercel Serverless Function
export default async function handler(request, response) {
    // On récupère le texte et le ton envoyés depuis le site
    const { text, tone } = request.body;
    const groqApiKey = process.env.GROQ_API_KEY; // La clé secrète !

    const prompt = `Reformule l'email suivant pour qu'il soit plus ${tone}. Ne renvoie que le texte reformulé, sans aucune introduction ou phrase supplémentaire : "${text}"`;

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama3-8b-8192' // Un modèle rapide et efficace
            })
        });

        const data = await groqResponse.json();
        const reformulatedText = data.choices[0]?.message?.content;
        
        // On renvoie le résultat au site
        response.status(200).json({ result: reformulatedText });

    } catch (error) {
        response.status(500).json({ error: 'Une erreur est survenue.' });
    }
}