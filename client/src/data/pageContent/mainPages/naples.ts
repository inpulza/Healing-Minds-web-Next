import type { BilingualPageContent } from '../types';

// Inline copy for client/src/pages/LocationNaples.tsx (EN + ES).
// Section titles that interleave an italic <span> (bespoke "icon headings")
// keep their JSX in the component; their full plain text is mirrored here as
// section `heading` so the server can serialize the same words.
// The list of served areas (serviceAreas) still renders from
// client/src/data/content.ts and is intentionally NOT duplicated here.

export const naplesLocationContent: BilingualPageContent = {
  en: {
    title: 'Your Trusted Psychiatrist in Naples, FL',
    sections: [
      {
        key: 'hero-description',
        paragraphs: ['Comprehensive psychiatric care in Southwest Florida.'],
      },
      {
        key: 'hero-badges',
        bullets: ['15+ Years Experience', 'Bilingual Care', 'Modern Facilities'],
      },
      {
        key: 'labels',
        bullets: [
          'Schedule Consultation',
          'Get Directions',
          'Book Appointment',
          'Call Now',
          'View Our Location',
          'Schedule My Consultation Now',
        ],
      },
      {
        key: 'banner-badge',
        paragraphs: ['Premium Location'],
      },
      {
        key: 'banner-heading',
        heading: 'Your Healing Journey Starts at Our Naples Office',
      },
      {
        key: 'banner-stat',
        paragraphs: ['15+', 'Years serving the Naples community with excellence'],
      },
      {
        key: 'banner-body',
        paragraphs: [
          'Located in the heart of Naples on Tamiami Trail, our modern facility provides a welcoming, comfortable environment designed specifically for mental health care. Experience compassionate psychiatric treatment in a setting that prioritizes your privacy and comfort.',
        ],
      },
      {
        key: 'banner-features',
        bullets: [
          'Easy Parking Available',
          'Accessible Location',
          'Private & Confidential',
          'Modern Facilities',
          'Welcoming Environment',
          'Professional Care',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Services at This Location',
      },
      {
        key: 'services-intro',
        paragraphs: [
          'Comprehensive psychiatric services available at our Naples location, tailored to meet your mental health needs with compassionate care.',
        ],
      },
      {
        key: 'service-anxiety',
        heading: 'Anxiety Treatment',
        paragraphs: [
          'Expert care for panic attacks, social anxiety, and generalized anxiety disorder with evidence-based treatments.',
        ],
        bullets: ['Learn About Anxiety Treatment'],
      },
      {
        key: 'service-depression',
        heading: 'Depression Treatment',
        paragraphs: [
          'Comprehensive care for major depression with personalized treatment plans and ongoing support.',
        ],
        bullets: ['Learn About Depression Treatment'],
      },
      {
        key: 'service-adhd',
        heading: 'ADHD Treatment',
        paragraphs: [
          'Specialized evaluation and treatment for adults and teens to improve focus and daily functioning.',
        ],
        bullets: ['Learn About ADHD Treatment'],
      },
      {
        key: 'service-ptsd',
        heading: 'PTSD Treatment',
        paragraphs: [
          'Trauma-informed psychiatric care to help you heal and reclaim your life from traumatic experiences.',
        ],
        bullets: ['Learn About PTSD Treatment'],
      },
      {
        key: 'service-bipolar',
        heading: 'Bipolar Treatment',
        paragraphs: [
          'Expert mood stabilization to help achieve emotional balance and prevent future episodes.',
        ],
        bullets: ['Learn About Bipolar Treatment'],
      },
      {
        key: 'service-medication-management',
        heading: 'Medication Management',
        paragraphs: [
          'Expert psychiatric medication evaluation, monitoring, and adjustment with comprehensive safety assessments.',
        ],
        bullets: ['Learn About Medication Management'],
      },
      {
        key: 'areas-heading',
        heading: 'Areas We Serve',
      },
      {
        key: 'directions-heading',
        heading: 'How to Get Here',
      },
      {
        key: 'directions-intro',
        paragraphs: [
          'Our Naples office is conveniently located in the heart of the city. Use these familiar landmarks to find us easily.',
        ],
      },
      {
        key: 'directions-pier',
        heading: 'From Naples Pier',
        paragraphs: ['Downtown Naples'],
        ordered: [
          'From the Naples Pier at 25 12th Ave S, head east toward 5th Avenue S',
          'Turn left on US-41 (Tamiami Trail) and head north for about 3 miles',
          'Our psychiatric practice is at 4760 Tamiami Trl N # 25, on the right side',
        ],
        bullets: ['8-12 minutes'],
      },
      {
        key: 'directions-airport',
        heading: 'From Naples Municipal Airport',
        paragraphs: ['Airport Access'],
        ordered: [
          'Exit the airport and head west on Airport Pulling Road toward US-41',
          'Turn right on US-41 (Tamiami Trail) and head north for about 2 miles',
          'Look for our mental health practice at 4760 Tamiami Trl N # 25, on the right',
        ],
        bullets: ['6-8 minutes'],
      },
      {
        key: 'directions-waterside',
        heading: 'From Waterside Shops',
        paragraphs: ['Shopping District'],
        ordered: [
          'From Waterside Shops at 5415 Tamiami Trail N, head north on US-41',
          'Continue north on Tamiami Trail for approximately 1.5 miles past Pine Ridge Road',
          'Our office is at 4760 Tamiami Trl N # 25, on the right side just before Immokalee Road',
        ],
        bullets: ['4-6 minutes'],
      },
      {
        key: 'access-heading',
        heading: 'Easy Access for Naples Residents',
      },
      {
        key: 'access-location',
        heading: 'Convenient Location',
        paragraphs: [
          'Located directly on US-41, our Naples psychiatric practice is easily accessible from all Naples neighborhoods',
        ],
      },
      {
        key: 'access-parking',
        heading: 'Ample Parking',
        paragraphs: [
          'Free, convenient parking available for all Naples patients visiting our facility',
        ],
      },
      {
        key: 'access-transit',
        heading: 'Transit Friendly',
        paragraphs: [
          'Accessible by public transportation and ride-sharing services from Naples',
        ],
      },
      {
        key: 'access-signage',
        heading: 'Clear Signage',
        paragraphs: [
          'Well-marked building with clear signs to help you find our mental health practice easily',
        ],
      },
      {
        key: 'access-footer',
        paragraphs: [
          'Serving Naples residents with expert psychiatric care at our conveniently located Naples practice. Call (239) 423-0272 for directions or appointment assistance.',
        ],
      },
      {
        key: 'community-heading',
        heading: 'Community Involvement in Naples',
      },
      {
        key: 'community-intro',
        paragraphs: [
          'Mental health is fundamental to building a thriving community. We proudly support Naples through our psychiatric care services and by recognizing the vital organizations that enhance our vibrant city.',
        ],
      },
      {
        key: 'community-botanical',
        heading: 'Naples Botanical Garden',
        paragraphs: [
          'A 170-acre world-class botanical paradise that promotes the connection between people and plants. Their therapeutic gardens, wellness programs, and mindfulness initiatives support mental health and community well-being, serving over 400,000 visitors annually.',
        ],
        bullets: ['Visit Botanical Garden'],
      },
      {
        key: 'community-unitedway',
        heading: 'United Way of Collier County',
        paragraphs: [
          'For over 50 years, United Way has strengthened our Naples community by funding programs that address critical needs. They support mental health initiatives, education, and family stability programs that create lasting change for over 75,000 residents annually.',
        ],
        bullets: ['Learn About Their Mission'],
      },
      {
        key: 'community-graceplace',
        heading: 'Grace Place for Children & Families',
        paragraphs: [
          'Dedicated to breaking the cycle of poverty through education, family support, and community engagement. Their comprehensive programs provide academic support, family counseling, and mental health resources to over 500 children and families in Naples.',
        ],
        bullets: ['Support Their Mission'],
      },
      {
        key: 'video-heading',
        heading: 'A Conversation with Dr. Reve',
      },
      {
        key: 'video-subtitle',
        paragraphs: [
          'Get to know me through these educational videos where I share insights about mental health.',
        ],
      },
      {
        key: 'cta-heading',
        heading: 'Ready to Take the First Step?',
      },
      {
        key: 'cta-body',
        paragraphs: [
          'Change begins with a simple conversation. I am here to listen to you, understand you, and walk with you toward a fuller and more balanced life.',
        ],
      },
      {
        key: 'cta-finePrint',
        paragraphs: [
          'All consultations are completely confidential and protected by medical privacy laws. Your privacy and well-being are our highest priorities.',
        ],
      },
      {
        key: 'final-heading',
        heading: 'Ready to Begin Your Journey?',
      },
      {
        key: 'final-body',
        paragraphs: [
          'Take the first step towards better mental health. Contact us today to schedule your consultation.',
        ],
      },
    ],
  },
  es: {
    title: 'Su Psiquiatra de Confianza en Naples, FL',
    sections: [
      {
        key: 'hero-description',
        paragraphs: ['Atención psiquiátrica integral en el suroeste de Florida.'],
      },
      {
        key: 'hero-badges',
        bullets: ['15+ Años de Experiencia', 'Atención Bilingüe', 'Instalaciones Modernas'],
      },
      {
        key: 'labels',
        bullets: [
          'Programar Consulta',
          'Obtener Direcciones',
          'Reservar Cita',
          'Llamar Ahora',
          'Ver Nuestra Ubicación',
          'Agendar mi Consulta Ahora',
        ],
      },
      {
        key: 'banner-badge',
        paragraphs: ['Ubicación Premium'],
      },
      {
        key: 'banner-heading',
        heading: 'Su Viaje de Sanación Comienza en Nuestra Oficina de Naples',
      },
      {
        key: 'banner-stat',
        paragraphs: ['15+', 'Años sirviendo a la comunidad de Naples con excelencia'],
      },
      {
        key: 'banner-body',
        paragraphs: [
          'Ubicado en el corazón de Naples en Tamiami Trail, nuestra instalación moderna proporciona un ambiente acogedor y cómodo diseñado específicamente para el cuidado de la salud mental. Experimente tratamiento psiquiátrico compasivo en un entorno que prioriza su privacidad y comodidad.',
        ],
      },
      {
        key: 'banner-features',
        bullets: [
          'Estacionamiento Fácil Disponible',
          'Ubicación Accesible',
          'Privado y Confidencial',
          'Instalaciones Modernas',
          'Ambiente Acogedor',
          'Atención Profesional',
        ],
      },
      {
        key: 'services-heading',
        heading: 'Servicios en Esta Ubicación',
      },
      {
        key: 'services-intro',
        paragraphs: [
          'Servicios psiquiátricos integrales disponibles en nuestra ubicación de Naples, adaptados para satisfacer sus necesidades de salud mental con atención compasiva.',
        ],
      },
      {
        key: 'service-anxiety',
        heading: 'Tratamiento de Ansiedad',
        paragraphs: [
          'Atención experta para ataques de pánico, ansiedad social y trastorno de ansiedad generalizada con tratamientos basados en evidencia.',
        ],
        bullets: ['Conocer Tratamiento de Ansiedad'],
      },
      {
        key: 'service-depression',
        heading: 'Tratamiento de Depresión',
        paragraphs: [
          'Atención integral para depresión mayor con planes de tratamiento personalizados y apoyo continuo.',
        ],
        bullets: ['Conocer Tratamiento de Depresión'],
      },
      {
        key: 'service-adhd',
        heading: 'Tratamiento de TDAH',
        paragraphs: [
          'Evaluación especializada y tratamiento para adultos y adolescentes para mejorar el enfoque y funcionamiento diario.',
        ],
        bullets: ['Conocer Tratamiento de TDAH'],
      },
      {
        key: 'service-ptsd',
        heading: 'Tratamiento de TEPT',
        paragraphs: [
          'Atención psiquiátrica informada en trauma para ayudarle a sanar y reclamar su vida de experiencias traumáticas.',
        ],
        bullets: ['Conocer Tratamiento de TEPT'],
      },
      {
        key: 'service-bipolar',
        heading: 'Tratamiento Bipolar',
        paragraphs: [
          'Estabilización experta del ánimo para lograr equilibrio emocional y prevenir episodios futuros.',
        ],
        bullets: ['Conocer Tratamiento Bipolar'],
      },
      {
        key: 'service-medication-management',
        heading: 'Manejo de Medicamentos',
        paragraphs: [
          'Evaluación, monitoreo y ajuste experto de medicamentos psiquiátricos con evaluaciones de seguridad integrales.',
        ],
        bullets: ['Conocer Manejo de Medicamentos'],
      },
      {
        key: 'areas-heading',
        heading: 'Áreas que Servimos',
      },
      {
        key: 'directions-heading',
        heading: 'Cómo Llegar',
      },
      {
        key: 'directions-intro',
        paragraphs: [
          'Nuestra oficina de Naples está convenientemente ubicada en el corazón de la ciudad. Use estos puntos de referencia familiares para encontrarnos fácilmente.',
        ],
      },
      {
        key: 'directions-pier',
        heading: 'Desde Naples Pier',
        paragraphs: ['Downtown Naples'],
        ordered: [
          'Desde Naples Pier en 25 12th Ave S, diríjase al este hacia 5th Avenue S',
          'Gire a la izquierda en US-41 (Tamiami Trail) y diríjase al norte aproximadamente 3 millas',
          'Nuestra práctica psiquiátrica está en 4760 Tamiami Trl N # 25, del lado derecho',
        ],
        bullets: ['8-12 minutos'],
      },
      {
        key: 'directions-airport',
        heading: 'Desde Aeropuerto Municipal Naples',
        paragraphs: ['Airport Access'],
        ordered: [
          'Salga del aeropuerto y diríjase al oeste por Airport Pulling Road hacia US-41',
          'Gire a la derecha en US-41 (Tamiami Trail) y diríjase al norte aproximadamente 2 millas',
          'Busque nuestra práctica de salud mental en 4760 Tamiami Trl N # 25, a la derecha',
        ],
        bullets: ['6-8 minutos'],
      },
      {
        key: 'directions-waterside',
        heading: 'Desde Waterside Shops',
        paragraphs: ['Shopping District'],
        ordered: [
          'Desde Waterside Shops en 5415 Tamiami Trail N, diríjase al norte por US-41',
          'Continúe al norte por Tamiami Trail aproximadamente 1.5 millas pasando Pine Ridge Road',
          'Nuestra oficina está en 4760 Tamiami Trl N # 25, del lado derecho justo antes de Immokalee Road',
        ],
        bullets: ['4-6 minutos'],
      },
      {
        key: 'access-heading',
        heading: 'Fácil Acceso para Residentes de Naples',
      },
      {
        key: 'access-location',
        heading: 'Ubicación Conveniente',
        paragraphs: [
          'Ubicada directamente en US-41, nuestra práctica psiquiátrica en Naples es fácilmente accesible desde todos los vecindarios de Naples',
        ],
      },
      {
        key: 'access-parking',
        heading: 'Amplio Estacionamiento',
        paragraphs: [
          'Estacionamiento gratuito y conveniente disponible para todos los pacientes de Naples que visiten nuestras instalaciones',
        ],
      },
      {
        key: 'access-transit',
        heading: 'Amigable para el Transporte',
        paragraphs: [
          'Accesible por transporte público y servicios de viajes compartidos desde Naples',
        ],
      },
      {
        key: 'access-signage',
        heading: 'Señalización Clara',
        paragraphs: [
          'Edificio bien marcado con señales claras para ayudarle a encontrar nuestra práctica de salud mental fácilmente',
        ],
      },
      {
        key: 'access-footer',
        paragraphs: [
          'Sirviendo a los residentes de Naples con atención psiquiátrica experta en nuestra práctica convenientemente ubicada en Naples. Llame al (239) 423-0272 para direcciones o asistencia con citas.',
        ],
      },
      {
        key: 'community-heading',
        heading: 'Participación Comunitaria en Naples',
      },
      {
        key: 'community-intro',
        paragraphs: [
          'La salud mental es fundamental para construir una comunidad próspera. Apoyamos con orgullo a Naples a través de nuestros servicios de atención psiquiátrica y reconociendo las organizaciones vitales que mejoran nuestra ciudad vibrante.',
        ],
      },
      {
        key: 'community-botanical',
        heading: 'Naples Botanical Garden',
        paragraphs: [
          'Un paraíso botánico de clase mundial de 170 acres que promueve la conexión entre las personas y las plantas. Sus jardines terapéuticos, programas de bienestar e iniciativas de mindfulness apoyan la salud mental y el bienestar comunitario, sirviendo a más de 400,000 visitantes anualmente.',
        ],
        bullets: ['Visitar Jardín Botánico'],
      },
      {
        key: 'community-unitedway',
        heading: 'United Way of Collier County',
        paragraphs: [
          'Por más de 50 años, United Way ha fortalecido nuestra comunidad de Naples financiando programas que abordan necesidades críticas. Apoyan iniciativas de salud mental, educación y programas de estabilidad familiar que crean cambios duraderos para más de 75,000 residentes anualmente.',
        ],
        bullets: ['Conocer Su Misión'],
      },
      {
        key: 'community-graceplace',
        heading: 'Grace Place for Children & Families',
        paragraphs: [
          'Dedicados a romper el ciclo de pobreza a través de educación, apoyo familiar y participación comunitaria. Sus programas integrales proporcionan apoyo académico, consejería familiar y recursos de salud mental a más de 500 niños y familias en Naples.',
        ],
        bullets: ['Apoyar Su Misión'],
      },
      {
        key: 'video-heading',
        heading: 'Una Conversación con la Dra. Reve',
      },
      {
        key: 'video-subtitle',
        paragraphs: [
          'Conóceme a través de estos videos educativos donde comparto conocimientos sobre salud mental.',
        ],
      },
      {
        key: 'cta-heading',
        heading: '¿Listo/a para Dar el Primer Paso?',
      },
      {
        key: 'cta-body',
        paragraphs: [
          'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.',
        ],
      },
      {
        key: 'cta-finePrint',
        paragraphs: [
          'Todas las consultas son completamente confidenciales y están protegidas por las leyes de privacidad médica. Tu privacidad y bienestar son nuestras máximas prioridades.',
        ],
      },
      {
        key: 'final-heading',
        heading: '¿Listo para Comenzar su Viaje?',
      },
      {
        key: 'final-body',
        paragraphs: [
          'Dé el primer paso hacia una mejor salud mental. Contáctenos hoy para programar su consulta.',
        ],
      },
    ],
  },
};
