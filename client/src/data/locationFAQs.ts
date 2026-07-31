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
        answer: "Our office at 4760 Tamiami Trl N is conveniently located just a short 15-20 minute drive south of Bonita Springs, directly on US-41 (Tamiami Trail). We offer flexible scheduling to accommodate patients traveling from the area."
      },
      {
        question: "Do you offer telepsychiatry (Telehealth) for Bonita Springs patients?",
        answer: "Absolutely! We understand your time is valuable. We offer secure and comprehensive virtual appointments for all Bonita Springs residents, allowing you to receive expert care from Dr. Reve from the comfort of your home."
      },
      {
        question: "Is Healing Minds Psychiatry a mental health provider for the Bonita Springs National Art Festival community?",
        answer: "We strongly support Bonita Springs' vibrant artistic community. While we are not an official festival partner, we offer accessible mental health care year-round to support the wellbeing of artists, visitors, and Bonita Springs residents."
      },
      {
        question: "Do you accept common health insurance in the Bonita Springs area, like Cigna or Aetna?",
        answer: "Yes. We accept most major insurance plans found in Southwest Florida, including Aetna, Cigna, Medicare, and Florida Medicaid. We recommend calling our office to verify your specific coverage."
      },
      {
        question: "Do you provide depression treatment in Bonita Springs?",
        answer: "Yes, we treat many Bonita Springs patients for depression. Dr. Reve specializes in creating comprehensive plans that may include medication management and therapeutic coordination to help you regain balance."
      },
      {
        question: "Does Dr. Melva Reve speak Spanish?",
        answer: "Yes, Dr. Reve is fully bilingual (English/Spanish), offering compassionate and culturally sensitive psychiatric care to the Spanish-speaking community of Bonita Springs."
      },
      {
        question: "Do you offer ADHD evaluations for adults near Bonita Springs?",
        answer: "Yes, one of our main specialties is diagnosing and treating ADHD in adults. Our Naples office is fully equipped for comprehensive evaluations for patients coming from Bonita Springs."
      },
      {
        question: "What is your approach to medication management?",
        answer: "Our approach is collaborative and vigilant. We believe in using the minimum effective dose to maximize your quality of life and minimize side effects, with regular check-ups (virtual or in-person)."
      },
      {
        question: "What is the first appointment like for a new patient from Bonita Springs?",
        answer: "Your first appointment is a comprehensive psychiatric evaluation, either in-person or via telemedicine. It's a 60-minute session to discuss your history, current concerns and goals, and collaborate on an initial treatment plan."
      },
      {
        question: "Do you treat Bipolar Disorder?",
        answer: "Yes, Dr. Reve has extensive experience in accurate diagnosis and long-term management of bipolar disorder (Types I and II), focusing on mood stabilization through expert medication management."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Bonita Springs?",
        answer: "Nuestra oficina en 4760 Tamiami Trl N está convenientemente ubicada a un corto viaje de 15-20 minutos al sur de Bonita Springs, directamente por la US-41 (Tamiami Trail). Ofrecemos horarios flexibles para acomodar a los pacientes que viajan desde el área."
      },
      {
        question: "¿Ofrecen telepsiquiatría (Telehealth) para pacientes de Bonita Springs?",
        answer: "¡Absolutamente! Entendemos que su tiempo es valioso. Ofrecemos citas virtuales seguras y completas para todos los residentes de Bonita Springs, permitiéndole recibir atención experta de la Dra. Reve desde la comodidad de su hogar."
      },
      {
        question: "¿Es Healing Minds Psychiatry un proveedor de salud mental para la comunidad del Bonita Springs National Art Festival?",
        answer: "Apoyamos firmemente la vibrante comunidad artística de Bonita Springs. Si bien no somos un socio oficial del festival, ofrecemos atención de salud mental accesible durante todo el año para apoyar el bienestar de los artistas, visitantes y residentes de Bonita Springs."
      },
      {
        question: "¿Aceptan seguros médicos comunes en el área de Bonita Springs, como Cigna o Aetna?",
        answer: "Sí. Aceptamos la mayoría de los principales planes de seguro que se encuentran en el suroeste de Florida, incluidos Aetna, Cigna, Medicare y Medicaid de Florida. Le recomendamos llamar a nuestra oficina para verificar su cobertura específica."
      },
      {
        question: "¿Proporcionan tratamiento de depresión en Bonita Springs?",
        answer: "Sí, tratamos a muchos pacientes de Bonita Springs para la depresión. La Dra. Reve se especializa en crear planes integrales que pueden incluir manejo de medicamentos y coordinación terapéutica para ayudarlo a recuperar el equilibrio."
      },
      {
        question: "¿La Dra. Melva Reve habla español?",
        answer: "Sí, la Dra. Reve es completamente bilingüe (inglés/español), y ofrece atención psiquiátrica compasiva y culturalmente sensible a la comunidad hispanohablante de Bonita Springs."
      },
      {
        question: "¿Ofrecen evaluaciones de TDAH (ADHD) para adultos cerca de Bonita Springs?",
        answer: "Sí, una de nuestras especialidades principales es el diagnóstico y tratamiento del TDAH en adultos. Nuestra oficina de Naples está totalmente equipada para evaluaciones completas para pacientes que vienen de Bonita Springs."
      },
      {
        question: "¿Cuál es su enfoque para el manejo de medicamentos (medication management)?",
        answer: "Nuestro enfoque es colaborativo y vigilante. Creemos en usar la dosis mínima efectiva para maximizar su calidad de vida y minimizar los efectos secundarios, con chequeos regulares (virtuales o en persona)."
      },
      {
        question: "¿Cómo es la primera cita para un paciente nuevo de Bonita Springs?",
        answer: "Su primera cita es una evaluación psiquiátrica integral, ya sea en persona o por telemedicina. Es una sesión de 60 minutos para discutir su historial, preocupaciones actuales y objetivos, y colaborar en un plan de tratamiento inicial."
      },
      {
        question: "¿Tratan el trastorno bipolar (Bipolar Disorder)?",
        answer: "Sí, la Dra. Reve tiene una amplia experiencia en el diagnóstico preciso y el manejo a largo plazo del trastorno bipolar (Tipos I y II), centrándose en la estabilización del estado de ánimo a través de un manejo de medicamentos experto."
      }
    ]
  },

  marcoIsland: {
    en: [
      {
        question: "Is telepsychiatry the best option for Marco Island patients?",
        answer: "It's our most popular option for Marco Island residents! Our secure, HIPAA-compliant Telehealth system eliminates the need to drive (and cross the Jolley bridge), allowing you to receive expert psychiatric care and ongoing treatment support from your home."
      },
      {
        question: "How do I get to your Naples office from Marco Island?",
        answer: "It's a straightforward northbound drive. Simply take Collier Blvd (CR 951) north, turn onto US-41 (Tamiami Trail N) and continue to our Park Shore office. Parking is free and easy."
      },
      {
        question: "I'm a seasonal resident (\"snowbird\") on Marco Island. Can you coordinate care with my primary doctor up north?",
        answer: "Absolutely. We are very experienced in coordinating care for seasonal residents. We handle your psychiatric care while you're in Florida and securely coordinate with your other providers to ensure continuous care."
      },
      {
        question: "Does Dr. Reve offer Spanish consultations for the Marco Island community?",
        answer: "Yes. Dr. Reve is fully bilingual (English/Spanish) and takes pride in serving Marco Island's diverse community with culturally sensitive care, both in-person and virtually."
      },
      {
        question: "Do you offer anxiety treatment for Marco Island patients?",
        answer: "Yes, we treat a wide range of anxiety disorders. We understand the unique lifestyle pressures and offer medication management plans and coping strategies for Marco Island residents."
      },
      {
        question: "Do you accept Medicare for Marco Island residents?",
        answer: "Yes, we accept Medicare, as well as most other major plans (Aetna, Cigna, Florida Blue) common in the Marco Island community. Please call to verify your plan."
      },
      {
        question: "What mental health services do you offer related to events like the Marco Island Seafood & Music Festival?",
        answer: "While we are not directly affiliated with the festival, we strongly support community events. We offer social anxiety and stress management so you can fully enjoy our region's community events."
      },
      {
        question: "How does medication management work through telemedicine?",
        answer: "After your initial evaluation (which can also be virtual), follow-up appointments for medication management are conducted via secure video call. Medication orders are sent electronically to your preferred pharmacy on Marco Island."
      },
      {
        question: "Do you treat PTSD at your clinic?",
        answer: "Yes. We offer confidential, trauma-informed psychiatric care for PTSD. Both our Naples office and our virtual sessions are safe spaces to seek treatment."
      },
      {
        question: "What age should patients be for ADHD treatment?",
        answer: "Our practice specializes in treating ADHD in adults (over 18 years old). We conduct comprehensive evaluations for adults who may have been late-diagnosed or undiagnosed."
      }
    ],
    es: [
      {
        question: "¿Es la telepsiquiatría la mejor opción para los pacientes de Marco Island?",
        answer: "¡Es nuestra opción más popular para residentes de Marco Island! Nuestro sistema de Telehealth, seguro y compatible con HIPAA, elimina la necesidad de conducir (y cruzar el puente Jolley), permitiéndole recibir atención psiquiátrica experta y apoyo continuo de tratamiento desde su hogar."
      },
      {
        question: "¿Cómo llego a su oficina de Naples desde Marco Island?",
        answer: "Es un viaje sencillo hacia el norte. Simplemente tome Collier Blvd (CR 951) hacia el norte, gire en la US-41 (Tamiami Trail N) y continúe hasta nuestra oficina en Park Shore. El estacionamiento es gratuito y fácil."
      },
      {
        question: "Soy un residente estacional (\"snowbird\") en Marco Island. ¿Pueden coordinar la atención con mi médico de cabecera en el norte?",
        answer: "Absolutamente. Estamos muy experimentados en la coordinación de la atención para residentes estacionales. Manejamos su cuidado psiquiátrico mientras está en Florida y coordinamos de manera segura con sus otros proveedores para garantizar una atención continua."
      },
      {
        question: "¿La Dra. Reve ofrece consultas en español para la comunidad de Marco Island?",
        answer: "Sí. La Dra. Reve es completamente bilingüe (inglés/español) y se enorgullece de servir a la diversa comunidad de Marco Island con atención culturalmente sensible, tanto en persona como virtualmente."
      },
      {
        question: "¿Ofrecen tratamiento para la ansiedad (anxiety treatment) para pacientes de Marco Island?",
        answer: "Sí, tratamos una amplia gama de trastornos de ansiedad. Entendemos las presiones únicas del estilo de vida y ofrecemos planes de manejo de medicamentos y estrategias de afrontamiento para residentes de Marco Island."
      },
      {
        question: "¿Aceptan Medicare para residentes de Marco Island?",
        answer: "Sí, aceptamos Medicare, así como la mayoría de los otros planes principales (Aetna, Cigna, Florida Blue) comunes en la comunidad de Marco Island. Por favor llame para verificar su plan."
      },
      {
        question: "¿Qué servicios de salud mental ofrecen relacionados con eventos como el Marco Island Seafood & Music Festival?",
        answer: "Si bien no estamos afiliados directamente al festival, apoyamos firmemente los eventos comunitarios. Ofrecemos manejo de la ansiedad social y el estrés para que pueda disfrutar plenamente de los eventos comunitarios de nuestra región."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos por telemedicina?",
        answer: "Después de su evaluación inicial (que también puede ser virtual), las citas de seguimiento para el manejo de medicamentos se realizan por videollamada segura. Las órdenes de medicamentos se envían electrónicamente a su farmacia preferida en Marco Island."
      },
      {
        question: "¿Tratan el TEPT (PTSD) en su clínica?",
        answer: "Sí. Ofrecemos atención psiquiátrica confidencial e informada en trauma para el TEPT. Tanto nuestra oficina de Naples como nuestras sesiones virtuales son espacios seguros para buscar tratamiento."
      },
      {
        question: "¿Qué edad deben tener los pacientes para el tratamiento de TDAH?",
        answer: "Nuestra práctica se especializa en el tratamiento de TDAH en adultos (mayores de 18 años). Realizamos evaluaciones integrales para adultos que pueden haber sido diagnosticados tarde o no diagnosticados."
      }
    ]
  },

  estero: {
    en: [
      {
        question: "How far is your Naples office from Estero, near FGCU?",
        answer: "We are conveniently located directly south on US-41 (Tamiami Trail). From the Coconut Point Mall area or FGCU, it's typically an easy 25-30 minute drive to our Park Shore office."
      },
      {
        question: "Do you offer telepsychiatry services for FGCU students or Estero residents?",
        answer: "Yes. Our Telehealth service is a perfect solution for busy college students and Estero residents with busy schedules. We offer secure virtual appointments for medication management and consultations."
      },
      {
        question: "I'm moving to Estero for college. Can you take over my ADHD management?",
        answer: "Absolutely. We specialize in transitioning ADHD care from adolescence to adulthood. We can coordinate with your previous psychiatrist to ensure seamless continuity of your care while residing in Estero."
      },
      {
        question: "Is depression treatment different for young adults in the Estero area?",
        answer: "Treatment is always personalized. For our college-age patients in the Estero area, we focus on medication management that supports academic and social demands, addressing unique stressors of that life stage."
      },
      {
        question: "What insurance do you accept that's common in Estero?",
        answer: "We accept major commercial insurance plans used by Estero employers (like Aetna, Cigna, Florida Blue), as well as Medicare and Florida Medicaid. Call to verify your coverage."
      },
      {
        question: "Does Dr. Reve speak Spanish?",
        answer: "Yes, Dr. Reve is fully bilingual, providing expert care in both English and Spanish for Estero's diverse community."
      },
      {
        question: "Do you visit Koreshan State Park? Do you support local Estero events?",
        answer: "As Southwest Florida community enthusiasts, we value unique local landmarks like Koreshan State Park. We are committed to the overall wellbeing of the Estero community and support local mental health initiatives."
      },
      {
        question: "What is a first psychiatric evaluation like?",
        answer: "It's a comprehensive 60-minute session (virtual or in-person) to understand your complete history, current symptoms, and goals. It's a collaborative conversation to establish an accurate diagnosis and treatment plan."
      },
      {
        question: "Do you treat anxiety disorders, like social anxiety?",
        answer: "Yes. Anxiety treatment is one of our main specialties. We offer medication management and strategies for generalized anxiety, panic disorders, and social anxiety."
      },
      {
        question: "Do you treat Bipolar Disorder?",
        answer: "Yes, Dr. Reve offers expert diagnosis and long-term medication management for Bipolar Disorder (Types I and II), focused on mood stabilization."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Estero, cerca de FGCU?",
        answer: "Estamos convenientemente ubicados directamente al sur por la US-41 (Tamiami Trail). Desde el área de Coconut Point Mall o FGCU, generalmente es un viaje fácil de 25-30 minutos hasta nuestra oficina en Park Shore."
      },
      {
        question: "¿Ofrecen servicios de telepsiquiatría para estudiantes de FGCU o residentes de Estero?",
        answer: "Sí. Nuestro servicio de Telehealth es una solución perfecta para los estudiantes universitarios y residentes de Estero con agendas ocupadas. Ofrecemos citas virtuales seguras para manejo de medicamentos y consultas."
      },
      {
        question: "Me mudo a Estero por la universidad. ¿Pueden hacerse cargo de mi manejo de TDAH (ADHD)?",
        answer: "Absolutamente. Nos especializamos en la transición de la atención del TDAH de la adolescencia a la edad adulta. Podemos coordinarnos con su psiquiatra anterior para garantizar una continuidad perfecta de su atención mientras reside en Estero."
      },
      {
        question: "¿El tratamiento de la depresión es diferente para los adultos jóvenes en el área de Estero?",
        answer: "El tratamiento siempre se personaliza. Para nuestros pacientes en edad universitaria del área de Estero, nos enfocamos en el manejo de medicamentos que respalde las demandas académicas y sociales, abordando factores estresantes únicos de esa etapa de la vida."
      },
      {
        question: "¿Qué seguros aceptan que sean comunes en Estero?",
        answer: "Aceptamos los principales planes de seguro comerciales utilizados por los empleadores en Estero (como Aetna, Cigna, Florida Blue), así como Medicare y Medicaid de Florida. Llame para verificar su cobertura."
      },
      {
        question: "¿La Dra. Reve habla español?",
        answer: "Sí, la Dra. Reve es completamente bilingüe, brindando atención experta tanto en inglés como en español para la diversa comunidad de Estero."
      },
      {
        question: "¿Visitan el Koreshan State Park? ¿Apoyan los eventos locales de Estero?",
        answer: "Como entusiastas de la comunidad del Suroeste de Florida, valoramos hitos locales únicos como el Koreshan State Park. Estamos comprometidos con el bienestar general de la comunidad de Estero y apoyamos las iniciativas locales de salud mental."
      },
      {
        question: "¿Cómo es una primera evaluación psiquiátrica?",
        answer: "Es una sesión integral de 60 minutos (virtual o en persona) para comprender su historial completo, sus síntomas actuales y sus objetivos. Es una conversación colaborativa para establecer un diagnóstico preciso y un plan de tratamiento."
      },
      {
        question: "¿Tratan los trastornos de ansiedad, como la ansiedad social?",
        answer: "Sí. El tratamiento de la ansiedad es una de nuestras principales especialidades. Ofrecemos manejo de medicamentos y estrategias para la ansiedad generalizada, los trastornos de pánico y la ansiedad social."
      },
      {
        question: "¿Tratan el Trastorno Bipolar?",
        answer: "Sí, la Dra. Reve ofrece diagnóstico experto y manejo de medicamentos a largo plazo para el Trastorno Bipolar (Tipos I y II), enfocado en la estabilización del estado de ánimo."
      }
    ]
  },

  goldenGate: {
    en: [
      {
        question: "Is your Naples clinic accessible from Golden Gate?",
        answer: "Yes, we are very close. Our office on Tamiami Trail N (US-41) is just a short drive west on Golden Gate Pkwy. It's a convenient option for in-person appointments."
      },
      {
        question: "Do you offer telepsychiatry for Golden Gate residents?",
        answer: "Absolutely! Many of our Golden Gate patients prefer the convenience of virtual appointments. We offer secure, HIPAA-compliant video consultations for medication management and follow-ups."
      },
      {
        question: "What insurance plans do you accept for Golden Gate patients?",
        answer: "We accept most major insurance plans commonly used in the Golden Gate area, including Aetna, Cigna, Medicare, Florida Medicaid, and many others. Please call to verify your specific plan."
      },
      {
        question: "Do you provide Spanish-speaking services for Golden Gate residents?",
        answer: "Yes, Dr. Reve is fully bilingual (English/Spanish) and provides culturally sensitive psychiatric care to Golden Gate's diverse Hispanic community."
      },
      {
        question: "Do you treat anxiety and depression for Golden Gate patients?",
        answer: "Yes, anxiety and depression treatment are our primary specialties. We provide comprehensive care including medication management and therapeutic support for Golden Gate residents."
      },
      {
        question: "What is the driving distance from Golden Gate to your office?",
        answer: "It's typically a 10-15 minute drive from Golden Gate to our Naples office. Take Golden Gate Pkwy west to US-41, then north to our practice at 4760 Tamiami Trl N."
      },
      {
        question: "Do you offer ADHD evaluations for adults living in Golden Gate?",
        answer: "Yes, adult ADHD evaluation and treatment is one of our specialties. We conduct comprehensive assessments for Golden Gate residents who suspect they may have undiagnosed ADHD."
      },
      {
        question: "How does medication management work for Golden Gate patients?",
        answer: "We offer both in-person and virtual medication management appointments. Regular monitoring ensures optimal treatment while minimizing side effects, with medication orders sent to your preferred Golden Gate area pharmacy."
      },
      {
        question: "Do you treat PTSD and trauma for Golden Gate residents?",
        answer: "Yes, we provide trauma-informed psychiatric care for PTSD. Our approach combines medication management with coordination of therapeutic services for comprehensive healing."
      },
      {
        question: "What should Golden Gate patients expect for their first appointment?",
        answer: "Your initial evaluation is a comprehensive 60-minute session to understand your mental health history, current symptoms, and treatment goals. This can be conducted in-person or via secure video call."
      }
    ],
    es: [
      {
        question: "¿Su clínica de Naples es accesible desde Golden Gate?",
        answer: "Sí, estamos muy cerca. Nuestra oficina en Tamiami Trail N (US-41) está a solo un corto viaje al oeste por Golden Gate Pkwy. Es una opción conveniente para citas en persona."
      },
      {
        question: "¿Ofrecen telepsiquiatría para residentes de Golden Gate?",
        answer: "¡Absolutamente! Muchos de nuestros pacientes de Golden Gate prefieren la conveniencia de las citas virtuales. Ofrecemos consultas por video seguras y compatibles con HIPAA para manejo de medicamentos y seguimientos."
      },
      {
        question: "¿Qué planes de seguro aceptan para pacientes de Golden Gate?",
        answer: "Aceptamos la mayoría de los principales planes de seguro comúnmente usados en el área de Golden Gate, incluyendo Aetna, Cigna, Medicare, Medicaid de Florida, y muchos otros. Por favor llame para verificar su plan específico."
      },
      {
        question: "¿Proporcionan servicios en español para residentes de Golden Gate?",
        answer: "Sí, la Dra. Reve es completamente bilingüe (inglés/español) y proporciona atención psiquiátrica culturalmente sensible a la diversa comunidad hispana de Golden Gate."
      },
      {
        question: "¿Tratan ansiedad y depresión para pacientes de Golden Gate?",
        answer: "Sí, el tratamiento de ansiedad y depresión son nuestras especialidades principales. Proporcionamos atención integral incluyendo manejo de medicamentos y apoyo terapéutico para residentes de Golden Gate."
      },
      {
        question: "¿Cuál es la distancia de manejo desde Golden Gate hasta su oficina?",
        answer: "Típicamente es un viaje de 10-15 minutos desde Golden Gate hasta nuestra oficina en Naples. Tome Golden Gate Pkwy al oeste hasta US-41, luego norte hasta nuestra práctica en 4760 Tamiami Trl N."
      },
      {
        question: "¿Ofrecen evaluaciones de TDAH para adultos que viven en Golden Gate?",
        answer: "Sí, la evaluación y tratamiento de TDAH en adultos es una de nuestras especialidades. Realizamos evaluaciones completas para residentes de Golden Gate que sospechan que pueden tener TDAH no diagnosticado."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos para pacientes de Golden Gate?",
        answer: "Ofrecemos citas de manejo de medicamentos tanto en persona como virtuales. El monitoreo regular asegura un tratamiento óptimo mientras minimiza los efectos secundarios, con órdenes de medicamentos enviadas a su farmacia preferida en el área de Golden Gate."
      },
      {
        question: "¿Tratan TEPT y trauma para residentes de Golden Gate?",
        answer: "Sí, proporcionamos atención psiquiátrica informada en trauma para TEPT. Nuestro enfoque combina manejo de medicamentos con coordinación de servicios terapéuticos para sanación integral."
      },
      {
        question: "¿Qué deben esperar los pacientes de Golden Gate para su primera cita?",
        answer: "Su evaluación inicial es una sesión integral de 60 minutos para entender su historial de salud mental, síntomas actuales, y objetivos de tratamiento. Esto puede realizarse en persona o por videollamada segura."
      }
    ]
  },

  vanderbiltBeach: {
    en: [
      {
        question: "How close is your Naples office to Vanderbilt Beach?",
        answer: "We're very close! Our office at 4760 Tamiami Trl N is just a few minutes drive from Vanderbilt Beach. Many of our patients enjoy the convenience of combining their appointment with a peaceful beach visit."
      },
      {
        question: "Do you offer telehealth services for Vanderbilt Beach residents?",
        answer: "Yes! We offer secure video consultations that are perfect for busy Vanderbilt Beach residents. You can receive expert psychiatric care from the comfort of your beachside home."
      },
      {
        question: "What insurance do you accept for Vanderbilt Beach area patients?",
        answer: "We accept most major insurance plans common in the Vanderbilt Beach area, including Medicare, Aetna, Cigna, and Florida Blue. Please call to verify coverage for your specific plan."
      },
      {
        question: "Do you provide bilingual services for the Vanderbilt Beach community?",
        answer: "Yes, Dr. Reve is fully bilingual (English/Spanish) and provides culturally sensitive care to Vanderbilt Beach's diverse community, including seasonal residents."
      },
      {
        question: "Do you treat seasonal depression or beach lifestyle-related mental health concerns?",
        answer: "Yes, we understand the unique mental health aspects of beach community living, including seasonal patterns and lifestyle transitions. We provide comprehensive care for all types of depression and anxiety."
      },
      {
        question: "Can you coordinate care for snowbirds who split time between Vanderbilt Beach and up north?",
        answer: "Absolutely! We specialize in coordinating care for seasonal residents. We can work with your northern providers to ensure seamless psychiatric care year-round."
      },
      {
        question: "Do you offer ADHD treatment for adults living near Vanderbilt Beach?",
        answer: "Yes, adult ADHD diagnosis and treatment is one of our specialties. We provide comprehensive evaluations and ongoing medication management for Vanderbilt Beach area residents."
      },
      {
        question: "How does parking work at your office for Vanderbilt Beach patients?",
        answer: "We offer free, convenient parking right at our office location. It's much easier than beach parking, and you're just minutes away from Vanderbilt Beach before or after your appointment!"
      },
      {
        question: "Do you treat anxiety related to lifestyle changes or retirement in the Vanderbilt Beach area?",
        answer: "Yes, we frequently help patients navigate life transitions including retirement, relocation to beach communities, and seasonal lifestyle changes. These transitions can bring unique stressors that we address with comprehensive care."
      },
      {
        question: "What's the best way to schedule an appointment from Vanderbilt Beach?",
        answer: "Simply call our office at (239) 423-0272 or use our online contact form. We offer flexible scheduling including early morning and late afternoon appointments to accommodate beach lifestyle preferences."
      }
    ],
    es: [
      {
        question: "¿Qué tan cerca está su oficina de Naples a Vanderbilt Beach?",
        answer: "¡Estamos muy cerca! Nuestra oficina en 4760 Tamiami Trl N está a solo unos minutos en coche de Vanderbilt Beach. Muchos de nuestros pacientes disfrutan la conveniencia de combinar su cita con una visita tranquila a la playa."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Vanderbilt Beach?",
        answer: "¡Sí! Ofrecemos consultas por video seguras que son perfectas para residentes ocupados de Vanderbilt Beach. Puede recibir atención psiquiátrica experta desde la comodidad de su hogar junto a la playa."
      },
      {
        question: "¿Qué seguro aceptan para pacientes del área de Vanderbilt Beach?",
        answer: "Aceptamos la mayoría de los principales planes de seguro comunes en el área de Vanderbilt Beach, incluyendo Medicare, Aetna, Cigna, y Florida Blue. Por favor llame para verificar la cobertura de su plan específico."
      },
      {
        question: "¿Proporcionan servicios bilingües para la comunidad de Vanderbilt Beach?",
        answer: "Sí, la Dra. Reve es completamente bilingüe (inglés/español) y proporciona atención culturalmente sensible a la diversa comunidad de Vanderbilt Beach, incluyendo residentes estacionales."
      },
      {
        question: "¿Tratan depresión estacional o problemas de salud mental relacionados con el estilo de vida playero?",
        answer: "Sí, entendemos los aspectos únicos de salud mental de vivir en una comunidad playera, incluyendo patrones estacionales y transiciones de estilo de vida. Proporcionamos atención integral para todos los tipos de depresión y ansiedad."
      },
      {
        question: "¿Pueden coordinar atención para snowbirds que dividen el tiempo entre Vanderbilt Beach y el norte?",
        answer: "¡Absolutamente! Nos especializamos en coordinar atención para residentes estacionales. Podemos trabajar con sus proveedores del norte para asegurar atención psiquiátrica continua durante todo el año."
      },
      {
        question: "¿Ofrecen tratamiento de TDAH para adultos que viven cerca de Vanderbilt Beach?",
        answer: "Sí, el diagnóstico y tratamiento de TDAH en adultos es una de nuestras especialidades. Proporcionamos evaluaciones completas y manejo continuo de medicamentos para residentes del área de Vanderbilt Beach."
      },
      {
        question: "¿Cómo funciona el estacionamiento en su oficina para pacientes de Vanderbilt Beach?",
        answer: "Ofrecemos estacionamiento gratuito y conveniente directamente en nuestra ubicación de oficina. ¡Es mucho más fácil que el estacionamiento de la playa, y está a solo minutos de Vanderbilt Beach antes o después de su cita!"
      },
      {
        question: "¿Tratan ansiedad relacionada con cambios de estilo de vida o jubilación en el área de Vanderbilt Beach?",
        answer: "Sí, frecuentemente ayudamos a pacientes a navegar transiciones de vida incluyendo jubilación, reubicación a comunidades playeras, y cambios de estilo de vida estacionales. Estas transiciones pueden traer factores estresantes únicos que abordamos con atención integral."
      },
      {
        question: "¿Cuál es la mejor manera de programar una cita desde Vanderbilt Beach?",
        answer: "Simplemente llame a nuestra oficina al (239) 423-0272 o use nuestro formulario de contacto en línea. Ofrecemos horarios flexibles incluyendo citas temprano en la mañana y tarde en la tarde para acomodar las preferencias del estilo de vida playero."
      }
    ]
  },

  fortMyers: {
    en: [
      {
        question: "How far is your Naples office from Fort Myers?",
        answer: "Our practice is conveniently located about 20-25 minutes north of Fort Myers on US-41 (Tamiami Trail). The drive is straightforward and direct, making it easy for Fort Myers residents to access our services."
      },
      {
        question: "Do you offer telehealth services for Fort Myers patients?",
        answer: "Absolutely! We provide secure video consultations that eliminate the need to drive to Naples. Many Fort Myers patients prefer the convenience of receiving expert psychiatric care from home."
      },
      {
        question: "What mental health services do you provide for Fort Myers residents?",
        answer: "We offer comprehensive psychiatric care including anxiety treatment, depression management, ADHD evaluation and treatment, PTSD therapy, bipolar disorder treatment, and psychiatric medication management for Fort Myers residents."
      },
      {
        question: "Do you accept insurance commonly used in Fort Myers?",
        answer: "Yes, we accept most major insurance plans common in the Fort Myers area, including Aetna, Cigna, Medicare, Florida Medicaid, and many others. Please call to verify your specific plan."
      },
      {
        question: "Does Dr. Reve provide services in Spanish for Fort Myers patients?",
        answer: "Yes, Dr. Reve is fully bilingual (English/Spanish) and provides culturally sensitive psychiatric care to Fort Myers' diverse community, including comprehensive services in Spanish."
      },
      {
        question: "Can you help with ADHD evaluations for Fort Myers adults?",
        answer: "Absolutely! Adult ADHD evaluation and treatment is one of our primary specialties. We provide thorough assessments for Fort Myers residents who may have undiagnosed or undertreated ADHD."
      },
      {
        question: "How do you coordinate care with other providers in Fort Myers?",
        answer: "We work closely with primary care physicians, therapists, and other healthcare providers in the Fort Myers area to ensure comprehensive, coordinated mental health care for our patients."
      },
      {
        question: "What should Fort Myers patients expect for their first appointment?",
        answer: "Your initial psychiatric evaluation is a comprehensive 60-90 minute appointment where we discuss your mental health history, current concerns, and develop a personalized treatment plan. This can be done in-person or via secure video call."
      },
      {
        question: "Do you treat anxiety and depression for Fort Myers residents?",
        answer: "Yes, anxiety and depression treatment are our core specialties. We provide evidence-based medication management and work with local Fort Myers therapists to provide comprehensive care."
      },
      {
        question: "How does medication management work for Fort Myers patients?",
        answer: "We provide ongoing medication management with regular follow-up appointments (in-person or virtual). Medication orders can be sent directly to your preferred pharmacy in the Fort Myers area, making the process seamless."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Fort Myers?",
        answer: "Nuestra práctica está convenientemente ubicada aproximadamente 20-25 minutos al norte de Fort Myers en US-41 (Tamiami Trail). El viaje es directo y sencillo, facilitando que los residentes de Fort Myers accedan a nuestros servicios."
      },
      {
        question: "¿Ofrecen servicios de telesalud para pacientes de Fort Myers?",
        answer: "¡Absolutamente! Proporcionamos consultas por video seguras que eliminan la necesidad de conducir a Naples. Muchos pacientes de Fort Myers prefieren la conveniencia de recibir atención psiquiátrica experta desde casa."
      },
      {
        question: "¿Qué servicios de salud mental proporcionan para residentes de Fort Myers?",
        answer: "Ofrecemos atención psiquiátrica integral incluyendo tratamiento de ansiedad, manejo de depresión, evaluación y tratamiento de TDAH, terapia de TEPT, tratamiento de trastorno bipolar, y manejo de medicamentos psiquiátricos para residentes de Fort Myers."
      },
      {
        question: "¿Aceptan seguro comúnmente usado en Fort Myers?",
        answer: "Sí, aceptamos la mayoría de los principales planes de seguro comunes en el área de Fort Myers, incluyendo Aetna, Cigna, Medicare, Medicaid de Florida, y muchos otros. Por favor llame para verificar su plan específico."
      },
      {
        question: "¿La Dra. Reve proporciona servicios en español para pacientes de Fort Myers?",
        answer: "Sí, la Dra. Reve es completamente bilingüe (inglés/español) y proporciona atención psiquiátrica culturalmente sensible a la diversa comunidad de Fort Myers, incluyendo servicios completos en español."
      },
      {
        question: "¿Pueden ayudar con evaluaciones de TDAH para adultos de Fort Myers?",
        answer: "¡Absolutamente! La evaluación y tratamiento de TDAH en adultos es una de nuestras especialidades principales. Proporcionamos evaluaciones completas para residentes de Fort Myers que pueden tener TDAH no diagnosticado o tratado inadecuadamente."
      },
      {
        question: "¿Cómo coordinan la atención con otros proveedores en Fort Myers?",
        answer: "Trabajamos estrechamente con médicos de atención primaria, terapeutas, y otros proveedores de atención médica en el área de Fort Myers para asegurar atención integral y coordinada de salud mental para nuestros pacientes."
      },
      {
        question: "¿Qué deben esperar los pacientes de Fort Myers para su primera cita?",
        answer: "Su evaluación psiquiátrica inicial es una cita integral de 60-90 minutos donde discutimos su historial de salud mental, preocupaciones actuales, y desarrollamos un plan de tratamiento personalizado. Esto puede hacerse en persona o por videollamada segura."
      },
      {
        question: "¿Tratan ansiedad y depresión para residentes de Fort Myers?",
        answer: "Sí, el tratamiento de ansiedad y depresión son nuestras especialidades principales. Proporcionamos manejo de medicamentos basado en evidencia y trabajamos con terapeutas locales de Fort Myers para proporcionar atención integral."
      },
      {
        question: "¿Cómo funciona el manejo de medicamentos para pacientes de Fort Myers?",
        answer: "Proporcionamos manejo continuo de medicamentos con citas regulares de seguimiento (en persona o virtuales). Las órdenes de medicamentos pueden enviarse directamente a su farmacia preferida en el área de Fort Myers, haciendo el proceso sin problemas."
      }
    ]
  },

  immokalee: {
    en: [
      {
        question: "How far is the drive from Immokalee to your Naples office?",
        answer: "The drive from Immokalee to our Naples office is approximately 45-50 minutes via Immokalee Road (Route 846) west to US-41. We understand it's a longer drive and offer flexible scheduling to accommodate our Immokalee patients."
      },
      {
        question: "Do you offer telehealth services for Immokalee residents?",
        answer: "Yes! We strongly recommend our secure video consultation services for Immokalee residents. This eliminates the long drive and allows you to receive expert psychiatric care from your home or workplace."
      },
      {
        question: "Do you provide mental health services in Spanish for the Immokalee community?",
        answer: "Absolutely! Dr. Reve is fully bilingual (English/Spanish) and understands the cultural needs of Immokalee's predominantly Hispanic community. We provide culturally sensitive psychiatric care in Spanish."
      },
      {
        question: "What insurance do you accept for Immokalee agricultural workers?",
        answer: "We accept Medicaid, Medicare, and many commercial insurance plans. We understand that many Immokalee residents work in agriculture and may have specific insurance needs - please call to discuss your coverage options."
      },
      {
        question: "Do you understand the mental health challenges faced by agricultural workers in Immokalee?",
        answer: "Yes, we recognize the unique stressors faced by agricultural workers including seasonal employment, physical demands, and immigration concerns. We provide compassionate, non-judgmental care that addresses these specific challenges."
      },
      {
        question: "Can you help with work-related stress and anxiety for Immokalee workers?",
        answer: "Absolutely. We treat anxiety, depression, and stress-related conditions that may stem from challenging work conditions, seasonal employment patterns, and other occupational stressors common in agricultural work."
      },
      {
        question: "What weekday appointment options are available for Immokalee patients?",
        answer: "Appointments are offered during our published Monday through Friday, 8:00 AM to 5:00 PM office hours. Tell us your availability when scheduling, and we'll help identify an available weekday time."
      },
      {
        question: "How do you handle language barriers or cultural concerns for Immokalee patients?",
        answer: "Dr. Reve speaks fluent Spanish and has extensive experience working with Hispanic communities. We provide culturally competent care and understand the importance of family involvement in mental health decisions."
      },
      {
        question: "Can you help coordinate care with community health centers in Immokalee?",
        answer: "Yes, we work with Healthcare Network and other community providers in Immokalee to ensure coordinated care. We understand the importance of working within the existing healthcare infrastructure serving your community."
      },
      {
        question: "Do you treat trauma and PTSD for Immokalee residents?",
        answer: "Yes, we provide trauma-informed psychiatric care for PTSD, including trauma that may result from difficult working conditions, immigration experiences, or other life stressors. We offer compassionate, confidential treatment."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está el viaje desde Immokalee hasta su oficina en Naples?",
        answer: "El viaje desde Immokalee hasta nuestra oficina en Naples es aproximadamente 45-50 minutos por Immokalee Road (Ruta 846) oeste hasta US-41. Entendemos que es un viaje más largo y ofrecemos horarios flexibles para acomodar a nuestros pacientes de Immokalee."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Immokalee?",
        answer: "¡Sí! Recomendamos enérgicamente nuestros servicios de consulta por video segura para residentes de Immokalee. Esto elimina el viaje largo y le permite recibir atención psiquiátrica experta desde su casa o lugar de trabajo."
      },
      {
        question: "¿Proporcionan servicios de salud mental en español para la comunidad de Immokalee?",
        answer: "¡Absolutamente! La Dra. Reve es completamente bilingüe (inglés/español) y entiende las necesidades culturales de la comunidad predominantemente hispana de Immokalee. Proporcionamos atención psiquiátrica culturalmente sensible en español."
      },
      {
        question: "¿Qué seguro aceptan para trabajadores agrícolas de Immokalee?",
        answer: "Aceptamos Medicaid, Medicare, y muchos planes de seguro comerciales. Entendemos que muchos residentes de Immokalee trabajan en agricultura y pueden tener necesidades específicas de seguro - por favor llame para discutir sus opciones de cobertura."
      },
      {
        question: "¿Entienden los desafíos de salud mental que enfrentan los trabajadores agrícolas en Immokalee?",
        answer: "Sí, reconocemos los factores estresantes únicos que enfrentan los trabajadores agrícolas incluyendo empleo estacional, demandas físicas, y preocupaciones de inmigración. Proporcionamos atención compasiva y sin prejuicios que aborda estos desafíos específicos."
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
        answer: "La Dra. Reve habla español con fluidez y tiene amplia experiencia trabajando con comunidades hispanas. Proporcionamos atención culturalmente competente y entendemos la importancia de la participación familiar en las decisiones de salud mental."
      },
      {
        question: "¿Pueden ayudar a coordinar atención con centros de salud comunitarios en Immokalee?",
        answer: "Sí, trabajamos con Healthcare Network y otros proveedores comunitarios en Immokalee para asegurar atención coordinada. Entendemos la importancia de trabajar dentro de la infraestructura de atención médica existente que sirve a su comunidad."
      },
      {
        question: "¿Tratan trauma y TEPT para residentes de Immokalee?",
        answer: "Sí, proporcionamos atención psiquiátrica informada en trauma para TEPT, incluyendo trauma que puede resultar de condiciones de trabajo difíciles, experiencias de inmigración, u otros factores estresantes de la vida. Ofrecemos tratamiento compasivo y confidencial."
      }
    ]
  },

  aveMaria: {
    en: [
      {
        question: "How far is your Naples office from Ave Maria?",
        answer: "Our office is approximately 35-40 minutes from Ave Maria via Immokalee Road west to US-41 north. We understand it's a drive for Ave Maria students and residents, so we offer flexible scheduling and telehealth options."
      },
      {
        question: "Do you provide telehealth services for Ave Maria University students and residents?",
        answer: "Yes! We offer secure video consultations that are perfect for busy college students and Ave Maria residents. This eliminates the drive time and allows flexible scheduling around academic commitments."
      },
      {
        question: "Do you treat college students from Ave Maria University?",
        answer: "Absolutely! We have extensive experience working with college students and young adults. We understand the unique mental health challenges of university life, including academic stress, social pressures, and life transitions."
      },
      {
        question: "What insurance do you accept for Ave Maria University students?",
        answer: "We accept most major insurance plans including those commonly used by students and university employees. We also work with students on payment plans when needed. Please call to verify your specific coverage."
      },
      {
        question: "Do you provide ADHD evaluations and treatment for Ave Maria students?",
        answer: "Yes, ADHD evaluation and treatment is one of our specialties. Many college students seek diagnosis for the first time when academic demands increase. We provide comprehensive evaluations and ongoing treatment."
      },
      {
        question: "Can you help with anxiety and depression related to college life in Ave Maria?",
        answer: "Absolutely. We frequently treat anxiety and depression in college students, including academic anxiety, social anxiety, adjustment disorders, and depression. We understand the unique pressures of university life."
      },
      {
        question: "Do you coordinate care with Ave Maria University counseling services?",
        answer: "Yes, we work collaboratively with university counseling centers when appropriate. We believe in coordinated care that may combine our psychiatric medication management with campus counseling services."
      },
      {
        question: "Can you provide services in Spanish for Ave Maria's diverse community?",
        answer: "Yes, Dr. Reve is fully bilingual (English/Spanish) and provides culturally sensitive care to Ave Maria's diverse student body and resident community, including Spanish-speaking families."
      },
      {
        question: "What should Ave Maria students expect for their first appointment?",
        answer: "Your initial evaluation focuses on understanding your academic and personal stressors, mental health history, and treatment goals. We tailor our approach to the unique needs of college students and young adults."
      },
      {
        question: "Do you provide crisis support for Ave Maria students?",
        answer: "While we don't provide 24/7 crisis services, we work closely with emergency resources and can help students access appropriate crisis support when needed. We also provide urgent appointments when possible."
      }
    ],
    es: [
      {
        question: "¿Qué tan lejos está su oficina de Naples desde Ave Maria?",
        answer: "Nuestra oficina está aproximadamente 35-40 minutos desde Ave Maria por Immokalee Road oeste hasta US-41 norte. Entendemos que es un viaje para estudiantes y residentes de Ave Maria, así que ofrecemos horarios flexibles y opciones de telesalud."
      },
      {
        question: "¿Proporcionan servicios de telesalud para estudiantes y residentes de Ave Maria University?",
        answer: "¡Sí! Ofrecemos consultas por video seguras que son perfectas para estudiantes universitarios ocupados y residentes de Ave Maria. Esto elimina el tiempo de viaje y permite horarios flexibles alrededor de compromisos académicos."
      },
      {
        question: "¿Tratan estudiantes universitarios de Ave Maria University?",
        answer: "¡Absolutamente! Tenemos amplia experiencia trabajando con estudiantes universitarios y adultos jóvenes. Entendemos los desafíos únicos de salud mental de la vida universitaria, incluyendo estrés académico, presiones sociales, y transiciones de vida."
      },
      {
        question: "¿Qué seguro aceptan para estudiantes de Ave Maria University?",
        answer: "Aceptamos la mayoría de los principales planes de seguro incluyendo aquellos comúnmente usados por estudiantes y empleados universitarios. También trabajamos con estudiantes en planes de pago cuando sea necesario. Por favor llame para verificar su cobertura específica."
      },
      {
        question: "¿Proporcionan evaluaciones y tratamiento de TDAH para estudiantes de Ave Maria?",
        answer: "Sí, la evaluación y tratamiento de TDAH es una de nuestras especialidades. Muchos estudiantes universitarios buscan diagnóstico por primera vez cuando las demandas académicas aumentan. Proporcionamos evaluaciones completas y tratamiento continuo."
      },
      {
        question: "¿Pueden ayudar con ansiedad y depresión relacionadas a la vida universitaria en Ave Maria?",
        answer: "Absolutamente. Frecuentemente tratamos ansiedad y depresión en estudiantes universitarios, incluyendo ansiedad académica, ansiedad social, trastornos de adaptación, y depresión. Entendemos las presiones únicas de la vida universitaria."
      },
      {
        question: "¿Coordinan atención con los servicios de consejería de Ave Maria University?",
        answer: "Sí, trabajamos colaborativamente con centros de consejería universitaria cuando es apropiado. Creemos en atención coordinada que puede combinar nuestro manejo de medicamentos psiquiátricos con servicios de consejería del campus."
      },
      {
        question: "¿Pueden proporcionar servicios en español para la comunidad diversa de Ave Maria?",
        answer: "Sí, la Dra. Reve es completamente bilingüe (inglés/español) y proporciona atención culturalmente sensible al diverso cuerpo estudiantil de Ave Maria y la comunidad residente, incluyendo familias de habla hispana."
      },
      {
        question: "¿Qué deben esperar los estudiantes de Ave Maria para su primera cita?",
        answer: "Su evaluación inicial se enfoca en entender sus factores estresantes académicos y personales, historial de salud mental, y objetivos de tratamiento. Adaptamos nuestro enfoque a las necesidades únicas de estudiantes universitarios y adultos jóvenes."
      },
      {
        question: "¿Proporcionan apoyo de crisis para estudiantes de Ave Maria?",
        answer: "Aunque no proporcionamos servicios de crisis 24/7, trabajamos estrechamente con recursos de emergencia y podemos ayudar a estudiantes a acceder apoyo de crisis apropiado cuando sea necesario. También proporcionamos citas urgentes cuando es posible."
      }
    ]
  },

  lelyResorts: {
    en: [
      {
        question: "How close is your Naples office to Lely Resort?",
        answer: "We're very conveniently located for Lely Resort residents! Our office is just about 15-20 minutes north on US-41 (Tamiami Trail). Many of our Lely Resort patients appreciate the short, easy drive."
      },
      {
        question: "Do you offer telehealth services for Lely Resort residents?",
        answer: "Absolutely! We provide secure video consultations that are popular with our Lely Resort patients. This allows you to receive expert psychiatric care from your resort home without the drive."
      },
      {
        question: "What mental health services do you provide for Lely Resort residents?",
        answer: "We offer comprehensive psychiatric care including anxiety treatment, depression management, ADHD evaluation, PTSD treatment, bipolar disorder care, and medication management specifically tailored for Lely Resort residents."
      },
      {
        question: "Do you accept Medicare and other insurance common in Lely Resort?",
        answer: "Yes, we accept Medicare, Medicare Advantage plans, and most major commercial insurance plans common among Lely Resort residents. Please call to verify your specific plan coverage."
      },
      {
        question: "Can you coordinate care for seasonal residents who split time between Lely Resort and up north?",
        answer: "Absolutely! We specialize in coordinating psychiatric care for seasonal residents. We can work with your northern healthcare providers to ensure continuous mental health care year-round."
      },
      {
        question: "Do you understand the mental health needs of retirees in resort communities like Lely?",
        answer: "Yes, we have extensive experience working with retirees and understand the unique aspects of retirement mental health, including life transitions, social changes, and health concerns common in resort retirement communities."
      },
      {
        question: "Do you treat age-related depression and anxiety for Lely Resort residents?",
        answer: "Absolutely. We provide specialized care for depression and anxiety that may arise during retirement years, including adjustment to retirement, health-related anxiety, and social isolation concerns."
      },
      {
        question: "Can you help with medication management for complex medical conditions common in Lely Resort?",
        answer: "Yes, we carefully coordinate psychiatric medications with other medications you may be taking for medical conditions. We work closely with your primary care physicians and specialists to ensure safe, effective treatment."
      },
      {
        question: "Do you provide couples counseling referrals for Lely Resort residents?",
        answer: "While we focus on psychiatric medication management, we work with excellent couples therapists in the Naples area and can provide referrals when relationship counseling would be beneficial alongside psychiatric care."
      },
      {
        question: "What's the parking situation for Lely Resort patients visiting your office?",
        answer: "We offer free, convenient parking directly at our office location. It's much easier than typical medical appointments, and many Lely Resort patients comment on how convenient and stress-free the parking is."
      }
    ],
    es: [
      {
        question: "¿Qué tan cerca está su oficina de Naples a Lely Resort?",
        answer: "¡Estamos muy convenientemente ubicados para residentes de Lely Resort! Nuestra oficina está a solo unos 15-20 minutos al norte en US-41 (Tamiami Trail). Muchos de nuestros pacientes de Lely Resort aprecian el viaje corto y fácil."
      },
      {
        question: "¿Ofrecen servicios de telesalud para residentes de Lely Resort?",
        answer: "¡Absolutamente! Proporcionamos consultas por video seguras que son populares con nuestros pacientes de Lely Resort. Esto le permite recibir atención psiquiátrica experta desde su hogar en el resort sin el viaje."
      },
      {
        question: "¿Qué servicios de salud mental proporcionan para residentes de Lely Resort?",
        answer: "Ofrecemos atención psiquiátrica integral incluyendo tratamiento de ansiedad, manejo de depresión, evaluación de TDAH, tratamiento de TEPT, atención de trastorno bipolar, y manejo de medicamentos específicamente adaptado para residentes de Lely Resort."
      },
      {
        question: "¿Aceptan Medicare y otros seguros comunes en Lely Resort?",
        answer: "Sí, aceptamos Medicare, planes Medicare Advantage, y la mayoría de los principales planes de seguro comerciales comunes entre residentes de Lely Resort. Por favor llame para verificar la cobertura de su plan específico."
      },
      {
        question: "¿Pueden coordinar atención para residentes estacionales que dividen el tiempo entre Lely Resort y el norte?",
        answer: "¡Absolutamente! Nos especializamos en coordinar atención psiquiátrica para residentes estacionales. Podemos trabajar con sus proveedores de atención médica del norte para asegurar atención continua de salud mental durante todo el año."
      },
      {
        question: "¿Entienden las necesidades de salud mental de jubilados en comunidades de resort como Lely?",
        answer: "Sí, tenemos amplia experiencia trabajando con jubilados y entendemos los aspectos únicos de la salud mental en la jubilación, incluyendo transiciones de vida, cambios sociales, y preocupaciones de salud comunes en comunidades de jubilación de resort."
      },
      {
        question: "¿Tratan depresión y ansiedad relacionadas con la edad para residentes de Lely Resort?",
        answer: "Absolutamente. Proporcionamos atención especializada para depresión y ansiedad que pueden surgir durante los años de jubilación, incluyendo adaptación a la jubilación, ansiedad relacionada con la salud, y preocupaciones de aislamiento social."
      },
      {
        question: "¿Pueden ayudar con manejo de medicamentos para condiciones médicas complejas comunes en Lely Resort?",
        answer: "Sí, coordinamos cuidadosamente los medicamentos psiquiátricos con otros medicamentos que pueda estar tomando para condiciones médicas. Trabajamos estrechamente con sus médicos de atención primaria y especialistas para asegurar tratamiento seguro y efectivo."
      },
      {
        question: "¿Proporcionan referencias de consejería de parejas para residentes de Lely Resort?",
        answer: "Aunque nos enfocamos en manejo de medicamentos psiquiátricos, trabajamos con excelentes terapeutas de parejas en el área de Naples y podemos proporcionar referencias cuando la consejería de relaciones sería beneficiosa junto con la atención psiquiátrica."
      },
      {
        question: "¿Cuál es la situación de estacionamiento para pacientes de Lely Resort que visitan su oficina?",
        answer: "Ofrecemos estacionamiento gratuito y conveniente directamente en nuestra ubicación de oficina. Es mucho más fácil que las citas médicas típicas, y muchos pacientes de Lely Resort comentan sobre qué tan conveniente y libre de estrés es el estacionamiento."
      }
    ]
  },

  telehealth: {
    en: [
      {
        question: "What is telepsychiatry and how does it work?",
        answer: "Telepsychiatry is psychiatric care delivered through secure video sessions. You meet with Dr. Reve virtually from your home or private space using a HIPAA-compliant platform. It's just as effective as in-person visits for psychiatric evaluations, therapy, and ongoing treatment."
      },
      {
        question: "Do I need any special equipment for telehealth sessions?",
        answer: "All you need is a device with a camera and microphone (smartphone, tablet, or computer), a stable internet connection, and a private space. We use CharmHealth's secure platform that works directly in your web browser - no downloads required."
      },
      {
        question: "Is telepsychiatry as effective as in-person appointments?",
        answer: "Yes! Research shows telepsychiatry is equally effective for most psychiatric conditions including anxiety, depression, ADHD, PTSD, and bipolar disorder. Dr. Reve can assess symptoms and provide comprehensive psychiatric care virtually."
      },
      {
        question: "What types of psychiatric conditions can be treated via telehealth?",
        answer: "Dr. Reve treats a wide range of conditions virtually, including anxiety, depression, ADHD, PTSD, bipolar disorder, and other mental health concerns. Virtual sessions offer the same comprehensive evaluation and ongoing psychiatric support as in-person visits."
      },
      {
        question: "What areas of Florida does Dr. Reve serve through telehealth?",
        answer: "Dr. Reve provides telepsychiatry services to patients throughout the entire state of Florida. As long as you are physically located in Florida during the appointment, you can receive care from anywhere in the state."
      },
      {
        question: "How do I schedule a telehealth appointment?",
        answer: "You can schedule online 24/7 through our CharmHealth booking system or call our office at (239) 423-0272. We offer flexible scheduling with same-day appointments often available."
      },
      {
        question: "Is my privacy protected during telehealth sessions?",
        answer: "Yes, completely. We use a HIPAA-compliant, encrypted video platform that meets all federal privacy standards. Your session is confidential and secure, just like in-person visits."
      },
      {
        question: "Does insurance cover telepsychiatry services?",
        answer: "Most insurance plans now cover telepsychiatry the same as in-person visits. We accept Aetna, Cigna, Medicare, Florida Blue, and most major insurance plans. Contact us to verify your specific coverage."
      },
      {
        question: "Can I switch between telehealth and in-person visits?",
        answer: "Yes! Many patients prefer a hybrid approach - some appointments virtual, others in-person at our Naples office. You can choose what works best for your schedule and needs."
      },
      {
        question: "What if I have technical issues during my telehealth appointment?",
        answer: "Our team is here to help! We provide technical support and can troubleshoot any issues. If needed, we can switch to a phone call to ensure you receive your care without interruption."
      }
    ],
    es: [
      {
        question: "¿Qué es la telepsiquiatría y cómo funciona?",
        answer: "La telepsiquiatría es atención psiquiátrica brindada a través de sesiones de video seguras. Se reúne con la Dra. Reve virtualmente desde su hogar o espacio privado usando una plataforma compatible con HIPAA. Es tan efectiva como las visitas en persona para evaluaciones psiquiátricas, terapia y tratamiento continuo."
      },
      {
        question: "¿Necesito algún equipo especial para las sesiones de telesalud?",
        answer: "Todo lo que necesita es un dispositivo con cámara y micrófono (teléfono inteligente, tableta o computadora), una conexión a internet estable y un espacio privado. Usamos la plataforma segura CharmHealth que funciona directamente en su navegador web - no se requieren descargas."
      },
      {
        question: "¿Es la telepsiquiatría tan efectiva como las citas en persona?",
        answer: "¡Sí! La investigación muestra que la telepsiquiatría es igualmente efectiva para la mayoría de las condiciones psiquiátricas incluyendo ansiedad, depresión, TDAH, TEPT y trastorno bipolar. La Dra. Reve puede evaluar síntomas y proporcionar atención psiquiátrica integral virtualmente."
      },
      {
        question: "¿Qué tipos de condiciones psiquiátricas se pueden tratar por telesalud?",
        answer: "La Dra. Reve trata una amplia gama de condiciones virtualmente, incluyendo ansiedad, depresión, TDAH, TEPT, trastorno bipolar y otras afecciones de salud mental. Las sesiones virtuales ofrecen la misma evaluación integral y apoyo psiquiátrico continuo que las visitas en persona."
      },
      {
        question: "¿Qué áreas de Florida atiende la Dra. Reve a través de telesalud?",
        answer: "La Dra. Reve proporciona servicios de telepsiquiatría a pacientes en todo el estado de Florida. Siempre que esté físicamente ubicado en Florida durante la cita, puede recibir atención desde cualquier lugar del estado."
      },
      {
        question: "¿Cómo programo una cita de telesalud?",
        answer: "Puede programar en línea 24/7 a través de nuestro sistema de reservas CharmHealth o llamar a nuestra oficina al (239) 423-0272. Ofrecemos horarios flexibles con citas el mismo día a menudo disponibles."
      },
      {
        question: "¿Está protegida mi privacidad durante las sesiones de telesalud?",
        answer: "Sí, completamente. Usamos una plataforma de video encriptada compatible con HIPAA que cumple con todos los estándares federales de privacidad. Su sesión es confidencial y segura, igual que las visitas en persona."
      },
      {
        question: "¿El seguro cubre los servicios de telepsiquiatría?",
        answer: "La mayoría de los planes de seguro ahora cubren la telepsiquiatría igual que las visitas en persona. Aceptamos Aetna, Cigna, Medicare, Florida Blue y la mayoría de los principales planes de seguro. Contáctenos para verificar su cobertura específica."
      },
      {
        question: "¿Puedo alternar entre visitas de telesalud y en persona?",
        answer: "¡Sí! Muchos pacientes prefieren un enfoque híbrido - algunas citas virtuales, otras en persona en nuestra oficina de Naples. Puede elegir lo que funcione mejor para su horario y necesidades."
      },
      {
        question: "¿Qué pasa si tengo problemas técnicos durante mi cita de telesalud?",
        answer: "¡Nuestro equipo está aquí para ayudar! Proporcionamos soporte técnico y podemos solucionar cualquier problema. Si es necesario, podemos cambiar a una llamada telefónica para asegurar que reciba su atención sin interrupción."
      }
    ]
  },

  californiaTelehealth: {
    en: [
      {
        question: "Does the doctor speak Spanish?",
        answer: "Yes. Spanish is her native language. Your entire appointment can be in Spanish, from start to finish."
      },
      {
        question: "Can I be seen if I live in California?",
        answer: "Yes, as long as you are physically in California during the appointment. It is a legal requirement: telehealth care is governed by the state where the patient is located."
      },
      {
        question: "Do you accept health insurance?",
        answer: "Not in California. Appointments are direct pay. In exchange, the price is clear from the start and there is no paperwork or prior authorizations."
      },
      {
        question: "How much does it cost?",
        answer: "Appointments are direct pay, with no insurance in between. Write to us on WhatsApp and we will confirm the exact price before you book, so there are no surprises."
      },
      {
        question: "How does payment work?",
        answer: "You pay for your appointment directly to the practice. \"Cash pay\" does not mean paying in physical cash: it is simply the term used in the United States for care paid without health insurance, with no claims and no prior authorizations."
      },
      {
        question: "What do I need for the video call?",
        answer: "A phone, tablet, or computer with a camera and microphone, an internet connection, and a place where you can talk privately. Nothing needs to be installed."
      },
      {
        question: "What happens at the first appointment?",
        answer: "It is a complete psychiatric evaluation, a 60-minute video call. Dr. Reve talks with you about what you are going through, your history and your symptoms, answers your questions, and explains the next steps of your treatment. Follow-up appointments last 30 minutes."
      },
      {
        question: "Do you see minors?",
        answer: "No. Appointments are for adults 18 and older only."
      },
      {
        question: "Is it the same as going in person?",
        answer: "For most cases, yes. Psychiatric evaluation and follow-up work just as well by video call, and you do not have to travel."
      },
      {
        question: "Is the video call private?",
        answer: "Yes. Appointments take place on a secure medical platform and your information is protected by medical privacy laws (HIPAA), just like an in-person visit."
      },
      {
        question: "What if I have an emergency?",
        answer: "This practice does not handle emergencies. If you are in crisis, call 988 or 911."
      }
    ],
    es: [
      {
        question: "¿La doctora habla español?",
        answer: "Sí. El español es su lengua materna. Toda la consulta puede ser en español, de principio a fin."
      },
      {
        question: "¿Puedo atenderme si vivo en California?",
        answer: "Sí, siempre que estés físicamente en California durante la cita. Es un requisito legal: la atención médica a distancia se rige por el estado donde está el paciente."
      },
      {
        question: "¿Aceptan seguro médico?",
        answer: "En California no. La consulta es de pago directo. A cambio, el precio es claro desde el principio y no hay trámites ni autorizaciones."
      },
      {
        question: "¿Cuánto cuesta?",
        answer: "La consulta es de pago directo, sin seguros de por medio. Escríbenos por WhatsApp y te confirmamos el precio exacto antes de reservar, sin sorpresas."
      },
      {
        question: "¿Cómo funciona el pago?",
        answer: "Pagas tu consulta directamente a la práctica. \"Cash pay\" no significa pagar en efectivo: es simplemente el término que se usa en Estados Unidos para la atención que se paga sin seguro médico, sin reclamos ni autorizaciones previas."
      },
      {
        question: "¿Qué necesito para la videollamada?",
        answer: "Un móvil, tablet u ordenador con cámara y micrófono, conexión a internet y un sitio donde puedas hablar tranquilo. No hace falta instalar nada."
      },
      {
        question: "¿Qué pasa en la primera consulta?",
        answer: "Es una evaluación psiquiátrica completa, una videollamada de 60 minutos. La Dra. Reve conversa contigo sobre lo que estás pasando, tu historia y tus síntomas, responde tus preguntas y te explica los siguientes pasos de tu tratamiento. Las consultas de seguimiento duran 30 minutos."
      },
      {
        question: "¿Atienden a menores de edad?",
        answer: "No. La consulta es solo para adultos a partir de 18 años."
      },
      {
        question: "¿Es lo mismo que ir en persona?",
        answer: "Para la mayoría de los casos, sí. La evaluación psiquiátrica y el seguimiento funcionan igual de bien por videollamada, y así no tienes que desplazarte."
      },
      {
        question: "¿La videollamada es privada?",
        answer: "Sí. La consulta se realiza en una plataforma médica segura y tu información está protegida por las leyes de privacidad médica (HIPAA), igual que una visita en persona."
      },
      {
        question: "¿Y si tengo una urgencia?",
        answer: "Esta consulta no atiende urgencias. Si estás en crisis, llama al 988 o al 911."
      }
    ]
  }
};
