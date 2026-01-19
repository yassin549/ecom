import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Drip Shop <noreply@shophub.com>'

export async function sendOrderConfirmation(
  to: string,
  orderData: {
    orderId: string
    customerName: string
    total: number
    items: Array<{ name: string; quantity: number; price: number }>
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Confirmation de commande #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Merci pour votre commande !</h1>
          <p>Bonjour ${orderData.customerName},</p>
          <p>Votre commande #${orderData.orderId} a été confirmée.</p>
          
          <h2>Détails de la commande :</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Produit</th>
                <th style="padding: 10px; text-align: center;">Quantité</th>
                <th style="padding: 10px; text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
          .map(
            (item) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} TND</td>
                </tr>
              `
          )
          .join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; font-weight: bold;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${orderData.total.toFixed(2)} TND</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="margin-top: 20px;">Nous vous tiendrons informé de l'état de votre commande.</p>
          <p>Merci de faire vos achats chez Drip Shop !</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending order confirmation:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return { success: false, error }
  }
}

export async function sendOrderStatusUpdate(
  to: string,
  orderData: {
    orderId: string
    customerName: string
    status: string
    statusLabel: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Mise à jour de commande #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Mise à jour de votre commande</h1>
          <p>Bonjour ${orderData.customerName},</p>
          <p>Le statut de votre commande #${orderData.orderId} a été mis à jour.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px;">
              <strong>Nouveau statut :</strong> 
              <span style="color: #4F46E5;">${orderData.statusLabel}</span>
            </p>
          </div>
          
          ${orderData.status === 'shipped'
          ? '<p>Votre commande est en route ! Vous devriez la recevoir sous peu.</p>'
          : ''
        }
          ${orderData.status === 'delivered'
          ? '<p>Votre commande a été livrée ! Nous espérons que vous êtes satisfait de vos achats.</p>'
          : ''
        }
          
          <p>Merci de faire vos achats chez Drip Shop !</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending status update:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending status update:', error)
    return { success: false, error }
  }
}

export async function sendPasswordReset(
  to: string,
  resetData: {
    name: string
    resetToken: string
    resetUrl: string
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Réinitialisation de mot de passe</h1>
          <p>Bonjour ${resetData.name},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetData.resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending password reset:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending password reset:', error)
    return { success: false, error }
  }
}
