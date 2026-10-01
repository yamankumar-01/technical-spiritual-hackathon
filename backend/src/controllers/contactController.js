import { createContactQuery } from '../db/queries.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitContactQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.',
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 150);
    const cleanSubject = typeof subject === 'string' ? subject.trim().slice(0, 200) : 'General Query';
    const cleanMessage = message.trim().slice(0, 3000);

    const query = await createContactQuery({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || 'General Query',
      message: cleanMessage,
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully submitted! Our team will respond within 24 hours.',
      data: query,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact inquiry.',
    });
  }
};
