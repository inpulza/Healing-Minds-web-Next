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
        bullets: ['Doctor of Medicine (MD)', 'Active Florida License ME165518', 'Adult Psychiatry Focus'],
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
          'Follow on TikTok',
        ],
      },
      {
        key: 'biographyHeading',
        heading: 'Meet **Dr. Melva** Reve',
      },
      {
        key: 'biography',
        paragraphs: [
          'My work in **psychiatry** is guided by a deep conviction: everyone deserves care that supports **mental clarity**, **emotional well-being**, and renewed hope through an individualized, evidence-informed approach.',
          'I provide **bilingual psychiatric care in English and Spanish** so patients can discuss their concerns, questions, and treatment in their preferred language. **Language barriers** and stigma should not prevent someone from receiving the care they deserve. My goal is for every patient to feel heard, understood, and respected throughout treatment.',
          'My philosophy is simple but powerful: **healing happens in relationship**. You are not a diagnosis; you are a complete person with a unique story, innate strengths, and unlimited potential for growth. My job is to walk with you on that journey toward **wellness** and **recovery**.',
          "My approach combines the latest advances in **psychiatric medicine** with time-honored principles of **therapeutic alliance**. Whether you're struggling with **anxiety**, **depression**, **ADHD**, **PTSD**, or **bipolar disorder**, I believe in creating a safe space where vulnerability becomes strength and challenges become opportunities for growth.",
          'In my practice in **Naples, Florida**, care may include **medication management**, **psychoeducation**, discussion of lifestyle factors, and collaborative planning based on each person’s needs and goals.',
          "Every session is an opportunity to reclaim your narrative, to rediscover your resilience, and to build the life you deserve. My role as your **psychiatrist** is not just to diagnose and treat, but to walk alongside you as you navigate the path toward **mental wellness**, **emotional balance**, and renewed hope. Together, we'll create a treatment plan that honors your unique circumstances, respects your cultural background, and aligns with your personal goals for recovery and growth.",
        ],
      },
      {
        key: 'credentialsHeading',
        level: 3,
        heading: 'Credentials and Focus Areas',
      },
      {
        key: 'credCertification',
        level: 3,
        heading: 'Florida Medical License',
        paragraphs: ['Active Florida medical license ME165518'],
      },
      {
        key: 'credEducation',
        level: 3,
        heading: 'Medical Degree',
        paragraphs: [
          'Doctor of Medicine (M.D.)',
          'Psychiatric Residency Training',
        ],
      },
      {
        key: 'credSpecialization',
        level: 3,
        heading: 'Areas of Focus',
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
        paragraphs: ['Bilingual care in English and Spanish'],
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
        bullets: ['Doctora en Medicina (MD)', 'Licencia Activa de Florida ME165518', 'Enfoque en Psiquiatría de Adultos'],
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
          'Seguir en TikTok',
        ],
      },
      {
        key: 'biographyHeading',
        heading: 'Conoce a la **Dra. Melva** Reve',
      },
      {
        key: 'biography',
        paragraphs: [
          'Mi trabajo en **psiquiatría** se guía por una convicción profunda: todas las personas merecen atención que apoye la **claridad mental**, el **bienestar emocional** y la esperanza renovada mediante un enfoque individualizado e informado por la evidencia.',
          'Ofrezco **atención psiquiátrica bilingüe en inglés y español** para que los pacientes puedan hablar sobre sus inquietudes, preguntas y tratamiento en su idioma preferido. La **barrera del idioma** y el estigma no deberían impedir que alguien reciba el cuidado que merece. Mi objetivo es que cada paciente se sienta escuchado, entendido y respetado durante su tratamiento.',
          'Mi filosofía es simple pero poderosa: **la sanación sucede en relación**. No eres un diagnóstico; eres una persona completa con una historia única, fortalezas innatas y un potencial ilimitado para el crecimiento. Mi trabajo es caminar contigo en ese viaje hacia el **bienestar** y la **recuperación**.',
          'Mi enfoque combina los últimos avances en **medicina psiquiátrica** con principios consagrados de **alianza terapéutica**. Ya sea que estés luchando con **ansiedad**, **depresión**, **TDAH**, **TEPT** o **trastorno bipolar**, creo en crear un espacio seguro donde la vulnerabilidad se convierte en fortaleza y los desafíos se convierten en oportunidades de crecimiento.',
          'En mi práctica en **Naples, Florida**, la atención puede incluir **manejo de medicamentos**, **psicoeducación**, conversación sobre factores de estilo de vida y planificación colaborativa según las necesidades y metas de cada persona.',
          'Cada sesión es una oportunidad para reclamar tu narrativa, redescubrir tu resistencia y construir la vida que mereces. Mi papel como tu **psiquiatra** no es solo diagnosticar y tratar, sino caminar a tu lado mientras navegas el camino hacia el **bienestar mental**, el **equilibrio emocional** y la esperanza renovada. Juntos, crearemos un plan de tratamiento que honre tus circunstancias únicas, respete tu trasfondo cultural y se alinee con tus metas personales de recuperación y crecimiento.',
        ],
      },
      {
        key: 'credentialsHeading',
        level: 3,
        heading: 'Credenciales y Áreas de Enfoque',
      },
      {
        key: 'credCertification',
        level: 3,
        heading: 'Licencia Médica de Florida',
        paragraphs: ['Licencia médica activa de Florida ME165518'],
      },
      {
        key: 'credEducation',
        level: 3,
        heading: 'Título Médico',
        paragraphs: [
          'Doctora en Medicina (M.D.)',
          'Residencia en Psiquiatría',
        ],
      },
      {
        key: 'credSpecialization',
        level: 3,
        heading: 'Áreas de Enfoque',
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
        paragraphs: ['Atención bilingüe en inglés y español'],
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
