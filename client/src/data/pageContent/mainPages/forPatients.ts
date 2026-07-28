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
        bullets: [`Book an Appointment`, `(239) 423-0272`],
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
          `Payment method for copay or self-pay balance`,
        ],
      },
      {
        key: 'telehealthHeading',
        heading: `Telehealth Instructions`,
      },
      {
        key: 'telehealthIntro',
        paragraphs: [
          `Secure video visits are available throughout Florida. Here's how to prepare for your online appointment.`,
        ],
      },
      {
        key: 'telehealthSteps',
        bullets: [
          `Book a telehealth slot`,
          `Receive your link`,
          `Test your setup`,
          `Join on time`,
          `After your visit`,
        ],
        paragraphs: [
          `Select "telehealth" when booking online or mention it when calling (239) 423-0272.`,
          `A secure video link will be emailed to you 24 hours before your appointment. Check your spam folder.`,
          `Use a device with a working camera and microphone. A quiet, private space works best. Chrome or Safari browsers recommended.`,
          `Click the link 5 minutes early. You may be placed in a virtual waiting room until Dr. Reve is ready.`,
          `Any prescriptions are sent electronically to your pharmacy. Follow-up instructions will be provided by secure message.`,
        ],
      },
      {
        key: 'verificationHeading',
        heading: `Insurance Verification Process`,
      },
      {
        key: 'verificationIntro',
        paragraphs: [
          `We verify your insurance benefits before your first visit so you know exactly what to expect.`,
        ],
      },
      {
        key: 'verificationCards',
        bullets: [
          `Book Your Appointment`,
          `We Contact Your Insurer`,
          `You Receive a Summary`,
          `No Billing Surprises`,
        ],
        paragraphs: [
          `Schedule online or call. Provide your insurance ID and group number when booking.`,
          `Our team calls your insurance company to verify coverage, deductibles, and copay amounts for mental health services.`,
          `Before your visit, we share what your insurance will cover and your estimated out-of-pocket responsibility.`,
          `Arrive knowing your costs. If you're self-pay, a Good Faith Estimate is provided per federal requirements.`,
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
          `New patient appointments are typically available within 1–2 weeks of scheduling. Telehealth slots often have greater flexibility. Call (239) 423-0272 or book online to check current availability.`,
          `Yes. We welcome patients transferring from another provider. Please bring your prior records, a list of current medications, and any relevant diagnostic history to your first appointment. We can also request records on your behalf with a signed release.`,
          `Please provide at least 24 business hours' notice to avoid a $50 late cancellation or no-show fee. We understand emergencies happen — genuine medical emergencies are always excepted. See our Cancellation Policy for full details.`,
          `Not always. The first appointment is an evaluation. Dr. Reve will discuss all treatment options — which may or may not include medication — and will collaborate with you on the best approach for your specific situation.`,
          `Absolutely. All patient information is protected under HIPAA and Florida's enhanced mental health privacy statutes. Your records are never shared without your written consent, except in specific legally defined circumstances such as imminent safety risks.`,
          `Yes, with your consent. A family member or support person may be present during part or all of your appointment. Please let the front desk know in advance, especially for telehealth visits where space logistics may differ.`,
          `Non-urgent questions can be sent through the secure patient portal. For medication concerns that cannot wait, please call the office at (239) 423-0272. In a psychiatric emergency, please call 911 or 988 (Suicide & Crisis Lifeline).`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `Ready to Get Started?`,
      },
      {
        key: 'ctaBody',
        paragraphs: [
          `New patient appointments typically available within 1–2 weeks. In-person in Naples or telehealth throughout Florida. Dr. Reve is accepting new patients now.`,
        ],
      },
      {
        key: 'ctaButtons',
        bullets: [`Book Your Appointment`, `Explore Our Services`],
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
        bullets: [`Reservar Cita`, `(239) 423-0272`],
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
          `Método de pago para copago o saldo de pago personal`,
        ],
      },
      {
        key: 'telehealthHeading',
        heading: `Instrucciones de Telesalud`,
      },
      {
        key: 'telehealthIntro',
        paragraphs: [
          `Las visitas por video seguro están disponibles en toda Florida. Así es como prepararse para su cita en línea.`,
        ],
      },
      {
        key: 'telehealthSteps',
        bullets: [
          `Reserve un horario de telesalud`,
          `Reciba su enlace`,
          `Pruebe su configuración`,
          `Únase a tiempo`,
          `Después de su visita`,
        ],
        paragraphs: [
          `Seleccione "telesalud" al reservar en línea o menciónelo al llamar al (239) 423-0272.`,
          `Un enlace de video seguro será enviado por correo electrónico 24 horas antes de su cita. Revise su carpeta de spam.`,
          `Use un dispositivo con cámara y micrófono funcionando. Un espacio tranquilo y privado es lo mejor. Se recomiendan los navegadores Chrome o Safari.`,
          `Haga clic en el enlace 5 minutos antes. Puede ser colocado en una sala de espera virtual hasta que la Dra. Reve esté lista.`,
          `Las recetas se envían electrónicamente a su farmacia. Las instrucciones de seguimiento se proporcionarán por mensaje seguro.`,
        ],
      },
      {
        key: 'verificationHeading',
        heading: `Proceso de Verificación de Seguro`,
      },
      {
        key: 'verificationIntro',
        paragraphs: [
          `Verificamos sus beneficios de seguro antes de su primera visita para que sepa exactamente qué esperar.`,
        ],
      },
      {
        key: 'verificationCards',
        bullets: [
          `Reserve su Cita`,
          `Contactamos a su Asegurador`,
          `Usted Recibe un Resumen`,
          `Sin Sorpresas de Facturación`,
        ],
        paragraphs: [
          `Programe en línea o llame. Proporcione su ID de seguro y número de grupo al reservar.`,
          `Nuestro equipo llama a su compañía de seguros para verificar cobertura, deducibles y montos de copago para servicios de salud mental.`,
          `Antes de su visita, compartimos lo que cubrirá su seguro y su responsabilidad estimada de gastos de bolsillo.`,
          `Llegue sabiendo sus costos. Si es pago personal, se proporciona un Estimado de Buena Fe según los requisitos federales.`,
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
          `Las citas para nuevos pacientes generalmente están disponibles dentro de 1–2 semanas después de programar. Los horarios de telesalud suelen tener mayor flexibilidad. Llame al (239) 423-0272 o reserve en línea para verificar la disponibilidad actual.`,
          `Sí. Damos la bienvenida a pacientes que se transfieren de otro proveedor. Traiga sus registros anteriores, una lista de medicamentos actuales y cualquier historial diagnóstico relevante a su primera cita. También podemos solicitar registros en su nombre con una autorización firmada.`,
          `Por favor proporcione al menos 24 horas hábiles de aviso para evitar un cargo de $50 por cancelación tardía o ausencia. Entendemos que ocurren emergencias — las emergencias médicas genuinas siempre están exceptuadas.`,
          `No necesariamente. La primera cita es una evaluación. La Dra. Reve discutirá todas las opciones de tratamiento — que pueden o no incluir medicamentos — y colaborará con usted en el mejor enfoque para su situación específica.`,
          `Absolutamente. Toda la información del paciente está protegida bajo HIPAA y los estatutos mejorados de privacidad de salud mental de Florida. Sus registros nunca se comparten sin su consentimiento escrito, excepto en circunstancias legales específicamente definidas.`,
          `Sí, con su consentimiento. Un familiar o persona de apoyo puede estar presente durante parte o toda su cita. Por favor informe a la recepción con anticipación, especialmente para visitas de telesalud.`,
          `Las preguntas no urgentes se pueden enviar a través del portal de pacientes seguro. Para preocupaciones sobre medicamentos que no pueden esperar, llame a la oficina al (239) 423-0272. En una emergencia psiquiátrica, llame al 911 o al 988.`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `¿Listo para Comenzar?`,
      },
      {
        key: 'ctaBody',
        paragraphs: [
          `Citas para nuevos pacientes generalmente disponibles en 1–2 semanas. En persona en Naples o telesalud en toda Florida. La Dra. Reve está aceptando nuevos pacientes ahora.`,
        ],
      },
      {
        key: 'ctaButtons',
        bullets: [`Reservar su Cita`, `Explorar Nuestros Servicios`],
      },
    ],
  },
};
