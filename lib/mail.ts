import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST() {
//     try {
//         const { data, error } = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: ['delivered@resend.dev'],
//             subject: 'Hello world',
//             react: EmailTemplate({ firstName: 'John' }),
//         });

//         if (error) {
//             return Response.json({ error }, { status: 500 });
//         }

//         return Response.json(data);
//     } catch (error) {
//         return Response.json({ error }, { status: 500 });
//     }
// }

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `http://localhost:3000/auth/new_verifcation?token=${token}`
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verifcation mail',
        // react: EmailTemplate({ firstName: 'John' }),
        html: `<p>Click <a href = "${confirmLink}">here</a> to verify !! :)</p>`
    })
}
