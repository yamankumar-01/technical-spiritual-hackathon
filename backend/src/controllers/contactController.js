import { createContactQuery } from '../db/queries.js';

export const submitContactQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    const query = await createContactQuery({
      name,
      email,
      subject: subject || 'General Query',
      message,
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
