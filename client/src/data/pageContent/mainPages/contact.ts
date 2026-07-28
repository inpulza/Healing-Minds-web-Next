import type { BilingualPageContent } from '../types';

// Inline copy for the Contact page pair (EN: client/src/pages/Contact.tsx,
// ES: client/src/pages/ContactoEspanol.tsx). These pages are thin wrappers over
// client/src/components/Contact.tsx, which is ALSO rendered on the Home page via
// LazyContact — its copy lives here (the module of the page it is named for).
//
// Copy already rendered via t() from client/src/data/translations.ts (contact
// title-eyebrow, phone/email/address labels, emergency label, all form field
// labels, the description, and the send button) is intentionally NOT duplicated
// here. Phone number, email and street address literals stay in the component
// (they mirror client/src/data/content.ts). Decorated headings use **...** for
// the inline italic accent span.

export const contactContent: BilingualPageContent = {
  en: {
    title: 'Get in **touch**',
    sections: [
      {
        key: 'phoneSubtext',
        paragraphs: ['Monday - Friday: 8:00 AM - 5:00 PM'],
      },
      {
        key: 'emailSubtext',
        paragraphs: ['We respond within 24 hours'],
      },
      {
        key: 'addressSubtext',
        paragraphs: ['Get Directions →'],
      },
      {
        key: 'insuranceLabel',
        paragraphs: ['Insurance We Accept'],
      },
      {
        key: 'infoTitle',
        level: 3,
        heading: 'Contact **Information**',
      },
      {
        key: 'emergency',
        paragraphs: [
          'If you are experiencing a mental health emergency, please call:',
        ],
        bullets: [
          'Emergency services',
          'Suicide & Crisis Lifeline',
          'David Lawrence Center 24-Hour Line',
        ],
      },
      {
        key: 'telehealthHeading',
        level: 3,
        heading: '**Telehealth** Appointments',
      },
      {
        key: 'formTitle',
        level: 3,
        heading: 'Send us a **message**',
      },
      {
        key: 'formMessagePlaceholder',
        paragraphs: [
          'Please let us know how we can help you or any questions you have about our services.',
        ],
      },
      {
        key: 'formConsent',
        paragraphs: [
          '* Required fields. By submitting this form, you consent to us contacting you about your inquiry. Your information is kept confidential and secure.',
        ],
      },
      {
        key: 'formSending',
        paragraphs: ['Sending...'],
      },
      {
        key: 'mapHeading',
        level: 3,
        heading: 'Find Us on the **Map**',
        paragraphs: [
          'Visit our Naples office conveniently located on Tamiami Trail. Easy access with ample parking available.',
        ],
      },
    ],
  },
  es: {
    title: 'Póngase en **contacto**',
    sections: [
      {
        key: 'phoneSubtext',
        paragraphs: ['Lunes - Viernes: 8:00 AM - 5:00 PM'],
      },
      {
        key: 'emailSubtext',
        paragraphs: ['Respondemos dentro de 24 horas'],
      },
      {
        key: 'addressSubtext',
        paragraphs: ['Obtener Direcciones →'],
      },
      {
        key: 'insuranceLabel',
        paragraphs: ['Seguros que Aceptamos'],
      },
      {
        key: 'infoTitle',
        level: 3,
        heading: 'Información de **Contacto**',
      },
      {
        key: 'emergency',
        paragraphs: [
          'Si está experimentando una emergencia de salud mental, por favor llame:',
        ],
        bullets: [
          'Servicios de emergencia',
          'Línea de Vida de Suicidio y Crisis',
          'Línea 24 Horas del Centro David Lawrence',
        ],
      },
      {
        key: 'telehealthHeading',
        level: 3,
        heading: 'Citas de **Telesalud**',
      },
      {
        key: 'formTitle',
        level: 3,
        heading: 'Envíanos un **mensaje**',
      },
      {
        key: 'formMessagePlaceholder',
        paragraphs: [
          'Por favor déjenos saber cómo podemos ayudarle o cualquier pregunta que tenga sobre nuestros servicios.',
        ],
      },
      {
        key: 'formConsent',
        paragraphs: [
          '* Campos requeridos. Al enviar este formulario, usted consiente que lo contactemos sobre su consulta. Su información se mantiene confidencial y segura.',
        ],
      },
      {
        key: 'formSending',
        paragraphs: ['Enviando...'],
      },
      {
        key: 'mapHeading',
        level: 3,
        heading: 'Encuéntranos en el **Mapa**',
        paragraphs: [
          'Visite nuestra oficina de Naples convenientemente ubicada en Tamiami Trail. Fácil acceso con amplio estacionamiento disponible.',
        ],
      },
    ],
  },
};
