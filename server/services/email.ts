import { Resend } from 'resend';
import type { InsertContactMessage } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailService {
  sendContactNotification(contactData: InsertContactMessage): Promise<void>;
  sendConfirmationEmail(contactData: InsertContactMessage): Promise<void>;
}

export class ResendEmailService implements EmailService {
  private readonly fromEmail = 'onboarding@resend.dev';
  private readonly practiceEmail = 'info@healingmindsp.com';

  async sendContactNotification(contactData: InsertContactMessage): Promise<void> {
    const subject = `Nueva consulta desde el sitio web - ${contactData.firstName} ${contactData.lastName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
          Nueva Consulta - Healing Minds Psychiatry
        </h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Información del Paciente:</h3>
          <p><strong>Nombre:</strong> ${contactData.firstName} ${contactData.lastName}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Teléfono:</strong> ${contactData.phone || 'No proporcionado'}</p>
          <p><strong>Idioma preferido:</strong> ${contactData.preferredLanguage === 'spanish' ? 'Español' : 'Inglés'}</p>
        </div>

        <div style="background: #fff; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
          <p style="line-height: 1.6; color: #4b5563;">${contactData.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Este mensaje fue enviado desde el formulario de contacto del sitio web de Healing Minds Psychiatry.</p>
          <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' })}</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 5px 0;">Dra. Melva Reve - Naples, FL</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #16a34a; margin-top: 0;">¡Gracias por contactarnos!</h2>
          <p>Estimado/a ${contactData.firstName},</p>
          <p>Hemos recibido su consulta y nos pondremos en contacto con usted lo antes posible. Su bienestar mental es nuestra prioridad.</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Información de su consulta:</h3>
          <p><strong>Nombre:</strong> ${contactData.firstName} ${contactData.lastName}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Teléfono:</strong> ${contactData.phone || 'No proporcionado'}</p>
          <p><strong>Idioma preferido:</strong> Español</p>
        </div>

        <div style="border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Su mensaje:</h3>
          <p style="line-height: 1.6; color: #4b5563; font-style: italic;">"${contactData.message}"</p>
        </div>

        <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Información de contacto:</h3>
          <p><strong>Teléfono:</strong> (239) 276-3030</p>
          <p><strong>Email:</strong> info@healingmindsp.com</p>
          <p><strong>Dirección:</strong> Naples, FL</p>
          <p><strong>Horarios:</strong> Lunes a Viernes, 9:00 AM - 5:00 PM</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
          <p>La Dra. Melva Reve es una psiquiatra certificada que brinda atención integral en salud mental.</p>
          <p>Especializada en ansiedad, depresión, TDAH, TEPT y otros trastornos psiquiátricos.</p>
        </div>
      </div>
    `;
  }

  private getEnglishConfirmationTemplate(contactData: InsertContactMessage): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0;">Healing Minds Psychiatry</h1>
          <p style="color: #6b7280; margin: 5px 0;">Dr. Melva Reve - Naples, FL</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #16a34a; margin-top: 0;">Thank you for contacting us!</h2>
          <p>Dear ${contactData.firstName},</p>
          <p>We have received your inquiry and will get back to you as soon as possible. Your mental health is our priority.</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your inquiry details:</h3>
          <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
          <p><strong>Preferred Language:</strong> English</p>
        </div>

        <div style="border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your message:</h3>
          <p style="line-height: 1.6; color: #4b5563; font-style: italic;">"${contactData.message}"</p>
        </div>

        <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Contact Information:</h3>
          <p><strong>Phone:</strong> (239) 276-3030</p>
          <p><strong>Email:</strong> info@healingmindsp.com</p>
          <p><strong>Address:</strong> Naples, FL</p>
          <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
          <p>Dr. Melva Reve is a board-certified psychiatrist providing comprehensive mental health care.</p>
          <p>Specializing in anxiety, depression, ADHD, PTSD, and other psychiatric conditions.</p>
        </div>
      </div>
    `;
  }
}

export const emailService = new ResendEmailService();