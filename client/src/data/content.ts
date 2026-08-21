// Structured content data for the psychiatry practice website
// This centralizes all content for easier maintenance and potential CMS integration

import { practiceProfile } from "@shared/practice-profile";

export const practiceInfo = {
  name: practiceProfile.name,
  doctorName: "Dr. Melva Reve",
  credentials: "MD, Psychiatry",
  phone: practiceProfile.phoneDisplay,
  email: practiceProfile.email,
  address: {
    street: practiceProfile.address.streetAddress,
    city: practiceProfile.address.addressLocality,
    state: practiceProfile.address.addressRegion,
    zip: practiceProfile.address.postalCode,
    full: `${practiceProfile.address.streetAddress}, ${practiceProfile.address.addressLocality}, ${practiceProfile.address.addressRegion} ${practiceProfile.address.postalCode}`,
  },
  hours: practiceProfile.hoursDisplay,
  googleMapsUrl: practiceProfile.bookingDirectionsUrl,
  emergencyNumbers: [
    { number: "911", description: "Emergency services" },
    { number: "988", description: "Suicide & Crisis Lifeline" },
    {
      number: "(239) 352-4357",
      description: "David Lawrence Centers Crisis Line",
    },
  ],
};

export const serviceAreas = [
  "Naples, FL",
  "Marco Island, FL",
  "Bonita Springs, FL",
  "Estero, FL",
  "Fort Myers, FL",
  "Collier County",
];

export const credentials = {
  en: [
    "Doctor of Medicine (MD)",
    "Active Florida Medical License ME165518",
    "Adult psychiatry focus",
  ],
  es: [
    "Doctora en Medicina (MD)",
    "Licencia Médica Activa de Florida ME165518",
    "Enfoque en psiquiatría de adultos",
  ],
};

export const services = {
  anxiety: {
    icon: "Heart",
    conditions: [
      "Generalized Anxiety Disorder",
      "Panic Disorder",
      "Social Anxiety",
      "Specific Phobias",
    ],
  },
  depression: {
    icon: "Sun",
    conditions: [
      "Major Depressive Disorder",
      "Persistent Depressive Disorder",
      "Seasonal Affective Disorder",
      "Postpartum Depression",
    ],
  },
  adhd: {
    icon: "Zap",
    conditions: [
      "Adult ADHD Assessment",
      "Medication Management",
      "Behavioral Strategies",
      "Executive Function Support",
    ],
  },
  ptsd: {
    icon: "Shield",
    conditions: [
      "PTSD Treatment",
      "Trauma-Informed Care",
      "Acute Stress Disorder",
      "Complex Trauma",
    ],
  },
  bipolar: {
    icon: "TrendingUp",
    conditions: [
      "Bipolar I & II Disorder",
      "Mood Stabilization",
      "Medication Management",
      "Psychoeducation",
    ],
  },
  ocd: {
    icon: "RotateCcw",
    conditions: [
      "Obsessive-Compulsive Disorder",
      "Exposure Response Prevention",
      "Medication Management",
      "Body-Focused Repetitive Behaviors",
    ],
  },
};

