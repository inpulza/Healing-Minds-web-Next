// Structured content data for the psychiatry practice website
// This centralizes all content for easier maintenance and potential CMS integration

export const practiceInfo = {
  name: "Healing Minds Psychiatry",
  doctorName: "Dr. Melva Reve",
  credentials: "MD, Psychiatry",
  phone: "(239) 423-0272",
  email: "info@healingmindsp.com",
  address: {
    street: "4760 Tamiami Trl N # 25",
    city: "Naples",
    state: "FL",
    zip: "34103",
    full: "4760 Tamiami Trl N # 25, Naples, FL 34103",
  },
  hours: "Monday - Friday: 9:00 AM - 5:00 PM",
  googleMapsUrl:
    "https://maps.google.com/?q=4760+Tamiami+Trl+N,+Ste+25,+Naples,+FL+34103",
  emergencyNumbers: [
    { number: "911", description: "Emergency services" },
    { number: "988", description: "Suicide & Crisis Lifeline" },
    {
      number: "(239) 263-7158",
      description: "David Lawrence Center Crisis Line",
    },
  ],
};

export const stats = {
  experience: "15+",
  successRate: "98%",
  rating: "4.9/5",
};

export const serviceAreas = [
  "Naples, FL",
  "Marco Island, FL",
  "Bonita Springs, FL",
  "Estero, FL",
  "Fort Myers, FL",
  "Collier County",
];

export const acceptedInsurance = [
  "Most major insurance plans",
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Medicare",
  "Medicaid",
];

export const credentials = {
  en: [
    "MD from University of Miami Miller School of Medicine",
    // "Board Certified by American Board of Psychiatry and Neurology",
    "Member of American Psychiatric Association",
    "Fluent in English and Spanish",
  ],
  es: [
    "MD de la Escuela de Medicina Miller de la Universidad de Miami",
    // "Certificada por la Junta Americana de Psiquiatría y Neurología",
    "Miembro de la Asociación Psiquiátrica Americana",
    "Fluida en inglés y español",
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

export const testimonials = {
  en: [
    {
      name: "J.D.",
      location: "Patient",
      quote:
        "Dr. Reve created a safe space for me to truly open up. Her guidance has been invaluable on my journey to understanding myself better.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "A.S.",
      location: "Patient",
      quote:
        "I was hesitant to start medication, but Dr. Reve's collaborative and informative approach made me feel confident and cared for. It's been life-changing.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332c83c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "M.R.",
      location: "Patient",
      quote:
        "The level of empathy and professionalism is unmatched. I finally feel like I have a true partner in my mental health care.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ],
  es: [
    {
      name: "J.D.",
      location: "Paciente",
      quote:
        "La Dra. Reve creó un espacio seguro para que pudiera abrirme de verdad. Su orientación ha sido invaluable en mi viaje hacia comprender mejor a mí mismo.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "A.S.",
      location: "Paciente",
      quote:
        "Tenía dudas sobre empezar medicación, pero el enfoque colaborativo e informativo de la Dra. Reve me hizo sentir confiado y cuidado. Ha sido un cambio de vida.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332c83c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "M.R.",
      location: "Paciente",
      quote:
        "El nivel de empatía y profesionalismo no tiene comparación. Finalmente siento que tengo un verdadero compañero en mi cuidado de salud mental.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ],
};

export const faqData = {
  en: [
    {
      question: "How soon can I get an appointment?",
      answer:
        "We typically offer new patient appointments within 1-2 weeks. Urgent cases can often be accommodated sooner. Call us to discuss your specific needs and timeline.",
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
        "We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Medicare, and Medicaid. We verify benefits before your first appointment.",
    },
    {
      question: "What is the cost of treatment?",
      answer:
        "Costs vary depending on your insurance coverage and treatment needs. We offer transparent pricing and will discuss all costs before beginning treatment. Self-pay options and payment plans are available.",
    },
  ],
  es: [
    {
      question: "¿Qué tan pronto puedo conseguir una cita?",
      answer:
        "Típicamente ofrecemos citas para pacientes nuevos dentro de 1-2 semanas. Los casos urgentes a menudo pueden ser acomodados antes. Llámenos para discutir sus necesidades específicas y cronograma.",
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
        "Aceptamos la mayoría de los planes de seguro principales incluyendo Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Medicare, y Medicaid. Verificamos beneficios antes de su primera cita.",
    },
    {
      question: "¿Cuál es el costo del tratamiento?",
      answer:
        "Los costos varían dependiendo de su cobertura de seguro y necesidades de tratamiento. Ofrecemos precios transparentes y discutiremos todos los costos antes de comenzar el tratamiento. Opciones de pago por cuenta propia y planes de pago están disponibles.",
    },
  ],
};

export const bilingualFeatures = {
  en: [
    {
      title: "Native Spanish Fluency",
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
      title: "Fluidez Nativa en Español",
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
      title: "Initial Consultation (60 minutes)",
      description:
        "Comprehensive evaluation of your mental health history, current symptoms, and treatment goals.",
    },
    {
      title: "Follow-up Appointments (30-45 minutes)",
      description:
        "Regular check-ins to monitor progress, adjust medications, and provide ongoing support.",
    },
    {
      title: "Treatment Planning",
      description:
        "Collaborative approach to developing a personalized treatment plan that fits your lifestyle and goals.",
    },
    {
      title: "Between Sessions",
      description:
        "24/7 on-call support for urgent situations and medication adjustments as needed.",
    },
  ],
  es: [
    {
      title: "Consulta Inicial (60 minutos)",
      description:
        "Evaluación integral de su historial de salud mental, síntomas actuales y objetivos de tratamiento.",
    },
    {
      title: "Citas de Seguimiento (30-45 minutos)",
      description:
        "Controles regulares para monitorear el progreso, ajustar medicamentos y brindar apoyo continuo.",
    },
    {
      title: "Planificación del Tratamiento",
      description:
        "Enfoque colaborativo para desarrollar un plan de tratamiento personalizado que se ajuste a su estilo de vida y objetivos.",
    },
    {
      title: "Entre Sesiones",
      description:
        "Soporte de guardia 24/7 para situaciones urgentes y ajustes de medicación según sea necesario.",
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
        "Expert psychiatric care for adults in Naples, FL. Dr. Melva Reve offers bilingual treatment for anxiety, depression, ADHD, and PTSD. 15+ years experience. Book your consultation today.",
      keywords:
        "psychiatrist Naples FL, psychiatric care Naples, anxiety treatment Naples, depression treatment Naples, bilingual psychiatrist, Spanish speaking psychiatrist Naples",
    },
    about: {
      title: "About Dr. Melva Reve - Psychiatrist in Naples, FL",
      description:
        "Learn about Dr. Melva Reve, a psychiatrist with 15+ years of experience serving Naples, FL. Bilingual care with cultural sensitivity.",
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
        "Atención psiquiátrica experta para adultos en Naples, FL. La Dra. Melva Reve ofrece tratamiento bilingüe para ansiedad, depresión, TDAH y TEPT. Más de 15 años de experiencia. Reserve su consulta hoy.",
      keywords:
        "psiquiatra Naples FL, atención psiquiátrica Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, psiquiatra bilingüe, psiquiatra español Naples",
    },
    about: {
      title:
        "Acerca de la Dra. Melva Reve - Psiquiatra Certificada en Naples, FL",
      description:
        "Conozca a la Dra. Melva Reve, psiquiatra certificada con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.",
      keywords:
        "Dra Melva Reve Naples, biografía psiquiatra, psiquiatra certificada Naples, psiquiatra bilingüe FL",
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
