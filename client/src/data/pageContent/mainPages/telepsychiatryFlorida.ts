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
    title: 'Expert Psychiatric Care from Anywhere in Florida',
    sections: [
      {
        key: 'hero-badges',
        bullets: ['Telehealth Available', 'Available 24/7', 'Mobile Friendly'],
      },
      {
        key: 'hero-description',
        paragraphs: [
          'Connect with Dr. Melva Reve from the comfort of your home. Professional psychiatric care designed to eliminate distance barriers, wherever you are in Florida.',
        ],
      },
      {
        key: 'coverage-heading',
        heading: 'Statewide Coverage',
      },
      {
        key: 'coverage-description',
        paragraphs: [
          'Dr. Melva Reve is licensed to provide telepsychiatry services throughout the entire state of Florida.',
        ],
      },
      {
        key: 'coverage-feature-tags',
        bullets: [
          '15+ Years Experience',
          'Expert Psychiatrist',
          'Bilingual Services',
          'Statewide Coverage',
          'HIPAA Compliant',
          'Secure Platform',
        ],
      },
      {
        key: 'coverage-map-badge',
        paragraphs: ['Available Statewide'],
      },
      {
        key: 'benefits-heading',
        heading: 'Why Choose Telepsychiatry?',
      },
      {
        key: 'benefit-access',
        heading: 'Access from Anywhere in Florida',
        paragraphs: [
          "Whether you're in Miami, Orlando, Tampa, or a rural community, connect with an expert psychiatrist without the need to travel.",
        ],
      },
      {
        key: 'benefit-convenient',
        heading: 'Convenient & Time-Saving',
        paragraphs: [
          'No traffic, no waiting rooms. Our virtual appointments fit your schedule, allowing you to receive care efficiently from home.',
        ],
      },
      {
        key: 'benefit-secure',
        heading: '100% Private & Secure',
        paragraphs: [
          'HIPAA-compliant platform ensures your sessions are completely confidential and encrypted. Your privacy is our priority.',
        ],
      },
      {
        key: 'benefit-continuity',
        heading: 'Continuity of Care',
        paragraphs: [
          'Perfect for seasonal residents, college students, or anyone traveling within Florida. Your treatment never gets interrupted.',
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
          'Call us or use our online booking portal to schedule your first virtual consultation.',
        ],
      },
      {
        key: 'process-step-2',
        heading: 'Receive Secure Link',
        paragraphs: [
          "You'll get a confirmation email with a unique, HIPAA-compliant video session link.",
        ],
      },
      {
        key: 'process-step-3',
        heading: 'Connect with Dr. Reve',
        paragraphs: [
          'At your appointment time, click the link from any device and meet with Dr. Reve in English or Spanish.',
        ],
      },
      {
        key: 'process-step-4',
        heading: 'Ongoing Care',
        paragraphs: [
          'Schedule follow-up appointments as needed and receive continuous psychiatric support, all from the comfort of home.',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Complete Psychiatry Services via Telemedicine',
      },
      {
        key: 'services-description',
        paragraphs: [
          'Our virtual platform allows us to offer our full range of diagnostic and psychiatric services for adults (18+).',
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
          'HIPAA-Compliant Platform',
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
        bullets: ['Schedule Now'],
      },
    ],
  },
  es: {
    title: 'Atención Psiquiátrica Experta desde Cualquier Lugar de Florida',
    sections: [
      {
        key: 'hero-badges',
        bullets: ['Telesalud Disponible', 'Disponible 24/7', 'Móvil Amigable'],
      },
      {
        key: 'hero-description',
        paragraphs: [
          'Conéctese con la Dra. Melva Reve desde la comodidad de su hogar. Atención psiquiátrica profesional diseñada para eliminar barreras de distancia, esté donde esté en Florida.',
        ],
      },
      {
        key: 'coverage-heading',
        heading: 'Cobertura Estatal',
      },
      {
        key: 'coverage-description',
        paragraphs: [
          'La Dra. Melva Reve tiene licencia para proporcionar servicios de telepsiquiatría en todo el estado de Florida.',
        ],
      },
      {
        key: 'coverage-feature-tags',
        bullets: [
          '15+ Años de Experiencia',
          'Psiquiatra Experta',
          'Servicios Bilingües',
          'Cobertura Estatal',
          'Compatible con HIPAA',
          'Plataforma Segura',
        ],
      },
      {
        key: 'coverage-map-badge',
        paragraphs: ['Disponible en Todo el Estado'],
      },
      {
        key: 'benefits-heading',
        heading: '¿Por Qué Elegir Telepsiquiatría?',
      },
      {
        key: 'benefit-access',
        heading: 'Acceso desde Cualquier Lugar de Florida',
        paragraphs: [
          'Ya sea que esté en Miami, Orlando, Tampa o una comunidad rural, conéctese con una psiquiatra con licencia sin necesidad de viajar.',
        ],
      },
      {
        key: 'benefit-convenient',
        heading: 'Conveniente y Ahorra Tiempo',
        paragraphs: [
          'Sin tráfico, sin salas de espera. Nuestras citas virtuales se adaptan a su horario, permitiéndole recibir atención eficientemente desde casa.',
        ],
      },
      {
        key: 'benefit-secure',
        heading: '100% Privado y Seguro',
        paragraphs: [
          'Plataforma compatible con HIPAA garantiza que sus sesiones sean completamente confidenciales y encriptadas. Su privacidad es nuestra prioridad.',
        ],
      },
      {
        key: 'benefit-continuity',
        heading: 'Continuidad de la Atención',
        paragraphs: [
          'Perfecto para residentes estacionales, estudiantes universitarios o cualquiera que viaje dentro de Florida. Su tratamiento nunca se interrumpe.',
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
          'Llámenos o use nuestro portal de reservas en línea para programar su primera consulta virtual.',
        ],
      },
      {
        key: 'process-step-2',
        heading: 'Reciba Enlace Seguro',
        paragraphs: [
          'Recibirá un correo de confirmación con un enlace único de sesión de video compatible con HIPAA.',
        ],
      },
      {
        key: 'process-step-3',
        heading: 'Conéctese con la Dra. Reve',
        paragraphs: [
          'A la hora de su cita, haga clic en el enlace desde cualquier dispositivo y reúnase con la Dra. Reve en inglés o español.',
        ],
      },
      {
        key: 'process-step-4',
        heading: 'Atención Continua',
        paragraphs: [
          'Programe citas de seguimiento según sea necesario y reciba apoyo psiquiátrico continuo, todo desde la comodidad de su hogar.',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Servicios Completos de Psiquiatría a través de Telemedicina',
      },
      {
        key: 'services-description',
        paragraphs: [
          'Nuestra plataforma virtual nos permite ofrecer nuestra gama completa de servicios de diagnóstico y atención psiquiátrica para adultos (18+).',
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
          'Plataforma Compatible con HIPAA',
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
        bullets: ['Programar Ahora'],
      },
    ],
  },
};
