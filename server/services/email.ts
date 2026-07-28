import { Resend } from 'resend';
import type { InsertContactMessage } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailService {
  sendContactNotification(
    contactData: InsertContactMessage,
    options?: { test?: boolean },
  ): Promise<void>;
  sendConfirmationEmail(contactData: InsertContactMessage): Promise<void>;
}

export class ResendEmailService implements EmailService {
  private readonly fromEmail = 'noreply@healingmindsp.com';
  private readonly practiceEmail = 'info@healingmindsp.com';

  async sendContactNotification(
    contactData: InsertContactMessage,
    options?: { test?: boolean },
  ): Promise<void> {
    console.log('🚀 ENTERED sendContactNotification method');
    const prefix = options?.test ? '[TEST] ' : '';
    const subject = `${prefix}Nueva consulta desde el sitio web - ${contactData.firstName} ${contactData.lastName}`;
    
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #16a34a; padding-bottom: 15px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 24px; font-weight: 600;">Nuevo Lead - Healing Minds</h1>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Información del Contacto</h2>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Nombre:</strong> ${contactData.firstName} ${contactData.lastName}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Email:</strong> ${contactData.email}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Teléfono:</strong> ${contactData.phone || 'No proporcionado'}</p>
          <p style="margin: 8px 0; color: #374151; font-size: 15px;"><strong>Idioma:</strong> ${contactData.preferredLanguage === 'spanish' ? 'Español' : 'Inglés'}</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">Mensaje:</h3>
          <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
            "${contactData.message}"
          </p>
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 13px; margin: 0;">
            Enviado desde healingmindsp.com • ${new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' })}
          </p>
        </div>
      </div>
    `;

    try {
      console.log('📧 Sending notification email to:', this.practiceEmail, 'from:', this.fromEmail);
      const response = await resend.emails.send({
        from: this.fromEmail,
        to: this.practiceEmail,
        subject: subject,
        html: htmlContent,
      });
      console.log('✅ Resend notification response:', response);
    } catch (error) {
      console.error('❌ Error sending contact notification email:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error('Failed to send contact notification email');
    }
  }

  async sendConfirmationEmail(contactData: InsertContactMessage): Promise<void> {
    console.log('🚀 ENTERED sendConfirmationEmail method');
    const isSpanish = contactData.preferredLanguage === 'spanish';
    
    const subject = isSpanish 
      ? 'Confirmación de consulta - Healing Minds Psychiatry'
      : 'Contact Confirmation - Healing Minds Psychiatry';

    const htmlContent = isSpanish ? this.getSpanishConfirmationTemplate(contactData) : this.getEnglishConfirmationTemplate(contactData);

    try {
      console.log('📧 Sending confirmation email to:', contactData.email, 'from:', this.fromEmail);
      const response = await resend.emails.send({
        from: this.fromEmail,
        to: contactData.email,
        subject: subject,
        html: htmlContent,
      });
      console.log('✅ Resend confirmation response:', response);
    } catch (error) {
      console.error('❌ Error sending confirmation email:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw new Error('Failed to send confirmation email');
    }
  }

  private getSpanishConfirmationTemplate(contactData: InsertContactMessage): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: 600;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 8px 0; font-size: 16px;">Dra. Melva Reve • Naples, FL</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 22px;">¡Gracias por contactarnos!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 0;">
            Estimado/a <strong>${contactData.firstName}</strong>, hemos recibido su consulta y nos pondremos en contacto con usted pronto.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #4b5563; font-style: italic; font-size: 15px;">
            "${contactData.message}"
          </p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Información de Contacto</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Teléfono:</strong> (239) 423-0272</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> info@healingmindsp.com</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Dirección:</strong> Naples, FL</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Horarios:</strong> Lunes - Viernes, 8:00 AM - 5:00 PM</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Atención integral en salud mental • Ansiedad • Depresión • TDAH • TEPT
          </p>
        </div>
      </div>
    `;
  }

  private getEnglishConfirmationTemplate(contactData: InsertContactMessage): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: 600;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 8px 0; font-size: 16px;">Dr. Melva Reve • Naples, FL</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 22px;">Thank you for contacting us!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5; margin: 0;">
            Dear <strong>${contactData.firstName}</strong>, we have received your inquiry and will get back to you soon.
          </p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #4b5563; font-style: italic; font-size: 15px;">
            "${contactData.message}"
          </p>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> (239) 423-0272</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> info@healingmindsp.com</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Address:</strong> Naples, FL</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Comprehensive mental health care • Anxiety • Depression • ADHD • PTSD
          </p>
        </div>
      </div>
    `;
  }
}

export const emailService = new ResendEmailService();