export const faqData = {
  en: [
    {
      question: "How soon can I get an appointment?",
      answer:
        "Appointment availability varies. Call the office or request a time online, and the team will confirm the next available appointment.",
    },
    {
      question: "Do you offer telehealth appointments?",
      answer:
        "Yes, we offer secure telehealth appointments for both new and existing patients. This is especially convenient for follow-up visits and medication management.",
    },
    {
      question: "What should I bring to my first appointment?",
      answer:
        "Please bring your insurance card, a valid ID, a list of current medications, and any relevant medical records. We'll also send you intake forms to complete before your visit.",
    },
    {
      question: "Do you provide services in Spanish?",
      answer:
        "Absolutely. Dr. Reve is fluent in Spanish and provides comprehensive psychiatric services in Spanish, ensuring clear communication and cultural understanding throughout your care.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer.",
    },
    {
      question: "What is the cost of treatment?",
      answer:
        "Costs vary based on the service and any applicable insurance benefits. Confirm participation with our office and verify benefits with your insurer before booking. Self-pay or financial options may be evaluated case by case.",
    },
  ],
  es: [
    {
      question: "¿Qué tan pronto puedo conseguir una cita?",
      answer:
        "La disponibilidad de citas varía. Llame a la oficina o solicite un horario en línea, y el equipo confirmará la próxima cita disponible.",
    },
    {
      question: "¿Ofrecen citas de telesalud?",
      answer:
        "Sí, ofrecemos citas seguras de telesalud para pacientes nuevos y existentes. Esto es especialmente conveniente para visitas de seguimiento y manejo de medicamentos.",
    },
    {
      question: "¿Qué debo traer a mi primera cita?",
      answer:
        "Por favor traiga su tarjeta de seguro, una identificación válida, una lista de medicamentos actuales, y cualquier registro médico relevante. También le enviaremos formularios de admisión para completar antes de su visita.",
    },
    {
      question: "¿Proporcionan servicios en español?",
      answer:
        "Absolutamente. La Dra. Reve habla español con fluidez y proporciona servicios psiquiátricos integrales en español, asegurando comunicación clara y comprensión cultural durante toda su atención.",
    },
    {
      question: "¿Qué planes de seguro aceptan?",
      answer:
        "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora.",
    },
    {
      question: "¿Cuál es el costo del tratamiento?",
      answer:
        "Los costos varían según el servicio y los beneficios de seguro aplicables. Confirme la participación con nuestra oficina y verifique los beneficios con su aseguradora antes de reservar. Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.",
    },
  ],
};

export const bilingualFeatures = {
  en: [
    {
      title: "Bilingual Care in English and Spanish",
      description:
        "Consultations conducted entirely in Spanish for optimal communication",
    },
    {
      title: "Cultural Understanding",
      description:
        "Sensitive to cultural factors that influence mental health and treatment",
    },
    {
      title: "Family-Centered Approach",
      description:
        "Understanding the important role of family in Hispanic mental health care",
    },
  ],
  es: [
    {
      title: "Atención Bilingüe en Inglés y Español",
      description:
        "Consultas realizadas completamente en español para una comunicación óptima",
    },
    {
      title: "Comprensión Cultural",
      description:
        "Sensible a los factores culturales que influyen en la salud mental y el tratamiento",
    },
    {
      title: "Enfoque Centrado en la Familia",
      description:
        "Comprensión del papel importante de la familia en el cuidado de la salud mental hispana",
    },
  ],
};

export const treatmentExpectations = {
  en: [
    {
      title: "Initial Consultation",
      description:
        "Comprehensive evaluation of your mental health history, current symptoms, and treatment goals. The office confirms the appointment length when scheduling.",
    },
    {
      title: "Follow-up Appointments",
      description:
        "Regular check-ins to monitor progress, adjust medications, and provide ongoing support. The office confirms the appointment length when scheduling.",
    },
    {
      title: "Treatment Planning",
      description:
        "Collaborative approach to developing a personalized treatment plan that fits your lifestyle and goals.",
    },
    {
      title: "Between Sessions",
      description:
        "For non-urgent questions, use the secure patient portal or contact the office during published hours. In an emergency, call 911 or 988.",
    },
  ],
  es: [
    {
      title: "Consulta Inicial",
      description:
        "Evaluación integral de su historial de salud mental, síntomas actuales y objetivos de tratamiento. La oficina confirma la duración de la cita al programar.",
    },
    {
      title: "Citas de Seguimiento",
      description:
        "Controles regulares para monitorear el progreso, ajustar medicamentos y brindar apoyo continuo. La oficina confirma la duración de la cita al programar.",
    },
    {
      title: "Planificación del Tratamiento",
      description:
        "Enfoque colaborativo para desarrollar un plan de tratamiento personalizado que se ajuste a su estilo de vida y objetivos.",
    },
    {
      title: "Entre Sesiones",
      description:
        "Para preguntas no urgentes, use el portal seguro del paciente o contacte la oficina durante el horario publicado. En una emergencia, llame al 911 o al 988.",
    },
  ],
};

