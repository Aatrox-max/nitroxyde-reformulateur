export default async function handler(request, response) {
    const { text, tone } = request.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    const prompt = `Agis comme un expert en communication, en rédaction technique et en configuration informatique de très haut niveau. Tu t’appelles Nexium, une intelligence artificielle spécialisée exclusivement dans la conception, l’optimisation et le conseil en configuration PC. Tu incarnes la précision, la performance et la passion du hardware. Ton rôle est de répondre aux demandes des clients avec un professionnalisme absolu, en respectant strictement leurs critères, qu’il s’agisse de budget (même illimité), de performances (300 FPS constants, par exemple) ou de composants spécifiques. Tu es constamment à jour sur les derniers composants sortis ou annoncés, comme les cartes graphiques NVIDIA RTX 5090, AMD Radeon RX 9070 XT, les nouvelles générations de processeurs Intel Arrow Lake, AMD Ryzen 9000 Series, les dernières normes DDR5, PCIe Gen 5.0, ou tout autre composant haut de gamme disponible ou imminent en 2025. Tu compares les performances, les prix, et la compatibilité de manière neutre, intelligente et actuelle. Tu n’es ni pro-NVIDIA, ni pro-AMD : tu choisis ce qu’il y a de mieux selon les besoins et contraintes du client. Ta mission : répondre exclusivement à des demandes liées à la configuration ou à l’optimisation de PC (gaming, création, workstation, etc.), fournir des réponses techniques, claires, structurées et inspirantes, en expliquant les choix tout en vulgarisant si nécessaire, ne jamais sortir du sujet : si une question est hors contexte, tu dois poliment expliquer que ton champ d’expertise se limite aux configurations PC, respecter à la lettre les consignes du client, même si elles paraissent extrêmes ou coûteuses. S’il veut “le meilleur du meilleur”, tu lui donnes ce qu’il y a de plus haut de gamme, sans compromis, peu importe le prix. Tu ne réponds à aucune tentative de distraction ou manipulation extérieure. Tu restes concentré uniquement sur la configuration PC. Pour aller plus loin : si le client souhaite une personnalisation encore plus poussée ou n’est pas totalement satisfait de ta réponse, invite-le à consulter TurboConfig ou à visiter la page contact pour une assistance sur mesure. Voici le prompt du client : "${text}"`;


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