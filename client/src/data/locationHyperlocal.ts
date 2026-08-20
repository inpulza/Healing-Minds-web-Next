// Per-city hyperlocal content for location pages.
// All demographic and geographic facts are drawn from public sources
// (US Census ACS 5-year estimates, county data, official community pages).
// No invented testimonials, patient counts or reviews — only verifiable context.

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
        en: 'Psychiatrist for Lely Resort, FL — Bilingual Care for an Active 55+ Community | Healing Minds',
        es: 'Psiquiatra para Lely Resort, FL — Atención Bilingüe para una Comunidad Activa 55+ | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Lely Resort residents — Players Club & Spa, Stonebridge, the Classics and Lakoya. In-person at our Park Shore office on US-41, plus secure telehealth. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para residentes de Lely Resort — Players Club & Spa, Stonebridge, the Classics y Lakoya. En persona en nuestra oficina de Park Shore sobre US-41, y telesalud segura. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Lely Resort FL, Players Club mental health, Stonebridge psychiatrist, retirement community psychiatry Naples, bilingual psychiatrist 34113',
        es: 'psiquiatra Lely Resort FL, salud mental Players Club, psiquiatra Stonebridge, psiquiatría jubilados Naples, psiquiatra bilingüe 34113',
      },
      serviceDescription: {
        en: "Psychiatric care serving Lely Resort's active 55+ community in ZIP 34113 from our only physical office in Naples. Dr. Melva Reve treats anxiety, depression, life-transition adjustment, sleep difficulties, ADHD, PTSD and bipolar disorder and provides medication review. Sessions are bilingual; appointment modality is confirmed when scheduling.",
        es: "Atención psiquiátrica para la comunidad activa 55+ de Lely Resort en el ZIP 34113 desde nuestra única oficina física en Naples. La Dra. Melva Reve trata ansiedad, depresión, ajuste a transiciones de vida, problemas del sueño, TDAH, TEPT y trastorno bipolar y realiza revisión de medicamentos. Las sesiones son bilingües; la modalidad se confirma al programar.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for Lely Resort's 55+ community — about 15 minutes north on US-41 from Players Club, Stonebridge, the Classics and Lakoya.",
      es: "Atención psiquiátrica bilingüe para la comunidad 55+ de Lely Resort — a unos 15 minutos hacia el norte por US-41 desde Players Club, Stonebridge, the Classics y Lakoya.",
    },
    healingParagraph: {
      en: "Lely Resort is home to roughly 9,300 residents with a median age in the high 50s and a strong network of master-association communities. Our only physical office is in Park Shore, commonly estimated at 15–20 minutes away depending on origin and traffic. The office confirms whether in-person or telehealth care is clinically appropriate when scheduling. Care is bilingual and oriented to sleep, anxiety, mood changes and careful medication review.",
      es: "Lely Resort tiene aproximadamente 9,300 residentes con una edad mediana cercana a los 60 años y una red sólida de comunidades de asociación maestra. Nuestra única oficina física está en Park Shore, a unos 15–20 minutos según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínicamente apropiada al programar. La atención es bilingüe y se centra en sueño, ansiedad, cambios de ánimo y revisión cuidadosa de medicamentos.",
    },
    servicesIntro: {
      en: "Whether you're navigating a recent move, retirement, the loss of a spouse, or simply want a careful second look at your psychiatric medications, the services below are the ones our Lely Resort patients ask about most.",
      es: "Ya sea por una mudanza reciente, jubilación, la pérdida de un cónyuge, o simplemente querer una segunda revisión cuidadosa de sus medicamentos psiquiátricos, los servicios a continuación son los que más nos solicitan los pacientes de Lely Resort.",
    },
    routeIntro: {
      en: "Most Lely Resort patients reach our Park Shore office via Collier Boulevard (CR-951) and US-41 in about 15–20 minutes. The route below is the one we recommend most often.",
      es: "La mayoría de los pacientes de Lely Resort llegan a nuestra oficina de Park Shore por Collier Boulevard (CR-951) y US-41 en unos 15–20 minutos. La ruta a continuación es la que recomendamos con más frecuencia.",
    },
    routeSteps: {
      en: [
        "Exit the Lely Resort entrance onto Collier Blvd (CR-951) heading north",
        "Continue ~5.5 miles to US-41 / Tamiami Trail North",
        "Turn left (north) onto US-41 toward Park Shore",
        "Arrive at 4760 Tamiami Trl N #25, on the west side of US-41",
      ],
      es: [
        "Salga de Lely Resort hacia Collier Blvd (CR-951) en dirección norte",
        "Continúe ~5.5 millas hasta US-41 / Tamiami Trail North",
        "Gire a la izquierda (norte) en US-41 hacia Park Shore",
        "Llegue a 4760 Tamiami Trl N #25, lado oeste de US-41",
      ],
    },
    duration: { en: '15-20 minutes', es: '15-20 minutos' },
    bottomNote: {
      en: "Serving Lely Resort residents from our only physical office in Park Shore. Appointment modality and telehealth eligibility are confirmed when scheduling. Call (239) 423-0272.",
      es: "Atendiendo a residentes de Lely Resort desde nuestra única oficina física en Park Shore. La modalidad y elegibilidad para telesalud se confirman al programar. Llame al (239) 423-0272.",
    },
    featureBadges: [
      { en: '55+ Community Focus', es: 'Enfoque en Comunidad 55+' },
      { en: '15-20 Min via US-41', es: '15-20 Min por US-41' },
      { en: 'Telehealth Between Visits', es: 'Telesalud Entre Visitas' },
      { en: 'Medication Review', es: 'Revisión de Medicamentos' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Easy Park Shore Parking', es: 'Estacionamiento Fácil en Park Shore' },
    ],
    serviceNotes: {
      en: [
        "Common among Lely retirees after a move, a new diagnosis, or the loss of a spouse.",
        "We watch for low mood that can follow retirement or reduced mobility in active 55+ residents.",
        "Adult ADHD evaluations for Lely residents who were never assessed earlier in life.",
        "Trauma-informed care, including for veterans living across Lely's master-association communities.",
        "Long-term mood stabilization coordinated with the other doctors many Lely retirees already see.",
        "Careful review of multiple prescriptions — a frequent request from our older Lely patients.",
      ],
      es: [
        "Frecuente en jubilados de Lely tras una mudanza, un nuevo diagnóstico o la pérdida de un cónyuge.",
        "Vigilamos el ánimo bajo que puede seguir a la jubilación o a la movilidad reducida en residentes activos de 55+.",
        "Evaluaciones de TDAH para adultos de Lely que nunca fueron valorados antes.",
        "Atención informada en trauma, incluida para veteranos en las comunidades de Lely.",
        "Estabilización del ánimo a largo plazo coordinada con los demás médicos que muchos jubilados de Lely ya consultan.",
        "Revisión cuidadosa de múltiples recetas — una solicitud frecuente de nuestros pacientes mayores de Lely.",
      ],
    },
    neighborhoods: {
      en: ['Players Club & Spa', 'Stonebridge', 'The Classics', 'Lakoya', 'Mustang Island', 'Lely Country Club', 'Ole at Lely Resort', 'Tiger Island Estates'],
      es: ['Players Club & Spa', 'Stonebridge', 'The Classics', 'Lakoya', 'Mustang Island', 'Lely Country Club', 'Ole at Lely Resort', 'Tiger Island Estates'],
    },
    localContext: {
      en: "We see patients from across Lely Resort's master-association communities in ZIP 34113 — from Players Club & Spa and Stonebridge to the Classics and Lakoya. Most come in once for an evaluation via Collier Boulevard and US-41, then continue with secure telehealth designed around an active 55+ lifestyle.",
      es: "Atendemos a pacientes de toda la red de comunidades de Lely Resort en el ZIP 34113 — desde Players Club & Spa y Stonebridge hasta the Classics y Lakoya. La mayoría viene una vez para la evaluación por Collier Boulevard y US-41, y luego continúa con telesalud segura pensada para un estilo de vida activo 55+.",
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
        en: "Psychiatric care for Vanderbilt Beach (ZIP 34108) residents, where roughly 44.6% of housing is seasonal. Dr. Melva Reve provides anxiety and depression treatment, ADHD evaluation, medication management, sleep care and trauma-informed support. With patient consent, coordination with another provider can be evaluated case by case.",
        es: "Atención psiquiátrica para residentes de Vanderbilt Beach (ZIP 34108), donde aproximadamente el 44.6% de la vivienda es estacional. La Dra. Melva Reve brinda tratamiento de ansiedad y depresión, evaluación de TDAH, manejo de medicamentos, cuidado del sueño y apoyo informado en trauma. Con consentimiento del paciente, la coordinación con otro proveedor puede evaluarse caso por caso.",
      },
    },
    heroDescription: {
      en: "Psychiatric care serving Vanderbilt Beach from our only physical office in Park Shore, with telehealth eligibility confirmed according to clinical need, patient location and applicable licensing.",
      es: "Atención psiquiátrica para residentes de Vanderbilt Beach desde nuestra única oficina física en Park Shore, con elegibilidad para telesalud confirmada según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    healingParagraph: {
      en: "Vanderbilt Beach (ZIP 34108) has a small year-round core of about 1,400 residents, a median age near 69 and roughly 44.6% of housing units used seasonally. Our only physical office is in Park Shore, commonly estimated at 10–15 minutes away depending on origin and traffic. The office confirms appointment modality and telehealth eligibility case by case; secure record sharing with another provider requires patient consent.",
      es: "Vanderbilt Beach (ZIP 34108) tiene un núcleo permanente de unos 1,400 residentes, una edad mediana cercana a los 69 y aproximadamente 44.6% de viviendas estacionales. Nuestra única oficina física está en Park Shore, a unos 10–15 minutos según el origen y el tráfico. La oficina confirma la modalidad y elegibilidad para telesalud caso por caso; compartir registros con otro proveedor requiere consentimiento del paciente.",
    },
    servicesIntro: {
      en: "The services below are available to Vanderbilt Beach residents. The office confirms whether each appointment should be in person or by secure video based on clinical need, patient location and applicable licensing.",
      es: "Los servicios a continuación están disponibles para residentes de Vanderbilt Beach. La oficina confirma si cada cita debe ser presencial o por video seguro según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "From most Vanderbilt Beach addresses our Park Shore office is a 10–15 minute drive south down US-41, after a short east-bound stretch on Vanderbilt Beach Rd.",
      es: "Desde la mayoría de direcciones en Vanderbilt Beach, nuestra oficina de Park Shore queda a 10–15 minutos por US-41 al sur, tras un breve tramo al este por Vanderbilt Beach Rd.",
    },
    routeSteps: {
      en: [
        "Head east on Vanderbilt Beach Rd toward US-41 (Tamiami Trail N)",
        "Turn right (south) onto US-41",
        "Continue ~3.5 miles past Pine Ridge Rd into Park Shore",
        "Arrive at 4760 Tamiami Trl N #25, on the right",
      ],
      es: [
        "Diríjase al este por Vanderbilt Beach Rd hacia US-41 (Tamiami Trail N)",
        "Gire a la derecha (sur) en US-41",
        "Continúe ~3.5 millas pasando Pine Ridge Rd hasta Park Shore",
        "Llegue a 4760 Tamiami Trl N #25, a la derecha",
      ],
    },
    duration: { en: '10-15 minutes', es: '10-15 minutos' },
    bottomNote: {
      en: "Serving Vanderbilt Beach from our Naples office. Appointment modality, telehealth eligibility and any provider coordination are confirmed case by case. Call (239) 423-0272.",
      es: "Atendiendo a Vanderbilt Beach desde nuestra oficina de Naples. La modalidad, elegibilidad para telesalud y cualquier coordinación con proveedores se confirman caso por caso. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Snowbird Continuity', es: 'Continuidad para Snowbirds' },
      { en: '10-15 Min on US-41', es: '10-15 Min por US-41' },
      { en: 'Consent-Based Coordination', es: 'Coordinación con Consentimiento' },
      { en: 'Naples Office', es: 'Oficina en Naples' },
      { en: 'Telehealth Eligibility Confirmed', es: 'Elegibilidad de Telesalud Confirmada' },
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
      en: "About 44.6% of housing in Vanderbilt Beach (ZIP 34108) is seasonal. Our only physical office is in Park Shore, commonly estimated at 10–15 minutes away depending on origin and traffic. Appointment modality, telehealth eligibility and consent-based record sharing are confirmed case by case.",
      es: "Cerca del 44.6% de la vivienda en Vanderbilt Beach (ZIP 34108) es estacional. Nuestra única oficina física está en Park Shore, a unos 10–15 minutos según el origen y el tráfico. La modalidad, elegibilidad para telesalud y el intercambio de registros con consentimiento se confirman caso por caso.",
    },
  },

  bonitaSprings: {
    seo: {
      title: {
        en: 'Psychiatrist for Bonita Springs, FL — Bilingual Mental Health on US-41 | Healing Minds',
        es: 'Psiquiatra para Bonita Springs, FL — Salud Mental Bilingüe sobre US-41 | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Bonita Springs (ZIP 34134/34135). Straight 15–20 minute drive south on US-41 to our Park Shore office. Anxiety, depression, ADHD, PTSD and medication management. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para Bonita Springs (ZIP 34134/34135). Trayecto directo de 15–20 minutos al sur por US-41 hasta Park Shore. Ansiedad, depresión, TDAH, TEPT y manejo de medicamentos. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Bonita Springs FL, bilingual psychiatrist 34134, mental health Bonita Springs, ADHD evaluation Bonita Springs',
        es: 'psiquiatra Bonita Springs FL, psiquiatra bilingüe 34134, salud mental Bonita Springs, evaluación TDAH Bonita Springs',
      },
      serviceDescription: {
        en: "Psychiatric care for Bonita Springs (ZIP 34134/34135), a city of roughly 57,000 with a median age near 62 and a sizable Spanish-speaking community (about 21% of households). Dr. Melva Reve treats anxiety, depression, ADHD, PTSD, bipolar disorder and provides medication management and telehealth — bilingual English/Spanish.",
        es: "Atención psiquiátrica para Bonita Springs (ZIP 34134/34135), una ciudad de aproximadamente 57,000 habitantes con edad mediana cercana a 62 y una comunidad hispanohablante notable (cerca del 21% de hogares). La Dra. Melva Reve trata ansiedad, depresión, TDAH, TEPT, trastorno bipolar y ofrece manejo de medicamentos y telesalud — bilingüe inglés/español.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for Bonita Springs — a 15–20 minute drive south on US-41 to our Park Shore office, plus secure telehealth.",
      es: "Atención psiquiátrica bilingüe para Bonita Springs — 15–20 minutos al sur por US-41 hasta Park Shore, más telesalud segura.",
    },
    healingParagraph: {
      en: "Bonita Springs is home to roughly 57,000 residents with a median age near 62 and a meaningful Spanish-speaking population — about 19% of residents identify as Hispanic and roughly 21% of households speak Spanish at home. Our Park Shore office is a straight 15–20 minute drive south on US-41 from most Bonita Springs neighborhoods, including Bonita Bay, Pelican Landing and the Imperial corridor. Bilingual sessions, careful medication review and telehealth options are standard for our Bonita patients.",
      es: "Bonita Springs tiene aproximadamente 57,000 residentes con una edad mediana cercana a 62 y una comunidad hispanohablante significativa — alrededor del 19% se identifican como hispanos y cerca del 21% de los hogares hablan español en casa. Nuestra oficina de Park Shore queda a 15–20 minutos al sur por US-41 desde la mayoría de barrios de Bonita Springs, incluidos Bonita Bay, Pelican Landing y el corredor de Imperial. Sesiones bilingües, revisión cuidadosa de medicamentos y opciones de telesalud son estándar para nuestros pacientes de Bonita.",
    },
    servicesIntro: {
      en: "These are the psychiatric services our Bonita Springs patients ask about most often — from a first evaluation to ongoing medication management, in English or Spanish.",
      es: "Estos son los servicios psiquiátricos que más nos solicitan los pacientes de Bonita Springs — desde una primera evaluación hasta manejo continuo de medicamentos, en inglés o español.",
    },
    routeIntro: {
      en: "From Bonita Springs the drive to our Park Shore office is a straight shot down US-41 (Tamiami Trail) — usually 15 to 20 minutes depending on time of day.",
      es: "Desde Bonita Springs, el trayecto a Park Shore es directo por US-41 (Tamiami Trail) — usualmente 15 a 20 minutos según la hora.",
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
      en: "Serving Bonita Springs (ZIP 34134/34135) with bilingual psychiatric care, US-41 access and telehealth follow-up. Call (239) 423-0272 to schedule.",
      es: "Atendiendo a Bonita Springs (ZIP 34134/34135) con atención psiquiátrica bilingüe, acceso por US-41 y telesalud para seguimiento. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'Straight Shot on US-41', es: 'Directo por US-41' },
      { en: '15-20 Min to Park Shore', es: '15-20 Min a Park Shore' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
      { en: 'Telehealth Follow-up', es: 'Seguimiento por Telesalud' },
      { en: 'Most Major Insurance', es: 'Mayoría de Seguros' },
    ],
    serviceNotes: {
      en: [
        "Care in English or Spanish for Bonita's many bilingual households.",
        "Comprehensive plans for residents across Bonita Bay, Pelican Landing and the Imperial corridor.",
        "Adult ADHD evaluations — a common first visit for working Bonita Springs families.",
        "Trauma-informed, culturally sensitive care for Bonita's diverse community.",
        "Long-term mood stabilization, with the option of Spanish-language sessions.",
        "Just 15–20 minutes south on US-41 for in-person medication reviews when needed.",
      ],
      es: [
        "Atención en inglés o español para los muchos hogares bilingües de Bonita.",
        "Planes integrales para residentes de Bonita Bay, Pelican Landing y el corredor de Imperial.",
        "Evaluaciones de TDAH para adultos — una primera visita común para familias trabajadoras de Bonita Springs.",
        "Atención informada en trauma y culturalmente sensible para la diversa comunidad de Bonita.",
        "Estabilización del ánimo a largo plazo, con la opción de sesiones en español.",
        "Solo 15–20 minutos al sur por US-41 para revisiones de medicamentos en persona cuando se necesite.",
      ],
    },
    neighborhoods: {
      en: ['Bonita Bay', 'Pelican Landing', 'Spanish Wells', 'Worthington', 'Bonita National', 'Imperial', 'Palmira', 'Hunters Ridge'],
      es: ['Bonita Bay', 'Pelican Landing', 'Spanish Wells', 'Worthington', 'Bonita National', 'Imperial', 'Palmira', 'Hunters Ridge'],
    },
    localContext: {
      en: "Bonita Springs (ZIP 34134/34135) is home to roughly 57,000 residents, with about 21% of households speaking Spanish at home. From Bonita Bay and Pelican Landing to the Imperial corridor, our Park Shore office is a straight 15–20 minute drive south on US-41 — and bilingual sessions and telehealth follow-up are standard for our Bonita patients.",
      es: "Bonita Springs (ZIP 34134/34135) tiene aproximadamente 57,000 residentes, y cerca del 21% de los hogares habla español en casa. Desde Bonita Bay y Pelican Landing hasta el corredor de Imperial, nuestra oficina de Park Shore queda a 15–20 minutos directos al sur por US-41 — y las sesiones bilingües y el seguimiento por telesalud son estándar para nuestros pacientes de Bonita.",
    },
  },

  estero: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Estero, FL — Naples Office & Telehealth | Healing Minds',
        es: 'Psiquiatra para Estero, FL — Oficina en Naples y Telesalud | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Estero (ZIP 33928) — about 25–30 minutes south toward our Naples office; check live directions and traffic before traveling. Bilingual care, medication management and telehealth for the 65+ majority and the working families of Estero's planned communities.",
        es: "Atención psiquiátrica para Estero (ZIP 33928) — unos 25–30 minutos hacia el sur hasta nuestra oficina de Naples; consulte la ruta y el tráfico en vivo antes de viajar. Atención bilingüe, manejo de medicamentos y telesalud para la mayoría 65+ y las familias trabajadoras de Estero.",
      },
      keywords: {
        en: 'psychiatrist Estero FL, mental health Estero 33928, Coconut Point psychiatrist, retirement community mental health Estero',
        es: 'psiquiatra Estero FL, salud mental Estero 33928, psiquiatra Coconut Point, salud mental jubilados Estero',
      },
      serviceDescription: {
        en: "Psychiatric care for Estero (ZIP 33928), a Lee County village of roughly 39,000 where about 51.9% of residents are 65 or older and dozens of planned communities anchor daily life. Dr. Melva Reve provides bilingual evaluation and treatment for anxiety, depression, ADHD, PTSD, bipolar disorder and complex medication regimens, with telehealth so the I-75 drive is only required when truly needed.",
        es: "Atención psiquiátrica para Estero (ZIP 33928), un poblado del condado de Lee de aproximadamente 39,000 habitantes donde cerca del 51.9% son mayores de 65 y decenas de comunidades planificadas estructuran la vida diaria. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y regímenes complejos de medicamentos, con telesalud para que el viaje por la I-75 solo sea necesario cuando realmente lo amerite.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Estero — about 25–30 minutes south via I-75, with telehealth so the drive isn't required for every visit.",
      es: "Atención psiquiátrica para Estero — 25–30 minutos al sur por I-75, con telesalud para que el viaje no sea obligatorio en cada cita.",
    },
    healingParagraph: {
      en: "Estero (ZIP 33928) is a Lee County village of roughly 39,000 residents, about 51.9% of whom are 65 or older. Daily life here is shaped by dozens of planned communities — Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club and Miromar Lakes among them — and by Coconut Point as the main commercial hub. Most of our Estero patients reach our Park Shore office by traveling south toward Naples in about 25–30 minutes, depending on the starting point and live traffic, then continue with secure telehealth visits so the drive isn't required every time.",
      es: "Estero (ZIP 33928) es un poblado del condado de Lee con cerca de 39,000 residentes, de los cuales aproximadamente el 51.9% tiene 65 años o más. La vida diaria está marcada por decenas de comunidades planificadas — Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club y Miromar Lakes entre ellas — y por Coconut Point como centro comercial principal. La mayoría de nuestros pacientes de Estero llega a Park Shore viajando hacia el sur en dirección a Naples en unos 25–30 minutos, según el punto de partida y el tráfico en vivo, y continúa con telesalud segura para evitar el viaje en cada consulta.",
    },
    servicesIntro: {
      en: "These are the services our Estero patients use most — built around the realities of an active 65+ majority and the busy seasonal calendar of Coconut Point and the planned communities.",
      es: "Estos son los servicios que más usan nuestros pacientes de Estero — pensados para la mayoría activa de 65+ y el calendario estacional de Coconut Point y las comunidades planificadas.",
    },
    routeIntro: {
      en: "From most Estero communities our Park Shore office is 25–30 minutes south on I-75. The route below is the one we recommend.",
      es: "Desde la mayoría de comunidades de Estero, nuestra oficina de Park Shore queda a 25–30 minutos al sur por I-75. Esta es la ruta recomendada.",
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
      en: "Serving Estero residents — including Pelican Sound, Grandezza, the Brooks, West Bay Club and Miromar Lakes — with in-person care and telehealth between visits. Call (239) 423-0272.",
      es: "Atendiendo a residentes de Estero — incluyendo Pelican Sound, Grandezza, the Brooks, West Bay Club y Miromar Lakes — con atención presencial y telesalud entre visitas. (239) 423-0272.",
    },
    featureBadges: [
      { en: '65+ Friendly Care', es: 'Atención para 65+' },
      { en: 'Near Coconut Point', es: 'Cerca de Coconut Point' },
      { en: '25-30 Min via I-75', es: '25-30 Min por I-75' },
      { en: 'Telehealth Available', es: 'Telesalud Disponible' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Medication Review', es: 'Revisión de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Support for both Estero's active retirees and the younger families near FGCU.",
        "Personalized plans for residents of Pelican Sound, Grandezza, the Brooks and Miromar Lakes.",
        "Adult ADHD evaluations, including for students and young professionals near FGCU.",
        "Trauma-informed care with telehealth so the I-75 drive isn't needed every time.",
        "Long-term mood stabilization built around Estero's busy seasonal calendar.",
        "Careful medication review for the many 65+ residents managing several prescriptions.",
      ],
      es: [
        "Apoyo tanto para los jubilados activos de Estero como para las familias jóvenes cerca de FGCU.",
        "Planes personalizados para residentes de Pelican Sound, Grandezza, the Brooks y Miromar Lakes.",
        "Evaluaciones de TDAH para adultos, incluidos estudiantes y jóvenes profesionales cerca de FGCU.",
        "Atención informada en trauma con telesalud para evitar el viaje por la I-75 en cada cita.",
        "Estabilización del ánimo a largo plazo pensada para el ajetreado calendario estacional de Estero.",
        "Revisión cuidadosa de medicamentos para los muchos residentes 65+ que manejan varias recetas.",
      ],
    },
    neighborhoods: {
      en: ['Pelican Sound', 'Grandezza', 'The Brooks', 'Wildcat Run', 'West Bay Club', 'Miromar Lakes', 'Coconut Point', 'Corkscrew Shores'],
      es: ['Pelican Sound', 'Grandezza', 'The Brooks', 'Wildcat Run', 'West Bay Club', 'Miromar Lakes', 'Coconut Point', 'Corkscrew Shores'],
    },
    localContext: {
      en: "Estero (ZIP 33928) is a Lee County village of roughly 39,000 where about 51.9% of residents are 65 or older and dozens of planned communities — Pelican Sound, Grandezza, the Brooks, West Bay Club and Miromar Lakes among them — anchor daily life. Our Park Shore office is 25–30 minutes south on I-75, and telehealth keeps the drive optional between visits.",
      es: "Estero (ZIP 33928) es un poblado del condado de Lee con cerca de 39,000 residentes, donde aproximadamente el 51.9% tiene 65 años o más y decenas de comunidades planificadas — Pelican Sound, Grandezza, the Brooks, West Bay Club y Miromar Lakes entre ellas — estructuran la vida diaria. Nuestra oficina de Park Shore queda a 25–30 minutos al sur por I-75, y la telesalud hace opcional el viaje entre visitas.",
    },
  },

  fortMyers: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Fort Myers, FL — Naples Office via I-75 South | Healing Minds',
        es: 'Psiquiatra para Fort Myers, FL — Oficina en Naples por la I-75 Sur | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Fort Myers and Lee County residents — about 40–45 minutes south on I-75 to our Park Shore office. Telehealth available for most follow-ups. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para Fort Myers y el condado de Lee — unos 40–45 minutos al sur por I-75 hasta Park Shore. Telesalud disponible para la mayoría de seguimientos. (239) 423-0272.",
      },
      keywords: {
        en: 'psychiatrist Fort Myers FL, bilingual psychiatrist Lee County, Fort Myers mental health, telepsychiatry Fort Myers',
        es: 'psiquiatra Fort Myers FL, psiquiatra bilingüe condado Lee, salud mental Fort Myers, telepsiquiatría Fort Myers',
      },
      serviceDescription: {
        en: "Psychiatric care for Fort Myers and the broader Lee County metro of roughly 975,000 — younger and more diverse than Naples, with a median age near 49 and about 17.9% foreign-born. Dr. Melva Reve provides bilingual English/Spanish evaluation and treatment for anxiety, depression, ADHD, PTSD, bipolar disorder and medication management, with telehealth for most follow-up care.",
        es: "Atención psiquiátrica para Fort Myers y el área metropolitana del condado de Lee, con cerca de 975,000 habitantes — más joven y diversa que Naples, edad mediana cerca de 49 y aproximadamente 17.9% nacidos en el extranjero. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe inglés/español para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y manejo de medicamentos, con telesalud para la mayor parte del seguimiento.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care serving Fort Myers from our only physical office in Naples; appointment modality is confirmed when scheduling.",
      es: "Atención psiquiátrica bilingüe para residentes de Fort Myers desde nuestra única oficina física en Naples; la modalidad se confirma al programar.",
    },
    healingParagraph: {
      en: "The Fort Myers / Lee County metro has roughly 975,000 residents — younger and more diverse than Naples, with a median age near 49 and about 17.9% foreign-born. Our only physical office is in Park Shore, commonly estimated at 40–45 minutes south depending on origin and traffic. The office confirms whether in-person or telehealth care is clinically and legally appropriate for each appointment.",
      es: "El área metropolitana de Fort Myers / condado de Lee tiene aproximadamente 975,000 habitantes — más joven y diversa que Naples, con edad mediana cerca de 49 y alrededor de 17.9% nacidos en el extranjero. Nuestra única oficina física está en Park Shore, a unos 40–45 minutos al sur según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínica y legalmente apropiada para cada cita.",
    },
    servicesIntro: {
      en: "These services are available to Fort Myers residents, with appointment modality confirmed according to clinical need, patient location and applicable licensing.",
      es: "Estos servicios están disponibles para residentes de Fort Myers, con modalidad confirmada según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "From Fort Myers our Park Shore office is about 40–45 minutes south on I-75 in typical conditions. Check live directions because the starting point and traffic can change the estimate.",
      es: "Desde Fort Myers, nuestra oficina de Park Shore queda a unos 40–45 minutos al sur por I-75 en condiciones típicas. Consulte indicaciones en vivo porque el punto de partida y el tráfico pueden cambiar la estimación.",
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
      en: "Serving Fort Myers and the Lee County metro with bilingual psychiatric care, an in-person Park Shore office and secure telehealth follow-up. Call (239) 423-0272 to schedule.",
      es: "Atendiendo a Fort Myers y al área metropolitana del condado de Lee con atención psiquiátrica bilingüe, oficina en Park Shore y telesalud segura para seguimiento. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'Telehealth-First Follow-up', es: 'Seguimiento por Telesalud' },
      { en: '40-45 Min via I-75', es: '40-45 Min por I-75' },
      { en: 'One In-Person Visit', es: 'Una Visita en Persona' },
      { en: 'Written Records Shared', es: 'Registros Compartidos' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Care for a younger, more diverse Lee County population, in English or Spanish.",
        "Appointment modality confirmed according to clinical need and applicable licensing.",
        "Adult ADHD evaluations for busy Fort Myers professionals and parents.",
        "Trauma-informed care by secure video, so the I-75 drive is rarely required.",
        "Mood stabilization with clear written records you can share with local providers.",
        "Medication management mostly by telehealth, with one Naples visit when needed.",
      ],
      es: [
        "Atención para una población del condado de Lee más joven y diversa, en inglés o español.",
        "Planes integrales que combinan una visita en persona con seguimiento por telesalud.",
        "Evaluaciones de TDAH para adultos ocupados de Fort Myers, profesionales y padres.",
        "Atención informada en trauma por video seguro, para que el viaje por la I-75 rara vez sea necesario.",
        "Estabilización del ánimo con registros claros que puede compartir con proveedores locales.",
        "Manejo de medicamentos principalmente por telesalud, con una visita a Naples cuando se necesite.",
      ],
    },
    neighborhoods: {
      en: ['Downtown River District', 'McGregor', 'Gateway', 'Fort Myers Beach', 'Cape Coral (nearby)', 'Lehigh Acres', 'San Carlos Park', 'Whiskey Creek'],
      es: ['Downtown River District', 'McGregor', 'Gateway', 'Fort Myers Beach', 'Cape Coral (cercano)', 'Lehigh Acres', 'San Carlos Park', 'Whiskey Creek'],
    },
    localContext: {
      en: "The Fort Myers / Lee County metro has roughly 975,000 residents — younger and more diverse than Naples, with about 17.9% foreign-born. Our only physical office is in Naples, commonly estimated at 40–45 minutes south depending on origin and traffic. The office confirms appointment modality and any consent-based record coordination case by case.",
      es: "El área metropolitana de Fort Myers / condado de Lee tiene aproximadamente 975,000 habitantes — más joven y diversa que Naples, con cerca del 17.9% nacidos en el extranjero. Nuestra única oficina física está en Naples, a unos 40–45 minutos al sur según el origen y el tráfico. La oficina confirma caso por caso la modalidad y cualquier coordinación de registros con consentimiento.",
    },
  },

  marcoIsland: {
    seo: {
      title: {
        en: 'Psychiatrist for Marco Island, FL — Telehealth & In-Person on US-41 | Healing Minds',
        es: 'Psiquiatra para Marco Island, FL — Telesalud y Atención en Persona sobre US-41 | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Marco Island (ZIP 34145). About 25–30 minutes north via Collier Blvd and the Jolley Bridge, or skip the bridge with secure telehealth. Snowbird-friendly continuity of care.",
        es: "Atención psiquiátrica para Marco Island (ZIP 34145). Unos 25–30 minutos al norte por Collier Blvd y el puente Jolley, o evítelo con telesalud segura. Continuidad de atención para snowbirds.",
      },
      keywords: {
        en: 'psychiatrist Marco Island FL, telepsychiatry Marco Island, snowbird mental health 34145, Jolley Bridge telehealth psychiatrist',
        es: 'psiquiatra Marco Island FL, telepsiquiatría Marco Island, salud mental snowbird 34145, telesalud psiquiatría puente Jolley',
      },
      serviceDescription: {
        en: "Psychiatric care for Marco Island (ZIP 34145), with a permanent population near 16,600 that nearly doubles in winter, a median age near 67.7 and an 89.9% homeownership rate. Dr. Melva Reve provides bilingual evaluation and treatment for anxiety, depression, ADHD, PTSD, sleep and bipolar disorder, with telehealth designed around residents who'd rather not cross the Jolley Bridge for every appointment.",
        es: "Atención psiquiátrica para Marco Island (ZIP 34145), con una población permanente cerca de 16,600 que casi se duplica en invierno, edad mediana cerca de 67.7 y 89.9% de propietarios. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad, depresión, TDAH, TEPT, sueño y trastorno bipolar, con telesalud pensada para quienes prefieren no cruzar el puente Jolley en cada cita.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Marco Island — 25–30 minutes north via Collier Blvd and the Jolley Bridge, or skip the bridge with secure telehealth.",
      es: "Atención psiquiátrica para Marco Island — 25–30 minutos al norte por Collier Blvd y el puente Jolley, o evítelo con telesalud segura.",
    },
    healingParagraph: {
      en: "Marco Island (ZIP 34145) has a permanent population near 16,600 that nearly doubles in winter, a median age close to 67.7 and an 89.9% homeownership rate. Our only physical office is in Park Shore, commonly estimated at 25–30 minutes north depending on origin and traffic. The office confirms whether in-person or telehealth care is clinically and legally appropriate for each appointment.",
      es: "Marco Island (ZIP 34145) tiene una población permanente cerca de 16,600 que casi se duplica en invierno, edad mediana cerca de 67.7 y un 89.9% de propietarios. Nuestra única oficina física está en Park Shore, a unos 25–30 minutos al norte según el origen y el tráfico. La oficina confirma si la atención presencial o por telesalud es clínica y legalmente apropiada para cada cita.",
    },
    servicesIntro: {
      en: "These services are available to Marco Island residents. The office confirms appointment modality according to clinical need, patient location and applicable licensing.",
      es: "Estos servicios están disponibles para residentes de Marco Island. La oficina confirma la modalidad según necesidad clínica, ubicación del paciente y licencias aplicables.",
    },
    routeIntro: {
      en: "From Marco Island our Park Shore office is 25–30 minutes north — Collier Blvd, the Jolley Bridge, and then US-41.",
      es: "Desde Marco Island, nuestra oficina de Park Shore queda a 25–30 minutos al norte — Collier Blvd, el puente Jolley, y luego US-41.",
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
      en: "Serving Marco Island with a bridge-aware care plan: in-person when it matters, secure telehealth the rest of the time. Call (239) 423-0272.",
      es: "Atendiendo a Marco Island con un plan que tiene en cuenta el puente: presencial cuando importa, y telesalud segura el resto del tiempo. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Skip the Jolley Bridge', es: 'Evite el Puente Jolley' },
      { en: 'Telehealth-First Care', es: 'Atención por Telesalud' },
      { en: '25-30 Min to Naples', es: '25-30 Min a Naples' },
      { en: 'Snowbird Continuity', es: 'Continuidad para Snowbirds' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
      { en: 'Medication Management', es: 'Manejo de Medicamentos' },
    ],
    serviceNotes: {
      en: [
        "Secure video means most anxiety visits never require crossing the Jolley Bridge.",
        "Comprehensive care for Marco's largely retired, year-round and seasonal residents.",
        "Adult ADHD evaluations on the mainland, then follow-up by telehealth.",
        "Trauma-informed care from home — no bridge required for follow-ups.",
        "Long-term mood stabilization coordinated for seasonal residents.",
        "Prescriptions sent electronically to your preferred Marco Island pharmacy.",
      ],
      es: [
        "El video seguro hace que la mayoría de las citas de ansiedad no requieran cruzar el puente Jolley.",
        "Atención integral para los residentes de Marco, en su mayoría jubilados, permanentes y estacionales.",
        "Evaluaciones de TDAH para adultos en tierra firme, con seguimiento por telesalud.",
        "Atención informada en trauma desde casa — sin necesidad de cruzar el puente para seguimientos.",
        "Estabilización del ánimo a largo plazo coordinada para residentes estacionales.",
        "Recetas enviadas electrónicamente a su farmacia preferida en Marco Island.",
      ],
    },
    neighborhoods: {
      en: ['Old Marco', 'Tigertail Beach area', 'Hideaway Beach', 'Marco Shores', 'Smokehouse Bay', 'Key Marco', 'Caxambas'],
      es: ['Old Marco', 'área de Tigertail Beach', 'Hideaway Beach', 'Marco Shores', 'Smokehouse Bay', 'Key Marco', 'Caxambas'],
    },
    localContext: {
      en: "Marco Island (ZIP 34145) has a permanent population near 16,600 that nearly doubles in winter, with a median age close to 67.7. Our only physical office is in Park Shore, commonly estimated at 25–30 minutes away depending on origin and traffic. The office confirms appointment modality and telehealth eligibility case by case.",
      es: "Marco Island (ZIP 34145) tiene una población permanente cerca de 16,600 que casi se duplica en invierno, con edad mediana cercana a 67.7. Nuestra única oficina física está en Park Shore, a unos 25–30 minutos según el origen y el tráfico. La oficina confirma caso por caso la modalidad y elegibilidad para telesalud.",
    },
  },

  goldenGate: {
    seo: {
      title: {
        en: 'Psychiatrist for Golden Gate, FL — Bilingual Anxiety, Depression & ADHD Care | Healing Minds',
        es: 'Psiquiatra para Golden Gate, FL — Atención Bilingüe en Español | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care for Golden Gate (ZIP 34116) — a community where about 79.6% of households speak Spanish at home. Short drive to our Park Shore office via Golden Gate Pkwy and US-41. Call (239) 423-0272.",
        es: "Atención psiquiátrica bilingüe para Golden Gate (ZIP 34116) — comunidad donde cerca del 79.6% de los hogares habla español. Trayecto corto a nuestra oficina de Park Shore por Golden Gate Pkwy y US-41. (239) 423-0272.",
      },
      keywords: {
        en: 'bilingual psychiatrist Golden Gate FL, psiquiatra en español Naples 34116, Spanish speaking psychiatrist Naples, mental health Golden Gate',
        es: 'psiquiatra en español Golden Gate FL, psiquiatra bilingüe 34116, salud mental Golden Gate, psiquiatra hispanohablante Naples',
      },
      serviceDescription: {
        en: "Bilingual psychiatric care for Golden Gate (ZIP 34116) — a community of roughly 28,000–34,000 with a young median age (about 35.4), where approximately 58.9% of residents identify as Hispanic and 79.6% of households speak Spanish at home. Dr. Melva Reve, fluent in Spanish, treats anxiety, depression, ADHD in adults 18 and older, PTSD, bipolar disorder and manages psychiatric medications.",
        es: "Atención psiquiátrica bilingüe para Golden Gate (ZIP 34116) — comunidad de aproximadamente 28,000 a 34,000 habitantes con edad mediana joven (cerca de 35.4), donde aproximadamente el 58.9% se identifica como hispano y el 79.6% de los hogares habla español en casa. La Dra. Melva Reve, fluida en español, trata ansiedad, depresión, TDAH en adultos de 18 años en adelante, TEPT, trastorno bipolar y maneja medicamentos psiquiátricos.",
      },
    },
    heroDescription: {
      en: "Bilingual (English/Spanish) psychiatric care for Golden Gate families — a 12–15 minute drive to our Park Shore office on US-41.",
      es: "Atención psiquiátrica bilingüe (inglés/español) para familias de Golden Gate — 12–15 minutos hasta nuestra oficina de Park Shore sobre US-41.",
    },
    healingParagraph: {
      en: "Golden Gate (ZIP 34116) is a young, working-family community of roughly 28,000–34,000 residents — median age around 35.4, with about 58.9% of residents identifying as Hispanic and roughly 79.6% of households speaking Spanish at home. Sessions with Dr. Reve can be conducted entirely in Spanish for adults 18 and older, including ADHD evaluations, postpartum care, anxiety and depression. Our Park Shore office is a 12–15 minute drive via Golden Gate Pkwy and US-41.",
      es: "Golden Gate (ZIP 34116) es una comunidad joven de familias trabajadoras con aproximadamente 28,000 a 34,000 residentes — edad mediana alrededor de 35.4, con cerca del 58.9% identificándose como hispanos y aproximadamente el 79.6% de los hogares hablando español en casa. Las sesiones con la Dra. Reve pueden realizarse completamente en español para adultos de 18 años en adelante, incluyendo evaluaciones de TDAH, atención postparto, ansiedad y depresión. Nuestra oficina de Park Shore queda a 12–15 minutos por Golden Gate Pkwy y US-41.",
    },
    servicesIntro: {
      en: "These are the services Golden Gate families ask about most — many of which can be delivered entirely in Spanish, in person or by telehealth.",
      es: "Estos son los servicios que más nos consultan las familias de Golden Gate — muchos pueden ofrecerse completamente en español, en persona o por telesalud.",
    },
    routeIntro: {
      en: "From most Golden Gate addresses our Park Shore office is a 12–15 minute drive west via Golden Gate Pkwy and US-41.",
      es: "Desde la mayoría de direcciones en Golden Gate, nuestra oficina queda a 12–15 minutos al oeste por Golden Gate Pkwy y US-41.",
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
      en: "Serving Golden Gate (ZIP 34116) with fully bilingual psychiatric care for adults 18 and older — sessions in Spanish and telehealth between visits. Call (239) 423-0272.",
      es: "Atendiendo a Golden Gate (ZIP 34116) con atención psiquiátrica completamente bilingüe para adultos de 18 años en adelante — sesiones en español y telesalud entre visitas. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Sessions in Spanish', es: 'Sesiones en Español' },
      { en: 'Adults 18 and Older', es: 'Adultos de 18 Años en Adelante' },
      { en: '12-15 Min via US-41', es: '12-15 Min por US-41' },
      { en: 'Family-Focused Care', es: 'Atención Centrada en la Familia' },
      { en: 'Telehealth Available', es: 'Telesalud Disponible' },
      { en: 'Most Major Insurance', es: 'Mayoría de Seguros' },
    ],
    serviceNotes: {
      en: [
        "Delivered entirely in Spanish when preferred, including postpartum anxiety.",
        "Care for working Golden Gate families, in Spanish or English.",
        "Evaluations for adults 18 and older, with treatment personalized to daily needs.",
        "Trauma-informed, culturally sensitive care for Golden Gate's Hispanic community.",
        "Long-term mood stabilization, with sessions available in Spanish.",
        "Medication management in person or by telehealth, just 12–15 minutes away.",
      ],
      es: [
        "Ofrecida completamente en español cuando se prefiere, incluida la ansiedad postparto.",
        "Atención para familias trabajadoras de Golden Gate, en español o inglés.",
        "Evaluaciones para adultos de 18 años en adelante, con tratamiento personalizado según sus necesidades diarias.",
        "Atención informada en trauma y culturalmente sensible para la comunidad hispana de Golden Gate.",
        "Estabilización del ánimo a largo plazo, con sesiones disponibles en español.",
        "Manejo de medicamentos en persona o por telesalud, a solo 12–15 minutos.",
      ],
    },
    neighborhoods: {
      en: ['Golden Gate City', 'Golden Gate Estates', 'Sunshine Blvd area', 'Coronado', 'Tropicana', 'Santa Barbara corridor'],
      es: ['Golden Gate City', 'Golden Gate Estates', 'área de Sunshine Blvd', 'Coronado', 'Tropicana', 'corredor de Santa Barbara'],
    },
    localContext: {
      en: "Golden Gate (ZIP 34116) is a young, working-family community where about 58.9% of residents identify as Hispanic and roughly 79.6% of households speak Spanish at home. Sessions with Dr. Reve can be conducted entirely in Spanish — from ADHD evaluations to postpartum and family care — and our Park Shore office is just a 12–15 minute drive via Golden Gate Pkwy and US-41.",
      es: "Golden Gate (ZIP 34116) es una comunidad joven de familias trabajadoras donde cerca del 58.9% se identifica como hispano y aproximadamente el 79.6% de los hogares habla español en casa. Las sesiones con la Dra. Reve pueden realizarse completamente en español — desde evaluaciones de TDAH hasta atención postparto y familiar — y nuestra oficina de Park Shore queda a solo 12–15 minutos por Golden Gate Pkwy y US-41.",
    },
  },

  immokalee: {
    seo: {
      title: {
        en: 'Bilingual Psychiatrist Serving Immokalee, FL — Care via Telehealth or CR-846 | Healing Minds',
        es: 'Psiquiatra Bilingüe para Immokalee, FL — Atención por Telesalud o CR-846 | Healing Minds',
      },
      description: {
        en: "Bilingual psychiatric care serving Immokalee (ZIP 34142) from our only physical office in Naples, with telehealth eligibility and availability confirmed when scheduling.",
        es: "Atención psiquiátrica bilingüe para residentes de Immokalee (ZIP 34142) desde nuestra única oficina física en Naples, con elegibilidad y disponibilidad de telesalud confirmadas al programar.",
      },
      keywords: {
        en: 'psychiatrist Immokalee FL, bilingual mental health Immokalee, Spanish psychiatrist 34142, agricultural worker mental health Collier',
        es: 'psiquiatra Immokalee FL, salud mental bilingüe Immokalee, psiquiatra en español 34142, salud mental trabajadores agrícolas Collier',
      },
      serviceDescription: {
        en: "Bilingual psychiatric care for Immokalee (ZIP 34142), a community of roughly 25,000 in eastern Collier County with a sizable agricultural workforce. Dr. Melva Reve, fluent in Spanish, offers evaluation and treatment for anxiety, depression, PTSD, ADHD, bipolar disorder and medication management. Telehealth eligibility and availability are confirmed when scheduling.",
        es: "Atención psiquiátrica bilingüe para Immokalee (ZIP 34142), comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier con una fuerza laboral agrícola importante. La Dra. Melva Reve, fluida en español, ofrece evaluación y tratamiento para ansiedad, depresión, TEPT, TDAH, trastorno bipolar y manejo de medicamentos. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care serving Immokalee from our only physical office in Naples; telehealth eligibility and availability are confirmed when scheduling.",
      es: "Atención psiquiátrica bilingüe para residentes de Immokalee desde nuestra única oficina física en Naples; la elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
    healingParagraph: {
      en: "Immokalee (ZIP 34142) is a community of roughly 25,000 in eastern Collier County where about 73.2% of residents identify as Hispanic, around 21.9% as Black, and the median age is near 30. We offer sessions in Spanish from our only physical office in Park Shore, commonly estimated at 50–60 minutes away depending on origin and traffic. Telehealth eligibility and availability are confirmed when scheduling.",
      es: "Immokalee (ZIP 34142) es una comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier donde cerca del 73.2% se identifica como hispano, alrededor del 21.9% como afroamericano, y la edad mediana es cercana a 30. Ofrecemos sesiones en español desde nuestra única oficina física en Park Shore, a unos 50–60 minutos según el origen y el tráfico. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
    servicesIntro: {
      en: "These services are available to Immokalee residents in Spanish or English. The office confirms appointment modality, telehealth eligibility and availability when scheduling.",
      es: "Estos servicios están disponibles para residentes de Immokalee en español o inglés. La oficina confirma la modalidad, elegibilidad para telesalud y disponibilidad al programar.",
    },
    routeIntro: {
      en: "From Immokalee our Park Shore office is commonly estimated at 50–60 minutes away depending on origin, route and traffic. Telehealth eligibility and availability are confirmed when scheduling.",
      es: "Desde Immokalee, nuestra oficina de Park Shore queda a unos 50–60 minutos según el origen, la ruta y el tráfico. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
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
      { en: 'Telehealth Eligibility Confirmed', es: 'Elegibilidad de Telesalud Confirmada' },
      { en: 'Call to Check Availability', es: 'Llame para Consultar Disponibilidad' },
      { en: 'Naples Office', es: 'Oficina en Naples' },
      { en: 'Culturally Sensitive Care', es: 'Atención Culturalmente Sensible' },
      { en: 'Most Major Insurance', es: 'Mayoría de Seguros' },
    ],
    serviceNotes: {
      en: [
        "Offered in Spanish, with telehealth eligibility and availability confirmed when scheduling.",
        "Care for Immokalee's young, hardworking agricultural community.",
        "Evaluations for adults 18 and older, with available weekday times confirmed when scheduling.",
        "Trauma-informed, confidential care in Spanish, by secure video when needed.",
        "Long-term mood stabilization with appointment modality confirmed case by case.",
        "Refill and follow-up arrangements confirmed according to clinical and legal requirements.",
      ],
      es: [
        "Ofrecida en español, con elegibilidad y disponibilidad de telesalud confirmadas al programar.",
        "Atención para la joven y trabajadora comunidad agrícola de Immokalee.",
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
      en: "Immokalee (ZIP 34142) is a community of roughly 25,000 in eastern Collier County where about 73.2% of residents identify as Hispanic and the median age is near 30. We offer Spanish-language sessions from our only physical office in Naples, commonly estimated at 50–60 minutes away depending on origin and traffic. Telehealth eligibility and availability are confirmed when scheduling.",
      es: "Immokalee (ZIP 34142) es una comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier donde cerca del 73.2% se identifica como hispano y la edad mediana es cercana a 30. Ofrecemos sesiones en español desde nuestra única oficina física en Naples, a unos 50–60 minutos según el origen y el tráfico. La elegibilidad y disponibilidad de telesalud se confirman al programar.",
    },
  },

  aveMaria: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Ave Maria, FL — Care for University Families | Healing Minds',
        es: 'Psiquiatra para Ave Maria, FL — Atención para Familias Universitarias | Healing Minds',
      },
      description: {
        en: "Psychiatric care serving Ave Maria, FL, from our only physical office in Naples, commonly estimated at 50–60 minutes away depending on origin and traffic. Telehealth eligibility is confirmed when scheduling.",
        es: "Atención psiquiátrica para residentes de Ave Maria, FL, desde nuestra única oficina física en Naples, a unos 50–60 minutos según el origen y el tráfico. La elegibilidad para telesalud se confirma al programar.",
      },
      keywords: {
        en: 'psychiatrist Ave Maria FL, Ave Maria University mental health, college student psychiatrist Naples, family psychiatry Ave Maria',
        es: 'psiquiatra Ave Maria FL, salud mental Ave Maria University, psiquiatra estudiantes universitarios Naples, psiquiatría familias Ave Maria',
      },
      serviceDescription: {
        en: "Psychiatric care for Ave Maria, a planned community of roughly 7,500 founded in 2005 around Ave Maria University in eastern Collier County. Dr. Melva Reve provides bilingual evaluation and treatment for college-age anxiety and depression, ADHD, postpartum and family-stage care, PTSD and medication management. Appointment modality is confirmed when scheduling.",
        es: "Atención psiquiátrica para Ave Maria, comunidad planificada de aproximadamente 7,500 habitantes fundada en 2005 alrededor de Ave Maria University en el este del condado de Collier. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad y depresión universitarias, TDAH, atención postparto y de etapa familiar, TEPT y manejo de medicamentos. La modalidad se confirma al programar.",
      },
    },
    heroDescription: {
      en: "Psychiatric care serving Ave Maria from our only physical office in Naples, with appointment modality and telehealth eligibility confirmed when scheduling.",
      es: "Atención psiquiátrica para residentes de Ave Maria desde nuestra única oficina física en Naples, con modalidad y elegibilidad para telesalud confirmadas al programar.",
    },
    healingParagraph: {
      en: "Ave Maria is a planned community of roughly 7,500 in eastern Collier County, founded in 2005 around Ave Maria University. We offer bilingual sessions, careful ADHD evaluations and college-age anxiety and depression care from our only physical office in Park Shore, commonly estimated at 50–60 minutes away depending on origin and traffic. Appointment modality and telehealth eligibility are confirmed when scheduling.",
      es: "Ave Maria es una comunidad planificada de aproximadamente 7,500 habitantes en el este del condado de Collier, fundada en 2005 alrededor de Ave Maria University. Ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria desde nuestra única oficina física en Park Shore, a unos 50–60 minutos según el origen y el tráfico. La modalidad y elegibilidad para telesalud se confirman al programar.",
    },
    servicesIntro: {
      en: "These are the services Ave Maria families and students ask about most — anxiety and depression, ADHD evaluation, medication management, and care that fits the academic calendar.",
      es: "Estos son los servicios que más nos consultan familias y estudiantes de Ave Maria — ansiedad y depresión, evaluación de TDAH, manejo de medicamentos y atención adaptada al calendario académico.",
    },
    routeIntro: {
      en: "From Ave Maria our Park Shore office is commonly estimated at 50–60 minutes away depending on origin, route and traffic. Appointment modality is confirmed when scheduling.",
      es: "Desde Ave Maria, nuestra oficina de Park Shore queda a unos 50–60 minutos según el origen, la ruta y el tráfico. La modalidad se confirma al programar.",
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
      { en: 'Telehealth Eligibility Confirmed', es: 'Elegibilidad de Telesalud Confirmada' },
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'College-Age Care', es: 'Atención para Edad Universitaria' },
      { en: 'ADHD Evaluations', es: 'Evaluaciones de TDAH' },
    ],
    serviceNotes: {
      en: [
        "College-age anxiety care with appointment modality confirmed when scheduling.",
        "Support for university students, faculty families and young parents.",
        "Careful adult ADHD evaluations — a frequent request from Ave Maria students.",
        "Trauma-informed care with telehealth eligibility confirmed when scheduling.",
        "Long-term mood stabilization that continues through academic breaks.",
        "Medication management with appointment modality confirmed case by case.",
      ],
      es: [
        "Atención de ansiedad universitaria con modalidad confirmada al programar.",
        "Apoyo para estudiantes universitarios, familias del profesorado y padres jóvenes.",
        "Evaluaciones cuidadosas de TDAH para adultos — una solicitud frecuente de estudiantes de Ave Maria.",
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
      en: "Ave Maria is a planned community of roughly 7,500 in eastern Collier County, founded in 2005 around Ave Maria University. We offer bilingual sessions, careful ADHD evaluations and college-age anxiety and depression care from our only physical office in Park Shore, commonly estimated at 50–60 minutes away depending on origin and traffic. Appointment modality and telehealth eligibility are confirmed when scheduling.",
      es: "Ave Maria es una comunidad planificada de aproximadamente 7,500 habitantes en el este del condado de Collier, fundada en 2005 alrededor de Ave Maria University. Ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria desde nuestra única oficina física en Park Shore, a unos 50–60 minutos según el origen y el tráfico. La modalidad y elegibilidad para telesalud se confirman al programar.",
    },
  },
};
