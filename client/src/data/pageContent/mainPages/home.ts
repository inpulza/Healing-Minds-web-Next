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
          'Crisis Intervention',
          'Stress Management',
        ],
      },
      {
        key: 'insuranceHeading',
        heading: 'Insurance **Plans** Accepted',
        paragraphs: [
          'We work with most major insurance providers to make quality mental health care accessible and affordable for our patients.',
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          "Don't see your insurance? Contact us to verify coverage for your specific plan.",
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
          'Intervención de Crisis',
          'Manejo del Estrés',
        ],
      },
      {
        key: 'insuranceHeading',
        heading: '**Planes** de Seguro Aceptados',
        paragraphs: [
          'Trabajamos con la mayoría de los principales proveedores de seguros para hacer que la atención de salud mental de calidad sea accesible y asequible para nuestros pacientes.',
        ],
      },
      {
        key: 'insuranceNote',
        paragraphs: [
          '¿No ve su seguro? Contáctenos para verificar la cobertura de su plan específico.',
        ],
      },
    ],
  },
};
