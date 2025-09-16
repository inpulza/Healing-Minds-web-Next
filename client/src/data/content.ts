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

// NEW: Urgency and Availability Messaging for Enhanced CTAs
export const urgencyMessaging = {
  en: {
    // Real-time availability indicators
    availability: {
      sameDayAvailable: "✅ Same-Day Appointments Available",
      limitedSlots: "⚡ Limited Slots Remaining Today",
      nextAvailable: "📅 Next Opening: Today 2:00 PM",
      answeringNow: "📞 Answering Calls Now",
      fastResponse: "⚡ Same-Day Response Guaranteed",
      urgentCare: "🚨 Urgent Consultations Available",
      onlineNow: "💻 Book Online 24/7",
      callNow: "☎️ Call Now - No Wait",
    },
    // Urgency triggers
    urgency: {
      bookingFast: "🔥 Booking Fast - Only 3 Slots Left Today",
      dontWait: "⏰ Don't Wait - Mental Health Matters",
      limitedTime: "⚡ Book Within 15 Minutes for Same-Day Care",
      lastChance: "⚠️ Last Same-Day Slot Available",
      preferred: "⭐ Naples' Preferred Psychiatric Care",
      secure: "🔒 Secure Your Spot Today",
    },
    // Crisis messaging
    crisis: {
      emergency: "🚨 Mental Health Emergency?",
      urgent: "Urgent Consultation Available",
      crisis988: "Crisis Support: 988",
      emergency911: "Life-Threatening: 911",
      davidLawrence: "Local Crisis: (239) 263-7158",
    }
  },
  es: {
    // Real-time availability indicators
    availability: {
      sameDayAvailable: "✅ Citas el Mismo Día Disponibles",
      limitedSlots: "⚡ Cupos Limitados Hoy",
      nextAvailable: "📅 Próxima Disponibilidad: Hoy 2:00 PM",
      answeringNow: "📞 Respondiendo Llamadas Ahora",
      fastResponse: "⚡ Respuesta el Mismo Día Garantizada",
      urgentCare: "🚨 Consultas Urgentes Disponibles",
      onlineNow: "💻 Reserve en Línea 24/7",
      callNow: "☎️ Llame Ahora - Sin Espera",
    },
    // Urgency triggers
    urgency: {
      bookingFast: "🔥 Reservas Rápidas - Solo 3 Cupos Hoy",
      dontWait: "⏰ No Espere - La Salud Mental Importa",
      limitedTime: "⚡ Reserve en 15 Minutos para Atención Hoy",
      lastChance: "⚠️ Último Cupo del Día Disponible",
      preferred: "⭐ Atención Psiquiátrica Preferida en Naples",
      secure: "🔒 Asegure su Lugar Hoy",
    },
    // Crisis messaging
    crisis: {
      emergency: "🚨 ¿Emergencia de Salud Mental?",
      urgent: "Consulta Urgente Disponible",
      crisis988: "Apoyo en Crisis: 988",
      emergency911: "Peligro de Vida: 911",
      davidLawrence: "Crisis Local: (239) 263-7158",
    }
  }
};

// Enhanced CTA Options for Multiple Conversion Paths
export const ctaOptions = {
  en: {
    primary: {
      text: "Book Online Now",
      subtext: "Instant confirmation",
      icon: "Calendar"
    },
    secondary: {
      text: "Call (239) 423-0272",
      subtext: "Speak with us directly",
      icon: "Phone"
    },
    tertiary: {
      text: "Request Callback",
      subtext: "We'll call you back",
      icon: "PhoneCall"
    },
    emergency: {
      text: "Crisis Support",
      subtext: "Immediate help available",
      icon: "AlertTriangle"
    },
    telehealth: {
      text: "Video Consultation",
      subtext: "Same-day telehealth",
      icon: "Video"
    }
  },
  es: {
    primary: {
      text: "Reservar en Línea Ahora",
      subtext: "Confirmación instantánea",
      icon: "Calendar"
    },
    secondary: {
      text: "Llamar (239) 423-0272",
      subtext: "Hable directamente con nosotros",
      icon: "Phone"
    },
    tertiary: {
      text: "Solicitar Llamada",
      subtext: "Le devolveremos la llamada",
      icon: "PhoneCall"
    },
    emergency: {
      text: "Apoyo en Crisis",
      subtext: "Ayuda inmediata disponible",
      icon: "AlertTriangle"
    },
    telehealth: {
      text: "Consulta por Video",
      subtext: "Telesalud el mismo día",
      icon: "Video"
    }
  }
};

