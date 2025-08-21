import { Resend } from 'resend';

export default async function handler(request, response) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, subject, message } = request.body;

    // Récupérer l'IP
    const ip = 
        request.headers['x-forwarded-for']?.split(',')[0] || // si derrière un proxy
        request.socket?.remoteAddress || 
        'IP non disponible';

    try {
        const { data, error } = await resend.emails.send({
            from: 'Contact Nitroxyde <contact@nitroxyde.fr>',
            to: ['aarondenoeux@gmail.com'],
            subject: `Nouveau message de ${name} : ${subject}`,
            html: `
                <p>Vous avez reçu un nouveau message depuis le formulaire de contact de nitroxyde.fr.</p>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Adresse IP :</strong> ${ip}</p>
                <p><strong>Message :</strong></p>
                <p>${message}</p>
            `,
        });

        if (error) {
            return response.status(400).json(error);
        }

        response.status(200).json({ message: 'Message envoyé avec succès !' });
    } catch (error) {
        response.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi.' });
    }
}
