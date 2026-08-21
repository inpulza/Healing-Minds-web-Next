// Per-city hyperlocal content for location pages.
// Geographic context is intentionally non-quantitative. Travel ranges have one
// display source per city in `duration`; prose tells readers to check live traffic.
// No invented testimonials, patient counts, demographic figures or reviews.

export type Lang = 'en' | 'es';

export interface CityHyperlocal {
  seo: {
    title: Record<Lang, string>;
    description: Record<Lang, string>;
    keywords: Record<Lang, string>;
    serviceDescription: Record<Lang, string>;
  };
  heroDescription: Record<Lang, string>;
  healingParagraph: Record<Lang, string>;
  servicesIntro: Record<Lang, string>;
  routeIntro: Record<Lang, string>;
  routeSteps: Record<Lang, string[]>;
  duration: Record<Lang, string>;
  bottomNote: Record<Lang, string>;
  featureBadges: { en: string; es: string }[];
  serviceNotes: Record<Lang, string[]>;
  neighborhoods: Record<Lang, string[]>;
  localContext: Record<Lang, string>;
}

export const cityHyperlocal: Record<string, CityHyperlocal> = {
  lelyResorts: {
    seo: {
      title: {
        en: 'Psychiatrist for Lely Resort, FL — Bilingual Adult Care | Healing Minds',
        es: 'Psiquiatra para Lely Resort, FL — Atención Bilingüe para Adultos | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Lely Resort residents from our only physical office in Naples. Patients may request telehealth; the office confirms eligibility and availability case by case. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para residentes de Lely Resort desde nuestra única oficina física en Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad y disponibilidad caso por caso. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Lely Resort FL, Players Club mental health, Stonebridge psychiatrist, retirement community psychiatry Naples, bilingual psychiatrist 34113',
        es: 'psiquiatra Lely Resort FL, salud mental Players Club, psiquiatra Stonebridge, psiquiatría jubilados Naples, psiquiatra bilingüe 34113',
      },
      serviceDescription: {
        en: "Psychiatric care serving adults in Lely Resort (ZIP 34113) from our only physical office in Naples. Dr. Melva Reve treats anxiety, depression, life-transition adjustment, sleep difficulties, ADHD, PTSD and bipolar disorder and provides medication review. Sessions are bilingual; appointment modality is confirmed when scheduling.",
        es: "Atención psiquiátrica para adultos de Lely Resort (ZIP 34113) desde nuestra única oficina física en Naples. La Dra. Melva Reve trata ansiedad, depresión, ajuste a transiciones de vida, problemas del sueño, TDAH, TEPT y trastorno bipolar y realiza revisión de medicamentos. Las sesiones son bilingües; la modalidad se confirma al programar.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for adults in Lely Resort from our Park Shore office, connected by Collier Boulevard and US-41.",
      es: "Atención psiquiátrica bilingüe para adultos de Lely Resort desde nuestra oficina de Park Shore, conectada por Collier Boulevard y US-41.",
    },
    healingParagraph: {
      en: "Lely Resort includes master-association communities such as Players Club, Stonebridge, the Classics and Lakoya. Our only physical office is in Park Shore; travel varies by origin and traffic. The office confirms whether in-person or telehealth care is clinically appropriate when scheduling. Care is bilingual and oriented to sleep, anxiety, mood changes and careful medication review.",
      es: "Lely Resort incluye comunidades de asociación maestra como Players Club, Stonebridge, the Classics y Lakoya. Nuestra única oficina física está en Park Shore; el viaje varía según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínicamente apropiada al programar. La atención es bilingüe y se centra en sueño, ansiedad, cambios de ánimo y revisión cuidadosa de medicamentos.",
    },
    servicesIntro: {
      en: "Services available to Lely Resort adults include psychiatric evaluation, treatment planning and medication management. The plan is individualized after assessment.",
      es: "Los servicios disponibles para adultos de Lely Resort incluyen evaluación psiquiátrica, planificación del tratamiento y manejo de medicamentos. El plan se individualiza después de la evaluación.",
    },
    routeIntro: {
      en: "Collier Boulevard (CR-951) and US-41 connect Lely Resort with our Park Shore office. Check current directions and traffic before traveling.",
      es: "Collier Boulevard (CR-951) y US-41 conectan Lely Resort con nuestra oficina de Park Shore. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Exit the Lely Resort entrance onto Collier Blvd (CR-951) heading north",
        "Continue ~5.5 miles to US-41 / Tamiami Trail North",
        "Turn left (north) onto US-41 toward Park Shore",
        "Arrive at 4760 Tamiami Trl N #25, Naples, FL 34103",
      ],
      es: [
        "Salga de Lely Resort hacia Collier Blvd (CR-951) en dirección norte",
        "Continúe ~5.5 millas hasta US-41 / Tamiami Trail North",
        "Gire a la izquierda (norte) en US-41 hacia Park Shore",
        "Llegue a 4760 Tamiami Trl N #25, Naples, FL 34103",
      ],
    },
    duration: { en: '15-20 minutes', es: '15-20 minutos' },
    bottomNote: {
      en: "Serving Lely Resort residents from our only physical office in Park Shore. Appointment modality and telehealth eligibility are confirmed when scheduling. Call (239) 423-0272.",
      es: "Atendiendo a residentes de Lely Resort desde nuestra única oficina física en Park Shore. La modalidad y elegibilidad para telesalud se confirman al programar. Llame al (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Adult Psychiatric Care', es: 'Atención Psiquiátrica para Adultos' },
      { en: 'Route via US-41', es: 'Ruta por US-41' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Medication Review', es: 'Revisión de Medicamentos' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Check Parking and Access Details When Scheduling', es: 'Confirme Estacionamiento y Acceso al Programar' },
    ],
    serviceNotes: {
      en: [
        "Anxiety symptoms are evaluated according to each adult patient's history and current concerns.",
        "Mood symptoms and treatment options are reviewed after individual assessment.",
        "Psychiatric ADHD evaluations are available to adults 18 and older.",
        "Trauma-informed psychiatric evaluation and treatment are available to adults.",
        "Medication and follow-up plans are individualized according to clinical needs.",
        "Medication review based on the patient's current prescriptions and clinical needs.",
      ],
      es: [
        "Los síntomas de ansiedad se evalúan según el historial y las inquietudes actuales de cada paciente adulto.",
        "Los síntomas del ánimo y las opciones de tratamiento se revisan después de una evaluación individual.",
        "Las evaluaciones psiquiátricas de TDAH están disponibles para adultos de 18 años en adelante.",
        "La evaluación y el tratamiento psiquiátrico informado en trauma están disponibles para adultos.",
        "Los planes de medicamentos y seguimiento se individualizan según las necesidades clínicas.",
        "Revisión de medicamentos según las recetas actuales y necesidades clínicas del paciente.",
      ],
    },
    neighborhoods: {
      en: ['Players Club & Spa', 'Stonebridge', 'The Classics', 'Lakoya', 'Mustang Island', 'Lely Country Club', 'Ole at Lely Resort', 'Tiger Island Estates'],
      es: ['Players Club & Spa', 'Stonebridge', 'The Classics', 'Lakoya', 'Mustang Island', 'Lely Country Club', 'Ole at Lely Resort', 'Tiger Island Estates'],
    },
    localContext: {
      en: "We serve adults from Lely Resort's master-association communities in ZIP 34113 — from Players Club & Spa and Stonebridge to the Classics and Lakoya. Patients may request in-person or video care; the office confirms availability, modality and telehealth eligibility for each appointment.",
      es: "Atendemos a adultos de la red de comunidades de Lely Resort en el ZIP 34113 — desde Players Club & Spa y Stonebridge hasta the Classics y Lakoya. Los pacientes pueden solicitar atención presencial o por video; la oficina confirma la disponibilidad, modalidad y elegibilidad para telesalud en cada cita.",
    },
  },

  vanderbiltBeach: {
    seo: {
      title: {
        en: 'Psychiatrist for Vanderbilt Beach, FL — Snowbird Continuity of Care | Healing Minds',
        es: 'Psiquiatra para Vanderbilt Beach, FL — Continuidad de Atención para Snowbirds | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Vanderbilt Beach (ZIP 34108), with one physical office in Park Shore. Telehealth may be available only when clinically appropriate and when the patient is physically located where Dr. Reve is authorized to provide care.",
        es: "Atención psiquiátrica para Vanderbilt Beach (ZIP 34108), con una única oficina física en Park Shore. La telesalud puede estar disponible solo cuando sea clínicamente apropiada y el paciente esté físicamente donde la Dra. Reve esté autorizada a atender.",
      },
      keywords: {
        en: 'psychiatrist Vanderbilt Beach FL, snowbird psychiatrist Naples, seasonal mental health 34108, telepsychiatry Park Shore',
        es: 'psiquiatra Vanderbilt Beach FL, psiquiatra snowbird Naples, salud mental estacional 34108, telepsiquiatría Park Shore',
      },
      serviceDescription: {
        en: "Psychiatric care for Vanderbilt Beach (ZIP 34108), including Vanderbilt Beach, Pelican Bay and nearby neighborhoods. Dr. Melva Reve provides anxiety and depression treatment, ADHD evaluation, medication management, sleep care and trauma-informed support. With patient consent, coordination with another provider can be evaluated case by case.",
        es: "Atención psiquiátrica para Vanderbilt Beach (ZIP 34108), incluidos Vanderbilt Beach, Pelican Bay y vecindarios cercanos. La Dra. Melva Reve brinda tratamiento de ansiedad y depresión, evaluación de TDAH, manejo de medicamentos, cuidado del sueño y apoyo informado en trauma. Con consentimiento del paciente, la coordinación con otro proveedor puede evaluarse caso por caso.",
      },
    },
    heroDescription: {
      en: "Psychiatric care serving Vanderbilt Beach from our only physical office in Park Shore, with telehealth eligibility confirmed according to clinical need, patient location and applicable licensing.",
      es: "Atención psiquiátrica para residentes de Vanderbilt Beach desde nuestra única oficina física en Park Shore, con elegibilidad para telesalud confirmada según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    healingParagraph: {
      en: "Vanderbilt Beach (ZIP 34108) includes coastal and seasonal neighborhoods near Vanderbilt Beach Road and US-41. Our only physical office is in Park Shore; travel varies by origin and traffic. The office confirms appointment modality and telehealth eligibility case by case; secure record sharing with another provider requires patient consent.",
      es: "Vanderbilt Beach (ZIP 34108) incluye vecindarios costeros y estacionales cerca de Vanderbilt Beach Road y US-41. Nuestra única oficina física está en Park Shore; el viaje varía según el origen y el tráfico. La oficina confirma la modalidad y elegibilidad para telesalud caso por caso; compartir registros con otro proveedor requiere consentimiento del paciente.",
    },
    servicesIntro: {
      en: "The services below are available to Vanderbilt Beach residents. The office confirms whether each appointment should be in person or by secure video based on clinical need, patient location and applicable licensing.",
      es: "Los servicios a continuación están disponibles para residentes de Vanderbilt Beach. La oficina confirma si cada cita debe ser presencial o por video seguro según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "Vanderbilt Beach Road and southbound US-41 connect Vanderbilt Beach with our Park Shore office. Check current directions and traffic before traveling.",
      es: "Vanderbilt Beach Road y US-41 hacia el sur conectan Vanderbilt Beach con nuestra oficina de Park Shore. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Head east on Vanderbilt Beach Rd toward US-41 (Tamiami Trail N)",
        "Turn right (south) onto US-41",
        "Continue ~3.5 miles past Pine Ridge Rd into Park Shore",
        "Arrive at 4760 Tamiami Trl N #25, Naples, FL 34103",
      ],
      es: [
        "Diríjase al este por Vanderbilt Beach Rd hacia US-41 (Tamiami Trail N)",
        "Gire a la derecha (sur) en US-41",
        "Continúe ~3.5 millas pasando Pine Ridge Rd hasta Park Shore",
        "Llegue a 4760 Tamiami Trl N #25, Naples, FL 34103",
      ],
    },
    duration: { en: '10-15 minutes', es: '10-15 minutos' },
    bottomNote: {
      en: "Serving Vanderbilt Beach from our Naples office. Appointment modality, telehealth eligibility and any provider coordination are confirmed case by case. Call (239) 423-0272.",
      es: "Atendiendo a Vanderbilt Beach desde nuestra oficina de Naples. La modalidad, elegibilidad para telesalud y cualquier coordinación con proveedores se confirman caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Snowbird Continuity', es: 'Continuidad para Snowbirds' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'Consent-Based Coordination', es: 'Coordinación con Consentimiento' },
      { en: 'Naples Office', es: 'Oficina en Naples' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
    ],
    serviceNotes: {
      en: [
        "Often tied to the back-and-forth of seasonal living between Naples and a home up north.",
        "Provider coordination can be evaluated case by case with patient consent.",
        "Adult ADHD evaluations with modality confirmed when scheduling.",
        "Trauma-informed care with telehealth eligibility based on patient location and licensing.",
        "Secure record sharing is available only with patient consent.",
        "Refill and monitoring plans are confirmed according to clinical and legal requirements.",
      ],
      es: [
        "A menudo ligada al ir y venir de la vida estacional entre Naples y otra casa en el norte.",
        "La coordinación con otro proveedor puede evaluarse caso por caso con consentimiento.",
        "Evaluaciones de TDAH para adultos con modalidad confirmada al programar.",
        "Atención informada en trauma con elegibilidad para telesalud según ubicación y licencias.",
        "El intercambio seguro de registros requiere consentimiento del paciente.",
        "Los planes de resurtido y monitoreo se confirman según requisitos clínicos y legales.",
      ],
    },
    neighborhoods: {
      en: ['Vanderbilt Beach', 'Pelican Bay', 'Connors at Vanderbilt Beach', 'Baker-Carroll Point', 'Regatta', 'The Dunes', 'Naples Park (north)'],
      es: ['Vanderbilt Beach', 'Pelican Bay', 'Connors at Vanderbilt Beach', 'Baker-Carroll Point', 'Regatta', 'The Dunes', 'Naples Park (norte)'],
    },
    localContext: {
      en: "Vanderbilt Beach (ZIP 34108) is a coastal area connected to Park Shore by Vanderbilt Beach Road and US-41. Travel varies by origin and traffic. Appointment modality, telehealth eligibility and consent-based record sharing are confirmed case by case.",
      es: "Vanderbilt Beach (ZIP 34108) es un área costera conectada con Park Shore por Vanderbilt Beach Road y US-41. El viaje varía según el origen y el tráfico. La modalidad, elegibilidad para telesalud y el intercambio de registros con consentimiento se confirman caso por caso.",
    },
  },

  bonitaSprings: {
    seo: {
      title: {
        en: 'Psychiatrist for Bonita Springs, FL — Bilingual Mental Health on US-41 | Healing Minds',
        es: 'Psiquiatra para Bonita Springs, FL — Salud Mental Bilingüe sobre US-41 | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Bonita Springs (ZIP 34134/34135), connected with our Park Shore office by US-41. Anxiety, depression, ADHD, PTSD and medication management. Check current traffic before traveling. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para Bonita Springs (ZIP 34134/34135), conectada con nuestra oficina de Park Shore por US-41. Ansiedad, depresión, TDAH, TEPT y manejo de medicamentos. Consulte el tráfico actual antes de viajar. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Bonita Springs FL, bilingual psychiatrist 34134, mental health Bonita Springs, ADHD evaluation Bonita Springs',
        es: 'psiquiatra Bonita Springs FL, psiquiatra bilingüe 34134, salud mental Bonita Springs, evaluación TDAH Bonita Springs',
      },
      serviceDescription: {
        en: "Psychiatric care for Bonita Springs (ZIP 34134/34135), including Bonita Bay, Pelican Landing, Spanish Wells and nearby communities. Dr. Melva Reve provides bilingual adult psychiatric evaluation and medication management. Patients may request telehealth; eligibility is confirmed case by case.",
        es: "Atención psiquiátrica para Bonita Springs (ZIP 34134/34135), incluidos Bonita Bay, Pelican Landing, Spanish Wells y comunidades cercanas. La Dra. Melva Reve ofrece evaluación psiquiátrica y manejo de medicamentos bilingües para adultos. Se puede solicitar telesalud; la elegibilidad se confirma caso por caso.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for Bonita Springs from our Park Shore office, reached southbound on US-41. Telehealth eligibility is confirmed case by case.",
      es: "Atención psiquiátrica bilingüe para Bonita Springs desde nuestra oficina de Park Shore, por US-41 hacia el sur. La elegibilidad para telesalud se confirma caso por caso.",
    },
    healingParagraph: {
      en: "Bonita Springs includes communities along the US-41 and Imperial corridors, including Bonita Bay and Pelican Landing. Travel to our Park Shore office varies by origin and traffic. Bilingual care may be requested, and the office confirms medication follow-up modality and telehealth eligibility case by case.",
      es: "Bonita Springs incluye comunidades a lo largo de los corredores de US-41 e Imperial, como Bonita Bay y Pelican Landing. El viaje a nuestra oficina de Park Shore varía según el origen y el tráfico. Puede solicitar atención bilingüe y la oficina confirma caso por caso la modalidad del seguimiento de medicamentos y elegibilidad para telesalud.",
    },
    servicesIntro: {
      en: "Psychiatric services available to Bonita Springs adults include evaluation and medication management in English or Spanish.",
      es: "Los servicios psiquiátricos disponibles para adultos de Bonita Springs incluyen evaluación y manejo de medicamentos en inglés o español.",
    },
    routeIntro: {
      en: "US-41 (Tamiami Trail) connects Bonita Springs with our Park Shore office. Check current directions and traffic before traveling.",
      es: "US-41 (Tamiami Trail) conecta Bonita Springs con nuestra oficina de Park Shore. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Head south on US-41 (Tamiami Trail) from Bonita Beach Rd",
        "Continue past Imperial Pkwy and into Collier County",
        "Pass Vanderbilt Beach Rd and Pine Ridge Rd",
        "Arrive at 4760 Tamiami Trl N #25, on the west side of US-41 in Park Shore",
      ],
      es: [
        "Diríjase al sur por US-41 (Tamiami Trail) desde Bonita Beach Rd",
        "Continúe pasando Imperial Pkwy hacia el condado de Collier",
        "Pase Vanderbilt Beach Rd y Pine Ridge Rd",
        "Llegue a 4760 Tamiami Trl N #25, lado oeste de US-41 en Park Shore",
      ],
    },
    duration: { en: '15-20 minutes', es: '15-20 minutos' },
    bottomNote: {
      en: "Serving Bonita Springs (ZIP 34134/34135) with bilingual psychiatric care from our Naples office. Patients may request telehealth; the office confirms eligibility case by case. Call (239) 423-0272.",
      es: "Atendiendo a Bonita Springs (ZIP 34134/34135) con atención psiquiátrica bilingüe desde nuestra oficina de Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'Straight Shot on US-41', es: 'Directo por US-41' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
      { en: 'Visit Modality Confirmed', es: 'Modalidad Confirmada' },
      { en: 'Plan Verification Required', es: 'Verificación del Plan Requerida' },
    ],
    serviceNotes: {
      en: [
        "Care in English or Spanish may be requested.",
        "Comprehensive plans for residents across Bonita Bay, Pelican Landing and the Imperial corridor.",
        "Adult ADHD evaluations — a common first visit for working Bonita Springs families.",
        "Trauma-informed psychiatric evaluation and treatment planning for adults.",
        "Long-term mood stabilization, with the option of Spanish-language sessions.",
        "US-41 connects Bonita Springs with the Park Shore office for in-person medication reviews when needed.",
      ],
      es: [
        "Puede solicitar atención en inglés o español.",
        "Planes integrales para residentes de Bonita Bay, Pelican Landing y el corredor de Imperial.",
        "Evaluaciones de TDAH para adultos — una primera visita común para familias trabajadoras de Bonita Springs.",
        "Evaluación psiquiátrica informada en trauma y planificación del tratamiento para adultos.",
        "Estabilización del ánimo a largo plazo, con la opción de sesiones en español.",
        "US-41 conecta Bonita Springs con la oficina de Park Shore para revisiones presenciales de medicamentos cuando se necesiten.",
      ],
    },
    neighborhoods: {
      en: ['Bonita Bay', 'Pelican Landing', 'Spanish Wells', 'Worthington', 'Bonita National', 'Imperial', 'Palmira', 'Hunters Ridge'],
      es: ['Bonita Bay', 'Pelican Landing', 'Spanish Wells', 'Worthington', 'Bonita National', 'Imperial', 'Palmira', 'Hunters Ridge'],
    },
    localContext: {
      en: "Bonita Springs (ZIP 34134/34135) includes Bonita Bay, Pelican Landing and communities along the Imperial corridor. Travel to our Park Shore office varies by origin and traffic. Bilingual care may be requested, and the office confirms telehealth suitability case by case.",
      es: "Bonita Springs (ZIP 34134/34135) incluye Bonita Bay, Pelican Landing y comunidades a lo largo del corredor de Imperial. El viaje a nuestra oficina de Park Shore varía según el origen y el tráfico. Puede solicitar atención bilingüe y la oficina confirma la adecuación de telesalud caso por caso.",
    },
  },

  estero: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Estero, FL — Naples Office | Healing Minds',
        es: 'Psiquiatra para Estero, FL — Oficina en Naples | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Estero (ZIP 33928) from our only physical office in Naples. Patients may request telehealth; the office confirms eligibility and availability case by case.",
        es: "Atención psiquiátrica para Estero (ZIP 33928) desde nuestra única oficina física en Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad y disponibilidad caso por caso.",
      },
      keywords: {
        en: 'psychiatrist Estero FL, mental health Estero 33928, Coconut Point psychiatrist, retirement community mental health Estero',
        es: 'psiquiatra Estero FL, salud mental Estero 33928, psiquiatra Coconut Point, salud mental jubilados Estero',
      },
      serviceDescription: {
        en: "Psychiatric care for Estero (ZIP 33928), a Lee County village with planned communities near Coconut Point and the I-75 corridor. Dr. Melva Reve provides bilingual evaluation and treatment for anxiety, depression, ADHD, PTSD, bipolar disorder and complex medication regimens. Telehealth eligibility and appointment modality are confirmed case by case.",
        es: "Atención psiquiátrica para Estero (ZIP 33928), un poblado del condado de Lee con comunidades planificadas cerca de Coconut Point y el corredor de I-75. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y regímenes complejos de medicamentos. La elegibilidad para telesalud y la modalidad se confirman caso por caso.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Estero from our Naples office via I-75; the office confirms appointment modality and telehealth eligibility case by case.",
      es: "Atención psiquiátrica para Estero desde nuestra oficina de Naples por I-75; la oficina confirma la modalidad y elegibilidad para telesalud caso por caso.",
    },
    healingParagraph: {
      en: "Estero (ZIP 33928) is a Lee County village with planned communities including Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club and Miromar Lakes, with Coconut Point as a central landmark. Travel to our Park Shore office varies by starting point and traffic. Patients may request video care; the office confirms modality and telehealth eligibility for each appointment.",
      es: "Estero (ZIP 33928) es un poblado del condado de Lee con comunidades planificadas como Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club y Miromar Lakes, y Coconut Point como punto de referencia central. El viaje a nuestra oficina de Park Shore varía según el punto de partida y el tráfico. Los pacientes pueden solicitar atención por video; la oficina confirma la modalidad y elegibilidad para telesalud en cada cita.",
    },
    servicesIntro: {
      en: "Psychiatric services available to Estero adults include evaluation, treatment planning and medication management. The office confirms appointment modality case by case.",
      es: "Los servicios psiquiátricos disponibles para adultos de Estero incluyen evaluación, planificación del tratamiento y manejo de medicamentos. La oficina confirma la modalidad caso por caso.",
    },
    routeIntro: {
      en: "I-75 connects Estero communities with our Park Shore office to the south. Check current directions and traffic before traveling.",
      es: "I-75 conecta las comunidades de Estero con nuestra oficina de Park Shore hacia el sur. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Travel south from Estero toward Naples",
        "Follow live directions into Collier County",
        "Continue toward Park Shore using the current recommended route",
        "Arrive at 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Viaje hacia el sur desde Estero en dirección a Naples",
        "Siga las indicaciones en vivo hasta el condado de Collier",
        "Continúe hacia Park Shore por la ruta recomendada en ese momento",
        "Llegue a 4760 Tamiami Trl N #25 en Park Shore",
      ],
    },
    duration: { en: '25-30 minutes', es: '25-30 minutos' },
    bottomNote: {
      en: "Serving Estero residents from our only physical office in Naples. Patients may request telehealth; the office confirms eligibility and availability case by case. Call (239) 423-0272.",
      es: "Atendiendo a residentes de Estero desde nuestra única oficina física en Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad y disponibilidad caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: '65+ Friendly Care', es: 'Atención para 65+' },
      { en: 'Near Coconut Point', es: 'Cerca de Coconut Point' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Medication Review', es: 'Revisión de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Psychiatric evaluation and treatment planning for adults in Estero.",
        "Personalized plans for residents of Pelican Sound, Grandezza, the Brooks and Miromar Lakes.",
        "Adult ADHD evaluations, including for students and young professionals near FGCU.",
        "Trauma-informed psychiatric care; video suitability is confirmed case by case.",
        "Individualized planning for mood symptoms and seasonal scheduling needs.",
        "Medication review based on current prescriptions and individual clinical needs.",
      ],
      es: [
        "Apoyo tanto para los jubilados activos de Estero como para las familias jóvenes cerca de FGCU.",
        "Planes personalizados para residentes de Pelican Sound, Grandezza, the Brooks y Miromar Lakes.",
        "Evaluaciones de TDAH para adultos, incluidos estudiantes y jóvenes profesionales cerca de FGCU.",
        "Atención psiquiátrica informada en trauma; la adecuación del video se confirma caso por caso.",
        "Planificación individualizada para síntomas del ánimo y necesidades de programación estacional.",
        "Revisión de medicamentos según las recetas actuales y necesidades clínicas individuales.",
      ],
    },
    neighborhoods: {
      en: ['Pelican Sound', 'Grandezza', 'The Brooks', 'Wildcat Run', 'West Bay Club', 'Miromar Lakes', 'Coconut Point', 'Corkscrew Shores'],
      es: ['Pelican Sound', 'Grandezza', 'The Brooks', 'Wildcat Run', 'West Bay Club', 'Miromar Lakes', 'Coconut Point', 'Corkscrew Shores'],
    },
    localContext: {
      en: "Estero (ZIP 33928) is a Lee County village with planned communities including Pelican Sound, Grandezza, the Brooks, West Bay Club and Miromar Lakes. I-75 connects the area with our Park Shore office; travel varies by origin and traffic, and appointment modality is confirmed case by case.",
      es: "Estero (ZIP 33928) es un poblado del condado de Lee con comunidades planificadas como Pelican Sound, Grandezza, the Brooks, West Bay Club y Miromar Lakes. I-75 conecta el área con nuestra oficina de Park Shore; el viaje varía según el origen y el tráfico, y la modalidad se confirma caso por caso.",
    },
  },

  fortMyers: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Fort Myers, FL — Naples Office via I-75 South | Healing Minds',
        es: 'Psiquiatra para Fort Myers, FL — Oficina en Naples por la I-75 Sur | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Fort Myers and Lee County residents from our Park Shore office south on I-75. Travel varies by origin and traffic. The office confirms appointment modality and telehealth eligibility case by case. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para residentes de Fort Myers y el condado de Lee desde nuestra oficina de Park Shore al sur por I-75. El viaje varía según el origen y el tráfico. La oficina confirma la modalidad y elegibilidad para telesalud caso por caso. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Fort Myers FL, bilingual psychiatrist Lee County, Fort Myers mental health, telepsychiatry Fort Myers',
        es: 'psiquiatra Fort Myers FL, psiquiatra bilingüe condado Lee, salud mental Fort Myers, telepsiquiatría Fort Myers',
      },
      serviceDescription: {
        en: "Psychiatric care for Fort Myers and nearby Lee County communities from our only physical office in Naples. Dr. Melva Reve provides bilingual English/Spanish evaluation and treatment for anxiety, depression, ADHD, PTSD, bipolar disorder and medication management. Telehealth eligibility and appointment modality are confirmed case by case.",
        es: "Atención psiquiátrica para Fort Myers y comunidades cercanas del condado de Lee desde nuestra única oficina física en Naples. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe inglés/español para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y manejo de medicamentos. La elegibilidad para telesalud y la modalidad se confirman caso por caso.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care serving Fort Myers from our only physical office in Naples; appointment modality is confirmed when scheduling.",
      es: "Atención psiquiátrica bilingüe para residentes de Fort Myers desde nuestra única oficina física en Naples; la modalidad se confirma al programar.",
    },
    healingParagraph: {
      en: "Fort Myers and nearby Lee County communities connect to Naples through the I-75 corridor. Our only physical office is in Park Shore; travel varies by origin and traffic. The office confirms whether in-person or telehealth care is clinically and legally appropriate for each appointment.",
      es: "Fort Myers y las comunidades cercanas del condado de Lee se conectan con Naples por el corredor de I-75. Nuestra única oficina física está en Park Shore; el viaje varía según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínica y legalmente apropiada para cada cita.",
    },
    servicesIntro: {
      en: "These services are available to Fort Myers residents, with appointment modality confirmed according to clinical need, patient location and applicable licensing.",
      es: "Estos servicios están disponibles para residentes de Fort Myers, con modalidad confirmada según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "I-75 connects Fort Myers with our Park Shore office to the south. Check current directions because the starting point and traffic affect the trip.",
      es: "I-75 conecta Fort Myers con nuestra oficina de Park Shore hacia el sur. Consulte indicaciones actuales porque el punto de partida y el tráfico afectan el viaje.",
    },
    routeSteps: {
      en: [
        "Take I-75 south from Fort Myers",
        "Continue ~30 miles into Collier County",
        "Follow live directions toward Park Shore in Naples",
        "Arrive at 4760 Tamiami Trl N #25",
      ],
      es: [
        "Tome la I-75 al sur desde Fort Myers",
        "Continúe ~30 millas hacia el condado de Collier",
        "Siga las indicaciones en vivo hacia Park Shore en Naples",
        "Llegue a 4760 Tamiami Trl N #25",
      ],
    },
    duration: { en: '40-45 minutes', es: '40-45 minutos' },
    bottomNote: {
      en: "Serving Fort Myers and Lee County from our only physical office in Naples. Patients may request telehealth; the office confirms eligibility and availability case by case. Call (239) 423-0272.",
      es: "Atendiendo a Fort Myers y el condado de Lee desde nuestra única oficina física en Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad y disponibilidad caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'Modality Confirmed Case by Case', es: 'Modalidad Confirmada Caso por Caso' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'In-Person or Video Evaluated', es: 'Presencial o Video Evaluado' },
      { en: 'Record Sharing Requires Consent', es: 'Registros Solo con Consentimiento' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Care for a younger, more diverse Lee County population, in English or Spanish.",
        "Appointment modality confirmed according to clinical need and applicable licensing.",
        "Adult ADHD evaluations for busy Fort Myers professionals and parents.",
        "Trauma-informed psychiatric care; video suitability is confirmed case by case.",
        "Records may be shared with another provider when appropriate and with patient consent.",
        "The office confirms whether medication follow-up is in person or by video for each appointment.",
      ],
      es: [
        "Atención para una población del condado de Lee más joven y diversa, en inglés o español.",
        "La oficina confirma la modalidad de cada cita según la necesidad clínica y requisitos aplicables.",
        "Evaluaciones de TDAH para adultos ocupados de Fort Myers, profesionales y padres.",
        "Atención psiquiátrica informada en trauma; la adecuación del video se confirma caso por caso.",
        "Los registros pueden compartirse con otro proveedor cuando sea apropiado y con consentimiento del paciente.",
        "La oficina confirma si el seguimiento de medicamentos es presencial o por video para cada cita.",
      ],
    },
    neighborhoods: {
      en: ['Downtown River District', 'McGregor', 'Gateway', 'Fort Myers Beach', 'Cape Coral (nearby)', 'Lehigh Acres', 'San Carlos Park', 'Whiskey Creek'],
      es: ['Downtown River District', 'McGregor', 'Gateway', 'Fort Myers Beach', 'Cape Coral (cercano)', 'Lehigh Acres', 'San Carlos Park', 'Whiskey Creek'],
    },
    localContext: {
      en: "Fort Myers and nearby Lee County communities connect to Naples through the I-75 corridor. Our only physical office is in Naples; travel varies by origin and traffic. The office confirms appointment modality and any consent-based record coordination case by case.",
      es: "Fort Myers y las comunidades cercanas del condado de Lee se conectan con Naples por el corredor de I-75. Nuestra única oficina física está en Naples; el viaje varía según el origen y el tráfico. La oficina confirma caso por caso la modalidad y cualquier coordinación de registros con consentimiento.",
    },
  },

  marcoIsland: {
    seo: {
      title: {
        en: 'Psychiatrist for Marco Island, FL — Naples Office | Healing Minds',
        es: 'Psiquiatra para Marco Island, FL — Oficina en Naples | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Marco Island (ZIP 34145) from our Naples office via Collier Boulevard and the Jolley Bridge. Travel varies by origin and traffic. The office confirms appointment modality and telehealth eligibility case by case.",
        es: "Atención psiquiátrica para Marco Island (ZIP 34145) desde nuestra oficina de Naples por Collier Boulevard y el puente Jolley. El viaje varía según el origen y el tráfico. La oficina confirma la modalidad y elegibilidad para telesalud caso por caso.",
      },
      keywords: {
        en: 'psychiatrist Marco Island FL, telepsychiatry Marco Island, snowbird mental health 34145, Jolley Bridge telehealth psychiatrist',
        es: 'psiquiatra Marco Island FL, telepsiquiatría Marco Island, salud mental snowbird 34145, telesalud psiquiatría puente Jolley',
      },
      serviceDescription: {
        en: "Psychiatric care for Marco Island (ZIP 34145), including Old Marco, Tigertail Beach, Hideaway Beach and nearby neighborhoods. Dr. Melva Reve provides bilingual evaluation and treatment for anxiety, depression, ADHD, PTSD, sleep and bipolar disorder. Telehealth eligibility and appointment modality are confirmed case by case.",
        es: "Atención psiquiátrica para Marco Island (ZIP 34145), incluidos Old Marco, Tigertail Beach, Hideaway Beach y vecindarios cercanos. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad, depresión, TDAH, TEPT, sueño y trastorno bipolar. La elegibilidad para telesalud y la modalidad se confirman caso por caso.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Marco Island from our Naples office via Collier Boulevard and the Jolley Bridge; the office confirms appointment modality and telehealth eligibility case by case.",
      es: "Atención psiquiátrica para Marco Island desde nuestra oficina de Naples por Collier Boulevard y el puente Jolley; la oficina confirma la modalidad y elegibilidad para telesalud caso por caso.",
    },
    healingParagraph: {
      en: "Marco Island (ZIP 34145) connects with Naples by Collier Boulevard and the Jolley Bridge. Our only physical office is in Park Shore; travel varies by origin and traffic. The office confirms whether in-person or telehealth care is clinically and legally appropriate for each appointment.",
      es: "Marco Island (ZIP 34145) se conecta con Naples por Collier Boulevard y el puente Jolley. Nuestra única oficina física está en Park Shore; el viaje varía según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínica y legalmente apropiada para cada cita.",
    },
    servicesIntro: {
      en: "These services are available to Marco Island residents. The office confirms appointment modality according to clinical need, patient location and applicable licensing.",
      es: "Estos servicios están disponibles para residentes de Marco Island. La oficina confirma la modalidad según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "Collier Boulevard, the Jolley Bridge and US-41 connect Marco Island with our Park Shore office. Check current directions and traffic before traveling.",
      es: "Collier Boulevard, el puente Jolley y US-41 conectan Marco Island con nuestra oficina de Park Shore. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Head north on Collier Blvd (CR-951) toward the Jolley Bridge",
        "Cross the Jolley Bridge onto the mainland",
        "Continue north on Collier Blvd, then turn left (west) on US-41 toward Naples",
        "Continue ~9 miles to 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Diríjase al norte por Collier Blvd (CR-951) hacia el puente Jolley",
        "Cruce el puente Jolley hacia tierra firme",
        "Continúe al norte por Collier Blvd, luego gire a la izquierda (oeste) en US-41 hacia Naples",
        "Continúe ~9 millas hasta 4760 Tamiami Trl N #25 en Park Shore",
      ],
    },
    duration: { en: '25-30 minutes', es: '25-30 minutos' },
    bottomNote: {
      en: "Serving Marco Island from our only physical office in Naples. Patients may request telehealth; the office confirms eligibility, modality and availability case by case. Call (239) 423-0272.",
      es: "Atendiendo a Marco Island desde nuestra única oficina física en Naples. Se puede solicitar telesalud; la oficina confirma elegibilidad, modalidad y disponibilidad caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Visit Modality Confirmed', es: 'Modalidad de Visita Confirmada' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'Coordination Requires Consent', es: 'Coordinación con Consentimiento' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Video care may be requested; the office confirms suitability for each anxiety appointment.",
        "Psychiatric care for adult year-round and seasonal residents of Marco Island.",
        "Adult ADHD evaluations with in-person or video follow-up considered case by case.",
        "Patients may request trauma-informed care by video; the office confirms eligibility and modality case by case.",
        "Seasonal residents may discuss continuity and coordination needs case by case.",
        "Pharmacy arrangements are confirmed according to clinical and legal requirements.",
      ],
      es: [
        "Puede solicitar atención por video; la oficina confirma su adecuación para cada cita de ansiedad.",
        "Atención psiquiátrica para residentes adultos permanentes y estacionales de Marco Island.",
        "Evaluaciones de TDAH en adultos, con modalidad de seguimiento confirmada caso por caso.",
        "Atención psiquiátrica informada en trauma, con adecuación de video confirmada caso por caso.",
        "Los residentes estacionales pueden discutir necesidades de continuidad y coordinación caso por caso.",
        "Los arreglos con la farmacia se confirman según requisitos clínicos y legales.",
      ],
    },
    neighborhoods: {
      en: ['Old Marco', 'Tigertail Beach area', 'Hideaway Beach', 'Marco Shores', 'Smokehouse Bay', 'Key Marco', 'Caxambas'],
      es: ['Old Marco', 'área de Tigertail Beach', 'Hideaway Beach', 'Marco Shores', 'Smokehouse Bay', 'Key Marco', 'Caxambas'],
    },
    localContext: {
      en: "Marco Island (ZIP 34145) includes Old Marco, Tigertail Beach, Hideaway Beach and communities reached through Collier Boulevard and the Jolley Bridge. Our only physical office is in Park Shore; travel varies by origin and traffic. The office confirms appointment modality and telehealth eligibility case by case.",
      es: "Marco Island (ZIP 34145) incluye Old Marco, Tigertail Beach, Hideaway Beach y comunidades conectadas por Collier Boulevard y el puente Jolley. Nuestra única oficina física está en Park Shore; el viaje varía según el origen y el tráfico. La oficina confirma caso por caso la modalidad y elegibilidad para telesalud.",
    },
  },

  goldenGate: {
    seo: {
      title: {
        en: 'Psychiatrist for Golden Gate, FL — Bilingual Anxiety, Depression & ADHD Care | Healing Minds',
        es: 'Psiquiatra para Golden Gate, FL — Atención Bilingüe en Español | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Golden Gate (ZIP 34116), including Golden Gate City, Golden Gate Estates and nearby neighborhoods. Short drive to our Park Shore office via Golden Gate Pkwy and US-41. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para Golden Gate (ZIP 34116), incluidos Golden Gate City, Golden Gate Estates y vecindarios cercanos. Trayecto corto a nuestra oficina de Park Shore por Golden Gate Pkwy y US-41. (239) 423-0272.",
      },
      keywords: {
        en: 'bilingual psychiatrist Golden Gate FL, psiquiatra en español Naples 34116, Spanish speaking psychiatrist Naples, mental health Golden Gate',
        es: 'psiquiatra en español Golden Gate FL, psiquiatra bilingüe 34116, salud mental Golden Gate, psiquiatra hispanohablante Naples',
      },
      serviceDescription: {
        en: "Bilingual psychiatric care for Golden Gate (ZIP 34116), including Golden Gate City, Golden Gate Estates and the Santa Barbara corridor. Dr. Melva Reve, fluent in Spanish, treats anxiety, depression, ADHD in adults 18 and older, PTSD, bipolar disorder and manages psychiatric medications.",
        es: "Atención psiquiátrica bilingüe para Golden Gate (ZIP 34116), incluidos Golden Gate City, Golden Gate Estates y el corredor de Santa Barbara. La Dra. Melva Reve, fluida en español, trata ansiedad, depresión, TDAH en adultos de 18 años en adelante, TEPT, trastorno bipolar y maneja medicamentos psiquiátricos.",
      },
    },
    heroDescription: {
      en: "Bilingual (English/Spanish) psychiatric care for Golden Gate families from our Park Shore office on US-41. Check current traffic before traveling.",
      es: "Atención psiquiátrica bilingüe (inglés/español) para familias de Golden Gate desde nuestra oficina de Park Shore sobre US-41. Consulte el tráfico actual antes de viajar.",
    },
    healingParagraph: {
      en: "Golden Gate (ZIP 34116) includes Golden Gate City, Golden Gate Estates and neighborhoods along the Santa Barbara corridor. Sessions with Dr. Reve can be conducted in Spanish for adults 18 and older, including ADHD evaluations, postpartum care, anxiety and depression. Golden Gate Parkway and US-41 connect the area with our Park Shore office.",
      es: "Golden Gate (ZIP 34116) incluye Golden Gate City, Golden Gate Estates y vecindarios a lo largo del corredor de Santa Barbara. Las sesiones con la Dra. Reve pueden realizarse en español para adultos de 18 años en adelante, incluyendo evaluaciones de TDAH, atención postparto, ansiedad y depresión. Golden Gate Parkway y US-41 conectan el área con nuestra oficina de Park Shore.",
    },
    servicesIntro: {
      en: "Psychiatric services available to adults in Golden Gate include evaluation and medication management in English or Spanish. Appointment modality is confirmed case by case.",
      es: "Los servicios psiquiátricos disponibles para adultos en Golden Gate incluyen evaluación y manejo de medicamentos en inglés o español. La modalidad se confirma caso por caso.",
    },
    routeIntro: {
      en: "Golden Gate Parkway and US-41 connect Golden Gate with our Park Shore office. Check current directions and traffic before traveling.",
      es: "Golden Gate Parkway y US-41 conectan Golden Gate con nuestra oficina de Park Shore. Consulte indicaciones y tráfico actuales antes de viajar.",
    },
    routeSteps: {
      en: [
        "Head west on Golden Gate Pkwy from Collier Blvd (CR-951)",
        "Continue past Goodlette-Frank Rd toward US-41",
        "Turn right (north) onto US-41 (Tamiami Trail N)",
        "Arrive at 4760 Tamiami Trl N #25 in Park Shore, on the left",
      ],
      es: [
        "Diríjase al oeste por Golden Gate Pkwy desde Collier Blvd (CR-951)",
        "Continúe pasando Goodlette-Frank Rd hacia US-41",
        "Gire a la derecha (norte) en US-41 (Tamiami Trail N)",
        "Llegue a 4760 Tamiami Trl N #25 en Park Shore, a la izquierda",
      ],
    },
    duration: { en: '12-15 minutes', es: '12-15 minutos' },
    bottomNote: {
      en: "Serving adults 18 and older in Golden Gate (ZIP 34116), with psychiatric appointments in English or Spanish. Patients may request telehealth; the office confirms eligibility case by case. Call (239) 423-0272.",
      es: "Atendiendo a adultos de Golden Gate (ZIP 34116) con citas psiquiátricas en inglés o español. Se puede solicitar telesalud; la oficina confirma elegibilidad caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Sessions in Spanish', es: 'Sesiones en Español' },
      { en: 'Adults 18 and Older', es: 'Adultos de 18 Años en Adelante' },
      { en: 'Check Live Directions', es: 'Consulte la Ruta en Vivo' },
      { en: 'Family-Focused Care', es: 'Atención Centrada en la Familia' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Plan Verification Required', es: 'Verificación del Plan Requerida' },
    ],
    serviceNotes: {
      en: [
        "Delivered entirely in Spanish when preferred, including postpartum anxiety.",
        "Care for working Golden Gate families, in Spanish or English.",
        "Evaluations for adults 18 and older, with treatment personalized to daily needs.",
        "Trauma-informed psychiatric evaluation and treatment planning for adults.",
        "Long-term mood stabilization, with sessions available in Spanish.",
        "Patients may request medication management by video; the office confirms clinical suitability, location and licensing case by case.",
      ],
      es: [
        "Ofrecida completamente en español cuando se prefiere, incluida la ansiedad postparto.",
        "Atención para familias trabajadoras de Golden Gate, en español o inglés.",
        "Evaluaciones para adultos de 18 años en adelante, con tratamiento personalizado según sus necesidades diarias.",
        "Evaluación psiquiátrica informada en trauma y planificación del tratamiento para adultos.",
        "Estabilización del ánimo a largo plazo, con sesiones disponibles en español.",
        "Se puede solicitar manejo de medicamentos por video; la oficina confirma adecuación clínica, ubicación y licencias caso por caso.",
      ],
    },
    neighborhoods: {
      en: ['Golden Gate City', 'Golden Gate Estates', 'Sunshine Blvd area', 'Coronado', 'Tropicana', 'Santa Barbara corridor'],
      es: ['Golden Gate City', 'Golden Gate Estates', 'área de Sunshine Blvd', 'Coronado', 'Tropicana', 'corredor de Santa Barbara'],
    },
    localContext: {
      en: "Golden Gate (ZIP 34116) includes Golden Gate City, Golden Gate Estates and neighborhoods along the Santa Barbara corridor. Sessions with Dr. Reve can be conducted in Spanish, and Golden Gate Parkway and US-41 connect the area with our Park Shore office.",
      es: "Golden Gate (ZIP 34116) incluye Golden Gate City, Golden Gate Estates y vecindarios a lo largo del corredor de Santa Barbara. Las sesiones con la Dra. Reve pueden realizarse en español, y Golden Gate Parkway y US-41 conectan el área con nuestra oficina de Park Shore.",
    },
  },

  immokalee: {
    seo: {
      title: {
        en: 'Bilingual Psychiatrist Serving Immokalee, FL — Naples Office | Healing Minds',
        es: 'Psiquiatra Bilingüe para Immokalee, FL — Oficina en Naples | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care serving Immokalee (ZIP 34142) from our only physical office in Naples, with telehealth eligibility and availability confirmed when scheduling.",
        es: "Atención psiquiátrica bilingüe para residentes de Immokalee (ZIP 34142) desde nuestra única oficina física en Naples, con elegibilidad y disponibilidad de telesalud confirmadas al programar.",
      },
      keywords: {
        en: 'psychiatrist Immokalee FL, bilingual mental health Immokalee, Spanish psychiatrist 34142, adult psychiatry Collier County',
        es: 'psiquiatra Immokalee FL, salud mental bilingüe Immokalee, psiquiatra en español 34142, psiquiatría para adultos Collier County',
      },
      serviceDescription: {
        en: "Bilingual psychiatric care for Immokalee (ZIP 34142), an eastern Collier County community connected with Naples by the CR-846 corridor. Dr. Melva Reve, fluent in Spanish, offers evaluation and treatment for anxiety, depression, PTSD, ADHD, bipolar disorder and medication management. Telehealth eligibility and availability are confirmed when scheduling.",
        es: "Atención psiquiátrica bilingüe para Immokalee (ZIP 34142), una comunidad del este del condado de Collier conectada con Naples por el corredor de CR-846. La Dra. Melva Reve, fluida en español, ofrece evaluación y tratamiento para ansiedad, depresión, TEPT, TDAH, trastorno bipolar y manejo de medicamentos. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care serving Immokalee from our only physical office in Naples; telehealth eligibility and availability are confirmed when scheduling.",
      es: "Atención psiquiátrica bilingüe para residentes de Immokalee desde nuestra única oficina física en Naples; la elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
    healingParagraph: {
      en: "Immokalee (ZIP 34142) is an eastern Collier County community connected with Naples by the CR-846 corridor. We offer sessions in Spanish from our only physical office in Park Shore; travel varies by origin and traffic. Telehealth eligibility and availability are confirmed when scheduling.",
      es: "Immokalee (ZIP 34142) es una comunidad del este del condado de Collier conectada con Naples por el corredor de CR-846. Ofrecemos sesiones en español desde nuestra única oficina física en Park Shore; el viaje varía según el origen y el tráfico. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
    servicesIntro: {
      en: "These services are available to Immokalee residents in Spanish or English. The office confirms appointment modality, telehealth eligibility and availability when scheduling.",
      es: "Estos servicios están disponibles para residentes de Immokalee en español o inglés. La oficina confirma la modalidad, elegibilidad para telesalud y disponibilidad al programar.",
    },
    routeIntro: {
      en: "CR-846 connects Immokalee with our Park Shore office. Travel varies by origin, route and traffic; telehealth eligibility and availability are confirmed when scheduling.",
      es: "CR-846 conecta Immokalee con nuestra oficina de Park Shore. El viaje varía según el origen, la ruta y el tráfico; la elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
    routeSteps: {
      en: [
        "Head west on Main St (SR-29), then south to CR-846 (Immokalee Rd)",
        "Take Immokalee Rd west ~30 miles toward I-75",
        "Continue west across I-75, then turn left (south) on US-41",
        "Continue ~3 miles to 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Diríjase al oeste por Main St (SR-29), luego al sur hacia CR-846 (Immokalee Rd)",
        "Tome Immokalee Rd al oeste ~30 millas hacia la I-75",
        "Continúe al oeste cruzando la I-75, luego gire a la izquierda (sur) en US-41",
        "Continúe ~3 millas hasta 4760 Tamiami Trl N #25 en Park Shore",
      ],
    },
    duration: { en: '50-60 minutes', es: '50-60 minutos' },
    bottomNote: {
      en: "Serving Immokalee (ZIP 34142) with bilingual psychiatric care from our only physical office in Naples. Telehealth eligibility and availability are confirmed when scheduling. Call (239) 423-0272.",
      es: "Atendiendo a Immokalee (ZIP 34142) con atención psiquiátrica bilingüe desde nuestra única oficina física en Naples. La elegibilidad y disponibilidad de telesalud se confirman al programar. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Sessions in Spanish', es: 'Sesiones en Español' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Call to Check Availability', es: 'Llame para Consultar Disponibilidad' },
      { en: 'Naples Office', es: 'Oficina en Naples' },
      { en: 'English or Spanish', es: 'Inglés o Español' },
      { en: 'Plan Verification Required', es: 'Verificación del Plan Requerida' },
    ],
    serviceNotes: {
      en: [
        "Offered in Spanish, with telehealth eligibility and availability confirmed when scheduling.",
        "Psychiatric evaluation and treatment planning for adults in Immokalee.",
        "Evaluations for adults 18 and older, with available weekday times confirmed when scheduling.",
        "Trauma-informed, confidential care in Spanish, by secure video when needed.",
        "Long-term mood stabilization with appointment modality confirmed case by case.",
        "Refill and follow-up arrangements confirmed according to clinical and legal requirements.",
      ],
      es: [
        "Ofrecida en español, con elegibilidad y disponibilidad de telesalud confirmadas al programar.",
        "Evaluación psiquiátrica y planificación del tratamiento para adultos en Immokalee.",
        "Evaluaciones para adultos de 18 años en adelante, con horarios disponibles entre semana confirmados al programar.",
        "Atención confidencial e informada en trauma en español, por video seguro cuando se necesite.",
        "Estabilización del ánimo a largo plazo con modalidad confirmada caso por caso.",
        "Los arreglos de resurtido y seguimiento se confirman según requisitos clínicos y legales.",
      ],
    },
    neighborhoods: {
      en: ['Downtown Immokalee', 'Main St (SR-29) corridor', 'Lake Trafford', 'Farm Worker Village', 'Eden Park', 'Carson Rd area'],
      es: ['Centro de Immokalee', 'corredor de Main St (SR-29)', 'Lake Trafford', 'Farm Worker Village', 'Eden Park', 'área de Carson Rd'],
    },
    localContext: {
      en: "Immokalee (ZIP 34142) is an eastern Collier County community connected with Naples by the CR-846 corridor. We offer Spanish-language sessions from our only physical office in Naples; travel varies by origin and traffic. Telehealth eligibility and availability are confirmed when scheduling.",
      es: "Immokalee (ZIP 34142) es una comunidad del este del condado de Collier conectada con Naples por el corredor de CR-846. Ofrecemos sesiones en español desde nuestra única oficina física en Naples; el viaje varía según el origen y el tráfico. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
  },

  aveMaria: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Ave Maria, FL — Care for University Families | Healing Minds',
        es: 'Psiquiatra para Ave Maria, FL — Atención para Familias Universitarias | Healing Minds',
      },
      description: {
        en: "Psychiatric care serving Ave Maria, FL, from our only physical office in Naples. Travel varies by origin and traffic; telehealth eligibility is confirmed when scheduling.",
        es: "Atención psiquiátrica para residentes de Ave Maria, FL, desde nuestra única oficina física en Naples. El viaje varía según el origen y el tráfico; la elegibilidad para telesalud se confirma al programar.",
      },
      keywords: {
        en: 'psychiatrist Ave Maria FL, Ave Maria University mental health, college student psychiatrist Naples, family psychiatry Ave Maria',
        es: 'psiquiatra Ave Maria FL, salud mental Ave Maria University, psiquiatra estudiantes universitarios Naples, psiquiatría familias Ave Maria',
      },
      serviceDescription: {
        en: "Psychiatric care for Ave Maria, a planned community around Ave Maria University in eastern Collier County. Dr. Melva Reve provides bilingual evaluation and treatment for college-age anxiety and depression, ADHD, postpartum and family-stage care, PTSD and medication management. Appointment modality is confirmed when scheduling.",
        es: "Atención psiquiátrica para Ave Maria, una comunidad planificada alrededor de Ave Maria University en el este del condado de Collier. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad y depresión universitarias, TDAH, atención postparto y de etapa familiar, TEPT y manejo de medicamentos. La modalidad se confirma al programar.",
      },
    },
    heroDescription: {
      en: "Psychiatric care serving Ave Maria from our only physical office in Naples, with appointment modality and telehealth eligibility confirmed when scheduling.",
      es: "Atención psiquiátrica para residentes de Ave Maria desde nuestra única oficina física en Naples, con modalidad y elegibilidad para telesalud confirmadas al programar.",
    },
    healingParagraph: {
      en: "Ave Maria is a planned community around Ave Maria University in eastern Collier County. We offer bilingual sessions, careful ADHD evaluations and college-age anxiety and depression care from our only physical office in Park Shore. Travel varies by origin and traffic; appointment modality and telehealth eligibility are confirmed when scheduling.",
      es: "Ave Maria es una comunidad planificada alrededor de Ave Maria University en el este del condado de Collier. Ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria desde nuestra única oficina física en Park Shore. El viaje varía según el origen y el tráfico; la modalidad y elegibilidad para telesalud se confirman al programar.",
    },
    servicesIntro: {
      en: "Psychiatric services available to adults in Ave Maria include anxiety and depression treatment, ADHD evaluation and medication management.",
      es: "Los servicios psiquiátricos disponibles para adultos en Ave Maria incluyen tratamiento de ansiedad y depresión, evaluación de TDAH y manejo de medicamentos.",
    },
    routeIntro: {
      en: "Roads through eastern Collier County connect Ave Maria with our Park Shore office. Travel varies by origin, route and traffic; appointment modality is confirmed when scheduling.",
      es: "Las carreteras del este del condado de Collier conectan Ave Maria con nuestra oficina de Park Shore. El viaje varía según el origen, la ruta y el tráfico; la modalidad se confirma al programar.",
    },
    routeSteps: {
      en: [
        "Head west on Oil Well Rd (CR-858) from Ave Maria",
        "Follow live directions west and south toward Naples",
        "Continue toward Park Shore using the current recommended route",
        "Arrive at 4760 Tamiami Trl N #25",
      ],
      es: [
        "Diríjase al oeste por Oil Well Rd (CR-858) desde Ave Maria",
        "Siga las indicaciones en vivo hacia el oeste y el sur en dirección a Naples",
        "Continúe hacia Park Shore por la ruta recomendada en ese momento",
        "Llegue a 4760 Tamiami Trl N #25",
      ],
    },
    duration: { en: '50-60 minutes', es: '50-60 minutos' },
    bottomNote: {
      en: "Serving Ave Maria with bilingual psychiatric care from our only physical office in Park Shore. Appointment modality, telehealth eligibility and availability are confirmed when scheduling. Call (239) 423-0272.",
      es: "Atendiendo a Ave Maria con atención psiquiátrica bilingüe desde nuestra única oficina física en Park Shore. La modalidad, elegibilidad para telesalud y disponibilidad se confirman al programar. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'University-Family Focus', es: 'Enfoque Universitario y Familiar' },
      { en: 'Availability Confirmed', es: 'Disponibilidad Confirmada' },
      { en: 'Telehealth by Request', es: 'Telesalud por Solicitud' },
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'College-Age Care', es: 'Atención para Edad Universitaria' },
      { en: 'ADHD Evaluations', es: 'Evaluaciones de TDAH' },
    ],
    serviceNotes: {
      en: [
        "Anxiety symptoms are evaluated individually, with appointment modality confirmed when scheduling.",
        "Psychiatric evaluation and treatment planning are available to adults.",
        "Psychiatric ADHD evaluations are available to adults, including college students.",
        "Trauma-informed care with telehealth eligibility confirmed when scheduling.",
        "Long-term mood stabilization that continues through academic breaks.",
        "Medication management with appointment modality confirmed case by case.",
      ],
      es: [
        "Atención de ansiedad universitaria con modalidad confirmada al programar.",
        "La evaluación y planificación del tratamiento psiquiátrico están disponibles para adultos.",
        "Las evaluaciones psiquiátricas de TDAH están disponibles para adultos, incluidos estudiantes universitarios.",
        "Atención informada en trauma con elegibilidad para telesalud confirmada al programar.",
        "Estabilización del ánimo a largo plazo que continúa durante los recesos académicos.",
        "Manejo de medicamentos con modalidad confirmada caso por caso.",
      ],
    },
    neighborhoods: {
      en: ['Ave Maria University', 'Maple Ridge', 'Del Webb Naples', 'La Piazza / Town Center', 'Avalon Park', 'Coquina at Maple Ridge', 'Emerson Park'],
      es: ['Ave Maria University', 'Maple Ridge', 'Del Webb Naples', 'La Piazza / Town Center', 'Avalon Park', 'Coquina at Maple Ridge', 'Emerson Park'],
    },
    localContext: {
      en: "Ave Maria is a planned community around Ave Maria University in eastern Collier County. We offer bilingual sessions, careful ADHD evaluations and college-age anxiety and depression care from our only physical office in Park Shore. Travel varies by origin and traffic; appointment modality and telehealth eligibility are confirmed when scheduling.",
      es: "Ave Maria es una comunidad planificada alrededor de Ave Maria University en el este del condado de Collier. Ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria desde nuestra única oficina física en Park Shore. El viaje varía según el origen y el tráfico; la modalidad y elegibilidad para telesalud se confirman al programar.",
    },
  },
};
