import { Resend } from 'resend';

export default async function handler(request, response) {
    // Récupérer la clé API depuis les variables d'environnement Vercel
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Récupérer les données du formulaire envoyées depuis le site
    const { name, email, subject, message } = request.body;

    try {
        // Envoi de l'email via Resend
        const { data, error } = await resend.emails.send({
            // L'adresse email qui apparaît comme expéditeur (doit être sur un domaine vérifié)
            from: 'Contact Nitroxyde <contact@nitroxyde.fr>', 
            
            // L'adresse email où TU veux recevoir les messages
            to: ['aarondenoeux@gmail.com'], // <-- !! METS TON ADRESSE ICI !!

            // Le sujet de l'email que tu recevras
            subject: `Nouveau message de ${name} : ${subject}`,
            
            // Le corps de l'email que tu recevras
            html: `
                <p>Vous avez reçu un nouveau message depuis le formulaire de contact de nitroxyde.fr.</p>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong></p>
                <p>${message}</p>
            `,
        });

        if (error) {
            return response.status(400).json(error);
        }

        // Si tout s'est bien passé, renvoyer une réponse positive
        response.status(200).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        response.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi.' });
    }
}