// NEW: Transactional Content Sections for Enhanced Conversion
export const transactionalSections = {
  // 1. "Why Book Online?" Benefits Section (Above fold)
  whyBookOnline: {
    en: {
      title: "Why Book Online?",
      titleHighlight: "Book",
      subtitle: "Experience the convenience of modern psychiatric care booking",
      benefits: [
        {
          icon: "CheckCircle",
          title: "Instant Confirmation",
          description: "Receive immediate appointment confirmation with no waiting for callbacks"
        },
        {
          icon: "Clock",
          title: "24/7 Availability", 
          description: "Schedule your consultation anytime, even outside office hours"
        },
        {
          icon: "Phone",
          title: "Skip Phone Queues",
          description: "No more waiting on hold - book directly through our secure portal"
        },
        {
          icon: "Calendar",
          title: "Same-Day Priority",
          description: "Online bookings get priority access to same-day appointment slots"
        },
        {
          icon: "Shield",
          title: "Secure & Private",
          description: "HIPAA-compliant booking with automatic appointment reminders"
        },
        {
          icon: "Video",
          title: "Telehealth Ready",
          description: "Easily schedule in-person or secure video consultations"
        }
      ],
      cta: "Book My Appointment Now",
      urgencyText: "Limited same-day slots available"
    },
    es: {
      title: "¿Por Qué Reservar en Línea?",
      titleHighlight: "Reservar",
      subtitle: "Experimente la conveniencia de la reserva moderna de atención psiquiátrica",
      benefits: [
        {
          icon: "CheckCircle",
          title: "Confirmación Instantánea",
          description: "Reciba confirmación inmediata de cita sin esperar llamadas de respuesta"
        },
        {
          icon: "Clock",
          title: "Disponibilidad 24/7",
          description: "Programe su consulta en cualquier momento, incluso fuera del horario de oficina"
        },
        {
          icon: "Phone", 
          title: "Evite Colas Telefónicas",
          description: "No más esperas en línea - reserve directamente a través de nuestro portal seguro"
        },
        {
          icon: "Calendar",
          title: "Prioridad el Mismo Día",
          description: "Las reservas en línea obtienen acceso prioritario a citas del mismo día"
        },
        {
          icon: "Shield",
          title: "Seguro y Privado",
          description: "Reserva compatible con HIPAA con recordatorios automáticos de citas"
        },
        {
          icon: "Video",
          title: "Listo para Telesalud",
          description: "Programe fácilmente consultas en persona o por video seguro"
        }
      ],
      cta: "Reservar Mi Cita Ahora",
      urgencyText: "Citas del mismo día limitadas disponibles"
    }
  },

  // 2. Trust & Credibility Signals Section
  trustCredibility: {
    en: {
      title: "Trusted Expertise",
      titleHighlight: "Trusted",
      subtitle: "Your mental health deserves the highest standard of professional care",
      credentials: [
        {
          icon: "Award",
          title: "15+ Years Experience",
          description: "Extensive experience treating anxiety, depression, ADHD, and other mental health conditions"
        },
        {
          icon: "GraduationCap",
          title: "University of Miami",
          description: "MD from University of Miami Miller School of Medicine"
        },
        {
          icon: "Users",
          title: "APA Member",
          description: "Active member of the American Psychiatric Association"
        },
        {
          icon: "Languages",
          title: "Bilingual Care",
          description: "Fluent in English and Spanish for comprehensive patient communication"
        },
        {
          icon: "Shield",
          title: "HIPAA Compliant",
          description: "Full patient privacy protection following all medical confidentiality laws"
        },
        {
          icon: "Heart",
          title: "Patient-Centered",
          description: "Personalized treatment plans tailored to each individual's unique needs"
        }
      ],
      stats: {
        experience: "15+",
        patients: "1,000+",
        satisfaction: "98%"
      },
      cta: "Learn About Dr. Reve"
    },
    es: {
      title: "Experiencia Confiable",
      titleHighlight: "Confiable",
      subtitle: "Su salud mental merece el más alto estándar de atención profesional",
      credentials: [
        {
          icon: "Award",
          title: "15+ Años de Experiencia",
          description: "Amplia experiencia tratando ansiedad, depresión, TDAH y otras condiciones de salud mental"
        },
        {
          icon: "GraduationCap",
          title: "Universidad de Miami",
          description: "MD de la Escuela de Medicina Miller de la Universidad de Miami"
        },
        {
          icon: "Users",
          title: "Miembro APA",
          description: "Miembro activo de la Asociación Psiquiátrica Americana"
        },
        {
          icon: "Languages",
          title: "Atención Bilingüe",
          description: "Fluida en inglés y español para comunicación integral con pacientes"
        },
        {
          icon: "Shield",
          title: "Compatible HIPAA",
          description: "Protección completa de privacidad del paciente siguiendo todas las leyes de confidencialidad médica"
        },
        {
          icon: "Heart",
          title: "Centrado en el Paciente",
          description: "Planes de tratamiento personalizados adaptados a las necesidades únicas de cada individuo"
        }
      ],
      stats: {
        experience: "15+",
        patients: "1,000+",
        satisfaction: "98%"
      },
      cta: "Conocer a la Dra. Reve"
    }
  },

  // 3. Emergency & Urgency Section
  emergencyUrgency: {
    en: {
      title: "Urgent Care Available",
      titleHighlight: "Urgent",
      subtitle: "When you need help, we're here with immediate mental health support",
      services: [
        {
          icon: "Clock",
          title: "Same-Day Appointments",
          description: "Emergency consultation slots available for urgent mental health needs",
          availability: "Available Today"
        },
        {
          icon: "Phone",
          title: "Crisis Consultation",
          description: "Immediate phone consultation for mental health emergencies",
          availability: "Call (239) 423-0272"
        },
        {
          icon: "Video",
          title: "Urgent Telehealth",
          description: "Secure video consultations for immediate assessment and support",
          availability: "Within 2 Hours"
        },
        {
          icon: "Heart",
          title: "After-Hours Support",
          description: "Emergency contact protocols and mental health crisis resources",
          availability: "24/7 Resources"
        }
      ],
      emergencyNumbers: [
        { number: "911", description: "Life-threatening emergencies" },
        { number: "988", description: "Suicide & Crisis Lifeline" },
        { number: "(239) 263-7158", description: "David Lawrence Center" }
      ],
      cta: "Get Urgent Help Now",
      disclaimer: "If this is a life-threatening emergency, call 911 immediately"
    },
    es: {
      title: "Atención Urgente Disponible",
      titleHighlight: "Urgente",
      subtitle: "Cuando necesite ayuda, estamos aquí con apoyo inmediato de salud mental",
      services: [
        {
          icon: "Clock",
          title: "Citas el Mismo Día",
          description: "Espacios de consulta de emergencia disponibles para necesidades urgentes de salud mental",
          availability: "Disponible Hoy"
        },
        {
          icon: "Phone",
          title: "Consulta de Crisis",
          description: "Consulta telefónica inmediata para emergencias de salud mental",
          availability: "Llame (239) 423-0272"
        },
        {
          icon: "Video",
          title: "Telesalud Urgente",
          description: "Consultas por video seguras para evaluación y apoyo inmediato",
          availability: "En 2 Horas"
        },
        {
          icon: "Heart",
          title: "Apoyo Fuera de Horario",
          description: "Protocolos de contacto de emergencia y recursos de crisis de salud mental",
          availability: "Recursos 24/7"
        }
      ],
      emergencyNumbers: [
        { number: "911", description: "Emergencias que amenazan la vida" },
        { number: "988", description: "Línea de Crisis y Suicidio" },
        { number: "(239) 263-7158", description: "Centro David Lawrence" }
      ],
      cta: "Obtener Ayuda Urgente Ahora",
      disclaimer: "Si esta es una emergencia que amenaza la vida, llame al 911 inmediatamente"
    }
  },

  // 4. Local Competitive Advantages
  competitiveAdvantages: {
    en: {
      title: "Why Choose Us",
      titleHighlight: "Choose",
      subtitle: "Discover what makes our psychiatric practice unique in Southwest Florida",
      advantages: [
        {
          icon: "Languages",
          title: "Only Bilingual Psychiatrist",
          description: "The area's only fully bilingual psychiatric practice serving English and Spanish speakers",
          benefit: "Cultural Understanding"
        },
        {
          icon: "MapPin",
          title: "Most Convenient Location",
          description: "Central Naples location with easy access from all major Southwest Florida communities",
          benefit: "Easy Access"
        },
        {
          icon: "CreditCard",
          title: "Comprehensive Insurance",
          description: "Accept more insurance plans than any other local psychiatric practice",
          benefit: "Affordable Care"
        },
        {
          icon: "Video",
          title: "Advanced Telemedicine",
          description: "State-of-the-art telehealth technology for secure, convenient consultations",
          benefit: "Modern Technology"
        },
        {
          icon: "User",
          title: "Personalized Approach",
          description: "Individual treatment plans tailored to your unique mental health journey",
          benefit: "Customized Care"
        },
        {
          icon: "Heart",
          title: "Community Involved",
          description: "Active participation in local mental health awareness and community wellness",
          benefit: "Local Commitment"
        }
      ],
      cta: "Experience the Difference",
      socialProof: "Join 1,000+ patients who trust our care"
    },
    es: {
      title: "Por Qué Elegirnos",
      titleHighlight: "Elegirnos",
      subtitle: "Descubra qué hace única nuestra práctica psiquiátrica en el suroeste de Florida",
      advantages: [
        {
          icon: "Languages",
          title: "Único Psiquiatra Bilingüe",
          description: "La única práctica psiquiátrica completamente bilingüe del área que sirve a hablantes de inglés y español",
          benefit: "Comprensión Cultural"
        },
        {
          icon: "MapPin", 
          title: "Ubicación Más Conveniente",
          description: "Ubicación central en Naples con fácil acceso desde todas las principales comunidades del suroeste de Florida",
          benefit: "Fácil Acceso"
        },
        {
          icon: "CreditCard",
          title: "Seguro Integral",
          description: "Aceptamos más planes de seguro que cualquier otra práctica psiquiátrica local",
          benefit: "Atención Asequible"
        },
        {
          icon: "Video",
          title: "Telemedicina Avanzada",
          description: "Tecnología de telesalud de vanguardia para consultas seguras y convenientes",
          benefit: "Tecnología Moderna"
        },
        {
          icon: "User",
          title: "Enfoque Personalizado",
          description: "Planes de tratamiento individuales adaptados a su viaje único de salud mental",
          benefit: "Atención Personalizada"
        },
        {
          icon: "Heart",
          title: "Participación Comunitaria",
          description: "Participación activa en conciencia local de salud mental y bienestar comunitario",
          benefit: "Compromiso Local"
        }
      ],
      cta: "Experimente la Diferencia",
      socialProof: "Únase a 1,000+ pacientes que confían en nuestra atención"
    }
  },

  // 5. Patient Success & Social Proof
  patientSuccess: {
    en: {
      title: "Patient Success Stories",
      titleHighlight: "Success",
      subtitle: "Real results from real patients in our Southwest Florida community",
      successMetrics: [
        {
          icon: "TrendingUp",
          percentage: "95%",
          title: "Treatment Satisfaction",
          description: "Patients report significant improvement in their mental health"
        },
        {
          icon: "Clock",
          percentage: "85%",
          title: "Faster Recovery",
          description: "Patients see improvements within the first 30 days of treatment"
        },
        {
          icon: "Heart",
          percentage: "92%",
          title: "Quality of Life",
          description: "Patients report improved relationships and daily functioning"
        }
      ],
      journeyExamples: [
        {
          condition: "Anxiety & Depression",
          timeframe: "3-6 months",
          improvements: ["Reduced anxiety episodes", "Better sleep quality", "Improved work performance", "Stronger relationships"]
        },
        {
          condition: "ADHD Management",
          timeframe: "1-3 months", 
          improvements: ["Enhanced focus", "Better organization", "Improved academic/work results", "Increased confidence"]
        },
        {
          condition: "PTSD Recovery",
          timeframe: "6-12 months",
          improvements: ["Reduced flashbacks", "Better emotional regulation", "Improved sleep", "Restored daily activities"]
        }
      ],
      testimonialHighlights: [
        {
          quote: "Dr. Reve changed my life. Her bilingual approach made me feel truly understood.",
          location: "Naples Patient",
          condition: "Anxiety"
        },
        {
          quote: "Same-day appointment saved me during my crisis. Professional and compassionate care.",
          location: "Bonita Springs Patient", 
          condition: "Depression"
        },
        {
          quote: "Finally found a psychiatrist who gets our culture. My family feels supported.",
          location: "Estero Patient",
          condition: "Family Therapy"
        }
      ],
      cta: "Start Your Success Story"
    },
    es: {
      title: "Historias de Éxito de Pacientes",
      titleHighlight: "Éxito",
      subtitle: "Resultados reales de pacientes reales en nuestra comunidad del suroeste de Florida",
      successMetrics: [
        {
          icon: "TrendingUp",
          percentage: "95%",
          title: "Satisfacción del Tratamiento",
          description: "Los pacientes reportan mejora significativa en su salud mental"
        },
        {
          icon: "Clock",
          percentage: "85%",
          title: "Recuperación Más Rápida",
          description: "Los pacientes ven mejoras dentro de los primeros 30 días de tratamiento"
        },
        {
          icon: "Heart",
          percentage: "92%",
          title: "Calidad de Vida",
          description: "Los pacientes reportan relaciones mejoradas y funcionamiento diario"
        }
      ],
      journeyExamples: [
        {
          condition: "Ansiedad y Depresión",
          timeframe: "3-6 meses",
          improvements: ["Episodios de ansiedad reducidos", "Mejor calidad del sueño", "Rendimiento laboral mejorado", "Relaciones más fuertes"]
        },
        {
          condition: "Manejo de TDAH",
          timeframe: "1-3 meses",
          improvements: ["Enfoque mejorado", "Mejor organización", "Resultados académicos/laborales mejorados", "Mayor confianza"]
        },
        {
          condition: "Recuperación de TEPT",
          timeframe: "6-12 meses",
          improvements: ["Flashbacks reducidos", "Mejor regulación emocional", "Sueño mejorado", "Actividades diarias restauradas"]
        }
      ],
      testimonialHighlights: [
        {
          quote: "La Dra. Reve cambió mi vida. Su enfoque bilingüe me hizo sentir verdaderamente comprendido/a.",
          location: "Paciente de Naples",
          condition: "Ansiedad"
        },
        {
          quote: "La cita del mismo día me salvó durante mi crisis. Atención profesional y compasiva.",
          location: "Paciente de Bonita Springs",
          condition: "Depresión"
        },
        {
          quote: "Finalmente encontré un psiquiatra que entiende nuestra cultura. Mi familia se siente apoyada.",
          location: "Paciente de Estero",
          condition: "Terapia Familiar"
        }
      ],
      cta: "Comience Su Historia de Éxito"
    }
  }
};

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