// SEO-optimized content for meta tags and structured data
export const seoContent = {
  en: {
    home: {
      title:
        "Dr. Melva Reve - Compassionate Psychiatric Care in Naples, FL | Healing Minds",
      description:
        "Psychiatric care for adults in Naples, FL. Dr. Melva Reve, MD, holds active Florida medical license ME165518 and focuses on anxiety, depression, ADHD, and PTSD.",
      keywords:
        "psychiatrist Naples FL, psychiatric care Naples, anxiety treatment Naples, depression treatment Naples, bilingual psychiatrist, Spanish speaking psychiatrist Naples",
    },
    about: {
      title: "About Dr. Melva Reve - Psychiatrist in Naples, FL",
      description:
        "Meet Dr. Melva Reve, MD, a Naples psychiatrist with active Florida medical license ME165518, bilingual care and defined clinical focus areas.",
      keywords:
        "Dr Melva Reve Naples, psychiatrist biography, psychiatrist Naples, bilingual psychiatrist FL",
    },
    services: {
      title:
        "Psychiatric Services Naples FL - Anxiety, Depression, ADHD Treatment",
      description:
        "Comprehensive psychiatric services in Naples, FL. Treatment for anxiety, depression, ADHD, PTSD, bipolar disorder, and OCD. Bilingual care available.",
      keywords:
        "psychiatric services Naples, anxiety treatment Naples, depression treatment Naples, ADHD treatment Naples, PTSD treatment Naples",
    },
    contact: {
      title: "Contact Dr. Melva Reve - Book Psychiatric Consultation Naples FL",
      description:
        "Contact Healing Minds Psychiatry in Naples, FL to schedule your consultation. Call (239) 423-0272 or send a message. Bilingual services available.",
      keywords:
        "contact psychiatrist Naples, book psychiatric consultation Naples, psychiatrist phone Naples FL",
    },
  },
  es: {
    home: {
      title:
        "Dra. Melva Reve - Atención Psiquiátrica Compasiva en Naples, FL | Healing Minds",
      description:
        "Atención psiquiátrica para adultos en Naples, FL. La Dra. Melva Reve, MD, tiene licencia médica activa de Florida ME165518 y se enfoca en ansiedad, depresión, TDAH y TEPT.",
      keywords:
        "psiquiatra Naples FL, atención psiquiátrica Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, psiquiatra bilingüe, psiquiatra español Naples",
    },
    about: {
      title:
        "Acerca de la Dra. Melva Reve - Psiquiatra en Naples, FL",
      description:
        "Conozca a la Dra. Melva Reve, MD, psiquiatra en Naples con licencia médica activa de Florida ME165518, atención bilingüe y áreas de enfoque clínico.",
      keywords:
        "Dra Melva Reve Naples, biografía psiquiatra, psiquiatra con licencia Naples, psiquiatra bilingüe FL",
    },
    services: {
      title:
        "Servicios Psiquiátricos Naples FL - Tratamiento Ansiedad, Depresión, TDAH",
      description:
        "Servicios psiquiátricos integrales en Naples, FL. Tratamiento para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y TOC. Atención bilingüe disponible.",
      keywords:
        "servicios psiquiátricos Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, tratamiento TDAH Naples, tratamiento TEPT Naples",
    },
    contact: {
      title:
        "Contactar Dra. Melva Reve - Reservar Consulta Psiquiátrica Naples FL",
      description:
        "Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.",
      keywords:
        "contactar psiquiatra Naples, reservar consulta psiquiátrica Naples, teléfono psiquiatra Naples FL",
    },
  },
};
