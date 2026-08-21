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
          `Participation varies by plan and service`,
          `Confirm current participation with the office`,
          `Verify benefits and telehealth coverage with your insurer`,
          `Financial options may be evaluated case by case`,
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          `Before booking, confirm participation with our office and verify your plan's benefits, cost sharing and telehealth terms directly with your insurer.`,
        ],
      },
      {
        key: 'whatToExpectHeading',
        heading: `What to Expect`,
      },
      {
        key: 'expectations',
        bullets: [
          `Initial Consultation`,
          `Follow-up Appointments`,
          `Treatment Planning`,
          `Between Sessions`,
        ],
        paragraphs: [
          `Comprehensive evaluation of your mental health history, current symptoms, and treatment goals. The office confirms the appointment length when scheduling.`,
          `Regular check-ins to monitor progress, adjust medications, and provide ongoing support. The office confirms the appointment length when scheduling.`,
          `Collaborative approach to developing a personalized treatment plan that fits your lifestyle and goals.`,
          `For non-urgent questions, use the secure patient portal or contact the office during published hours. In an emergency, call 911 or 988.`,
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
          `Current written terms confirmed by the office`,
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
          `La participación varía según el plan y el servicio`,
          `Confirme la participación vigente con la oficina`,
          `Verifique beneficios y cobertura de telesalud con su aseguradora`,
          `Las opciones financieras pueden evaluarse caso por caso`,
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          `Antes de reservar, confirme la participación con nuestra oficina y verifique directamente con su aseguradora los beneficios, costos compartidos y condiciones de telesalud de su plan.`,
        ],
      },
      {
        key: 'whatToExpectHeading',
        heading: `Qué Esperar`,
      },
      {
        key: 'expectations',
        bullets: [
          `Consulta Inicial`,
          `Citas de Seguimiento`,
          `Planificación del Tratamiento`,
          `Entre Sesiones`,
        ],
        paragraphs: [
          `Evaluación integral de su historial de salud mental, síntomas actuales y objetivos de tratamiento. La oficina confirma la duración de la cita al programar.`,
          `Controles regulares para monitorear el progreso, ajustar medicamentos y brindar apoyo continuo. La oficina confirma la duración de la cita al programar.`,
          `Enfoque colaborativo para desarrollar un plan de tratamiento personalizado que se ajuste a su estilo de vida y objetivos.`,
          `Para preguntas no urgentes, use el portal seguro del paciente o contacte la oficina durante el horario publicado. En una emergencia, llame al 911 o al 988.`,
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
          `Términos escritos vigentes confirmados por la oficina`,
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
        paragraphs: [`Active Florida medical license`],
      },
      {
        key: 'description',
        paragraphs: [
          `We provide individualized psychiatric evaluation and treatment planning, with appointment options confirmed by the office.`,
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
        paragraphs: [`Licencia médica activa de Florida`],
      },
      {
        key: 'description',
        paragraphs: [
          `Brindamos evaluación psiquiátrica y planificación individualizada del tratamiento, con opciones de cita confirmadas por la oficina.`,
        ],
      },
      {
        key: 'cta',
        bullets: [`Explorar servicios`],
      },
    ],
  },
};
