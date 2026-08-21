// Location-specific FAQ data extracted from provided content
export interface LocationFAQItem {
  question: string;
  answer: string;
}

export interface BilingualLocationFAQs {
  en: LocationFAQItem[];
  es: LocationFAQItem[];
}

export const locationFAQs: Record<string, BilingualLocationFAQs> = {
  bonitaSprings: {
    en: [
      {
        question: "How far is your Naples office from Bonita Springs?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25, south of Bonita Springs. Travel time varies by starting point and traffic, so check live directions before leaving."
      },
      {
        question: "Do you offer telepsychiatry (Telehealth) for Bonita Springs patients?",
        answer: "Patients in Bonita Springs may request a secure video appointment. The office confirms availability, patient location, licensing and clinical suitability when scheduling."
      },
      {
        question: "Is Healing Minds Psychiatry a mental health provider for the Bonita Springs National Art Festival community?",
        answer: "We strongly support Bonita Springs' vibrant artistic community. While we are not an official festival partner, we offer accessible mental health care year-round to support the wellbeing of artists, visitors, and Bonita Springs residents."
      },
      {
        question: "How do I confirm insurance for care serving Bonita Springs?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific mental-health, telehealth and cost-sharing benefits directly with your insurer."
      },
      {
        question: "Do you provide depression treatment in Bonita Springs?",
        answer: "Dr. Reve evaluates adults with depression symptoms and develops an individualized plan. Medication management or coordination with another provider may be discussed when clinically appropriate and, for coordination, with patient consent."
      },
      {
        question: "Does Dr. Melva Reve speak Spanish?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "Do you offer ADHD evaluations for adults near Bonita Springs?",
        answer: "Yes. Dr. Reve conducts psychiatric ADHD evaluations for adults and develops the plan from each patient's clinical findings."
      },
      {
        question: "What is your approach to medication management?",
        answer: "Medication decisions are individualized. Dr. Reve reviews possible benefits, risks, side effects and monitoring needs; the office confirms whether follow-up is in person or by video case by case."
      },
      {
        question: "What is the first appointment like for a new patient from Bonita Springs?",
        answer: "Your first appointment is a comprehensive psychiatric evaluation focused on your history, current concerns and goals. Our office will confirm the appointment length and whether in-person or telehealth is clinically appropriate when scheduling."
      },
      {
        question: "Do you treat Bipolar Disorder?",
        answer: "Dr. Reve evaluates and treats bipolar disorder in adults. Diagnosis, medication options and follow-up plans are individualized after clinical assessment."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Bonita Springs?",
        answer: "Nuestra única oficina está en Naples, en 4760 Tamiami Trl N #25, al sur de Bonita Springs. El tiempo varía según el punto de partida y el tráfico; consulte la ruta en vivo antes de salir."
      },
      {
        question: "¿Ofrecen telepsiquiatría (Telehealth) para pacientes de Bonita Springs?",
        answer: "Los pacientes de Bonita Springs pueden solicitar una cita por video seguro. La oficina confirma disponibilidad, ubicación del paciente, licencias y adecuación clínica al programar."
      },
      {
        question: "¿Es Healing Minds Psychiatry un proveedor de salud mental para la comunidad del Bonita Springs National Art Festival?",
        answer: "Apoyamos firmemente la vibrante comunidad artística de Bonita Springs. Si bien no somos un socio oficial del festival, ofrecemos atención de salud mental accesible durante todo el año para apoyar el bienestar de los artistas, visitantes y residentes de Bonita Springs."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Bonita Springs?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique directamente con su aseguradora sus beneficios de salud mental, telesalud y costos compartidos."
      },
      {
        question: "¿Proporcionan tratamiento de depresión en Bonita Springs?",
        answer: "La Dra. Reve evalúa y trata la depresión en adultos. El plan puede incluir manejo de medicamentos y, con consentimiento, conversación sobre coordinación con otro profesional caso por caso."
      },
      {
        question: "¿La Dra. Melva Reve habla español?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Ofrecen evaluaciones de TDAH (ADHD) para adultos cerca de Bonita Springs?",
        answer: "Sí. La Dra. Reve realiza evaluaciones psiquiátricas de TDAH en adultos y desarrolla el plan según los hallazgos clínicos de cada paciente."
      },
      {
        question: "¿Cuál es su enfoque para el manejo de medicamentos (medication management)?",
        answer: "Las decisiones sobre medicamentos son individualizadas. La Dra. Reve revisa posibles beneficios, riesgos, efectos secundarios y necesidades de monitoreo; la oficina confirma caso por caso si el seguimiento es presencial o por video."
      },
      {
        question: "¿Cómo es la primera cita para un paciente nuevo de Bonita Springs?",
        answer: "Su primera cita es una evaluación psiquiátrica integral centrada en su historial, preocupaciones actuales y objetivos. La oficina confirmará la duración y si la modalidad presencial o por telesalud es clínicamente apropiada al programarla."
      },
      {
        question: "¿Tratan el trastorno bipolar (Bipolar Disorder)?",
        answer: "La Dra. Reve evalúa y trata el trastorno bipolar en adultos. El diagnóstico, las opciones de medicamentos y el seguimiento se individualizan después de la evaluación clínica."
      }
    ]
  },

  marcoIsland: {
    en: [
      {
        question: "Is telepsychiatry the best option for Marco Island patients?",
        answer: "Telepsychiatry may reduce travel from Marco Island when it is clinically appropriate and the patient is physically located where Dr. Reve is authorized to provide care. Our office confirms eligibility and modality when scheduling."
      },
      {
        question: "How do I get to your Naples office from Marco Island?",
        answer: "Take Collier Boulevard (CR 951) north, turn onto US-41 (Tamiami Trail N) and continue to our Park Shore office. Check current directions and confirm parking or accessibility details with the office before your visit."
      },
      {
        question: "I'm a seasonal resident (\"snowbird\") on Marco Island. Can you coordinate care with my primary doctor up north?",
        answer: "With the patient's consent, our office can discuss case-by-case coordination and secure record sharing with other providers. Care and telehealth availability depend on where the patient is physically located and applicable licensing rules."
      },
      {
        question: "Does Dr. Reve offer Spanish consultations for the Marco Island community?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish. The office confirms appointment modality case by case."
      },
      {
        question: "Do you offer anxiety treatment for Marco Island patients?",
        answer: "Yes, we treat a wide range of anxiety disorders. We understand the unique lifestyle pressures and offer medication management plans and coping strategies for Marco Island residents."
      },
      {
        question: "How do I confirm insurance for care serving Marco Island?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "What mental health services do you offer related to events like the Marco Island Seafood & Music Festival?",
        answer: "While we are not directly affiliated with the festival, we strongly support community events. We offer social anxiety and stress management so you can fully enjoy our region's community events."
      },
      {
        question: "How does medication management work through telemedicine?",
        answer: "Our office confirms whether the initial evaluation and follow-ups should be in person or by secure video based on clinical needs, the patient's physical location and applicable licensing rules. Pharmacy arrangements are confirmed case by case."
      },
      {
        question: "Do you treat PTSD at your clinic?",
        answer: "Yes. We offer trauma-informed psychiatric evaluation and treatment for PTSD. The office confirms whether an in-person or secure video appointment is clinically appropriate."
      },
      {
        question: "What age should patients be for ADHD treatment?",
        answer: "Dr. Reve conducts psychiatric ADHD evaluations for adults 18 and older and discusses treatment options based on the individual findings."
      }
    ],
    es: [
      {
        question: "¿Es la telepsiquiatría la mejor opción para los pacientes de Marco Island?",
        answer: "La telepsiquiatría puede reducir los viajes desde Marco Island cuando sea clínicamente apropiada y el paciente se encuentre físicamente donde la Dra. Reve esté autorizada a atender. La oficina confirma elegibilidad y modalidad al programar."
      },
      {
        question: "¿Cómo llego a su oficina de Naples desde Marco Island?",
        answer: "Tome Collier Boulevard (CR 951) hacia el norte, gire en US-41 (Tamiami Trail N) y continúe hasta nuestra oficina en Park Shore. Consulte indicaciones actuales y confirme con la oficina los detalles de estacionamiento o accesibilidad antes de su visita."
      },
      {
        question: "Soy un residente estacional (\"snowbird\") en Marco Island. ¿Pueden coordinar la atención con mi médico de cabecera en el norte?",
        answer: "Con el consentimiento del paciente, la oficina puede evaluar caso por caso la coordinación y el intercambio seguro de registros con otros proveedores. La atención y la telesalud dependen de dónde esté físicamente el paciente y de las licencias aplicables."
      },
      {
        question: "¿La Dra. Reve ofrece consultas en español para la comunidad de Marco Island?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español. La oficina confirma la modalidad caso por caso."
      },
      {
        question: "¿Ofrecen tratamiento para la ansiedad (anxiety treatment) para pacientes de Marco Island?",
        answer: "Sí, tratamos una amplia gama de trastornos de ansiedad. Entendemos las presiones únicas del estilo de vida y ofrecemos planes de manejo de medicamentos y estrategias de afrontamiento para residentes de Marco Island."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Marco Island?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Qué servicios de salud mental ofrecen relacionados con eventos como el Marco Island Seafood & Music Festival?",
        answer: "Si bien no estamos afiliados directamente al festival, apoyamos firmemente los eventos comunitarios. Ofrecemos manejo de la ansiedad social y el estrés para que pueda disfrutar plenamente de los eventos comunitarios de nuestra región."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos por telemedicina?",
        answer: "La oficina confirma si la evaluación inicial y los seguimientos deben ser presenciales o por video seguro según las necesidades clínicas, la ubicación física del paciente y las licencias aplicables. Los arreglos con la farmacia se confirman caso por caso."
      },
      {
        question: "¿Tratan el TEPT (PTSD) en su clínica?",
        answer: "Sí. Ofrecemos evaluación y tratamiento psiquiátrico informado en trauma para el TEPT. La oficina confirma si una cita presencial o por video seguro es clínicamente apropiada."
      },
      {
        question: "¿Qué edad deben tener los pacientes para el tratamiento de TDAH?",
        answer: "La Dra. Reve realiza evaluaciones psiquiátricas de TDAH para adultos de 18 años en adelante y conversa sobre opciones de tratamiento según los hallazgos individuales."
      }
    ]
  },

  estero: {
    en: [
      {
        question: "How far is your Naples office from Estero, near FGCU?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25. Travel from Estero varies by starting point and traffic, so check live directions before leaving."
      },
      {
        question: "Do you offer telepsychiatry services for FGCU students or Estero residents?",
        answer: "FGCU students and Estero residents may request a secure video appointment for psychiatric evaluation or medication management. The office confirms availability and clinical suitability when scheduling."
      },
      {
        question: "I'm moving to Estero for college. Can you take over my ADHD management?",
        answer: "The office can discuss whether adult ADHD care is appropriate and whether coordination with a previous psychiatrist may be considered. Any coordination is evaluated case by case and requires the patient’s consent."
      },
      {
        question: "Is depression treatment different for young adults in the Estero area?",
        answer: "Dr. Reve evaluates depression in adults and individualizes treatment options after clinical assessment. Medication benefits, risks and monitoring are reviewed case by case."
      },
      {
        question: "How do I confirm insurance for care serving Estero?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Does Dr. Reve speak Spanish?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "Do you visit Koreshan State Park? Do you support local Estero events?",
        answer: "Koreshan State Park is a local Estero landmark. Healing Minds provides psychiatric services from its Naples office and does not claim an official relationship with the park or local events."
      },
      {
        question: "What is a first psychiatric evaluation like?",
        answer: "It's a comprehensive conversation to understand your history, current symptoms and goals. Our office confirms the appointment length and whether in-person or telehealth is clinically appropriate when scheduling."
      },
      {
        question: "Do you treat anxiety disorders, like social anxiety?",
        answer: "Yes. Dr. Reve evaluates anxiety symptoms in adults and discusses treatment options, which may include medication management when clinically appropriate."
      },
      {
        question: "Do you treat Bipolar Disorder?",
        answer: "Dr. Reve evaluates and treats bipolar disorder in adults. Diagnosis, medication options and follow-up plans are individualized after clinical assessment."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Estero, cerca de FGCU?",
        answer: "US-41 (Tamiami Trail) conecta Estero con nuestra oficina de Park Shore hacia el sur. Consulte indicaciones y tráfico actuales antes de viajar."
      },
      {
        question: "¿Ofrecen servicios de telepsiquiatría para estudiantes de FGCU o residentes de Estero?",
        answer: "Los estudiantes de FGCU y residentes de Estero pueden solicitar una cita por video seguro para evaluación psiquiátrica o manejo de medicamentos. La oficina confirma disponibilidad y adecuación clínica al programar."
      },
      {
        question: "Me mudo a Estero por la universidad. ¿Pueden hacerse cargo de mi manejo de TDAH (ADHD)?",
        answer: "La oficina puede discutir si la atención de TDAH en adultos es apropiada y si puede considerarse coordinación con un psiquiatra anterior. Toda coordinación se evalúa caso por caso y requiere el consentimiento del paciente."
      },
      {
        question: "¿El tratamiento de la depresión es diferente para los adultos jóvenes en el área de Estero?",
        answer: "La Dra. Reve evalúa la depresión en adultos e individualiza las opciones de tratamiento después de la evaluación clínica. Los beneficios, riesgos y monitoreo de medicamentos se revisan caso por caso."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Estero?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿La Dra. Reve habla español?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Visitan el Koreshan State Park? ¿Apoyan los eventos locales de Estero?",
        answer: "Como entusiastas de la comunidad del Suroeste de Florida, valoramos hitos locales únicos como el Koreshan State Park. Estamos comprometidos con el bienestar general de la comunidad de Estero y apoyamos las iniciativas locales de salud mental."
      },
      {
        question: "¿Cómo es una primera evaluación psiquiátrica?",
        answer: "Es una conversación integral para comprender su historial, síntomas actuales y objetivos. La oficina confirma la duración y si la modalidad presencial o por telesalud es clínicamente apropiada al programarla."
      },
      {
        question: "¿Tratan los trastornos de ansiedad, como la ansiedad social?",
        answer: "Sí. La Dra. Reve evalúa síntomas de ansiedad en adultos y conversa sobre opciones de tratamiento, que pueden incluir manejo de medicamentos cuando sea clínicamente apropiado."
      },
      {
        question: "¿Tratan el Trastorno Bipolar?",
        answer: "La Dra. Reve evalúa y trata el trastorno bipolar en adultos. El diagnóstico, las opciones de medicamentos y el seguimiento se individualizan después de la evaluación clínica."
      }
    ]
  },

  goldenGate: {
    en: [
      {
        question: "Is your Naples clinic accessible from Golden Gate?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25. Travel from Golden Gate varies by starting point and traffic, so check live directions before leaving."
      },
      {
        question: "Do you offer telepsychiatry for Golden Gate residents?",
        answer: "You may request a visit through a secure video platform. The office confirms availability, clinical suitability, patient location and applicable licensing requirements case by case."
      },
      {
        question: "How do I confirm insurance for care serving Golden Gate?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Do you provide Spanish-speaking services for Golden Gate residents?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "Do you treat anxiety and depression for Golden Gate patients?",
        answer: "Dr. Reve evaluates and treats anxiety and depression in adults. Treatment options are discussed after an individual psychiatric assessment."
      },
      {
        question: "What is the driving distance from Golden Gate to your office?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25. Travel time from Golden Gate varies by starting point and traffic, so check live directions before leaving."
      },
      {
        question: "Do you offer ADHD evaluations for adults living in Golden Gate?",
        answer: "Yes. Dr. Reve conducts psychiatric ADHD evaluations for adults and develops the plan from each patient's clinical findings."
      },
      {
        question: "How does medication management work for Golden Gate patients?",
        answer: "Medication management may be available in person or by secure video when clinically appropriate. Benefits, risks, monitoring and pharmacy arrangements are reviewed for each patient."
      },
      {
        question: "Do you treat PTSD and trauma for Golden Gate residents?",
        answer: "Yes, we provide trauma-informed psychiatric care for PTSD. Our approach combines medication management with coordination of therapeutic services for comprehensive healing."
      },
      {
        question: "What should Golden Gate patients expect for their first appointment?",
        answer: "Your initial evaluation reviews your mental health history, current symptoms and treatment goals. Our office confirms the length and whether in-person or secure video is clinically appropriate when scheduling."
      }
    ],
    es: [
      {
        question: "¿Su clínica de Naples es accesible desde Golden Gate?",
        answer: "Nuestra única oficina está en Naples, en 4760 Tamiami Trl N #25. El viaje desde Golden Gate varía según el punto de partida y el tráfico; consulte la ruta en vivo antes de salir."
      },
      {
        question: "¿Ofrecen telepsiquiatría para residentes de Golden Gate?",
        answer: "Puede solicitar una visita mediante una plataforma de video segura. La oficina confirma disponibilidad, adecuación clínica, ubicación del paciente y requisitos de licencia aplicables caso por caso."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Golden Gate?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Proporcionan servicios en español para residentes de Golden Gate?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Tratan ansiedad y depresión para pacientes de Golden Gate?",
        answer: "La Dra. Reve evalúa y trata ansiedad y depresión en adultos. Las opciones de tratamiento se conversan después de una evaluación psiquiátrica individual."
      },
      {
        question: "¿Cuál es la distancia de manejo desde Golden Gate hasta su oficina?",
        answer: "Nuestra única oficina está en Naples, en 4760 Tamiami Trl N #25. El tiempo desde Golden Gate varía según el punto de partida y el tráfico; consulte la ruta en vivo antes de salir."
      },
      {
        question: "¿Ofrecen evaluaciones de TDAH para adultos que viven en Golden Gate?",
        answer: "Sí. La Dra. Reve realiza evaluaciones psiquiátricas de TDAH en adultos y desarrolla el plan según los hallazgos clínicos de cada paciente."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos para pacientes de Golden Gate?",
        answer: "El manejo de medicamentos puede estar disponible en persona o por video seguro cuando sea clínicamente apropiado. Beneficios, riesgos, monitoreo y arreglos con la farmacia se revisan para cada paciente."
      },
      {
        question: "¿Tratan TEPT y trauma para residentes de Golden Gate?",
        answer: "Sí, proporcionamos atención psiquiátrica informada en trauma para TEPT. Nuestro enfoque combina manejo de medicamentos con coordinación de servicios terapéuticos para sanación integral."
      },
      {
        question: "¿Qué deben esperar los pacientes de Golden Gate para su primera cita?",
        answer: "Su evaluación inicial revisa su historial de salud mental, síntomas actuales y objetivos de tratamiento. La oficina confirma la duración y si la modalidad presencial o por video seguro es clínicamente apropiada al programarla."
      }
    ]
  },

  vanderbiltBeach: {
    en: [
      {
        question: "How close is your Naples office to Vanderbilt Beach?",
        answer: "Our only office is at 4760 Tamiami Trl N #25, Naples, FL 34103. Travel time from Vanderbilt Beach varies by starting point and traffic, so check current directions before leaving."
      },
      {
        question: "Do you offer telehealth services for Vanderbilt Beach residents?",
        answer: "Vanderbilt Beach residents may request a secure video appointment. The office confirms availability, patient location, licensing and clinical suitability when scheduling."
      },
      {
        question: "How do I confirm insurance for care serving Vanderbilt Beach?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Do you provide bilingual services for the Vanderbilt Beach community?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "Do you treat seasonal depression or beach lifestyle-related mental health concerns?",
        answer: "Dr. Reve evaluates anxiety, depression and stress related to life transitions. Symptoms and treatment options are assessed individually."
      },
      {
        question: "Can you coordinate care for snowbirds who split time between Vanderbilt Beach and up north?",
        answer: "You may discuss continuity needs with the office. Coordination with another provider may be evaluated case by case and requires the patient’s consent; availability and licensing requirements still apply."
      },
      {
        question: "Do you offer ADHD treatment for adults living near Vanderbilt Beach?",
        answer: "Yes. Dr. Reve conducts psychiatric ADHD evaluations for adults and discusses ongoing treatment options based on the individual assessment."
      },
      {
        question: "How does parking work at your office for Vanderbilt Beach patients?",
        answer: "Contact the office before your visit to confirm current parking, arrival or accessibility details."
      },
      {
        question: "Do you treat anxiety related to lifestyle changes or retirement in the Vanderbilt Beach area?",
        answer: "Dr. Reve can evaluate anxiety or mood symptoms related to retirement, relocation and other life transitions. Care is individualized after clinical assessment."
      },
      {
        question: "What's the best way to schedule an appointment from Vanderbilt Beach?",
        answer: "Call our office at (239) 423-0272 or use our online contact form. Appointment availability varies, and the office will confirm the available times."
      }
    ],
    es: [
      {
        question: "¿Qué tan cerca está su oficina de Naples a Vanderbilt Beach?",
        answer: "Nuestra única oficina está en 4760 Tamiami Trl N #25, Naples, FL 34103. El tiempo de viaje desde Vanderbilt Beach varía según el punto de partida y el tráfico; consulte indicaciones actuales antes de salir."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Vanderbilt Beach?",
        answer: "Los residentes de Vanderbilt Beach pueden solicitar una cita por video seguro. La oficina confirma disponibilidad, ubicación del paciente, licencias y adecuación clínica al programar."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Vanderbilt Beach?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Proporcionan servicios bilingües para la comunidad de Vanderbilt Beach?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Tratan depresión estacional o problemas de salud mental relacionados con el estilo de vida playero?",
        answer: "Sí, entendemos los aspectos únicos de salud mental de vivir en una comunidad playera, incluyendo patrones estacionales y transiciones de estilo de vida. Proporcionamos atención integral para todos los tipos de depresión y ansiedad."
      },
      {
        question: "¿Pueden coordinar atención para snowbirds que dividen el tiempo entre Vanderbilt Beach y el norte?",
        answer: "Puede discutir sus necesidades de continuidad con la oficina. La coordinación con otro proveedor puede evaluarse caso por caso y requiere el consentimiento del paciente; también aplican disponibilidad y requisitos de licencia."
      },
      {
        question: "¿Ofrecen tratamiento de TDAH para adultos que viven cerca de Vanderbilt Beach?",
        answer: "Sí. La Dra. Reve realiza evaluaciones psiquiátricas de TDAH en adultos y conversa sobre opciones de tratamiento continuo según la evaluación individual."
      },
      {
        question: "¿Cómo funciona el estacionamiento en su oficina para pacientes de Vanderbilt Beach?",
        answer: "Contacte la oficina antes de su visita para confirmar detalles actuales de estacionamiento, llegada o accesibilidad."
      },
      {
        question: "¿Tratan ansiedad relacionada con cambios de estilo de vida o jubilación en el área de Vanderbilt Beach?",
        answer: "La Dra. Reve puede evaluar síntomas de ansiedad o ánimo relacionados con jubilación, reubicación y otras transiciones de vida. La atención se individualiza después de la evaluación clínica."
      },
      {
        question: "¿Cuál es la mejor manera de programar una cita desde Vanderbilt Beach?",
        answer: "Llame a nuestra oficina al (239) 423-0272 o use nuestro formulario de contacto en línea. La disponibilidad varía y la oficina confirmará los horarios disponibles."
      }
    ]
  },

  fortMyers: {
    en: [
      {
        question: "How far is your Naples office from Fort Myers?",
        answer: "Our only physical office is in Naples, south of Fort Myers. Travel time varies by starting point and traffic; patients may also ask whether telehealth is appropriate for their appointment."
      },
      {
        question: "Do you offer telehealth services for Fort Myers patients?",
        answer: "Fort Myers patients may request a secure video appointment. The office confirms availability, patient location, licensing and clinical suitability when scheduling."
      },
      {
        question: "What mental health services do you provide for Fort Myers residents?",
        answer: "We offer comprehensive psychiatric care including anxiety treatment, depression management, ADHD evaluation and treatment, PTSD therapy, bipolar disorder treatment, and psychiatric medication management for Fort Myers residents."
      },
      {
        question: "How do I confirm insurance for care serving Fort Myers?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Does Dr. Reve provide services in Spanish for Fort Myers patients?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "Can you help with ADHD evaluations for Fort Myers adults?",
        answer: "Yes. Dr. Reve conducts psychiatric ADHD evaluations for adults and develops the plan from each patient's clinical findings."
      },
      {
        question: "How do you coordinate care with other providers in Fort Myers?",
        answer: "With patient consent, the office can discuss whether coordination or record sharing with another provider is appropriate. Any coordination is evaluated case by case and no local-provider relationship is implied."
      },
      {
        question: "What should Fort Myers patients expect for their first appointment?",
        answer: "Your initial psychiatric evaluation reviews your mental health history, current concerns, and treatment goals. The office will confirm the appointment length and whether in-person or telehealth is appropriate when you schedule."
      },
      {
        question: "Do you treat anxiety and depression for Fort Myers residents?",
        answer: "The practice evaluates adults with anxiety and depression and may discuss medication management when clinically appropriate. With patient consent, the office can evaluate coordination with another provider case by case."
      },
      {
        question: "How does medication management work for Fort Myers patients?",
        answer: "Medication management follow-up may be in person or by secure video when clinically appropriate. The office confirms modality and pharmacy arrangements case by case."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Fort Myers?",
        answer: "Nuestra única oficina física está en Naples, al sur de Fort Myers. El tiempo de viaje varía según el punto de partida y el tráfico; también puede consultar si la telesalud es apropiada para su cita."
      },
      {
        question: "¿Ofrecen servicios de telesalud para pacientes de Fort Myers?",
        answer: "Los pacientes de Fort Myers pueden solicitar una cita por video seguro. La oficina confirma disponibilidad, ubicación del paciente, licencias y adecuación clínica al programar."
      },
      {
        question: "¿Qué servicios de salud mental proporcionan para residentes de Fort Myers?",
        answer: "Ofrecemos atención psiquiátrica integral incluyendo tratamiento de ansiedad, manejo de depresión, evaluación y tratamiento de TDAH, terapia de TEPT, tratamiento de trastorno bipolar, y manejo de medicamentos psiquiátricos para residentes de Fort Myers."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Fort Myers?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿La Dra. Reve proporciona servicios en español para pacientes de Fort Myers?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Pueden ayudar con evaluaciones de TDAH para adultos de Fort Myers?",
        answer: "Sí. La Dra. Reve realiza evaluaciones psiquiátricas de TDAH en adultos y desarrolla el plan según los hallazgos clínicos de cada paciente."
      },
      {
        question: "¿Cómo coordinan la atención con otros proveedores en Fort Myers?",
        answer: "Con consentimiento del paciente, la oficina puede discutir si la coordinación o el intercambio de registros con otro proveedor es apropiado. Toda coordinación se evalúa caso por caso y no implica una relación con proveedores locales."
      },
      {
        question: "¿Qué deben esperar los pacientes de Fort Myers para su primera cita?",
        answer: "Su evaluación psiquiátrica inicial revisa su historial de salud mental, preocupaciones actuales y objetivos de tratamiento. La oficina confirmará la duración y si la modalidad presencial o de telesalud es apropiada cuando programe la cita."
      },
      {
        question: "¿Tratan ansiedad y depresión para residentes de Fort Myers?",
        answer: "La Dra. Reve evalúa y trata ansiedad y depresión en adultos. Con consentimiento del paciente, puede conversar sobre coordinación con otro profesional caso por caso, sin implicar una relación establecida."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos para pacientes de Fort Myers?",
        answer: "El seguimiento del manejo de medicamentos puede ser presencial o por video seguro cuando sea clínicamente apropiado. La oficina confirma la modalidad y los arreglos con la farmacia caso por caso."
      }
    ]
  },

  immokalee: {
    en: [
      {
        question: "How far is the drive from Immokalee to your Naples office?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25. Travel from Immokalee varies by starting point, route and live traffic; check current directions before leaving."
      },
      {
        question: "Do you offer telehealth services for Immokalee residents?",
        answer: "Immokalee residents may request a secure video appointment. The office confirms availability, patient location, licensing and clinical suitability when scheduling."
      },
      {
        question: "Do you provide mental health services in Spanish for the Immokalee community?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "How do I confirm insurance for care serving Immokalee?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Do you provide psychiatric services to adults in Immokalee?",
        answer: "Yes. Dr. Reve provides psychiatric evaluation and treatment for adults in Immokalee. Care is individualized after clinical assessment and appointments are available in English or Spanish."
      },
      {
        question: "Can you help with work-related stress and anxiety for Immokalee workers?",
        answer: "Dr. Reve can evaluate anxiety, depression and stress-related symptoms in adults. Symptoms and treatment options are assessed individually."
      },
      {
        question: "What weekday appointment options are available for Immokalee patients?",
        answer: "Appointments are offered during our published Monday through Friday, 8:00 AM to 5:00 PM office hours. Tell us your availability when scheduling, and we'll help identify an available weekday time."
      },
      {
        question: "How do you handle language barriers or cultural concerns for Immokalee patients?",
        answer: "Dr. Reve speaks Spanish, and appointments may be conducted in English or Spanish. Family involvement is discussed with the patient and requires appropriate consent."
      },
      {
        question: "Can you help coordinate care with community health centers in Immokalee?",
        answer: "With the patient's consent, our office can evaluate case-by-case coordination and secure record sharing with a patient's existing community providers. Call the office to discuss the specific request."
      },
      {
        question: "Do you treat trauma and PTSD for Immokalee residents?",
        answer: "Yes. Dr. Reve provides trauma-informed psychiatric evaluation and treatment for PTSD in adults. The treatment plan is individualized after clinical assessment."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está el viaje desde Immokalee hasta su oficina en Naples?",
        answer: "Nuestra única oficina está en Naples, en 4760 Tamiami Trl N #25. El viaje desde Immokalee varía según el punto de partida, la ruta y el tráfico en vivo; consulte indicaciones actuales antes de salir."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Immokalee?",
        answer: "Los residentes de Immokalee pueden solicitar una cita por video seguro. La oficina confirma disponibilidad, ubicación del paciente, licencias y adecuación clínica al programar."
      },
      {
        question: "¿Proporcionan servicios de salud mental en español para la comunidad de Immokalee?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Immokalee?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Proporcionan servicios psiquiátricos a adultos en Immokalee?",
        answer: "Sí. La Dra. Reve proporciona evaluación y tratamiento psiquiátrico para adultos en Immokalee. La atención se individualiza después de la evaluación clínica y las citas están disponibles en inglés o español."
      },
      {
        question: "¿Pueden ayudar con estrés y ansiedad relacionados al trabajo para trabajadores de Immokalee?",
        answer: "Absolutamente. Tratamos ansiedad, depresión, y condiciones relacionadas al estrés que pueden surgir de condiciones de trabajo desafiantes, patrones de empleo estacional, y otros factores estresantes ocupacionales comunes en el trabajo agrícola."
      },
      {
        question: "¿Qué opciones de citas entre semana están disponibles para pacientes de Immokalee?",
        answer: "Las citas se ofrecen dentro de nuestro horario de oficina publicado, de lunes a viernes de 8:00 AM a 5:00 PM. Indíquenos su disponibilidad al programar y le ayudaremos a identificar un horario disponible entre semana."
      },
      {
        question: "¿Cómo manejan las barreras del idioma o preocupaciones culturales para pacientes de Immokalee?",
        answer: "La Dra. Reve habla español y las citas pueden realizarse en inglés o español. La participación familiar se conversa con el paciente y requiere el consentimiento correspondiente."
      },
      {
        question: "¿Pueden ayudar a coordinar atención con centros de salud comunitarios en Immokalee?",
        answer: "Con el consentimiento del paciente, la oficina puede evaluar caso por caso la coordinación y el intercambio seguro de registros con los proveedores comunitarios actuales del paciente. Llame para comentar la solicitud específica."
      },
      {
        question: "¿Tratan trauma y TEPT para residentes de Immokalee?",
        answer: "Sí. La Dra. Reve proporciona evaluación y tratamiento psiquiátrico informado en trauma para el TEPT en adultos. El plan se individualiza después de la evaluación clínica."
      }
    ]
  },

  aveMaria: {
    en: [
      {
        question: "How far is your Naples office from Ave Maria?",
        answer: "Our only office is in Naples at 4760 Tamiami Trl N #25. Travel from Ave Maria varies by starting point, route and live traffic; check current directions before leaving."
      },
      {
        question: "Do you provide telehealth services for Ave Maria University students and residents?",
        answer: "Secure video consultations may be available when clinically appropriate and when the patient is physically located where Dr. Reve is authorized to provide care. The office confirms eligibility and appointment availability when scheduling."
      },
      {
        question: "Do you treat college students from Ave Maria University?",
        answer: "Dr. Reve evaluates and treats adults, including college students, for concerns such as anxiety, depression, ADHD and stress related to life transitions. Care is based on an individual assessment."
      },
      {
        question: "How do I confirm insurance for care serving Ave Maria?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Do you provide ADHD evaluations and treatment for Ave Maria students?",
        answer: "Yes. Dr. Reve conducts psychiatric ADHD evaluations for adults, including college students, and discusses treatment options based on the individual findings."
      },
      {
        question: "Can you help with anxiety and depression related to college life in Ave Maria?",
        answer: "Dr. Reve can evaluate anxiety, depression and stress related to college life in adults. Symptoms and treatment options are assessed individually."
      },
      {
        question: "Do you coordinate care with Ave Maria University counseling services?",
        answer: "With the patient's consent, our office can evaluate case-by-case coordination and secure record sharing with the patient's current counseling provider. No university partnership is implied."
      },
      {
        question: "Can you provide services in Spanish for Ave Maria's diverse community?",
        answer: "Yes. Psychiatric appointments with Dr. Reve are available in English or Spanish."
      },
      {
        question: "What should Ave Maria students expect for their first appointment?",
        answer: "The initial evaluation reviews current concerns, psychiatric history and treatment goals. The plan is individualized from the clinical assessment."
      },
      {
        question: "Do you provide crisis support for Ave Maria students?",
        answer: "We do not provide 24/7 crisis services. In an emergency, call 911 or 988 or go to the nearest emergency department. Contact the office during published hours for non-emergency scheduling."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Ave Maria?",
        answer: "Nuestra única oficina está en Naples, en 4760 Tamiami Trl N #25. El viaje desde Ave Maria varía según el punto de partida, la ruta y el tráfico en vivo; consulte indicaciones actuales antes de salir."
      },
      {
        question: "¿Proporcionan servicios de telesalud para estudiantes y residentes de Ave Maria University?",
        answer: "Las consultas por video seguro pueden estar disponibles cuando sean clínicamente apropiadas y el paciente esté físicamente donde la Dra. Reve esté autorizada a atender. La oficina confirma elegibilidad y disponibilidad al programar."
      },
      {
        question: "¿Tratan estudiantes universitarios de Ave Maria University?",
        answer: "La Dra. Reve evalúa y trata a adultos, incluidos estudiantes universitarios, por inquietudes como ansiedad, depresión, TDAH y estrés relacionado con transiciones de vida. La atención se basa en una evaluación individual."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Ave Maria?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Proporcionan evaluaciones y tratamiento de TDAH para estudiantes de Ave Maria?",
        answer: "Sí. La Dra. Reve realiza evaluaciones psiquiátricas de TDAH en adultos, incluidos estudiantes universitarios, y conversa sobre opciones de tratamiento según los hallazgos individuales."
      },
      {
        question: "¿Pueden ayudar con ansiedad y depresión relacionadas a la vida universitaria en Ave Maria?",
        answer: "La Dra. Reve puede evaluar ansiedad, depresión y estrés relacionado con la vida universitaria en adultos. Los síntomas y opciones de tratamiento se evalúan de forma individual."
      },
      {
        question: "¿Coordinan atención con los servicios de consejería de Ave Maria University?",
        answer: "Con el consentimiento del paciente, la oficina puede evaluar caso por caso la coordinación y el intercambio seguro de registros con su proveedor actual de consejería. Esto no implica una asociación universitaria."
      },
      {
        question: "¿Pueden proporcionar servicios en español para la comunidad diversa de Ave Maria?",
        answer: "Sí. Las citas psiquiátricas con la Dra. Reve están disponibles en inglés o español."
      },
      {
        question: "¿Qué deben esperar los estudiantes de Ave Maria para su primera cita?",
        answer: "La evaluación inicial revisa las inquietudes actuales, el historial psiquiátrico y los objetivos de tratamiento. El plan se individualiza a partir de la evaluación clínica."
      },
      {
        question: "¿Proporcionan apoyo de crisis para estudiantes de Ave Maria?",
        answer: "No proporcionamos servicios de crisis 24/7. En una emergencia, llame al 911 o 988 o acuda al departamento de emergencias más cercano. Contacte la oficina dentro del horario publicado para programación no urgente."
      }
    ]
  },

  lelyResorts: {
    en: [
      {
        question: "How close is your Naples office to Lely Resort?",
        answer: "Our only office is at 4760 Tamiami Trl N #25, Naples, FL 34103. Travel time from Lely Resort varies by starting point and traffic, so check current directions before leaving."
      },
      {
        question: "Do you offer telehealth services for Lely Resort residents?",
        answer: "Lely Resort residents may request a secure video appointment. The office confirms availability, patient location, licensing and clinical suitability when scheduling."
      },
      {
        question: "What mental health services do you provide for Lely Resort residents?",
        answer: "Services for adults include psychiatric evaluation and treatment for anxiety, depression, ADHD, PTSD and bipolar disorder, as well as medication management. The plan is individualized after assessment."
      },
      {
        question: "How do I confirm insurance for care serving Lely Resort?",
        answer: "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific benefits directly with your insurer."
      },
      {
        question: "Can you coordinate care for seasonal residents who split time between Lely Resort and up north?",
        answer: "You may discuss continuity needs with the office. Coordination with another provider may be evaluated case by case and requires the patient’s consent; availability and licensing requirements still apply."
      },
      {
        question: "Do you understand the mental health needs of retirees in resort communities like Lely?",
        answer: "Dr. Reve can evaluate anxiety, mood symptoms and other psychiatric concerns related to retirement or life transitions. Care is individualized after clinical assessment."
      },
      {
        question: "Do you treat age-related depression and anxiety for Lely Resort residents?",
        answer: "The practice evaluates adults with depression or anxiety symptoms, including concerns related to retirement, health changes or social isolation. Treatment planning is individualized after evaluation."
      },
      {
        question: "Can you help with medication management for complex medical conditions common in Lely Resort?",
        answer: "Medication history and possible interactions are reviewed during clinical care. With patient consent, coordination with another clinician may be evaluated case by case when appropriate."
      },
      {
        question: "Do you provide couples counseling referrals for Lely Resort residents?",
        answer: "The practice focuses on psychiatric care. You may ask whether an outside counseling referral could be appropriate; any referral is discussed case by case and does not imply an ongoing affiliation."
      },
      {
        question: "What's the parking situation for Lely Resort patients visiting your office?",
        answer: "Parking is available at our Naples office. Check live directions and contact the office if you need accessibility or arrival details before your visit."
      }
    ],
    es: [
      {
        question: "¿Qué tan cerca está su oficina de Naples a Lely Resort?",
        answer: "Nuestra única oficina está en 4760 Tamiami Trl N #25, Naples, FL 34103. El viaje desde Lely Resort varía según el punto de partida y el tráfico; consulte indicaciones actuales antes de salir."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Lely Resort?",
        answer: "Los residentes de Lely Resort pueden solicitar una cita por video seguro. La oficina confirma disponibilidad, ubicación del paciente, licencias y adecuación clínica al programar."
      },
      {
        question: "¿Qué servicios de salud mental proporcionan para residentes de Lely Resort?",
        answer: "Ofrecemos atención psiquiátrica integral incluyendo tratamiento de ansiedad, manejo de depresión, evaluación de TDAH, tratamiento de TEPT, atención de trastorno bipolar, y manejo de medicamentos específicamente adaptado para residentes de Lely Resort."
      },
      {
        question: "¿Cómo confirmo el seguro para la atención que sirve a Lely Resort?",
        answer: "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique sus beneficios específicos directamente con su aseguradora."
      },
      {
        question: "¿Pueden coordinar atención para residentes estacionales que dividen el tiempo entre Lely Resort y el norte?",
        answer: "Puede discutir sus necesidades de continuidad con la oficina. La coordinación con otro proveedor puede evaluarse caso por caso y requiere el consentimiento del paciente; también aplican disponibilidad y requisitos de licencia."
      },
      {
        question: "¿Entienden las necesidades de salud mental de jubilados en comunidades de resort como Lely?",
        answer: "La Dra. Reve puede evaluar ansiedad, síntomas del ánimo y otras inquietudes psiquiátricas relacionadas con jubilación o transiciones de vida. La atención se individualiza después de la evaluación clínica."
      },
      {
        question: "¿Tratan depresión y ansiedad relacionadas con la edad para residentes de Lely Resort?",
        answer: "La práctica evalúa a adultos con síntomas de depresión o ansiedad, incluidas preocupaciones relacionadas con jubilación, cambios de salud o aislamiento social. La planificación se individualiza después de la evaluación."
      },
      {
        question: "¿Pueden ayudar con manejo de medicamentos para condiciones médicas complejas comunes en Lely Resort?",
        answer: "El historial de medicamentos y las posibles interacciones se revisan durante la atención clínica. Con consentimiento del paciente, la coordinación con otro profesional puede evaluarse caso por caso cuando sea apropiado."
      },
      {
        question: "¿Proporcionan referencias de consejería de parejas para residentes de Lely Resort?",
        answer: "La práctica se enfoca en atención psiquiátrica. Puede preguntar si una referencia externa de consejería sería apropiada; toda referencia se discute caso por caso y no implica una afiliación continua."
      },
      {
        question: "¿Cuál es la situación de estacionamiento para pacientes de Lely Resort que visitan su oficina?",
        answer: "Hay estacionamiento disponible en nuestra oficina de Naples. Consulte la ruta en vivo y contacte la oficina si necesita detalles de accesibilidad o llegada antes de su visita."
      }
    ]
  },

  telehealth: {
    en: [
      {
        question: "What is telepsychiatry and how does it work?",
        answer: "Telepsychiatry is psychiatric care delivered through a secure video platform. The office confirms whether video is clinically appropriate and permitted based on your needs, physical location and applicable licensing requirements."
      },
      {
        question: "Do I need any special equipment for telehealth sessions?",
        answer: "A device with a camera and microphone, an internet connection and a private space may be needed. If a video visit is confirmed, the office will provide the platform and access requirements before the appointment."
      },
      {
        question: "How is suitability for telepsychiatry determined?",
        answer: "Video care is not appropriate for every person, condition or appointment. Dr. Reve and the office confirm clinical suitability, patient location and applicable licensing requirements case by case."
      },
      {
        question: "What types of psychiatric conditions can be treated via telehealth?",
        answer: "Some evaluations and follow-up care may be appropriate by video. Dr. Reve determines the appropriate setting after considering the clinical need, patient location and applicable licensing requirements."
      },
      {
        question: "What areas of Florida does Dr. Reve serve through telehealth?",
        answer: "The patient must be physically located where Dr. Reve is authorized to provide care. The office confirms location, licensing requirements, availability and clinical suitability before each video appointment."
      },
      {
        question: "How do I schedule a telehealth appointment?",
        answer: "You can request an appointment online through our CharmHealth booking system or call our office at (239) 423-0272. Appointment availability varies, and the office will confirm the available time."
      },
      {
        question: "Is my privacy protected during telehealth sessions?",
        answer: "Video visits use a secure video platform. The practice privacy notice and consent documents explain how health information is handled and the limits that apply to electronic communications."
      },
      {
        question: "Does insurance cover telepsychiatry services?",
        answer: "Telepsychiatry benefits vary by plan, service and patient location. Before booking, confirm current participation with our office and verify telehealth benefits and cost sharing directly with your insurer."
      },
      {
        question: "Can I switch between telehealth and in-person visits?",
        answer: "You may ask about in-person and video options. The office and Dr. Reve confirm the appropriate modality for each appointment based on clinical needs, patient location and applicable requirements."
      },
      {
        question: "What if I have technical issues during my telehealth appointment?",
        answer: "Contact the office if you have trouble joining. The office or clinician will advise whether the appointment can proceed, needs to be rescheduled or requires another approved arrangement."
      }
    ],
    es: [
      {
        question: "¿Qué es la telepsiquiatría y cómo funciona?",
        answer: "La telepsiquiatría es atención psiquiátrica brindada mediante una plataforma de video segura. La oficina confirma si el video es clínicamente apropiado y está permitido según sus necesidades, ubicación física y requisitos de licencia aplicables."
      },
      {
        question: "¿Necesito algún equipo especial para las sesiones de telesalud?",
        answer: "Puede necesitar un dispositivo con cámara y micrófono, conexión a internet y un espacio privado. Si se confirma una visita por video, la oficina proporcionará los requisitos de plataforma y acceso antes de la cita."
      },
      {
        question: "¿Cómo se determina si la telepsiquiatría es apropiada?",
        answer: "La atención por video no es apropiada para todas las personas, condiciones o citas. La Dra. Reve y la oficina confirman caso por caso la adecuación clínica, ubicación del paciente y requisitos de licencia aplicables."
      },
      {
        question: "¿Qué tipos de condiciones psiquiátricas se pueden tratar por telesalud?",
        answer: "Algunas evaluaciones y seguimientos pueden ser apropiados por video. La Dra. Reve determina el entorno apropiado tras considerar la necesidad clínica, ubicación del paciente y requisitos de licencia aplicables."
      },
      {
        question: "¿Qué áreas de Florida atiende la Dra. Reve a través de telesalud?",
        answer: "El paciente debe estar físicamente donde la Dra. Reve esté autorizada para brindar atención. La oficina confirma la ubicación, requisitos de licencia, disponibilidad y adecuación clínica antes de cada cita por video."
      },
      {
        question: "¿Cómo programo una cita de telesalud?",
        answer: "Puede solicitar una cita en línea a través de nuestro sistema CharmHealth o llamar a nuestra oficina al (239) 423-0272. La disponibilidad varía y la oficina confirmará el horario disponible."
      },
      {
        question: "¿Está protegida mi privacidad durante las sesiones de telesalud?",
        answer: "Las visitas usan una plataforma de video segura. El aviso de privacidad y los documentos de consentimiento explican cómo se maneja la información de salud y los límites aplicables a las comunicaciones electrónicas."
      },
      {
        question: "¿El seguro cubre los servicios de telepsiquiatría?",
        answer: "Los beneficios de telepsiquiatría varían según el plan, el servicio y la ubicación del paciente. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique directamente con su aseguradora los beneficios de telesalud y costos compartidos."
      },
      {
        question: "¿Puedo alternar entre visitas de telesalud y en persona?",
        answer: "Puede preguntar por opciones presenciales y por video. La oficina y la Dra. Reve confirman la modalidad apropiada para cada cita según las necesidades clínicas, ubicación del paciente y requisitos aplicables."
      },
      {
        question: "¿Qué pasa si tengo problemas técnicos durante mi cita de telesalud?",
        answer: "Contacte la oficina si tiene problemas para conectarse. La oficina o la profesional indicará si la cita puede continuar, debe reprogramarse o requiere otra alternativa aprobada."
      }
    ]
  },

  californiaTelehealth: {
    en: [
      {
        question: "Does the doctor speak Spanish?",
        answer: "Yes. Bilingual care is available in English and Spanish. Your entire appointment can be in Spanish, from start to finish."
      },
      {
        question: "Can I be seen if I live in California?",
        answer: "The patient must be physically located where Dr. Reve is authorized to provide care. The office confirms California eligibility, availability and clinical suitability before the appointment."
      },
      {
        question: "Do you accept health insurance?",
        answer: "Coverage and payment arrangements vary. Before booking, confirm participation, benefits and costs with the office and your insurer."
      },
      {
        question: "How much does it cost?",
        answer: "Before booking, the office confirms the price, payment method, availability, treating professional, modality and eligibility for the requested appointment."
      },
      {
        question: "How does payment work?",
        answer: "Payment arrangements vary. The office confirms the accepted payment method and applicable financial details before booking."
      },
      {
        question: "What do I need for the video call?",
        answer: "A device with a camera and microphone, an internet connection and a private place may be needed. If video is confirmed, the office provides the access requirements before the appointment."
      },
      {
        question: "What happens at the first appointment?",
        answer: "The initial evaluation reviews what you are experiencing, your history, symptoms and possible next steps. The office confirms appointment length and modality when scheduling; follow-up needs are determined individually."
      },
      {
        question: "Do you see minors?",
        answer: "No. Appointments are for adults 18 and older only."
      },
      {
        question: "How is video care compared with an in-person visit?",
        answer: "Video and in-person visits are different care settings. Dr. Reve determines which setting is clinically appropriate for each appointment based on individual needs and applicable requirements."
      },
      {
        question: "Is the video call private?",
        answer: "Appointments use a secure video platform. The practice privacy notice and consent documents explain how your information is handled and the limits of electronic communication."
      },
      {
        question: "What if I have an emergency?",
        answer: "This practice does not handle emergencies. If you are in crisis, call 988 or 911."
      }
    ],
    es: [
      {
        question: "¿La doctora habla español?",
        answer: "Sí. La atención bilingüe está disponible en español e inglés. Toda la consulta puede ser en español, de principio a fin."
      },
      {
        question: "¿Puedo atenderme si vivo en California?",
        answer: "El paciente debe estar físicamente donde la Dra. Reve esté autorizada para brindar atención. La oficina confirma la elegibilidad en California, disponibilidad y adecuación clínica antes de la cita."
      },
      {
        question: "¿Aceptan seguro médico?",
        answer: "La cobertura y los arreglos de pago varían. Antes de reservar, confirme la participación, los beneficios y los costos con la oficina y su aseguradora."
      },
      {
        question: "¿Cuánto cuesta?",
        answer: "Antes de reservar, la oficina confirma el precio, método de pago, disponibilidad, profesional, modalidad y elegibilidad para la cita solicitada."
      },
      {
        question: "¿Cómo funciona el pago?",
        answer: "Los arreglos de pago varían. La oficina confirma el método de pago aceptado y los detalles financieros aplicables antes de reservar."
      },
      {
        question: "¿Qué necesito para la videollamada?",
        answer: "Puede necesitar un dispositivo con cámara y micrófono, conexión a internet y un lugar privado. Si se confirma el video, la oficina proporciona los requisitos de acceso antes de la cita."
      },
      {
        question: "¿Qué pasa en la primera consulta?",
        answer: "La evaluación inicial revisa lo que está experimentando, su historia, síntomas y posibles próximos pasos. La oficina confirma la duración y modalidad al programar; las necesidades de seguimiento se determinan individualmente."
      },
      {
        question: "¿Atienden a menores de edad?",
        answer: "No. La consulta es solo para adultos a partir de 18 años."
      },
      {
        question: "¿Cómo se compara la atención por video con una visita presencial?",
        answer: "El video y la atención presencial son entornos distintos. La Dra. Reve determina cuál es clínicamente apropiado para cada cita según las necesidades individuales y requisitos aplicables."
      },
      {
        question: "¿La videollamada es privada?",
        answer: "La consulta usa una plataforma de video segura. El aviso de privacidad y los documentos de consentimiento explican cómo se maneja su información y los límites de la comunicación electrónica."
      },
      {
        question: "¿Y si tengo una urgencia?",
        answer: "Esta consulta no atiende urgencias. Si estás en crisis, llama al 988 o al 911."
      }
    ]
  }
};
