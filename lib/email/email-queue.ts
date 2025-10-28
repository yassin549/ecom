type EmailJob = {
  id: string
  to: string
  subject: string
  html: string
  text?: string
  priority: 'high' | 'normal' | 'low'
  retries: number
  maxRetries: number
  createdAt: Date
  scheduledFor?: Date
  status: 'pending' | 'processing' | 'sent' | 'failed'
}

class EmailQueue {
  private queue: EmailJob[] = []
  private processing = false
  private readonly maxRetries = 3
  private readonly retryDelay = 5000 // 5 seconds

  /**
   * Add email to queue
   */
  async add(email: Omit<EmailJob, 'id' | 'retries' | 'maxRetries' | 'createdAt' | 'status'>) {
    const job: EmailJob = {
      ...email,
      id: this.generateId(),
      retries: 0,
      maxRetries: this.maxRetries,
      createdAt: new Date(),
      status: 'pending',
    }

    this.queue.push(job)
    this.sortQueue()

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue()
    }

    return job.id
  }

  /**
   * Process queue
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const job = this.queue[0]

      // Check if scheduled for future
      if (job.scheduledFor && job.scheduledFor > new Date()) {
        break
      }

      // Update status
      job.status = 'processing'

      try {
        await this.sendEmail(job)
        job.status = 'sent'
        this.queue.shift() // Remove from queue
        console.log(`✅ Email sent: ${job.id} to ${job.to}`)
      } catch (error) {
        job.retries++

        if (job.retries >= job.maxRetries) {
          job.status = 'failed'
          this.queue.shift() // Remove from queue
          console.error(`❌ Email failed after ${job.maxRetries} retries: ${job.id}`)
        } else {
          job.status = 'pending'
          // Move to end of queue for retry
          this.queue.shift()
          this.queue.push(job)
          console.warn(`⚠️ Email retry ${job.retries}/${job.maxRetries}: ${job.id}`)
          
          // Wait before next attempt
          await this.delay(this.retryDelay)
        }
      }
    }

    this.processing = false
  }

  /**
   * Send email (mock implementation)
   * Replace with actual email service (Resend, SendGrid, etc.)
   */
  private async sendEmail(job: EmailJob): Promise<void> {
    // Simulate API call
    await this.delay(1000)

    // Mock: 10% chance of failure for testing
    if (Math.random() < 0.1) {
      throw new Error('Email service error')
    }

    // In production, use actual email service:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@example.com',
        to: job.to,
        subject: job.subject,
        html: job.html,
        text: job.text,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }
    */

    console.log(`📧 Mock email sent to ${job.to}: ${job.subject}`)
  }

  /**
   * Sort queue by priority and scheduled time
   */
  private sortQueue() {
    const priorityOrder = { high: 0, normal: 1, low: 2 }

    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Then by scheduled time
      const aTime = a.scheduledFor?.getTime() || a.createdAt.getTime()
      const bTime = b.scheduledFor?.getTime() || b.createdAt.getTime()
      return aTime - bTime
    })
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      total: this.queue.length,
      pending: this.queue.filter((j) => j.status === 'pending').length,
      processing: this.queue.filter((j) => j.status === 'processing').length,
      isProcessing: this.processing,
    }
  }

  /**
   * Clear queue
   */
  clear() {
    this.queue = []
  }

  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Singleton instance
export const emailQueue = new EmailQueue()

/**
 * Email templates
 */
export const emailTemplates = {
  orderConfirmation: (orderNumber: string, total: string) => ({
    subject: `Confirmation de commande #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Merci pour votre commande!</h1>
        <p>Votre commande #${orderNumber} a été confirmée.</p>
        <p><strong>Total:</strong> ${total}</p>
        <p>Nous vous enverrons un email dès que votre commande sera expédiée.</p>
      </div>
    `,
    text: `Merci pour votre commande! Votre commande #${orderNumber} a été confirmée. Total: ${total}`,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Réinitialisation du mot de passe</h1>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Réinitialiser le mot de passe
        </a>
        <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>
      </div>
    `,
    text: `Réinitialisation du mot de passe. Cliquez sur ce lien: ${resetLink}`,
  }),

  welcomeEmail: (name: string) => ({
    subject: 'Bienvenue sur notre boutique!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Bienvenue ${name}!</h1>
        <p>Nous sommes ravis de vous compter parmi nous.</p>
        <p>Découvrez nos produits et profitez de nos offres exclusives.</p>
        <a href="https://example.com/shop" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Commencer vos achats
        </a>
      </div>
    `,
    text: `Bienvenue ${name}! Nous sommes ravis de vous compter parmi nous.`,
  }),

  orderShipped: (orderNumber: string, trackingNumber: string) => ({
    subject: `Votre commande #${orderNumber} a été expédiée`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Votre commande est en route!</h1>
        <p>Votre commande #${orderNumber} a été expédiée.</p>
        <p><strong>Numéro de suivi:</strong> ${trackingNumber}</p>
        <p>Vous devriez recevoir votre colis dans 3-5 jours ouvrables.</p>
      </div>
    `,
    text: `Votre commande #${orderNumber} a été expédiée. Numéro de suivi: ${trackingNumber}`,
  }),
}

/**
 * Helper functions
 */
export async function sendOrderConfirmation(to: string, orderNumber: string, total: string) {
  const template = emailTemplates.orderConfirmation(orderNumber, total)
  return emailQueue.add({
    to,
    ...template,
    priority: 'high',
  })
}

export async function sendPasswordReset(to: string, resetLink: string) {
  const template = emailTemplates.passwordReset(resetLink)
  return emailQueue.add({
    to,
    ...template,
    priority: 'high',
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  const template = emailTemplates.welcomeEmail(name)
  return emailQueue.add({
    to,
    ...template,
    priority: 'normal',
  })
}

export async function sendOrderShipped(to: string, orderNumber: string, trackingNumber: string) {
  const template = emailTemplates.orderShipped(orderNumber, trackingNumber)
  return emailQueue.add({
    to,
    ...template,
    priority: 'normal',
  })
}
