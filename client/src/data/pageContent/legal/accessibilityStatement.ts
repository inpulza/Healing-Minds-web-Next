import type { BilingualPageContent } from '@/data/pageContent/types';

export const accessibilityStatementContent: BilingualPageContent = {
  en: {
    title: 'Accessibility Statement',
    sections: [
      { key: 'updated', paragraphs: ['Last updated: July 2026'] },
      {
        key: 'commitment',
        heading: 'Our Commitment',
        paragraphs: [
          'Healing Minds Psychiatry is committed to ensuring that our website is accessible to people with disabilities. Consistent with the Americans with Disabilities Act (ADA), we aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We believe that everyone should be able to access clear information about mental health care in their own language.',
        ],
      },
      {
        key: 'measures',
        heading: 'Measures We Have Taken',
        paragraphs: [
          'To support an accessible experience, our website includes the following measures:',
        ],
        bullets: [
          '**Semantic structure:** We use semantic HTML and landmarks so the page structure can be understood by assistive technologies.',
          '**Alternative text:** We provide alternative text for meaningful images so their content is available to screen reader users.',
          '**Color contrast:** We aim for sufficient color contrast between text and its background to improve readability.',
          '**Keyboard navigation:** Interactive elements are designed to be reachable and usable with a keyboard.',
          '**Responsive design:** The site is responsive and intended to remain usable with browser zoom and screen readers on a range of devices.',
          '**Bilingual content:** Our content is available in both English and Spanish.',
        ],
      },
      {
        key: 'ongoing',
        heading: 'Ongoing Effort',
        paragraphs: [
          'Accessibility is an ongoing effort. We review the accessibility of our website as our content evolves and work to improve the experience over time. Please note that some third-party content, such as embedded video players and our online booking platform, may not be fully under our control, and we cannot guarantee its accessibility.',
        ],
      },
      {
        key: 'feedback',
        heading: 'Feedback and Assistance',
        paragraphs: [
          'If you have difficulty accessing any part of our website, or if you need information from our site provided in another format, please let us know. Contact us at [(239) 423-0272](tel:+12394230272) or email [info@healingmindsp.com](mailto:info@healingmindsp.com), and we will work with you to provide the information you need and make reasonable accommodations.',
        ],
      },
      {
        key: 'auxiliary',
        heading: 'Auxiliary Aids and Language Assistance for Care',
        paragraphs: [
          'Beyond the website, patients may request auxiliary aids and language assistance services for their care at no cost. If you need these services, please contact our office by phone or email so we can arrange appropriate support for your appointment.',
        ],
      },
    ],
  },
  es: {
    title: 'Declaración de Accesibilidad',
    sections: [
      { key: 'updated', paragraphs: ['Última actualización: julio de 2026'] },
      {
        key: 'commitment',
        heading: 'Nuestro Compromiso',
        paragraphs: [
          'Healing Minds Psychiatry se compromete a garantizar que nuestro sitio web sea accesible para las personas con discapacidades. De acuerdo con la Ley de Estadounidenses con Discapacidades (ADA), nuestro objetivo es cumplir con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 Nivel AA. Creemos que todas las personas deben poder acceder a información clara sobre la atención de salud mental en su propio idioma.',
        ],
      },
      {
        key: 'measures',
        heading: 'Medidas que Hemos Tomado',
        paragraphs: [
          'Para apoyar una experiencia accesible, nuestro sitio web incluye las siguientes medidas:',
        ],
        bullets: [
          '**Estructura semántica:** Usamos HTML semántico y puntos de referencia para que las tecnologías de asistencia puedan comprender la estructura de la página.',
          '**Texto alternativo:** Proporcionamos texto alternativo para las imágenes con contenido significativo, de modo que su información esté disponible para los usuarios de lectores de pantalla.',
          '**Contraste de color:** Buscamos un contraste de color suficiente entre el texto y su fondo para mejorar la legibilidad.',
          '**Navegación con teclado:** Los elementos interactivos están diseñados para poder alcanzarse y utilizarse con el teclado.',
          '**Diseño adaptable:** El sitio es adaptable y está diseñado para seguir siendo utilizable con el zoom del navegador y con lectores de pantalla en distintos dispositivos.',
          '**Contenido bilingüe:** Nuestro contenido está disponible en inglés y en español.',
        ],
      },
      {
        key: 'ongoing',
        heading: 'Esfuerzo Continuo',
        paragraphs: [
          'La accesibilidad es un esfuerzo continuo. Revisamos la accesibilidad de nuestro sitio web a medida que nuestro contenido evoluciona y trabajamos para mejorar la experiencia con el tiempo. Tenga en cuenta que parte del contenido de terceros, como los reproductores de video incrustados y nuestra plataforma de reservas en línea, puede no estar completamente bajo nuestro control, y no podemos garantizar su accesibilidad.',
        ],
      },
      {
        key: 'feedback',
        heading: 'Comentarios y Asistencia',
        paragraphs: [
          'Si tiene dificultades para acceder a cualquier parte de nuestro sitio web, o si necesita que la información de nuestro sitio se le proporcione en otro formato, por favor háganoslo saber. Contáctenos al [(239) 423-0272](tel:+12394230272) o envíe un email a [info@healingmindsp.com](mailto:info@healingmindsp.com), y trabajaremos con usted para proporcionarle la información que necesita y realizar los ajustes razonables.',
        ],
      },
      {
        key: 'auxiliary',
        heading: 'Ayudas Auxiliares y Asistencia de Idioma para la Atención',
        paragraphs: [
          'Más allá del sitio web, los pacientes pueden solicitar ayudas auxiliares y servicios de asistencia de idioma para su atención sin costo alguno. Si necesita estos servicios, por favor contacte nuestra oficina por teléfono o email para que podamos organizar el apoyo apropiado para su cita.',
        ],
      },
    ],
  },
};
