import type { BilingualPageContent } from '../types';

// Services index page (EN: client/src/pages/Services.tsx,
// ES: client/src/pages/ServiciosEspanol.tsx). Both components render from this
// single module. Decorated headings use **...** for the inline italic accent
// span (rendered by RichText with the page's span className).

export const servicesIndexContent: BilingualPageContent = {
  en: {
    title: `**Psychiatric** Services in Naples, FL`,
    sections: [
      {
        key: 'eyebrow',
        paragraphs: [`Naples, FL · Southwest Florida`],
      },
      {
        key: 'heroDescription',
        paragraphs: [
          `Dr. Melva Reve offers psychiatric care for anxiety, depression, ADHD, PTSD, and more at the Naples office. Patients may request telehealth; the office confirms availability, clinical suitability, physical location and applicable licensing case by case.`,
        ],
      },
      {
        key: 'heroBookCta',
        paragraphs: [`Book an Appointment`],
      },
      {
        key: 'quickInfo',
        bullets: [
          `Naples, FL 34103`,
          `Mon–Fri, flexible hours`,
          `In-person care; telehealth by request`,
          `Bilingual EN/ES`,
        ],
      },
      {
        key: 'approachHeading',
        heading: `Our **Treatment** Approach`,
        paragraphs: [
          `What makes psychiatric care at Healing Minds different from a standard clinic visit.`,
        ],
      },
      {
        key: 'approach-1',
        level: 3,
        heading: `Evidence-Based Treatment`,
        paragraphs: [
          `Every treatment plan is grounded in the latest psychiatric research — combining medication management with therapeutic approaches proven to work for your specific condition.`,
        ],
      },
      {
        key: 'approach-2',
        level: 3,
        heading: `Personalized Care Plans`,
        paragraphs: [
          `No two patients are the same. Dr. Reve develops individualized treatment strategies tailored to your unique history, lifestyle, and goals — not a one-size-fits-all approach.`,
        ],
      },
      {
        key: 'approach-3',
        level: 3,
        heading: `Bilingual & Culturally Sensitive`,
        paragraphs: [
          `Fully bilingual care in English and Spanish, with cultural competency that reflects the diverse communities of Naples and Southwest Florida.`,
        ],
      },
      {
        key: 'approach-4',
        level: 3,
        heading: `In-Person Care and Telehealth Requests`,
        paragraphs: [
          `Visit the Naples office or request a secure video appointment. The office confirms availability, clinical suitability, physical location and applicable licensing case by case.`,
        ],
      },
      {
        key: 'insuranceHeading',
        heading: `Insurance & **Getting Started**`,
        paragraphs: [
          `Participation and benefits vary by plan and service. Confirm current participation with our office and verify your specific benefits, including telehealth, with your insurer before booking.`,
        ],
      },
      {
        key: 'insuranceBullets',
        bullets: [
          `Participation varies by plan and service`,
          `Confirm current participation with the office`,
          `Verify telehealth benefits with your insurer`,
          `Good Faith Estimates provided for self-pay`,
          `Financial options may be evaluated case by case`,
        ],
      },
      {
        key: 'insuranceCta',
        paragraphs: [`View Full Billing Policy`],
      },
      {
        key: 'expectHeading',
        heading: `What to **Expect**`,
      },
      {
        key: 'expect-1',
        level: 3,
        heading: `Book Your Appointment`,
        paragraphs: [
          `Schedule online or call (239) 423-0272. Appointment availability varies; the office will confirm the next available time.`,
        ],
      },
      {
        key: 'expect-2',
        level: 3,
        heading: `Initial Evaluation`,
        paragraphs: [
          `A comprehensive assessment of your mental health history, current symptoms, medications, and treatment goals. The office confirms appointment length when scheduling.`,
        ],
      },
      {
        key: 'expect-3',
        level: 3,
        heading: `Personalized Treatment Plan`,
        paragraphs: [
          `Dr. Reve develops a tailored plan that may include medication management, therapy referrals, or both.`,
        ],
      },
      {
        key: 'expect-4',
        level: 3,
        heading: `Follow-Up When Clinically Appropriate`,
        paragraphs: [
          `If follow-up is recommended, the office confirms availability, modality and appointment length when scheduling.`,
        ],
      },
      {
        key: 'expectCta',
        paragraphs: [`Patient Resources & Info`],
      },
      {
        key: 'faqHeading',
        heading: `Frequently Asked **Questions**`,
        paragraphs: [
          `Common questions about psychiatric services at Healing Minds in Naples, FL.`,
        ],
      },
      {
        key: 'faq-1',
        level: 3,
        heading: `What psychiatric conditions do you treat at Healing Minds?`,
        paragraphs: [
          `Dr. Melva Reve evaluates anxiety disorders, depression, ADHD in adults 18 and older, PTSD and bipolar disorder, and provides medication management. Treatment planning follows the individual clinical assessment.`,
        ],
      },
      {
        key: 'faq-2',
        level: 3,
        heading: `Do you accept insurance for psychiatric services?`,
        paragraphs: [
          `Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your mental-health, telehealth and cost-sharing benefits directly with your insurer. Self-pay or financial options may be evaluated case by case.`,
        ],
      },
      {
        key: 'faq-3',
        level: 3,
        heading: `How long does a first psychiatric appointment take?`,
        paragraphs: [
          `The initial consultation covers your mental health history, current symptoms, medications, and treatment goals. The office will confirm the appointment length when you schedule.`,
        ],
      },
      {
        key: 'faq-4',
        level: 3,
        heading: `Is telehealth available for psychiatric care?`,
        paragraphs: [
          `You may request telehealth through a secure video platform. The office confirms availability, clinical suitability, patient location and applicable licensing requirements case by case.`,
        ],
      },
      {
        key: 'faq-5',
        level: 3,
        heading: `Do you offer bilingual psychiatric services in Spanish?`,
        paragraphs: [
          `Yes. Dr. Melva Reve is fully bilingual in English and Spanish, providing culturally sensitive psychiatric care to Naples and Southwest Florida's Hispanic and Latin communities.`,
        ],
      },
      {
        key: 'faq-6',
        level: 3,
        heading: `How soon can I get an appointment?`,
        paragraphs: [
          `Appointment availability varies. You can request a time online through our scheduling system or call (239) 423-0272, and the office will confirm the next available appointment.`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `Serving Naples and **Southwest Florida**`,
        paragraphs: [
          `Healing Minds Psychiatry has one physical office in Naples and serves adults from surrounding communities. Patients may request telehealth; the office confirms clinical suitability, physical location, licensing and availability case by case.`,
        ],
      },
      {
        key: 'cities',
        bullets: [`Naples`, `Bonita Springs`, `Marco Island`, `Estero`, `Fort Myers`],
      },
      {
        key: 'ctaBook',
        paragraphs: [`Book Your Appointment`],
      },
      {
        key: 'ctaLocation',
        paragraphs: [`Our Naples Location`],
      },
    ],
  },
  es: {
    title: `**Servicios** Psiquiátricos en Naples, FL`,
    sections: [
      {
        key: 'eyebrow',
        paragraphs: [`Naples, FL · Suroeste de Florida`],
      },
      {
        key: 'heroDescription',
        paragraphs: [
          `La Dra. Melva Reve ofrece atención psiquiátrica para ansiedad, depresión, TDAH, TEPT y más en la oficina de Naples. Los pacientes pueden solicitar telesalud; la oficina confirma disponibilidad, adecuación clínica, ubicación física y licencias aplicables caso por caso.`,
        ],
      },
      {
        key: 'heroBookCta',
        paragraphs: [`Reservar una Cita`],
      },
      {
        key: 'quickInfo',
        bullets: [
          `Naples, FL 34103`,
          `Lun–Vie, disponibilidad confirmada por la oficina`,
          `Atención presencial; telesalud por solicitud`,
          `Bilingüe EN/ES`,
        ],
      },
      {
        key: 'approachHeading',
        heading: `Nuestro **Enfoque** de Tratamiento`,
        paragraphs: [
          `Lo que hace diferente la atención psiquiátrica en Healing Minds de una visita clínica estándar.`,
        ],
      },
      {
        key: 'approach-1',
        level: 3,
        heading: `Tratamiento Basado en Evidencia`,
        paragraphs: [
          `Cada plan de tratamiento está fundamentado en la investigación psiquiátrica más reciente, combinando manejo de medicamentos con enfoques terapéuticos comprobados para su condición específica.`,
        ],
      },
      {
        key: 'approach-2',
        level: 3,
        heading: `Planes de Atención Personalizados`,
        paragraphs: [
          `No hay dos pacientes iguales. La Dra. Reve desarrolla estrategias de tratamiento individualizadas adaptadas a su historial único, estilo de vida y objetivos — no un enfoque genérico.`,
        ],
      },
      {
        key: 'approach-3',
        level: 3,
        heading: `Bilingüe y Culturalmente Sensible`,
        paragraphs: [
          `Atención completamente bilingüe en inglés y español, con competencia cultural que refleja las diversas comunidades de Naples y el suroeste de Florida.`,
        ],
      },
      {
        key: 'approach-4',
        level: 3,
        heading: `Atención Presencial y Solicitudes de Telesalud`,
        paragraphs: [
          `Puede solicitar una cita presencial en Naples o por video seguro. La oficina confirma modalidad, ubicación, licencias, adecuación clínica y disponibilidad caso por caso.`,
        ],
      },
      {
        key: 'insuranceHeading',
        heading: `Seguro y **Cómo Comenzar**`,
        paragraphs: [
          `La participación y los beneficios varían según el plan y el servicio. Confirme la participación vigente con nuestra oficina y verifique con su aseguradora sus beneficios específicos, incluida la telesalud, antes de reservar.`,
        ],
      },
      {
        key: 'insuranceBullets',
        bullets: [
          `La participación varía según el plan y el servicio`,
          `Confirme la participación vigente con la oficina`,
          `Verifique los beneficios de telesalud con su aseguradora`,
          `Estimados de buena fe para pago personal`,
          `Las opciones financieras pueden evaluarse caso por caso`,
        ],
      },
      {
        key: 'insuranceCta',
        paragraphs: [`Ver Política de Facturación`],
      },
      {
        key: 'expectHeading',
        heading: `Qué **Esperar**`,
      },
      {
        key: 'expect-1',
        level: 3,
        heading: `Reservar su Cita`,
        paragraphs: [
          `Programe en línea o llame al (239) 423-0272. La disponibilidad varía; la oficina confirmará el próximo horario disponible.`,
        ],
      },
      {
        key: 'expect-2',
        level: 3,
        heading: `Evaluación Inicial`,
        paragraphs: [
          `Una evaluación integral de su historial de salud mental, síntomas actuales, medicamentos y objetivos de tratamiento. La oficina confirma la duración al programar.`,
        ],
      },
      {
        key: 'expect-3',
        level: 3,
        heading: `Plan de Tratamiento Personalizado`,
        paragraphs: [
          `La Dra. Reve desarrolla un plan personalizado que puede incluir manejo de medicamentos, derivaciones a terapia, o ambos.`,
        ],
      },
      {
        key: 'expect-4',
        level: 3,
        heading: `Seguimiento Cuando Sea Clínicamente Apropiado`,
        paragraphs: [
          `Si se recomienda seguimiento, la oficina confirma disponibilidad, modalidad y duración al programar.`,
        ],
      },
      {
        key: 'expectCta',
        paragraphs: [`Recursos e Información para Pacientes`],
      },
      {
        key: 'faqHeading',
        heading: `Preguntas **Frecuentes**`,
        paragraphs: [
          `Preguntas comunes sobre los servicios psiquiátricos en Healing Minds en Naples, FL.`,
        ],
      },
      {
        key: 'faq-1',
        level: 3,
        heading: `¿Qué condiciones psiquiátricas trata Healing Minds?`,
        paragraphs: [
          `La Dra. Melva Reve evalúa trastornos de ansiedad, depresión, TDAH en adultos de 18 años en adelante, TEPT y trastorno bipolar, y ofrece manejo de medicamentos. La planificación sigue la evaluación clínica individual.`,
        ],
      },
      {
        key: 'faq-2',
        level: 3,
        heading: `¿Aceptan seguro médico para servicios psiquiátricos?`,
        paragraphs: [
          `La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique directamente con su aseguradora los beneficios de salud mental, telesalud y costos compartidos. Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.`,
        ],
      },
      {
        key: 'faq-3',
        level: 3,
        heading: `¿Cuánto dura la primera cita psiquiátrica?`,
        paragraphs: [
          `La consulta inicial cubre su historial de salud mental, síntomas actuales, medicamentos y objetivos de tratamiento. La oficina confirmará la duración de la cita cuando la programe.`,
        ],
      },
      {
        key: 'faq-4',
        level: 3,
        heading: `¿Está disponible la telesalud para atención psiquiátrica?`,
        paragraphs: [
          `Puede solicitar telesalud mediante una plataforma de video segura. La oficina confirma disponibilidad, adecuación clínica, ubicación del paciente y requisitos de licencia aplicables caso por caso.`,
        ],
      },
      {
        key: 'faq-5',
        level: 3,
        heading: `¿Ofrecen servicios psiquiátricos en español?`,
        paragraphs: [
          `Sí. La Dra. Melva Reve es completamente bilingüe en inglés y español, brindando atención psiquiátrica culturalmente sensible a las comunidades hispanas y latinas de Naples y el suroeste de Florida.`,
        ],
      },
      {
        key: 'faq-6',
        level: 3,
        heading: `¿Qué tan pronto puedo obtener una cita?`,
        paragraphs: [
          `La disponibilidad de citas varía. Puede solicitar un horario en línea o llamar al (239) 423-0272, y la oficina confirmará la próxima cita disponible.`,
        ],
      },
      {
        key: 'ctaHeading',
        heading: `Atendiendo Naples y el **Suroeste de Florida**`,
        paragraphs: [
          `Healing Minds Psychiatry atiende a adultos de Naples y comunidades cercanas de los condados de Collier y Lee. Los adultos en Florida pueden solicitar telesalud; la oficina confirma elegibilidad y disponibilidad caso por caso.`,
        ],
      },
      {
        key: 'cities',
        bullets: [`Naples`, `Bonita Springs`, `Marco Island`, `Estero`, `Fort Myers`],
      },
      {
        key: 'ctaBook',
        paragraphs: [`Reservar su Cita`],
      },
      {
        key: 'ctaLocation',
        paragraphs: [`Nuestra Ubicación en Naples`],
      },
    ],
  },
};
