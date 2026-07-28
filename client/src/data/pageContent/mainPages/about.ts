import type { BilingualPageContent } from '../types';

// Inline copy for the About page pair (EN: client/src/pages/About.tsx,
// ES: client/src/pages/AcercaEspanol.tsx). These pages are thin wrappers over
// client/src/components/About.tsx, which renders all of its copy inline (it does
// not read from translations.ts / content.ts), so every visible string of that
// component lives here. The embedded <Reviews /> section is a separate component
// and is out of scope for this module.
//
// Decorated headings use **...** for the inline italic accent span. Biography
// paragraphs use **...** for the inline bold runs (font-bold text-green-600),
// rendered by RichText. Dynamic TikTok video titles/descriptions come from an
// API and are not part of this module.

export const aboutContent: BilingualPageContent = {
  en: {
    title: 'A **Safe Space** to **Heal** and Find **Clarity**',
    sections: [
      {
        key: 'heroSubtitle',
        paragraphs: [
          'I am Dr. Melva Reve, and my mission is to accompany you on your journey toward mental wellness with compassionate care, personalized treatments, and renewed hope.',
        ],
      },
      {
        key: 'heroBadges',
        bullets: ['15+ years experience', 'Bilingual', 'Licensed Psychiatrist'],
      },
      {
        key: 'heroCta',
        paragraphs: ['Schedule Consultation'],
      },
      {
        key: 'videoHeading',
        heading: 'A **Conversation** with Dr. Reve',
        paragraphs: [
          'Get to know me through these educational videos where I share insights about mental health, answer common questions, and provide guidance for your wellness journey.',
        ],
      },
      {
        key: 'videoCta',
        level: 3,
        heading: 'Have a Question for Dr. Reve?',
        paragraphs: [
          'Follow me on TikTok for daily mental health tips and feel free to ask your questions directly!',
          'Follow @dra.melvavidal',
        ],
      },
      {
        key: 'biographyHeading',
        heading: 'Meet **Dr. Melva** Reve',
      },
      {
        key: 'biography',
        paragraphs: [
          'My passion for **psychiatry** was born from a deep conviction: we all deserve to live with **mental clarity**, **emotional peace**, and renewed hope. For over **15 years**, I have had the privilege of accompanying people in their most vulnerable moments and witnessing their incredible transformations through **evidence-based treatment** and **compassionate care**.',
          'As the daughter of immigrants and a **native Spanish speaker**, I deeply understand the unique challenges **Latino families** face when seeking **mental health care**. **Language barriers**, cultural differences, and stigma should not prevent someone from receiving the care they deserve. My **bilingual practice** ensures that every patient feels heard, understood, and respected in their preferred language, creating a bridge of trust that is essential for effective **psychiatric treatment**.',
          'My philosophy is simple but powerful: **healing happens in relationship**. You are not a diagnosis; you are a complete person with a unique story, innate strengths, and unlimited potential for growth. My job is to walk with you on that journey toward **wellness** and **recovery**.',
          "My approach combines the latest advances in **psychiatric medicine** with time-honored principles of **therapeutic alliance**. Whether you're struggling with **anxiety**, **depression**, **ADHD**, **PTSD**, or **bipolar disorder**, I believe in creating a safe space where vulnerability becomes strength and challenges become opportunities for growth.",
          "In my practice in **Naples, Florida**, I've witnessed countless stories of transformation. From the anxious professional who learned to manage their stress, to the mother who overcame postpartum depression, to the teenager who found their voice again after trauma - each journey reminds me why I chose this calling. My commitment extends beyond traditional **medication management** to include **psychoeducation**, **lifestyle interventions**, and collaborative care planning that empowers you to be an active participant in your healing.",
          "Every session is an opportunity to reclaim your narrative, to rediscover your resilience, and to build the life you deserve. My role as your **psychiatrist** is not just to diagnose and treat, but to walk alongside you as you navigate the path toward **mental wellness**, **emotional balance**, and renewed hope. Together, we'll create a treatment plan that honors your unique circumstances, respects your cultural background, and aligns with your personal goals for recovery and growth.",
        ],
      },
      {
        key: 'credentialsHeading',
        level: 3,
        heading: 'Credentials and Training',
      },
      {
        key: 'credCertification',
        level: 3,
        heading: 'Professional Certification',
        paragraphs: ['Specializing in Adult Psychiatry'],
      },
      {
        key: 'credEducation',
        level: 3,
        heading: 'Medical Education',
        paragraphs: [
          'Doctor of Medicine (M.D.)',
          'Psychiatric Residency Training',
          'Specialized Training in Cultural Competency',
        ],
      },
      {
        key: 'credSpecialization',
        level: 3,
        heading: 'Areas of Specialization',
        bullets: [
          'Anxiety Disorders',
          'Depression',
          'Adult ADHD',
          'Trauma and PTSD',
          'Bipolar Disorder',
        ],
      },
      {
        key: 'credLanguages',
        level: 3,
        heading: 'Languages',
        paragraphs: ['Spanish (native)', 'English (fluent)'],
      },
      {
        key: 'processHeading',
        heading: 'Your **Journey** with Us: What to Expect',
        paragraphs: [
          'Our process is designed to make you feel comfortable, heard, and empowered from the very first moment.',
        ],
      },
      {
        key: 'process-1',
        level: 3,
        heading: 'First Consultation: We Listen',
        paragraphs: [
          'A deep, unhurried conversation where you share your story, concerns, and goals. No judgments, only understanding.',
        ],
      },
      {
        key: 'process-2',
        level: 3,
        heading: 'Collaborative Plan: We Design Together',
        paragraphs: [
          'Based on your evaluation, we co-create a clear and realistic treatment plan that respects your values, lifestyle, and preferences.',
        ],
      },
      {
        key: 'process-3',
        level: 3,
        heading: 'Ongoing Support: We Grow with You',
        paragraphs: [
          'Regular follow-up to adjust treatment according to your progress, celebrate your achievements, and navigate together any challenges that arise.',
        ],
      },
      {
        key: 'approachHeading',
        heading: '**Modern**, Human and Collaborative Psychiatry',
        paragraphs: [
          'My practice is not just a distant clinical model. It is a therapeutic alliance where we co-create a wellness plan designed specifically for you, combining evidence-based medicine with deep human understanding.',
        ],
      },
      {
        key: 'approach-1',
        level: 3,
        heading: 'Precise Diagnosis and Personalized Treatment',
        paragraphs: [
          'Comprehensive evaluations that go beyond surface symptoms, identifying underlying causes to create truly personalized treatment strategies.',
        ],
      },
      {
        key: 'approach-2',
        level: 3,
        heading: 'Trauma-Informed Therapy and Cultural Sensitivity',
        paragraphs: [
          'Care that recognizes how past experiences shape the present, with deep sensitivity toward your cultural and linguistic background.',
        ],
      },
      {
        key: 'approach-3',
        level: 3,
        heading: 'Continuous Collaboration and Empowerment',
        paragraphs: [
          'You are the expert in your own life. We work together as partners in your healing, adjusting treatment according to your progress and changing needs.',
        ],
      },
    ],
  },
  es: {
    title: 'Un **Espacio Seguro** para **Sanar** y Encontrar **Claridad**',
    sections: [
      {
        key: 'heroSubtitle',
        paragraphs: [
          'Soy la Dra. Melva Reve, y mi misión es acompañarte en tu camino hacia el bienestar mental con cuidado compasivo, tratamientos personalizados y esperanza renovada.',
        ],
      },
      {
        key: 'heroBadges',
        bullets: ['15+ años experiencia', 'Bilingüe', 'Psiquiatra Licenciada'],
      },
      {
        key: 'heroCta',
        paragraphs: ['Agendar mi Consulta'],
      },
      {
        key: 'videoHeading',
        heading: 'Una **Conversación** con la Dra. Reve',
        paragraphs: [
          'Conóceme a través de estos videos educativos donde comparto conocimientos sobre salud mental, respondo preguntas comunes y brindo orientación para tu viaje de bienestar.',
        ],
      },
      {
        key: 'videoCta',
        level: 3,
        heading: '¿Tienes una Pregunta para la Dra. Reve?',
        paragraphs: [
          '¡Sígueme en TikTok para consejos diarios de salud mental y no dudes en hacer tus preguntas directamente!',
          'Seguir @dra.melvavidal',
        ],
      },
      {
        key: 'biographyHeading',
        heading: 'Conoce a la **Dra. Melva** Reve',
      },
      {
        key: 'biography',
        paragraphs: [
          'Mi pasión por la **psiquiatría** nació de una profunda convicción: todos merecemos vivir con **claridad mental**, **paz emocional** y esperanza renovada. Durante más de **15 años**, he tenido el privilegio de acompañar a personas en sus momentos más vulnerables y ser testigo de sus increíbles transformaciones a través del **tratamiento basado en evidencia** y **cuidado compasivo**.',
          'Como hija de inmigrantes y **hablante nativa de español**, entiendo profundamente los desafíos únicos que enfrentan las **familias latinas** al buscar **atención de salud mental**. La **barrera del idioma**, las diferencias culturales y el estigma no deberían impedir que alguien reciba el cuidado que merece. Mi **práctica bilingüe** asegura que cada paciente se sienta escuchado, entendido y respetado en su idioma preferido, creando un puente de confianza que es esencial para un **tratamiento psiquiátrico** efectivo.',
          'Mi filosofía es simple pero poderosa: **la sanación sucede en relación**. No eres un diagnóstico; eres una persona completa con una historia única, fortalezas innatas y un potencial ilimitado para el crecimiento. Mi trabajo es caminar contigo en ese viaje hacia el **bienestar** y la **recuperación**.',
          'Mi enfoque combina los últimos avances en **medicina psiquiátrica** con principios consagrados de **alianza terapéutica**. Ya sea que estés luchando con **ansiedad**, **depresión**, **TDAH**, **TEPT** o **trastorno bipolar**, creo en crear un espacio seguro donde la vulnerabilidad se convierte en fortaleza y los desafíos se convierten en oportunidades de crecimiento.',
          'En mi práctica en **Naples, Florida**, he sido testigo de innumerables historias de transformación. Desde el profesional ansioso que aprendió a manejar su estrés, hasta la madre que superó la depresión posparto, hasta el adolescente que encontró su voz nuevamente después del trauma - cada viaje me recuerda por qué elegí esta vocación. Mi compromiso se extiende más allá del tradicional **manejo de medicamentos** para incluir **psicoeducación**, **intervenciones de estilo de vida** y planificación de cuidado colaborativo que te empodera a ser un participante activo en tu sanación.',
          'Cada sesión es una oportunidad para reclamar tu narrativa, redescubrir tu resistencia y construir la vida que mereces. Mi papel como tu **psiquiatra** no es solo diagnosticar y tratar, sino caminar a tu lado mientras navegas el camino hacia el **bienestar mental**, el **equilibrio emocional** y la esperanza renovada. Juntos, crearemos un plan de tratamiento que honre tus circunstancias únicas, respete tu trasfondo cultural y se alinee con tus metas personales de recuperación y crecimiento.',
        ],
      },
      {
        key: 'credentialsHeading',
        level: 3,
        heading: 'Credenciales y Formación',
      },
      {
        key: 'credCertification',
        level: 3,
        heading: 'Certificación Profesional',
        paragraphs: ['Especializada en Psiquiatría de Adultos'],
      },
      {
        key: 'credEducation',
        level: 3,
        heading: 'Educación Médica',
        paragraphs: [
          'Doctora en Medicina (M.D.)',
          'Residencia en Psiquiatría',
          'Entrenamiento Especializado en Competencia Cultural',
        ],
      },
      {
        key: 'credSpecialization',
        level: 3,
        heading: 'Áreas de Especialización',
        bullets: [
          'Trastornos de Ansiedad',
          'Depresión',
          'TDAH en Adultos',
          'Trauma y TEPT',
          'Trastorno Bipolar',
        ],
      },
      {
        key: 'credLanguages',
        level: 3,
        heading: 'Idiomas',
        paragraphs: ['Español (nativo)', 'Inglés (fluido)'],
      },
      {
        key: 'processHeading',
        heading: 'Tu Viaje con **Nosotros**: Qué Esperar',
        paragraphs: [
          'Nuestro proceso está diseñado para que te sientas cómodo, escuchado y empoderado desde el primer momento.',
        ],
      },
      {
        key: 'process-1',
        level: 3,
        heading: 'Primera Consulta: Te Escuchamos',
        paragraphs: [
          'Una conversación profunda y sin prisas donde compartes tu historia, tus preocupaciones y tus objetivos. No hay juicios, solo comprensión.',
        ],
      },
      {
        key: 'process-2',
        level: 3,
        heading: 'Plan Colaborativo: Diseñamos Juntos',
        paragraphs: [
          'Basándome en tu evaluación, co-creamos un plan de tratamiento claro y realista que respeta tus valores, estilo de vida y preferencias.',
        ],
      },
      {
        key: 'process-3',
        level: 3,
        heading: 'Apoyo Continuo: Crecemos Contigo',
        paragraphs: [
          'Seguimiento regular para ajustar el tratamiento según tu progreso, celebrar tus logros y navegar juntos cualquier desafío que surja.',
        ],
      },
      {
        key: 'approachHeading',
        heading: 'Psiquiatría **Moderna**, Humana y Colaborativa',
        paragraphs: [
          'Mi práctica no es solo un modelo clínico distante. Es una alianza terapéutica donde co-creamos un plan de bienestar diseñado específicamente para ti, combinando medicina basada en evidencia con comprensión humana profunda.',
        ],
      },
      {
        key: 'approach-1',
        level: 3,
        heading: 'Diagnóstico Preciso y Tratamiento Personalizado',
        paragraphs: [
          'Evaluaciones exhaustivas que van más allá de los síntomas superficiales, identificando las causas subyacentes para crear estrategias de tratamiento verdaderamente personalizadas.',
        ],
      },
      {
        key: 'approach-2',
        level: 3,
        heading: 'Terapia Informada en Trauma y Sensibilidad Cultural',
        paragraphs: [
          'Atención que reconoce cómo las experiencias pasadas moldean el presente, con profunda sensibilidad hacia tu trasfondo cultural y lingüístico.',
        ],
      },
      {
        key: 'approach-3',
        level: 3,
        heading: 'Colaboración Continua y Empoderamiento',
        paragraphs: [
          'Tú eres el experto en tu propia vida. Trabajamos juntos como socios en tu sanación, ajustando el tratamiento según tu progreso y tus necesidades cambiantes.',
        ],
      },
    ],
  },
};
