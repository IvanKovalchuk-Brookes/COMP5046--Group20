import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { CONTACT_INFO } from '@/lib/constants';

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail =
  process.env.CONTACT_TO_EMAIL ?? process.env.RESEND_TO_EMAIL ?? CONTACT_INFO.email;
const contactFromEmail =
  process.env.CONTACT_FROM_EMAIL ??
  process.env.RESEND_FROM_EMAIL ??
  'SubWise Contact <onboarding@resend.dev>';
const fallbackFromEmail = 'SubWise Contact <onboarding@resend.dev>';

type ContactResponse = {
  message: string;
};

function sanitize(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const name = sanitize(req.body?.name);
  const email = sanitize(req.body?.email);
  const message = sanitize(req.body?.message);

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (message.length < 10) {
    return res
      .status(400)
      .json({ message: 'Message must be at least 10 characters.' });
  }

  if (!resendApiKey) {
    return res.status(500).json({
      message:
        'Contact form is not configured yet. Please add RESEND_API_KEY in environment variables.',
    });
  }

  try {
    const resend = new Resend(resendApiKey);

    const payload = {
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `New SubWise contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    let result = await resend.emails.send(payload);

    const providerMessage = result.error?.message ?? '';
    const failedFromDomainNotVerified =
      providerMessage.toLowerCase().includes('domain is not verified') &&
      contactFromEmail !== fallbackFromEmail;

    if (failedFromDomainNotVerified) {
      result = await resend.emails.send({
        ...payload,
        from: fallbackFromEmail,
      });
    }

    if (result.error) {
      const errorMessage =
        result.error.message ?? 'Email provider rejected request.';
      return res.status(502).json({ message: `Email delivery failed: ${errorMessage}` });
    }

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      message: 'Could not send message right now. Please try again later.',
    });
  }
}
