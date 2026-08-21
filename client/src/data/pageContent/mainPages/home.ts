import type { BilingualPageContent } from '../types';

// Inline copy for the Home page pair (EN: client/src/pages/Home.tsx,
// ES: client/src/pages/HomeEspanol.tsx). These pages are thin wrappers over
// components; this module holds the remaining inline visible copy of the two
// Home-only components:
//   - client/src/components/Hero.tsx
//   - client/src/components/InsuranceLogos.tsx (also rendered on
//     client/src/pages/TelepsychiatryFlorida.tsx — see note in that task)
//
// Copy that already lives in client/src/data/translations.ts (rendered via
// t(), e.g. the desktop hero.description) is intentionally NOT duplicated here.
// Decorated headings use **...** for the inline italic accent span, rendered by
// RichText with the element's original className. The SEO pill labels are static
// English in both languages, so the same strings appear in en and es.

export const homeContent: BilingualPageContent = {
  en: {
    title: 'Expert **psychiatric care** in Naples, FL',
    sections: [
      {
        key: 'heroPillsMobile',
        bullets: ['Expert Psychiatrist', 'Naples FL'],
      },
      {
        key: 'heroPillsDesktop',
        bullets: ['Expert Psychiatrist', 'Naples Mental Health', 'Southwest Florida'],
      },
      {
        key: 'heroDescriptionMobile',
        paragraphs: ['Compassionate care for your mental well-being in Naples, FL.'],
      },
      {
        key: 'heroButtons',
        bullets: ['Our Services', 'Call Now'],
      },
      {
        key: 'heroServices',
        bullets: [
          'Anxiety Disorders',
          'Depression Treatment',
          'ADHD Assessment',
          'PTSD Therapy',
          'Bipolar Disorder',
          'OCD Treatment',
          'Panic Disorders',
          'Social Anxiety',
          'Mood Stabilization',
          'Trauma-Informed Care',
          'Medication Management',
          'Psychoeducation',
          'Psychiatric Evaluation',
          'Stress Management',
        ],
      },
      {
        key: 'insuranceHeading',
        heading: 'Insurance & **Billing**',
        paragraphs: [
          'Participation and benefits vary by plan and service. Confirm current participation with our office and verify your specific benefits with your insurer before booking.',
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          'Telehealth benefits must be verified separately. Self-pay or financial options may be evaluated case by case.',
        ],
      },
    ],
  },
  es: {
    title: 'Atención **psiquiátrica experta** en Naples, FL',
    sections: [
      {
        key: 'heroPillsMobile',
        bullets: ['Expert Psychiatrist', 'Naples FL'],
      },
      {
        key: 'heroPillsDesktop',
        bullets: ['Expert Psychiatrist', 'Naples Mental Health', 'Southwest Florida'],
      },
      {
        key: 'heroDescriptionMobile',
        paragraphs: ['Atención compasiva para su bienestar mental en Naples, FL.'],
      },
      {
        key: 'heroButtons',
        bullets: ['Nuestros Servicios', 'Llamar Ahora'],
      },
      {
        key: 'heroServices',
        bullets: [
          'Trastornos de Ansiedad',
          'Tratamiento de Depresión',
          'Evaluación de TDAH',
          'Terapia para TEPT',
          'Trastorno Bipolar',
          'Tratamiento TOC',
          'Trastornos de Pánico',
          'Ansiedad Social',
          'Estabilización del Estado de Ánimo',
          'Atención Informada por Trauma',
          'Manejo de Medicamentos',
          'Psicoeducación',
          'Evaluación Psiquiátrica',
          'Manejo del Estrés',
        ],
      },
      {
        key: 'insuranceHeading',
        heading: 'Seguro y **Facturación**',
        paragraphs: [
          'La participación y los beneficios varían según el plan y el servicio. Confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos con su aseguradora antes de reservar.',
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          'Los beneficios de telesalud deben verificarse por separado. Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.',
        ],
      },
    ],
  },
};
