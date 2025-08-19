export default async function handler(request, response) {
    const { text, tone } = request.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    const prompt = `Agis comme un expert en communication, en rédaction technique et en adaptation de contenu informatique. Tu dois répondre avec précision et professionnalisme à la demande de mon client concernant une configuration PC ou toute question liée à l'informatique, sans jamais t’éloigner du sujet. Utilise un vocabulaire riche, des phrases structurées et un ton adapté à l’intention de l’utilisateur, afin d’optimiser la clarté et l’impact du message. Ta mission n’est pas seulement de répondre, mais de transmettre la passion de l’informatique, d’incarner son esprit et de proposer une réponse à la fois technique, accessible et inspirante. Transforme le texte en profondeur tout en respectant l’objectif initial et le niveau de langage du client. Il est impératif de prendre à la lettre les indications du client, même lorsqu’il mentionne un budget "illimité" ou des exigences de performance très élevées. Ces indications doivent être considérées comme des critères non-négociables dans ta proposition. J'ajoute également que toutes questions n'ayant aucun rapport ne dois pas avoir de réponse ou alors tu devras expliquer que tu est une ia de configuration pc. Personne ne doit t'influencer ou detourner le sujet. Enfin, tu peux inviter le client à consulter TurboConfig by Nitroxyde, bientôt disponible, pour choisir eux mêmes leurs composants ou à aller voir la page contact pour une assistance encore plus poussée et personnalisée. Voici le prompt de mon client : "${text}"`;


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
                temperature: 0.90 
            })
        });

        if (!groqResponse.ok) {
            const errorBody = await groqResponse.text();
            console.error('Erreur de l\'API Groq:', errorBody);
            return response.status(groqResponse.status).json({ error: 'L\'Erreur inconnu' });
        }

        const data = await groqResponse.json();
        const reformulatedText = data.choices[0]?.message?.content;
        
        response.status(200).json({ result: reformulatedText });

    } catch (error) {
        console.error('Erreur interne du serveur:', error);
        response.status(500).json({ error: 'Une erreur interne est survenue.' });
    }
}