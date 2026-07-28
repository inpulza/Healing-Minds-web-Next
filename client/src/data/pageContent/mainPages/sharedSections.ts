import type { BilingualPageContent } from '../types';

// Inline copy for shared section components rendered across multiple pages.
// Kept here (rather than in a single page's module) because these components
// are used by more than one page pair.
//
// forPatientsSectionContent -> client/src/components/ForPatients.tsx
//   Used by: Home / HomeEspanol (via LazyForPatients), ForPatients /
//   ParaPacientesEspanol.
//
// doctorSectionContent -> client/src/components/DoctorSection.tsx
//   Used by: Home / HomeEspanol (via LazyDoctorSection), PsiquiatraCalifornia,
//   TelepsychiatryFlorida.
//
// Split headings that interleave an italic <span> keep their JSX in the
// component; their full plain text is mirrored here as `title`. Card/expectation
// groups store their titles in `bullets` and matching descriptions in
// `paragraphs` (paired by index); the component zips them back together.
//
// Pure TypeScript only: no JSX, no React/lucide/@assets imports.

export const forPatientsSectionContent: BilingualPageContent = {
  en: {
    title: `For Patients`,
    sections: [
      {
        key: 'description',
        paragraphs: [
          `Important information about insurance, appointments, and what to expect during your care.`,
        ],
      },
      {
        key: 'insurancePaymentHeading',
        heading: `Insurance & Payment`,
      },
      {
        key: 'insuranceFeatures',
        bullets: [
          `Most major insurance plans accepted`,
          `Self-pay options available`,
          `Telehealth appointments covered`,
          `Flexible payment plans`,
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          `We verify insurance benefits before your first appointment. Please bring your insurance card and a valid ID to your visit.`,
        ],
      },
      {
        key: 'whatToExpectHeading',
        heading: `What to Expect`,
      },
      {
        key: 'expectations',
        bullets: [
          `Initial Consultation (40-60 minutes)`,
          `Follow-up Appointments (20-30 minutes)`,
          `Treatment Planning`,
          `Between Sessions`,
        ],
        paragraphs: [
          `Comprehensive evaluation of your mental health history, current symptoms, and treatment goals.`,
          `Regular check-ins to monitor progress, adjust medications, and provide ongoing support.`,
          `Collaborative approach to developing a personalized treatment plan that fits your lifestyle and goals.`,
          `24/7 on-call support for urgent situations and medication adjustments as needed.`,
        ],
      },
      {
        key: 'importantPoliciesHeading',
        heading: `Important Policies`,
      },
      {
        key: 'policyCards',
        bullets: [
          `Cancellation Policy`,
          `Billing Policy`,
          `Emergency Policy`,
          `Patient Rights`,
          `No Surprises Act`,
          `Telehealth Consent`,
        ],
        paragraphs: [
          `24-hour notice required`,
          `Insurance & payment information`,
          `Crisis & emergency resources`,
          `Your rights & responsibilities`,
          `Good Faith Estimates & billing rights`,
          `How video visits work`,
        ],
      },
    ],
  },
  es: {
    title: `Para Pacientes`,
    sections: [
      {
        key: 'description',
        paragraphs: [
          `Información importante sobre seguros, citas, y qué esperar durante su atención.`,
        ],
      },
      {
        key: 'insurancePaymentHeading',
        heading: `Seguro y Pago`,
      },
      {
        key: 'insuranceFeatures',
        bullets: [
          `Se aceptan la mayoría de los planes de seguro principales`,
          `Opciones de pago por cuenta propia disponibles`,
          `Citas de telesalud cubiertas`,
          `Planes de pago flexibles`,
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          `Verificamos los beneficios del seguro antes de su primera cita. Por favor traiga su tarjeta de seguro y una identificación válida a su visita.`,
        ],
      },
      {
        key: 'whatToExpectHeading',
        heading: `Qué Esperar`,
      },
      {
        key: 'expectations',
        bullets: [
          `Consulta Inicial (40-60 minutos)`,
          `Citas de Seguimiento (20-30 minutos)`,
          `Planificación del Tratamiento`,
          `Entre Sesiones`,
        ],
        paragraphs: [
          `Evaluación integral de su historial de salud mental, síntomas actuales y objetivos de tratamiento.`,
          `Controles regulares para monitorear el progreso, ajustar medicamentos y brindar apoyo continuo.`,
          `Enfoque colaborativo para desarrollar un plan de tratamiento personalizado que se ajuste a su estilo de vida y objetivos.`,
          `Soporte de guardia 24/7 para situaciones urgentes y ajustes de medicación según sea necesario.`,
        ],
      },
      {
        key: 'importantPoliciesHeading',
        heading: `Políticas Importantes`,
      },
      {
        key: 'policyCards',
        bullets: [
          `Política de Cancelación`,
          `Política de Facturación`,
          `Política de Emergencias`,
          `Derechos del Paciente`,
          `Ley Sin Sorpresas`,
          `Consentimiento de Telesalud`,
        ],
        paragraphs: [
          `Aviso de 24 horas requerido`,
          `Información de seguro y pagos`,
          `Recursos de crisis y emergencia`,
          `Sus derechos y responsabilidades`,
          `Estimados de Buena Fe y sus derechos`,
          `Cómo funcionan las visitas por video`,
        ],
      },
    ],
  },
};

export const doctorSectionContent: BilingualPageContent = {
  en: {
    title: `Dedicated to your mental health, every day`,
    sections: [
      {
        key: 'yearsLabel',
        paragraphs: [`Years of experience`],
      },
      {
        key: 'description',
        paragraphs: [
          `We provide compassionate care and advanced treatments tailored to your needs. Experience convenient access to mental healthcare.`,
        ],
      },
      {
        key: 'cta',
        bullets: [`Explore services`],
      },
    ],
  },
  es: {
    title: `Dedicados a su salud mental, todos los días`,
    sections: [
      {
        key: 'yearsLabel',
        paragraphs: [`Años de experiencia`],
      },
      {
        key: 'description',
        paragraphs: [
          `Brindamos atención compasiva y tratamientos avanzados adaptados a sus necesidades. Experimente un acceso conveniente a la atención de salud mental.`,
        ],
      },
      {
        key: 'cta',
        bullets: [`Explorar servicios`],
      },
    ],
  },
};
