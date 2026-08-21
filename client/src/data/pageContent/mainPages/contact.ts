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
        paragraphs: ['Response times vary; the office reviews messages during published business hours'],
      },
      {
        key: 'addressSubtext',
        paragraphs: ['Get Directions →'],
      },
      {
        key: 'insuranceLabel',
        paragraphs: ['Insurance and billing questions'],
      },
      {
        key: 'insuranceDescription',
        paragraphs: ['Participation and benefits vary by plan and service. Confirm current participation with our office and verify your specific benefits with your insurer before booking.'],
      },
      {
        key: 'insuranceNote',
        paragraphs: ['Self-pay or financial options may be evaluated case by case.'],
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
          'David Lawrence Centers Crisis Line',
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
          '* Required fields. By submitting this form, you consent to us contacting you about your inquiry. We apply reasonable privacy and security safeguards under applicable policies and law.',
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
          'Visit our Naples office on Tamiami Trail. Check parking and access details when scheduling.',
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
        paragraphs: ['Los tiempos de respuesta varían; la oficina revisa los mensajes durante el horario publicado'],
      },
      {
        key: 'addressSubtext',
        paragraphs: ['Obtener Direcciones →'],
      },
      {
        key: 'insuranceLabel',
        paragraphs: ['Preguntas sobre seguro y facturación'],
      },
      {
        key: 'insuranceDescription',
        paragraphs: ['La participación y los beneficios varían según el plan y el servicio. Confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos con su aseguradora antes de reservar.'],
      },
      {
        key: 'insuranceNote',
        paragraphs: ['Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.'],
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
          'Línea de Crisis de David Lawrence Centers',
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
          '* Campos requeridos. Al enviar este formulario, usted consiente que lo contactemos sobre su consulta. Aplicamos salvaguardas razonables de privacidad y seguridad conforme a políticas y leyes aplicables.',
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
          'Visite nuestra oficina de Naples en Tamiami Trail. Confirme estacionamiento y acceso al programar.',
        ],
      },
    ],
  },
};
