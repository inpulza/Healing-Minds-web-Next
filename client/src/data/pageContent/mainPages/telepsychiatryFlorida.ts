import type { BilingualPageContent } from '../types';

// Inline copy for client/src/pages/TelepsychiatryFlorida.tsx (EN + ES).
// The page's H1 (hero title) and the section titles that interleave an italic
// <span> keep their bespoke JSX in the component; their full plain text is
// mirrored here (title + section `heading`) so the server can serialize the
// same words.
// FAQ items render from client/src/data/locationFAQs.ts (locationFAQs.telehealth)
// and are intentionally NOT duplicated here. Image alt texts stay inline in the
// component (English-only accessibility attributes, not visible body copy).

export const telepsychiatryFloridaContent: BilingualPageContent = {
  en: {
    title: 'Request Telepsychiatry in Florida',
    sections: [
      {
        key: 'hero-badges',
        bullets: ['Telehealth Requests Available', 'Availability Confirmed by Office', 'Mobile Friendly'],
      },
      {
        key: 'hero-description',
        paragraphs: [
          'Request a video visit with Dr. Melva Reve from your home. The office confirms availability, clinical suitability, patient location and licensing requirements case by case.',
        ],
      },
      {
        key: 'coverage-heading',
        heading: 'Florida Telehealth Eligibility',
      },
      {
        key: 'coverage-description',
        paragraphs: [
          'Dr. Melva Reve holds a Florida medical license. The office confirms whether telepsychiatry is appropriate and permitted for each appointment based on clinical needs and the patient’s physical location.',
        ],
      },
      {
        key: 'coverage-feature-tags',
        bullets: [
          'Active Florida License ME165518',
          'Expert Psychiatrist',
          'Bilingual Services',
          'Eligibility Confirmed Case by Case',
          'Privacy Practices Reviewed',
          'Secure Platform',
        ],
      },
      {
        key: 'coverage-map-badge',
        paragraphs: ['Florida Location Required'],
      },
      {
        key: 'benefits-heading',
        heading: 'Why Choose Telepsychiatry?',
      },
      {
        key: 'benefit-access',
        heading: 'Request Care While Located in Florida',
        paragraphs: [
          'The office verifies your physical location, applicable licensing requirements and clinical suitability before confirming a video appointment.',
        ],
      },
      {
        key: 'benefit-convenient',
        heading: 'Convenient & Time-Saving',
        paragraphs: [
          'A confirmed video appointment may reduce travel. Appointment time and modality are confirmed by the office when scheduling.',
        ],
      },
      {
        key: 'benefit-secure',
        heading: 'Privacy-Conscious Video Visits',
        paragraphs: [
          'Video visits use a secure video platform. Privacy practices and consent are reviewed before care; no internet transmission can be described as risk-free.',
        ],
      },
      {
        key: 'benefit-continuity',
        heading: 'Continuity of Care',
        paragraphs: [
          'Patients may discuss continuity needs with the office. Modality, availability and any coordination with another provider are evaluated case by case and require patient consent where applicable.',
        ],
      },
      {
        key: 'process-heading',
        heading: 'How It Works',
      },
      {
        key: 'process-description',
        paragraphs: ['Getting started with telepsychiatry is simple and straightforward.'],
      },
      {
        key: 'process-step-1',
        heading: 'Book Your Appointment',
        paragraphs: [
          'Call us or use the online portal to request an appointment. The office confirms availability and modality.',
        ],
      },
      {
        key: 'process-step-2',
        heading: 'Receive Access Instructions',
        paragraphs: [
          'If a video visit is confirmed, the office will provide secure access instructions before the appointment.',
        ],
      },
      {
        key: 'process-step-3',
        heading: 'Connect with Dr. Reve',
        paragraphs: [
          'Follow the access instructions provided by the office. Contact the office if you have trouble joining.',
        ],
      },
      {
        key: 'process-step-4',
        heading: 'Ongoing Care',
        paragraphs: [
          'Request follow-up appointments as needed. The office confirms the appropriate modality for each visit.',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Complete Psychiatry Services via Telemedicine',
      },
      {
        key: 'services-description',
        paragraphs: [
          'For adults 18 and older, the office determines which diagnostic and psychiatric services are clinically appropriate for video visits case by case.',
        ],
      },
      {
        key: 'service-evaluation',
        heading: 'Initial Psychiatric Evaluation',
        paragraphs: [
          'Comprehensive assessment to understand your mental health needs and create a personalized treatment plan.',
        ],
      },
      {
        key: 'service-anxiety-depression',
        heading: 'Anxiety & Depression Treatment',
        paragraphs: [
          'Expert psychiatric evaluation and ongoing support for anxiety disorders and depression.',
        ],
      },
      {
        key: 'service-adhd',
        heading: 'ADHD Evaluation & Management',
        paragraphs: [
          'Thorough ADHD assessment and personalized psychiatric care for adults seeking focus and productivity.',
        ],
      },
      {
        key: 'service-ptsd',
        heading: 'PTSD & Trauma Therapy',
        paragraphs: [
          'Trauma-informed psychiatric care and coordinated support for post-traumatic stress disorder.',
        ],
      },
      {
        key: 'service-bipolar',
        heading: 'Bipolar Disorder Treatment',
        paragraphs: [
          'Specialized mood stabilization and comprehensive bipolar disorder management.',
        ],
      },
      {
        key: 'service-medication',
        heading: 'Ongoing Psychiatric Care',
        paragraphs: [
          'Regular follow-up appointments and continuous psychiatric support to optimize your treatment plan.',
        ],
      },
      {
        key: 'faq-heading',
        heading: 'Frequently Asked Questions',
      },
      {
        key: 'compliance-badges',
        bullets: [
          'Florida Licensed Psychiatrist · ME165518',
          'Secure Video Platform',
          'Clinical Evaluations Only · Not an Online Pharmacy',
        ],
      },
      {
        key: 'compliance-footer',
        paragraphs: [
          'Virtual appointments are clinical consultations conducted by a licensed physician. Treatment plans are determined individually after evaluation. Not intended for emergencies — call 988 or 911 in a crisis.',
        ],
      },
      {
        key: 'cta-heading',
        heading: 'Ready to Get Started?',
      },
      {
        key: 'cta-description',
        paragraphs: ['Quality mental health care is just a click away.'],
      },
      {
        key: 'cta-button',
        bullets: ['Request Appointment'],
      },
    ],
  },
  es: {
    title: 'Solicite Telepsiquiatría en Florida',
    sections: [
      {
        key: 'hero-badges',
        bullets: ['Solicitudes de Telesalud Disponibles', 'Disponibilidad Confirmada por la Oficina', 'Acceso Móvil'],
      },
      {
        key: 'hero-description',
        paragraphs: [
          'Solicite una visita por video con la Dra. Melva Reve desde su hogar. La oficina confirma la disponibilidad, adecuación clínica, ubicación del paciente y requisitos de licencia caso por caso.',
        ],
      },
      {
        key: 'coverage-heading',
        heading: 'Elegibilidad para Telesalud en Florida',
      },
      {
        key: 'coverage-description',
        paragraphs: [
          'La Dra. Melva Reve tiene licencia médica de Florida. La oficina confirma si la telepsiquiatría es apropiada y está permitida para cada cita según las necesidades clínicas y la ubicación física del paciente.',
        ],
      },
      {
        key: 'coverage-feature-tags',
        bullets: [
          'Licencia Activa de Florida ME165518',
          'Psiquiatra Experta',
          'Servicios Bilingües',
          'Elegibilidad Confirmada Caso por Caso',
          'Prácticas de Privacidad Revisadas',
          'Plataforma Segura',
        ],
      },
      {
        key: 'coverage-map-badge',
        paragraphs: ['Ubicación en Florida Requerida'],
      },
      {
        key: 'benefits-heading',
        heading: '¿Por Qué Elegir Telepsiquiatría?',
      },
      {
        key: 'benefit-access',
        heading: 'Solicite Atención Mientras Está en Florida',
        paragraphs: [
          'La oficina verifica su ubicación física, los requisitos de licencia aplicables y la adecuación clínica antes de confirmar una cita por video.',
        ],
      },
      {
        key: 'benefit-convenient',
        heading: 'Conveniente y Ahorra Tiempo',
        paragraphs: [
          'Una cita por video confirmada puede reducir desplazamientos. La oficina confirma el horario y la modalidad al programar.',
        ],
      },
      {
        key: 'benefit-secure',
        heading: 'Visitas por Video con Medidas de Privacidad',
        paragraphs: [
          'Las visitas usan una plataforma de video segura. Las prácticas de privacidad y el consentimiento se revisan antes de la atención; ninguna transmisión por internet puede describirse como libre de riesgo.',
        ],
      },
      {
        key: 'benefit-continuity',
        heading: 'Continuidad de la Atención',
        paragraphs: [
          'Los pacientes pueden discutir sus necesidades de continuidad con la oficina. La modalidad, disponibilidad y cualquier coordinación con otro proveedor se evalúan caso por caso y requieren consentimiento cuando corresponda.',
        ],
      },
      {
        key: 'process-heading',
        heading: 'Cómo Funciona',
      },
      {
        key: 'process-description',
        paragraphs: ['Comenzar con la telepsiquiatría es simple y directo.'],
      },
      {
        key: 'process-step-1',
        heading: 'Reserve su Cita',
        paragraphs: [
          'Llámenos o use el portal en línea para solicitar una cita. La oficina confirma la disponibilidad y modalidad.',
        ],
      },
      {
        key: 'process-step-2',
        heading: 'Reciba Instrucciones de Acceso',
        paragraphs: [
          'Si se confirma una visita por video, la oficina proporcionará instrucciones de acceso seguro antes de la cita.',
        ],
      },
      {
        key: 'process-step-3',
        heading: 'Conéctese con la Dra. Reve',
        paragraphs: [
          'Siga las instrucciones de acceso proporcionadas por la oficina. Contacte la oficina si tiene problemas para conectarse.',
        ],
      },
      {
        key: 'process-step-4',
        heading: 'Atención Continua',
        paragraphs: [
          'Solicite citas de seguimiento según sea necesario. La oficina confirma la modalidad apropiada para cada visita.',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Servicios Completos de Psiquiatría a través de Telemedicina',
      },
      {
        key: 'services-description',
        paragraphs: [
          'Para adultos de 18 años en adelante, la oficina determina caso por caso qué servicios diagnósticos y psiquiátricos son clínicamente apropiados por video.',
        ],
      },
      {
        key: 'service-evaluation',
        heading: 'Evaluación Psiquiátrica Inicial',
        paragraphs: [
          'Evaluación integral para comprender sus necesidades de salud mental y crear un plan de tratamiento personalizado.',
        ],
      },
      {
        key: 'service-anxiety-depression',
        heading: 'Tratamiento de Ansiedad y Depresión',
        paragraphs: [
          'Evaluación psiquiátrica experta y apoyo continuo para trastornos de ansiedad y depresión.',
        ],
      },
      {
        key: 'service-adhd',
        heading: 'Evaluación y Manejo de TDAH',
        paragraphs: [
          'Evaluación exhaustiva de TDAH y atención psiquiátrica personalizada para adultos que buscan enfoque y productividad.',
        ],
      },
      {
        key: 'service-ptsd',
        heading: 'Terapia de TEPT y Trauma',
        paragraphs: [
          'Atención psiquiátrica informada en trauma y apoyo coordinado para trastorno de estrés postraumático.',
        ],
      },
      {
        key: 'service-bipolar',
        heading: 'Tratamiento de Trastorno Bipolar',
        paragraphs: [
          'Estabilización del estado de ánimo especializada y manejo integral del trastorno bipolar.',
        ],
      },
      {
        key: 'service-medication',
        heading: 'Atención Psiquiátrica Continua',
        paragraphs: [
          'Citas de seguimiento regulares y apoyo psiquiátrico continuo para optimizar su plan de tratamiento.',
        ],
      },
      {
        key: 'faq-heading',
        heading: 'Preguntas Frecuentes',
      },
      {
        key: 'compliance-badges',
        bullets: [
          'Psiquiatra con Licencia en Florida · ME165518',
          'Plataforma de Video Segura',
          'Solo Evaluaciones Clínicas · No es Farmacia en Línea',
        ],
      },
      {
        key: 'compliance-footer',
        paragraphs: [
          'Las citas virtuales son consultas clínicas realizadas por una médica con licencia. Los planes de tratamiento se determinan individualmente tras la evaluación. No es para emergencias — llame al 988 o al 911 en una crisis.',
        ],
      },
      {
        key: 'cta-heading',
        heading: '¿Listo para Comenzar?',
      },
      {
        key: 'cta-description',
        paragraphs: ['La atención de salud mental de calidad está a solo un clic de distancia.'],
      },
      {
        key: 'cta-button',
        bullets: ['Solicitar Cita'],
      },
    ],
  },
};
