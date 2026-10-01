import crypto from 'crypto';

class ExportTicketManager {
  constructor() {
    this.tickets = new Map();

    // Clean up expired tickets every 30 seconds
    setInterval(() => {
      const now = Date.now();
      for (const [ticket, record] of this.tickets.entries()) {
        if (now > record.expiresAt) {
          this.tickets.delete(ticket);
        }
      }
    }, 30 * 1000).unref();
  }

  /**
   * Issues a short-lived (60s), single-use export ticket for an authenticated admin
   */
  createTicket(adminUserId) {
    const ticket = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    this.tickets.set(ticket, {
      adminUserId,
      createdAt: now,
      expiresAt: now + 60 * 1000, // 60 seconds TTL
    });
    return ticket;
  }

  /**
   * Validates and immediately burns (consumes) the single-use ticket.
   * Returns adminUserId if valid, null if invalid/expired/already used.
   */
  consumeTicket(ticket) {
    if (!ticket || typeof ticket !== 'string') return null;

    const record = this.tickets.get(ticket);
    if (!record) return null;

    // Immediately remove (single-use guarantee)
    this.tickets.delete(ticket);

    if (Date.now() > record.expiresAt) {
      return null;
    }

    return record.adminUserId;
  }
}

export const exportTicketManager = new ExportTicketManager();
