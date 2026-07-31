import type { BilingualPageContent } from '@/data/pageContent/types';

export const telehealthConsentContent: BilingualPageContent = {
  en: {
    title: 'Telehealth Informed Consent',
    sections: [
      { key: 'updated', paragraphs: ['Last updated: July 2026'] },
      {
        key: 'intro',
        paragraphs: [
          'This document explains how telehealth works at Healing Minds Psychiatry and describes its benefits, limitations, and risks so that you can make an informed decision about your care. Please read it carefully before your visit.',
        ],
      },
      {
        key: 'what-is',
        heading: 'What Telehealth Is at This Practice',
        paragraphs: [
          'Healing Minds Psychiatry is a telepsychiatry practice led by Dr. Melva Reve, a psychiatrist. Telehealth means that your psychiatric evaluation and follow-up appointments are conducted remotely through a secure, real-time video connection rather than a traditional in-person office visit. This allows you to receive care from a private location of your choosing.',
        ],
      },
      {
        key: 'legal-basis',
        heading: 'Legal Basis for Telehealth',
        paragraphs: [
          'Consent to receive care by telehealth is provided in accordance with Florida Statutes Section 456.47 and California Business and Professions Code Section 2290.5. Under these laws, a valid provider-patient relationship may be established and maintained through telehealth. Our practice is licensed to provide telepsychiatry in the states of Florida and California.',
        ],
      },
      {
        key: 'benefits',
        heading: 'Expected Benefits',
        bullets: [
          '**Access:** Reach a psychiatrist without the need to travel to an office.',
          '**Convenience:** Attend appointments from a private, comfortable setting that fits your schedule.',
          '**Continuity:** Maintain consistent follow-up care and medication management over time.',
          '**Care in your language:** Receive services in English or Spanish with a bilingual provider.',
        ],
      },
      {
        key: 'limitations',
        heading: 'Limitations and Risks',
        paragraphs: [
          'While telehealth is safe and effective for many people, it has limitations that you should understand:',
        ],
        bullets: [
          '**No complete physical examination:** A telehealth visit does not allow for a full, hands-on physical examination.',
          '**Technology failures:** Connections may fail or be interrupted, and technical problems can affect the timing or quality of a session.',
          '**Privacy and security risks:** In rare cases, electronic transmissions carry a risk to privacy or security despite the safeguards we use.',
          '**Appropriateness of care:** Telehealth may not be appropriate for every condition. Your provider may determine that in-person care or a higher level of care is needed and will help you arrange appropriate alternatives.',
        ],
      },
      {
        key: 'not-emergency',
        heading: 'Not for Emergencies',
        paragraphs: [
          'Telehealth is not an emergency service. If you or a loved one is experiencing a life-threatening crisis, call 911 or call or text the 988 Suicide and Crisis Lifeline immediately. Our Emergency and Crisis Policy applies to all telehealth care and explains additional resources available to you.',
        ],
      },
      {
        key: 'responsibilities',
        heading: 'Your Responsibilities',
        bullets: [
          '**Location:** You must be physically located in Florida or California at the time of your visit, and you agree to state your location at the start of each session.',
          '**Identity verification:** You agree to verify your identity as requested at the beginning of your appointment.',
          '**Private setting:** You are responsible for finding a private, quiet space where your session cannot be overheard.',
          '**Adequate connection:** You are responsible for having a device and an internet connection adequate for a video visit.',
        ],
      },
      {
        key: 'confidentiality',
        heading: 'Confidentiality',
        paragraphs: [
          'Your telehealth sessions receive the same HIPAA privacy protections as in-person care. Sessions are not recorded. We use secure technology and reasonable safeguards to protect the confidentiality of your information.',
        ],
      },
      {
        key: 'prescriptions',
        heading: 'Prescriptions',
        paragraphs: [
          'Prescriptions are issued only when clinically appropriate and only when permitted by applicable state and federal law. Attending a telehealth visit does not guarantee that any medication will be prescribed. All treatment decisions remain a matter of clinical judgment.',
        ],
      },
      {
        key: 'rights',
        heading: 'Your Rights',
        paragraphs: [
          'You may withdraw your consent to telehealth at any time and discuss alternatives with your provider. Withdrawing consent to telehealth does not affect your right to future care.',
        ],
      },
      {
        key: 'acknowledgment',
        heading: 'Acknowledgment',
        paragraphs: [
          'By scheduling and attending a telehealth visit with Healing Minds Psychiatry, you confirm that you have read and understood this consent. A formal consent is also completed as part of your intake paperwork.',
        ],
      },
      {
        key: 'contact',
        heading: 'Questions or Contact',
        paragraphs: [
          'If you have any questions about telehealth or this consent, please contact us at [(239) 423-0272](tel:+12394230272) or by email at [info@healingmindsp.com](mailto:info@healingmindsp.com). Our office is located at 4760 Tamiami Trl N # 25, Naples, FL 34103. Services are available to adults 18 and older.',
        ],
      },
    ],
  },
  es: {
    title: 'Consentimiento Informado de Telesalud',
    sections: [
      { key: 'updated', paragraphs: ['Última actualización: julio de 2026'] },
      {
        key: 'intro',
        paragraphs: [
          'Este documento explica cómo funciona la telesalud en Healing Minds Psychiatry y describe sus beneficios, limitaciones y riesgos para que usted pueda tomar una decisión informada sobre su atención. Por favor, léalo con atención antes de su consulta.',
        ],
      },
      {
        key: 'what-is',
        heading: 'Qué es la Telesalud en Esta Práctica',
        paragraphs: [
          'Healing Minds Psychiatry es una práctica de telepsiquiatría dirigida por la Dra. Melva Reve, psiquiatra. La telesalud significa que su evaluación psiquiátrica y sus citas de seguimiento se realizan de forma remota a través de una conexión de video segura y en tiempo real, en lugar de una visita tradicional en persona. Esto le permite recibir atención desde un lugar privado de su elección.',
        ],
      },
      {
        key: 'legal-basis',
        heading: 'Base Legal de la Telesalud',
        paragraphs: [
          'El consentimiento para recibir atención por telesalud se otorga de acuerdo con los Estatutos de Florida, Sección 456.47, y el Código de Negocios y Profesiones de California, Sección 2290.5. Conforme a estas leyes, se puede establecer y mantener una relación válida entre proveedor y paciente a través de la telesalud. Nuestra práctica cuenta con licencia para brindar telepsiquiatría en los estados de Florida y California.',
        ],
      },
      {
        key: 'benefits',
        heading: 'Beneficios Esperados',
        bullets: [
          '**Acceso:** Comuníquese con una psiquiatra sin necesidad de trasladarse a una oficina.',
          '**Comodidad:** Asista a sus citas desde un entorno privado y cómodo que se ajuste a su horario.',
          '**Continuidad:** Mantenga una atención de seguimiento constante y un manejo de medicamentos a lo largo del tiempo.',
          '**Atención en su idioma:** Reciba servicios en inglés o español con una proveedora bilingüe.',
        ],
      },
      {
        key: 'limitations',
        heading: 'Limitaciones y Riesgos',
        paragraphs: [
          'Si bien la telesalud es segura y eficaz para muchas personas, tiene limitaciones que usted debe comprender:',
        ],
        bullets: [
          '**Sin examen físico completo:** Una consulta por telesalud no permite realizar un examen físico completo ni presencial.',
          '**Fallas tecnológicas:** Las conexiones pueden fallar o interrumpirse, y los problemas técnicos pueden afectar el momento o la calidad de una sesión.',
          '**Riesgos de privacidad y seguridad:** En casos poco frecuentes, las transmisiones electrónicas conllevan un riesgo para la privacidad o la seguridad, a pesar de las medidas de protección que utilizamos.',
          '**Idoneidad de la atención:** La telesalud puede no ser apropiada para todas las condiciones. Su proveedora puede determinar que se necesita atención en persona o un nivel de atención más alto, y le ayudará a coordinar las alternativas apropiadas.',
        ],
      },
      {
        key: 'not-emergency',
        heading: 'No es para Emergencias',
        paragraphs: [
          'La telesalud no es un servicio de emergencia. Si usted o un ser querido está experimentando una crisis que ponga en riesgo la vida, llame al 911 o llame o envíe un mensaje de texto a la Línea de Prevención del Suicidio y Crisis 988 de inmediato. Nuestra Política de Emergencia y Crisis se aplica a toda la atención por telesalud y explica los recursos adicionales disponibles para usted.',
        ],
      },
      {
        key: 'responsibilities',
        heading: 'Sus Responsabilidades',
        bullets: [
          '**Ubicación:** Usted debe encontrarse físicamente en Florida o California al momento de su consulta, y acepta indicar su ubicación al inicio de cada sesión.',
          '**Verificación de identidad:** Usted acepta verificar su identidad según se le solicite al comienzo de su cita.',
          '**Entorno privado:** Usted es responsable de encontrar un espacio privado y tranquilo donde su sesión no pueda ser escuchada por otras personas.',
          '**Conexión adecuada:** Usted es responsable de contar con un dispositivo y una conexión a internet adecuados para una videoconsulta.',
        ],
      },
      {
        key: 'confidentiality',
        heading: 'Confidencialidad',
        paragraphs: [
          'Sus sesiones de telesalud reciben las mismas protecciones de privacidad de HIPAA que la atención en persona. Las sesiones no se graban. Utilizamos tecnología segura y medidas de protección razonables para resguardar la confidencialidad de su información.',
        ],
      },
      {
        key: 'prescriptions',
        heading: 'Recetas Médicas',
        paragraphs: [
          'Las recetas se emiten únicamente cuando son clínicamente apropiadas y solo cuando lo permiten las leyes estatales y federales aplicables. Asistir a una consulta por telesalud no garantiza que se recete ningún medicamento. Todas las decisiones de tratamiento son una cuestión de criterio clínico.',
        ],
      },
      {
        key: 'rights',
        heading: 'Sus Derechos',
        paragraphs: [
          'Usted puede retirar su consentimiento a la telesalud en cualquier momento y hablar sobre las alternativas con su proveedora. Retirar el consentimiento a la telesalud no afecta su derecho a recibir atención en el futuro.',
        ],
      },
      {
        key: 'acknowledgment',
        heading: 'Reconocimiento',
        paragraphs: [
          'Al programar y asistir a una consulta por telesalud con Healing Minds Psychiatry, usted confirma que ha leído y comprendido este consentimiento. Un consentimiento formal también se completa como parte de su documentación de admisión.',
        ],
      },
      {
        key: 'contact',
        heading: 'Preguntas o Contacto',
        paragraphs: [
          'Si tiene alguna pregunta sobre la telesalud o este consentimiento, comuníquese con nosotros al [(239) 423-0272](tel:+12394230272) o por correo electrónico a [info@healingmindsp.com](mailto:info@healingmindsp.com). Nuestra oficina está ubicada en 4760 Tamiami Trl N # 25, Naples, FL 34103. Los servicios están disponibles para adultos de 18 años en adelante.',
        ],
      },
    ],
  },
};
