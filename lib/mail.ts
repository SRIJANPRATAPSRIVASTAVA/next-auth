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
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verification mail',
        // react: EmailTemplate({ firstName: 'John' }),
        html: `<p>Click <a href = "${confirmLink}">here</a> to verify !! :)</p>`
    })
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Password',
        // react: EmailTemplate({ firstName: 'John' }),
        html: `<p>Click <a href = "${resetLink}">here</a> to reset password !! :)</p>`
    })
}

export async function sendTwoFactorEmail(email: string, token: string) {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '2FA Code',
        // react: EmailTemplate({ firstName: 'John' }),
        html: `<p>Your 2FA code : ${token}</p>`
    })
}