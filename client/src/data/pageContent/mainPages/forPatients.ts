import type { BilingualPageContent } from '../types';

// Inline copy for the "For Patients" page (EN + ES).
// EN: client/src/pages/ForPatients.tsx (bilingual via language toggle)
// ES: client/src/pages/ParaPacientesEspanol.tsx (Spanish-only route)
// Both components render from this single module.
//
// Section titles that interleave an italic <span> (bespoke split headings)
// keep their JSX in the component; their full plain text is mirrored here as
// section `heading` (or the top-level `title` for the H1) so the server can
// serialize the same words.
//
// Step/card/FAQ groups store their titles/questions in `bullets` and the
// matching descriptions/answers in `paragraphs` (paired by index); the
// component zips them back into the objects it maps over.
//
// The shared <ForPatients /> section component (insurance, what-to-expect,
// policy cards) is used by multiple pages (Home + For Patients) and is
// intentionally NOT extracted here.

export const forPatientsContent: BilingualPageContent = {
  en: {
    title: `For Patients — Everything You Need to Know`,
    sections: [
      {
        key: 'eyebrow',
        paragraphs: [`Patient Resources · Naples, FL`],
      },
      {
        key: 'heroDescription',
        paragraphs: [
          `From your first appointment to ongoing care — find everything you need as a new or returning patient at Healing Minds Psychiatry in Naples, FL.`,
        ],
      },
      {
        key: 'heroActions',
        bullets: [`Request an Appointment`, `(239) 423-0272`],
      },
      {
        key: 'checklistHeading',
        heading: `First-Visit Checklist`,
      },
      {
        key: 'checklistIntro',
        paragraphs: [
          `Bring these items to your initial appointment to make your visit as smooth and productive as possible.`,
        ],
      },
      {
        key: 'checklistItems',
        bullets: [
          `Photo ID (driver's license or passport)`,
          `Insurance card(s) — front and back`,
          `List of current medications (name, dose, frequency)`,
          `Names of any previous psychiatrists or therapists`,
          `Medical history summary (relevant diagnoses, hospitalizations)`,
          `List of current concerns and symptoms you'd like to discuss`,
          `Emergency contact information`,
          `Questions about insurance, self-pay fees or current billing terms`,
        ],
      },
      {
        key: 'telehealthHeading',
        heading: `Telehealth Instructions`,
      },
      {
        key: 'telehealthIntro',
        paragraphs: [
          `Adults in Florida may request a video visit. The office confirms modality, location, licensing, clinical suitability and availability case by case. Privacy practices are described in the practice Privacy Notice.`,
        ],
      },
      {
        key: 'telehealthSteps',
        bullets: [
          `Request telehealth`,
          `Receive your link`,
          `Test your setup`,
          `Join on time`,
          `After your visit`,
        ],
        paragraphs: [
          `Request telehealth when booking online or by calling (239) 423-0272. The office confirms modality and eligibility case by case.`,
          `If a video visit is confirmed, the office will provide access instructions and identify the current platform before the appointment.`,
          `Use a device with a working camera and microphone. A quiet, private space works best. Chrome or Safari browsers recommended.`,
          `Follow the access instructions provided by the office and contact the office if you have trouble joining.`,
          `If a prescription is issued, the office will explain how it will be sent. The office will also confirm any follow-up instructions and communication channel.`,
        ],
      },
      {
        key: 'verificationHeading',
        heading: `Insurance and Billing Check`,
      },
      {
        key: 'verificationIntro',
        paragraphs: [
          `Participation and benefits vary by plan and service. Confirm details with both our office and your insurer before booking.`,
        ],
      },
      {
        key: 'verificationCards',
        bullets: [
          `Share Your Plan Details`,
          `Confirm Participation`,
          `Verify Your Benefits`,
          `Review Billing Options`,
        ],
        paragraphs: [
          `Call the office before booking and have your plan details available.`,
          `Ask whether the practice currently participates with your specific plan and service.`,
          `Confirm mental-health, telehealth, deductible and cost-sharing details directly with your insurer.`,
          `Ask the office for current written self-pay and billing terms. Do not assume a payment plan or financial-assistance program is available. A Good Faith Estimate is provided when required by applicable law.`,
        ],
      },
      {
        key: 'policyLinks',
        bullets: [
          `Billing Policy`,
          `Cancellation Policy`,
          `Patient Rights`,
          `No Surprises Act`,
        ],
      },
      {
        key: 'faqHeading',
        heading: `Patient FAQ`,
      },
      {
        key: 'faqIntro',
        paragraphs: [
          `Answers to the most common questions from new and returning patients.`,
        ],
      },
      {
        key: 'faqs',
        bullets: [
          `How do I prepare for my first psychiatric appointment?`,
          `How long will I wait before being seen as a new patient?`,
          `Can I transfer care from another psychiatrist?`,
          `What happens if I need to cancel or reschedule?`,
          `Will I be prescribed medication at my first visit?`,
          `Is my information kept private and confidential?`,
          `Can I bring a family member or support person to my appointment?`,
          `What if I have a question between appointments?`,
        ],
        paragraphs: [
          `Bring your insurance card, photo ID, a list of current medications, and a summary of the symptoms or concerns you want to discuss. Arriving 5–10 minutes early helps with intake paperwork. For telehealth, test your camera and microphone the day before.`,
          `Appointment availability varies. Call (239) 423-0272 or request a time online, and the office will confirm the next available appointment.`,
          `Yes. We welcome patients transferring from another provider. Please bring your prior records, a list of current medications, and any relevant diagnostic history to your first appointment. We can also request records on your behalf with a signed release.`,
          `Contact the office promptly if you need to cancel or reschedule. The current written Cancellation Policy states the notice period, any fee and any applicable exceptions; ask the office to confirm the terms for your appointment.`,
          `Not necessarily. The first appointment is an evaluation. Treatment options may or may not include medication, and any prescription or dose depends on clinical judgment.`,
          `Health information is handled under applicable medical privacy laws and the practice privacy notice. Disclosure may occur with authorization or when otherwise permitted or required by law.`,
          `Yes, with your consent. A family member or support person may be present during part or all of your appointment. Please let the front desk know in advance, especially for telehealth visits where space logistics may differ.`,
          `For non-urgent questions, use the patient portal or other contact method confirmed by the office. For medication concerns that cannot wait, call the office at (239) 423-0272. In a psychiatric emergency, call 911 or 988 (Suicide & Crisis Lifeline).`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `Ready to Get Started?`,
      },
      {
        key: 'ctaBody',
        paragraphs: [
          `Request an appointment in Naples or ask whether telehealth is appropriate for your visit. The office will confirm current availability.`,
        ],
      },
      {
        key: 'ctaButtons',
        bullets: [`Request an Appointment`, `Explore Our Services`],
      },
    ],
  },
  es: {
    title: `Para Pacientes — Todo lo que Necesita Saber`,
    sections: [
      {
        key: 'eyebrow',
        paragraphs: [`Recursos para Pacientes · Naples, FL`],
      },
      {
        key: 'heroDescription',
        paragraphs: [
          `Desde su primera cita hasta la atención continua — encuentre todo lo que necesita como paciente nuevo o existente en Healing Minds Psychiatry en Naples, FL.`,
        ],
      },
      {
        key: 'heroActions',
        bullets: [`Solicitar Cita`, `(239) 423-0272`],
      },
      {
        key: 'checklistHeading',
        heading: `Lista para la Primera Visita`,
      },
      {
        key: 'checklistIntro',
        paragraphs: [
          `Traiga estos elementos a su cita inicial para que su visita sea lo más fluida y productiva posible.`,
        ],
      },
      {
        key: 'checklistItems',
        bullets: [
          `Identificación con foto (licencia de conducir o pasaporte)`,
          `Tarjeta(s) de seguro — frente y reverso`,
          `Lista de medicamentos actuales (nombre, dosis, frecuencia)`,
          `Nombres de psiquiatras o terapeutas anteriores`,
          `Resumen del historial médico (diagnósticos relevantes, hospitalizaciones)`,
          `Lista de preocupaciones y síntomas actuales que desea discutir`,
          `Información de contacto de emergencia`,
          `Preguntas sobre seguro, tarifas de pago privado o términos vigentes de facturación`,
        ],
      },
      {
        key: 'telehealthHeading',
        heading: `Instrucciones de Telesalud`,
      },
      {
        key: 'telehealthIntro',
        paragraphs: [
          `Los adultos en Florida pueden solicitar una visita por video. La oficina confirma modalidad, ubicación, licencias, adecuación clínica y disponibilidad caso por caso. Las prácticas de privacidad se describen en el Aviso de Privacidad de la práctica.`,
        ],
      },
      {
        key: 'telehealthSteps',
        bullets: [
          `Solicite telesalud`,
          `Reciba su enlace`,
          `Pruebe su configuración`,
          `Únase a tiempo`,
          `Después de su visita`,
        ],
        paragraphs: [
          `Solicite telesalud al reservar en línea o al llamar al (239) 423-0272. La oficina confirma la modalidad y elegibilidad caso por caso.`,
          `Si se confirma una visita por video, la oficina proporcionará instrucciones de acceso e identificará la plataforma vigente antes de la cita.`,
          `Use un dispositivo con cámara y micrófono funcionando. Un espacio tranquilo y privado es lo mejor. Se recomiendan los navegadores Chrome o Safari.`,
          `Siga las instrucciones de acceso proporcionadas por la oficina y contacte la oficina si tiene problemas para conectarse.`,
          `Si se emite una receta, la oficina explicará cómo se enviará. La oficina también confirmará las instrucciones de seguimiento y el canal de comunicación.`,
        ],
      },
      {
        key: 'verificationHeading',
        heading: `Revisión de Seguro y Facturación`,
      },
      {
        key: 'verificationIntro',
        paragraphs: [
          `La participación y los beneficios varían según el plan y el servicio. Confirme los detalles con nuestra oficina y su aseguradora antes de reservar.`,
        ],
      },
      {
        key: 'verificationCards',
        bullets: [
          `Comparta los Datos de su Plan`,
          `Confirme la Participación`,
          `Verifique sus Beneficios`,
          `Revise Opciones de Facturación`,
        ],
        paragraphs: [
          `Llame a la oficina antes de reservar y tenga disponibles los datos de su plan.`,
          `Pregunte si la práctica participa actualmente con su plan y servicio específicos.`,
          `Confirme directamente con su aseguradora los beneficios de salud mental y telesalud, el deducible y los costos compartidos.`,
          `Solicite a la oficina los términos vigentes de pago privado y facturación por escrito. No suponga que existe un plan de pago o un programa de ayuda financiera. Se proporciona un Estimado de Buena Fe cuando lo exige la ley aplicable.`,
        ],
      },
      {
        key: 'policyLinks',
        bullets: [
          `Política de Facturación`,
          `Política de Cancelación`,
          `Derechos del Paciente`,
          `Ley Sin Sorpresas`,
        ],
      },
      {
        key: 'faqHeading',
        heading: `Preguntas Frecuentes`,
      },
      {
        key: 'faqIntro',
        paragraphs: [
          `Respuestas a las preguntas más comunes de pacientes nuevos y existentes.`,
        ],
      },
      {
        key: 'faqs',
        bullets: [
          `¿Cómo me preparo para mi primera cita psiquiátrica?`,
          `¿Cuánto tiempo esperaré para ser atendido como nuevo paciente?`,
          `¿Puedo transferir mi atención desde otro psiquiatra?`,
          `¿Qué sucede si necesito cancelar o reprogramar?`,
          `¿Me recetarán medicamentos en mi primera visita?`,
          `¿Mi información se mantiene privada y confidencial?`,
          `¿Puedo traer un familiar o persona de apoyo a mi cita?`,
          `¿Qué hago si tengo una pregunta entre citas?`,
        ],
        paragraphs: [
          `Traiga su tarjeta de seguro, identificación con foto, una lista de medicamentos actuales y un resumen de los síntomas o preocupaciones que desea discutir. Llegar 5–10 minutos antes ayuda con los trámites de ingreso. Para telesalud, pruebe su cámara y micrófono el día anterior.`,
          `La disponibilidad de citas varía. Llame al (239) 423-0272 o solicite un horario en línea, y la oficina confirmará la próxima cita disponible.`,
          `Sí. Damos la bienvenida a pacientes que se transfieren de otro proveedor. Traiga sus registros anteriores, una lista de medicamentos actuales y cualquier historial diagnóstico relevante a su primera cita. También podemos solicitar registros en su nombre con una autorización firmada.`,
          `Contacte la oficina lo antes posible si necesita cancelar o reprogramar. La Política de Cancelación escrita vigente indica el plazo de aviso, cualquier cargo y las excepciones aplicables; pida a la oficina que confirme los términos para su cita.`,
          `No necesariamente. La primera cita es una evaluación. Las opciones pueden incluir o no medicamentos, y toda receta o dosis depende del criterio clínico.`,
          `La información de salud se maneja conforme a las leyes aplicables de privacidad médica y al aviso de privacidad de la práctica. Puede divulgarse con autorización o cuando la ley lo permita o exija.`,
          `Sí, con su consentimiento. Un familiar o persona de apoyo puede estar presente durante parte o toda su cita. Por favor informe a la recepción con anticipación, especialmente para visitas de telesalud.`,
          `Para preguntas no urgentes, use el portal de pacientes u otro método de contacto confirmado por la oficina. Para inquietudes sobre medicamentos que no pueden esperar, llame a la oficina al (239) 423-0272. En una emergencia psiquiátrica, llame al 911 o al 988.`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `¿Listo para Comenzar?`,
      },
      {
        key: 'ctaBody',
        paragraphs: [
          `Solicite una cita en Naples o pregunte si la telesalud es apropiada para su visita. La oficina confirmará la disponibilidad actual.`,
        ],
      },
      {
        key: 'ctaButtons',
        bullets: [`Solicitar una Cita`, `Explorar Nuestros Servicios`],
      },
    ],
  },
};
