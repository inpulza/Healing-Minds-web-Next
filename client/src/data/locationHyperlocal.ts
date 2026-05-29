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
        en: "Psychiatric care tailored to Lely Resort's active 55+ community in ZIP 34113. Dr. Melva Reve treats anxiety, depression, life-transition adjustment, sleep difficulties, ADHD, PTSD, bipolar disorder and provides medication review for residents of Players Club & Spa, Stonebridge, the Classics, Lakoya, Mustang Island and Lely Country Club. Sessions are bilingual (English/Spanish), with telehealth available between in-person visits.",
        es: "Atención psiquiátrica adaptada a la comunidad activa 55+ de Lely Resort en el ZIP 34113. La Dra. Melva Reve trata ansiedad, depresión, ajuste a transiciones de vida, problemas del sueño, TDAH, TEPT, trastorno bipolar y revisión de medicamentos para residentes de Players Club & Spa, Stonebridge, the Classics, Lakoya, Mustang Island y Lely Country Club. Sesiones bilingües (inglés/español), con telesalud entre visitas en persona.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for Lely Resort's 55+ community — about 15 minutes north on US-41 from Players Club, Stonebridge, the Classics and Lakoya.",
      es: "Atención psiquiátrica bilingüe para la comunidad 55+ de Lely Resort — a unos 15 minutos hacia el norte por US-41 desde Players Club, Stonebridge, the Classics y Lakoya.",
    },
    healingParagraph: {
      en: "Lely Resort is home to roughly 9,300 residents with a median age in the high 50s and a strong network of master-association communities — Players Club & Spa, Stonebridge, the Classics, Lakoya and Mustang Island among them. Most of our Lely patients reach our Park Shore office in 15–20 minutes via Collier Boulevard and US-41 for their initial evaluation, and continue with secure telehealth visits in between. Care is bilingual (English/Spanish) and oriented to the concerns we hear most often from active retirees: sleep, anxiety after a major life transition, mood changes, careful medication review and adjustment to chronic illness.",
      es: "Lely Resort tiene aproximadamente 9,300 residentes con una edad mediana cercana a los 60 años y una red sólida de comunidades de asociación maestra — Players Club & Spa, Stonebridge, the Classics, Lakoya y Mustang Island entre ellas. La mayoría de nuestros pacientes de Lely llegan a nuestra oficina de Park Shore en 15–20 minutos por Collier Boulevard y US-41 para la evaluación inicial, y continúan con visitas seguras por telesalud entre consultas. La atención es bilingüe (inglés/español) y se centra en lo que más escuchamos de jubilados activos: sueño, ansiedad tras una transición vital, cambios de ánimo, revisión cuidadosa de medicamentos y ajuste a enfermedades crónicas.",
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
      en: "Serving Lely Resort residents — including Players Club & Spa, Stonebridge, the Classics and Lakoya — with in-person visits at our Park Shore office and secure telehealth follow-up. Call (239) 423-0272 for directions or scheduling.",
      es: "Atendiendo a residentes de Lely Resort — incluyendo Players Club & Spa, Stonebridge, the Classics y Lakoya — con visitas en persona en Park Shore y telesalud segura para seguimiento. Llame al (239) 423-0272.",
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
        en: "Psychiatric care for Vanderbilt Beach (ZIP 34108) — short drive down Vanderbilt Beach Rd to our Park Shore office. Coordinated continuity of care for seasonal residents, with telehealth when you return north.",
        es: "Atención psiquiátrica para Vanderbilt Beach (ZIP 34108) — corto trayecto por Vanderbilt Beach Rd hasta nuestra oficina de Park Shore. Continuidad coordinada para residentes estacionales, con telesalud cuando regresan al norte.",
      },
      keywords: {
        en: 'psychiatrist Vanderbilt Beach FL, snowbird psychiatrist Naples, seasonal mental health 34108, telepsychiatry Park Shore',
        es: 'psiquiatra Vanderbilt Beach FL, psiquiatra snowbird Naples, salud mental estacional 34108, telepsiquiatría Park Shore',
      },
      serviceDescription: {
        en: "Psychiatric care for Vanderbilt Beach (ZIP 34108) residents, where roughly 44.6% of housing is seasonal. Dr. Melva Reve provides anxiety and depression treatment, ADHD evaluation, medication management, sleep care and trauma-informed support — with explicit coordination with northern providers so seasonal patients are not left without care between Florida and home.",
        es: "Atención psiquiátrica para residentes de Vanderbilt Beach (ZIP 34108), donde aproximadamente el 44.6% de la vivienda es estacional. La Dra. Melva Reve brinda tratamiento de ansiedad y depresión, evaluación de TDAH, manejo de medicamentos, cuidado del sueño y apoyo informado en trauma — con coordinación explícita con proveedores del norte para que los pacientes estacionales no queden sin atención entre Florida y su lugar de origen.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Vanderbilt Beach — a short drive east on Vanderbilt Beach Rd to US-41, with telehealth continuity when you head back north.",
      es: "Atención psiquiátrica para Vanderbilt Beach — corto trayecto al este por Vanderbilt Beach Rd hasta US-41, con telesalud cuando regrese al norte.",
    },
    healingParagraph: {
      en: "Vanderbilt Beach (ZIP 34108) has a small year-round core of about 1,400 residents, a median age near 69 and roughly 44.6% of housing units used seasonally. Many of our patients here split the year between Naples and a home up north, so we build the care plan around that reality: a thorough in-person evaluation at our Park Shore office (10–15 minutes via Vanderbilt Beach Rd and US-41), structured medication management, and secure telehealth follow-ups that travel with you. We routinely send written summaries to your primary doctor or therapist so nothing is lost between the seasons.",
      es: "Vanderbilt Beach (ZIP 34108) tiene un núcleo permanente de unos 1,400 residentes, una edad mediana cercana a los 69 y aproximadamente 44.6% de viviendas estacionales. Muchos de nuestros pacientes aquí dividen el año entre Naples y otra casa en el norte, así que diseñamos el plan en torno a esa realidad: una evaluación inicial en persona en Park Shore (10–15 minutos por Vanderbilt Beach Rd y US-41), manejo estructurado de medicamentos y seguimientos seguros por telesalud que viajan con usted. Enviamos resúmenes escritos a su médico de cabecera o terapeuta para que nada se pierda entre temporadas.",
    },
    servicesIntro: {
      en: "The services below are the ones our Vanderbilt Beach patients use most — typically a careful first evaluation in season, then medication management and follow-up care that continues by secure video when you travel.",
      es: "Los servicios a continuación son los que más utilizan nuestros pacientes de Vanderbilt Beach — usualmente una primera evaluación cuidadosa en temporada, y luego manejo de medicamentos y seguimiento que continúa por video seguro cuando viaja.",
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
      en: "Serving Vanderbilt Beach with a snowbird-friendly model: in-person visits during the season, secure telehealth and written records sent to your northern provider when you travel. Call (239) 423-0272.",
      es: "Atendiendo a Vanderbilt Beach con un modelo amigable para snowbirds: visitas presenciales en temporada, telesalud segura y resúmenes enviados a su proveedor del norte cuando viaja. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Snowbird Continuity', es: 'Continuidad para Snowbirds' },
      { en: '10-15 Min on US-41', es: '10-15 Min por US-41' },
      { en: 'Records Sent North', es: 'Resúmenes Enviados al Norte' },
      { en: 'Seasonal Scheduling', es: 'Agenda Estacional' },
      { en: 'Telehealth Anywhere', es: 'Telesalud en Cualquier Lugar' },
      { en: 'Bilingual Care', es: 'Atención Bilingüe' },
    ],
    serviceNotes: {
      en: [
        "Often tied to the back-and-forth of seasonal living between Naples and a home up north.",
        "We coordinate with your northern provider so care doesn't lapse when you travel.",
        "Adult ADHD evaluations scheduled within your Florida season.",
        "Trauma-informed care with secure video that follows you between residences.",
        "Mood stabilization with written summaries sent to your home-state psychiatrist.",
        "Refill and monitoring plans built around the months you spend away from Florida.",
      ],
      es: [
        "A menudo ligada al ir y venir de la vida estacional entre Naples y otra casa en el norte.",
        "Coordinamos con su proveedor del norte para que la atención no se interrumpa al viajar.",
        "Evaluaciones de TDAH para adultos programadas dentro de su temporada en Florida.",
        "Atención informada en trauma con video seguro que le acompaña entre residencias.",
        "Estabilización del ánimo con resúmenes enviados a su psiquiatra en su estado de origen.",
        "Planes de resurtido y monitoreo pensados para los meses fuera de Florida.",
      ],
    },
    neighborhoods: {
      en: ['Vanderbilt Beach', 'Pelican Bay', 'Connors at Vanderbilt Beach', 'Baker-Carroll Point', 'Regatta', 'The Dunes', 'Naples Park (north)'],
      es: ['Vanderbilt Beach', 'Pelican Bay', 'Connors at Vanderbilt Beach', 'Baker-Carroll Point', 'Regatta', 'The Dunes', 'Naples Park (norte)'],
    },
    localContext: {
      en: "About 44.6% of housing in Vanderbilt Beach (ZIP 34108) is seasonal, so many of our patients here split the year between Naples and a home up north. Our Park Shore office is a 10–15 minute drive down US-41, and we build each plan around snowbird continuity — an in-person evaluation in season, then secure telehealth and written summaries sent to your home-state provider.",
      es: "Cerca del 44.6% de la vivienda en Vanderbilt Beach (ZIP 34108) es estacional, por lo que muchos de nuestros pacientes dividen el año entre Naples y otra casa en el norte. Nuestra oficina de Park Shore queda a 10–15 minutos por US-41, y diseñamos cada plan para la continuidad del snowbird — una evaluación en persona en temporada y luego telesalud segura con resúmenes enviados a su proveedor de origen.",
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
        en: 'Psychiatrist Serving Estero, FL — Naples Office Off I-75 Exit 123 | Healing Minds',
        es: 'Psiquiatra para Estero, FL — Oficina en Naples cerca del Exit 123 de la I-75 | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Estero (ZIP 33928) — about 25–30 minutes via I-75 south to Exit 116/Pine Ridge, then US-41. Bilingual care, medication management and telehealth for the 65+ majority and the working families of Estero's planned communities.",
        es: "Atención psiquiátrica para Estero (ZIP 33928) — unos 25–30 minutos por I-75 sur hasta el Exit 116/Pine Ridge y luego US-41. Atención bilingüe, manejo de medicamentos y telesalud para la mayoría 65+ y las familias trabajadoras de Estero.",
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
      en: "Estero (ZIP 33928) is a Lee County village of roughly 39,000 residents, about 51.9% of whom are 65 or older. Daily life here is shaped by dozens of planned communities — Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club and Miromar Lakes among them — and by Coconut Point as the main commercial hub. Most of our Estero patients reach our Park Shore office via I-75 south to Exit 116 (Pine Ridge Rd) in 25–30 minutes for an in-person evaluation, then continue with secure telehealth visits so the drive isn't required every time.",
      es: "Estero (ZIP 33928) es un poblado del condado de Lee con cerca de 39,000 residentes, de los cuales aproximadamente el 51.9% tiene 65 años o más. La vida diaria está marcada por decenas de comunidades planificadas — Pelican Sound, Grandezza, the Brooks, Wildcat Run, West Bay Club y Miromar Lakes entre ellas — y por Coconut Point como centro comercial principal. La mayoría de nuestros pacientes de Estero llegan a Park Shore por I-75 sur hasta el Exit 116 (Pine Ridge Rd) en 25–30 minutos para la evaluación inicial, y continúan con telesalud segura para evitar el viaje en cada consulta.",
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
        "Take I-75 south from Estero (Exit 123 Corkscrew Rd or Exit 128 Alico Rd entrance)",
        "Continue ~17 miles into Collier County",
        "Take Exit 116 onto Pine Ridge Rd west toward US-41",
        "Turn left (south) on US-41 to 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Tome la I-75 al sur desde Estero (Exit 123 Corkscrew Rd o Exit 128 Alico Rd)",
        "Continúe ~17 millas hasta el condado de Collier",
        "Tome el Exit 116 hacia Pine Ridge Rd al oeste hasta US-41",
        "Gire a la izquierda (sur) en US-41 hasta 4760 Tamiami Trl N #25 en Park Shore",
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
      en: "Bilingual psychiatric care for Fort Myers — about 40–45 minutes south on I-75 for the first visit, with telehealth for follow-ups.",
      es: "Atención psiquiátrica bilingüe para Fort Myers — unos 40–45 minutos al sur por I-75 para la primera visita, y telesalud para seguimientos.",
    },
    healingParagraph: {
      en: "The Fort Myers / Lee County metro has roughly 975,000 residents — younger and more diverse than Naples, with a median age near 49 and about 17.9% foreign-born. Many of our Fort Myers patients drive about 40–45 minutes south on I-75 to our Park Shore office for an in-person evaluation, then switch to secure telehealth for ongoing visits. Bilingual care (English/Spanish), structured medication management and clear written records make the longer initial drive worthwhile.",
      es: "El área metropolitana de Fort Myers / condado de Lee tiene aproximadamente 975,000 habitantes — más joven y diversa que Naples, con edad mediana cerca de 49 y alrededor de 17.9% nacidos en el extranjero. Muchos de nuestros pacientes de Fort Myers conducen 40–45 minutos al sur por I-75 hasta Park Shore para una evaluación inicial, y luego pasan a telesalud segura para visitas continuas. Atención bilingüe (inglés/español), manejo estructurado de medicamentos y registros claros hacen que el primer trayecto valga la pena.",
    },
    servicesIntro: {
      en: "These are the services our Fort Myers patients ask about most — typically combining one in-person visit with ongoing telehealth follow-up.",
      es: "Estos son los servicios que más nos consultan los pacientes de Fort Myers — usualmente una visita en persona combinada con seguimiento por telesalud.",
    },
    routeIntro: {
      en: "From Fort Myers our Park Shore office is about 40–45 minutes south on I-75. We typically suggest scheduling the first visit mid-morning to avoid peak traffic.",
      es: "Desde Fort Myers, nuestra oficina de Park Shore queda a unos 40–45 minutos al sur por I-75. Sugerimos programar la primera visita a media mañana para evitar tráfico.",
    },
    routeSteps: {
      en: [
        "Take I-75 south from Fort Myers",
        "Continue ~30 miles into Collier County",
        "Take Exit 116 onto Pine Ridge Rd west toward US-41",
        "Turn left (south) on US-41 to 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Tome la I-75 al sur desde Fort Myers",
        "Continúe ~30 millas hacia el condado de Collier",
        "Tome el Exit 116 a Pine Ridge Rd al oeste hasta US-41",
        "Gire a la izquierda (sur) en US-41 hasta 4760 Tamiami Trl N #25 en Park Shore",
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
        "Comprehensive plans combining one in-person visit with ongoing telehealth.",
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
      en: "The Fort Myers / Lee County metro has roughly 975,000 residents — younger and more diverse than Naples, with about 17.9% foreign-born. Many patients make one 40–45 minute drive south on I-75 for an in-person evaluation, then switch to secure telehealth for ongoing visits, with bilingual care and written records throughout.",
      es: "El área metropolitana de Fort Myers / condado de Lee tiene aproximadamente 975,000 habitantes — más joven y diversa que Naples, con cerca del 17.9% nacidos en el extranjero. Muchos pacientes hacen un viaje de 40–45 minutos al sur por I-75 para la evaluación inicial y luego pasan a telesalud segura para visitas continuas, con atención bilingüe y registros escritos en todo momento.",
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
      en: "Marco Island (ZIP 34145) has a permanent population near 16,600 that nearly doubles in winter, a median age close to 67.7 and an 89.9% homeownership rate. The drive to our Park Shore office is straightforward — north on Collier Blvd (CR-951), across the Jolley Bridge and onto US-41 — typically 25 to 30 minutes. We design care around the bridge: a thorough first evaluation in person, then secure telehealth for medication management and follow-ups so most visits don't require leaving the island.",
      es: "Marco Island (ZIP 34145) tiene una población permanente cerca de 16,600 que casi se duplica en invierno, edad mediana cerca de 67.7 y un 89.9% de propietarios. El trayecto a nuestra oficina de Park Shore es directo — al norte por Collier Blvd (CR-951), cruzando el puente Jolley y subiendo por US-41 — usualmente 25 a 30 minutos. Diseñamos la atención teniendo en cuenta el puente: una primera evaluación cuidadosa en persona y luego telesalud segura para manejo de medicamentos y seguimientos, evitando salir de la isla en la mayoría de visitas.",
    },
    servicesIntro: {
      en: "These are the services our Marco Island patients use most — combining a careful first visit on the mainland with telehealth that keeps you on the island the rest of the time.",
      es: "Estos son los servicios que más usan nuestros pacientes de Marco Island — combinando una primera visita cuidadosa en tierra firme con telesalud que le permite quedarse en la isla el resto del tiempo.",
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
      en: "Marco Island (ZIP 34145) has a permanent population near 16,600 that nearly doubles in winter, with a median age close to 67.7. Because reaching our Park Shore office means Collier Blvd and the Jolley Bridge (25–30 minutes), we design care around the bridge — a thorough first evaluation in person, then secure telehealth that keeps most visits on the island.",
      es: "Marco Island (ZIP 34145) tiene una población permanente cerca de 16,600 que casi se duplica en invierno, con edad mediana cercana a 67.7. Como llegar a nuestra oficina de Park Shore implica Collier Blvd y el puente Jolley (25–30 minutos), diseñamos la atención teniendo en cuenta el puente — una primera evaluación cuidadosa en persona y luego telesalud segura que mantiene la mayoría de las visitas en la isla.",
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
        en: "Bilingual psychiatric care for Golden Gate (ZIP 34116) — a community of roughly 28,000–34,000 with a young median age (about 35.4), where approximately 58.9% of residents identify as Hispanic and 79.6% of households speak Spanish at home. Dr. Melva Reve, fluent in Spanish, treats anxiety, depression, ADHD in adults and adolescents, PTSD, bipolar disorder and manages psychiatric medications.",
        es: "Atención psiquiátrica bilingüe para Golden Gate (ZIP 34116) — comunidad de aproximadamente 28,000 a 34,000 habitantes con edad mediana joven (cerca de 35.4), donde aproximadamente el 58.9% se identifica como hispano y el 79.6% de los hogares habla español en casa. La Dra. Melva Reve, fluida en español, trata ansiedad, depresión, TDAH en adultos y adolescentes, TEPT, trastorno bipolar y maneja medicamentos psiquiátricos.",
      },
    },
    heroDescription: {
      en: "Bilingual (English/Spanish) psychiatric care for Golden Gate families — a 12–15 minute drive to our Park Shore office on US-41.",
      es: "Atención psiquiátrica bilingüe (inglés/español) para familias de Golden Gate — 12–15 minutos hasta nuestra oficina de Park Shore sobre US-41.",
    },
    healingParagraph: {
      en: "Golden Gate (ZIP 34116) is a young, working-family community of roughly 28,000–34,000 residents — median age around 35.4, with about 58.9% of residents identifying as Hispanic and roughly 79.6% of households speaking Spanish at home. Sessions with Dr. Reve can be conducted entirely in Spanish, including for ADHD evaluations, postpartum care, anxiety and depression, and we are used to coordinating with Collier County Public Schools when teens are involved. Our Park Shore office is a 12–15 minute drive via Golden Gate Pkwy and US-41.",
      es: "Golden Gate (ZIP 34116) es una comunidad joven de familias trabajadoras con aproximadamente 28,000 a 34,000 residentes — edad mediana alrededor de 35.4, con cerca del 58.9% identificándose como hispanos y aproximadamente el 79.6% de los hogares hablando español en casa. Las sesiones con la Dra. Reve pueden realizarse completamente en español, incluyendo evaluaciones de TDAH, atención postparto, ansiedad y depresión, y estamos acostumbrados a coordinar con las escuelas públicas del condado de Collier cuando hay adolescentes involucrados. Nuestra oficina de Park Shore queda a 12–15 minutos por Golden Gate Pkwy y US-41.",
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
      en: "Serving Golden Gate (ZIP 34116) with fully bilingual psychiatric care — sessions in Spanish, school-coordinated teen care, and telehealth between visits. Call (239) 423-0272.",
      es: "Atendiendo a Golden Gate (ZIP 34116) con atención psiquiátrica completamente bilingüe — sesiones en español, atención coordinada con escuelas para adolescentes, y telesalud entre visitas. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Sessions in Spanish', es: 'Sesiones en Español' },
      { en: 'School-Coordinated Teen Care', es: 'Atención Coordinada con Escuelas' },
      { en: '12-15 Min via US-41', es: '12-15 Min por US-41' },
      { en: 'Family-Focused Care', es: 'Atención Centrada en la Familia' },
      { en: 'Telehealth Available', es: 'Telesalud Disponible' },
      { en: 'Most Major Insurance', es: 'Mayoría de Seguros' },
    ],
    serviceNotes: {
      en: [
        "Delivered entirely in Spanish when preferred, including postpartum anxiety.",
        "Care for working Golden Gate families, in Spanish or English.",
        "Evaluations for adults and adolescents, coordinated with Collier County schools.",
        "Trauma-informed, culturally sensitive care for Golden Gate's Hispanic community.",
        "Long-term mood stabilization, with sessions available in Spanish.",
        "Medication management in person or by telehealth, just 12–15 minutes away.",
      ],
      es: [
        "Ofrecida completamente en español cuando se prefiere, incluida la ansiedad postparto.",
        "Atención para familias trabajadoras de Golden Gate, en español o inglés.",
        "Evaluaciones para adultos y adolescentes, coordinadas con las escuelas del condado de Collier.",
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
        en: "Bilingual psychiatric care for Immokalee (ZIP 34142) — Spanish-speaking psychiatrist, evening telehealth options for agricultural workers, and in-person visits at our Park Shore office in Naples.",
        es: "Atención psiquiátrica bilingüe para Immokalee (ZIP 34142) — psiquiatra que habla español, opciones de telesalud por la tarde para trabajadores del campo, y visitas presenciales en Park Shore, Naples.",
      },
      keywords: {
        en: 'psychiatrist Immokalee FL, bilingual mental health Immokalee, Spanish psychiatrist 34142, agricultural worker mental health Collier',
        es: 'psiquiatra Immokalee FL, salud mental bilingüe Immokalee, psiquiatra en español 34142, salud mental trabajadores agrícolas Collier',
      },
      serviceDescription: {
        en: "Bilingual psychiatric care for Immokalee (ZIP 34142), a community of roughly 25,000 in eastern Collier County where about 73.2% of residents identify as Hispanic and roughly 21.9% as Black, with a median age near 30 and a sizable agricultural workforce. Dr. Melva Reve, fluent in Spanish, offers evaluation and treatment for anxiety, depression, PTSD, ADHD, bipolar disorder and medication management, with telehealth scheduled around field hours.",
        es: "Atención psiquiátrica bilingüe para Immokalee (ZIP 34142), comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier donde cerca del 73.2% se identifica como hispano y aproximadamente el 21.9% como afroamericano, con edad mediana cerca de 30 y una fuerza laboral agrícola importante. La Dra. Melva Reve, fluida en español, ofrece evaluación y tratamiento para ansiedad, depresión, TEPT, TDAH, trastorno bipolar y manejo de medicamentos, con telesalud programada según los horarios de trabajo en el campo.",
      },
    },
    heroDescription: {
      en: "Bilingual psychiatric care for Immokalee — Spanish-speaking sessions, telehealth that fits around field hours, and in-person visits at our Naples office.",
      es: "Atención psiquiátrica bilingüe para Immokalee — sesiones en español, telesalud adaptada a horarios del campo, y visitas presenciales en nuestra oficina de Naples.",
    },
    healingParagraph: {
      en: "Immokalee (ZIP 34142) is a community of roughly 25,000 in eastern Collier County where about 73.2% of residents identify as Hispanic, around 21.9% as Black, and the median age is near 30. The local agricultural economy — Immokalee tomato production accounts for roughly 90% of US winter tomatoes — sets the rhythm of family life. We schedule sessions in Spanish, offer telehealth for evenings and weekends so workers don't lose a day in the fields for a follow-up, and reserve in-person visits at our Park Shore office (about 50–60 minutes via CR-846) for the initial evaluation when possible.",
      es: "Immokalee (ZIP 34142) es una comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier donde cerca del 73.2% se identifica como hispano, alrededor del 21.9% como afroamericano, y la edad mediana es cercana a 30. La economía agrícola local — Immokalee produce aproximadamente el 90% de los tomates de invierno de EE.UU. — marca el ritmo familiar. Programamos sesiones en español, ofrecemos telesalud por las tardes y fines de semana para que los trabajadores no pierdan un día en el campo por un seguimiento, y reservamos las visitas presenciales en Park Shore (aproximadamente 50–60 minutos por CR-846) para la evaluación inicial cuando es posible.",
    },
    servicesIntro: {
      en: "These are the services our Immokalee patients ask about most — in Spanish or English, by telehealth when getting time off work is hard, in person when it isn't.",
      es: "Estos son los servicios que más nos consultan los pacientes de Immokalee — en español o inglés, por telesalud cuando es difícil pedir tiempo libre, en persona cuando no lo es.",
    },
    routeIntro: {
      en: "From Immokalee our Park Shore office is about 50–60 minutes west via CR-846 (Immokalee Rd) — a long drive, which is why we lean heavily on telehealth between visits.",
      es: "Desde Immokalee, nuestra oficina de Park Shore queda a 50–60 minutos al oeste por CR-846 (Immokalee Rd) — un trayecto largo, por lo que usamos telesalud entre visitas siempre que se pueda.",
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
      en: "Serving Immokalee (ZIP 34142) with bilingual psychiatric care designed around the realities of agricultural work — Spanish-language sessions, evening telehealth and a single longer in-person visit when needed. Call (239) 423-0272.",
      es: "Atendiendo a Immokalee (ZIP 34142) con atención psiquiátrica bilingüe diseñada para la realidad del trabajo agrícola — sesiones en español, telesalud por la tarde y una sola visita presencial más larga cuando se necesite. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'Sessions in Spanish', es: 'Sesiones en Español' },
      { en: 'Evening & Weekend Telehealth', es: 'Telesalud Tarde y Fines de Semana' },
      { en: 'Scheduled Around Field Hours', es: 'Adaptada a Horarios del Campo' },
      { en: 'One In-Person Visit', es: 'Una Visita en Persona' },
      { en: 'Culturally Sensitive Care', es: 'Atención Culturalmente Sensible' },
      { en: 'Most Major Insurance', es: 'Mayoría de Seguros' },
    ],
    serviceNotes: {
      en: [
        "Offered in Spanish, with evening telehealth so you don't lose a day in the fields.",
        "Care for Immokalee's young, hardworking agricultural community.",
        "Adult and adolescent evaluations scheduled around the harvest calendar.",
        "Trauma-informed, confidential care in Spanish, by secure video when needed.",
        "Long-term mood stabilization with telehealth between the longer in-person visits.",
        "Refills sent to your Immokalee pharmacy, with evening follow-ups by video.",
      ],
      es: [
        "Ofrecida en español, con telesalud por la tarde para no perder un día en el campo.",
        "Atención para la joven y trabajadora comunidad agrícola de Immokalee.",
        "Evaluaciones para adultos y adolescentes programadas según el calendario de cosecha.",
        "Atención confidencial e informada en trauma en español, por video seguro cuando se necesite.",
        "Estabilización del ánimo a largo plazo con telesalud entre las visitas presenciales más largas.",
        "Resurtidos enviados a su farmacia de Immokalee, con seguimientos por video por la tarde.",
      ],
    },
    neighborhoods: {
      en: ['Downtown Immokalee', 'Main St (SR-29) corridor', 'Lake Trafford', 'Farm Worker Village', 'Eden Park', 'Carson Rd area'],
      es: ['Centro de Immokalee', 'corredor de Main St (SR-29)', 'Lake Trafford', 'Farm Worker Village', 'Eden Park', 'área de Carson Rd'],
    },
    localContext: {
      en: "Immokalee (ZIP 34142) is a community of roughly 25,000 in eastern Collier County where about 73.2% of residents identify as Hispanic and the median age is near 30. With a large agricultural workforce setting the rhythm of family life, we schedule Spanish-language sessions and evening or weekend telehealth so workers don't lose a day in the fields — reserving the 50–60 minute drive via CR-846 for the initial evaluation when possible.",
      es: "Immokalee (ZIP 34142) es una comunidad de aproximadamente 25,000 habitantes en el este del condado de Collier donde cerca del 73.2% se identifica como hispano y la edad mediana es cercana a 30. Con una gran fuerza laboral agrícola marcando el ritmo familiar, programamos sesiones en español y telesalud por la tarde o los fines de semana para que los trabajadores no pierdan un día en el campo — reservando el viaje de 50–60 minutos por CR-846 para la evaluación inicial cuando es posible.",
    },
  },

  aveMaria: {
    seo: {
      title: {
        en: 'Psychiatrist Serving Ave Maria, FL — Care for University Families | Healing Minds',
        es: 'Psiquiatra para Ave Maria, FL — Atención para Familias Universitarias | Healing Minds',
      },
      description: {
        en: "Psychiatric care for Ave Maria, FL — a planned community of roughly 7,500 around Ave Maria University. Bilingual telehealth and in-person visits at our Naples office, ~50–60 minutes west via Oil Well Rd and I-75.",
        es: "Atención psiquiátrica para Ave Maria, FL — comunidad planificada de cerca de 7,500 habitantes alrededor de Ave Maria University. Telesalud bilingüe y visitas presenciales en Naples, ~50–60 minutos al oeste por Oil Well Rd y la I-75.",
      },
      keywords: {
        en: 'psychiatrist Ave Maria FL, Ave Maria University mental health, college student psychiatrist Naples, family psychiatry Ave Maria',
        es: 'psiquiatra Ave Maria FL, salud mental Ave Maria University, psiquiatra estudiantes universitarios Naples, psiquiatría familias Ave Maria',
      },
      serviceDescription: {
        en: "Psychiatric care for Ave Maria, a planned community of roughly 7,500 founded in 2005 around Ave Maria University in eastern Collier County. Dr. Melva Reve provides bilingual evaluation and treatment for college-age anxiety and depression, ADHD, postpartum and family-stage care, PTSD and medication management — with telehealth that fits the academic calendar.",
        es: "Atención psiquiátrica para Ave Maria, comunidad planificada de aproximadamente 7,500 habitantes fundada en 2005 alrededor de Ave Maria University en el este del condado de Collier. La Dra. Melva Reve ofrece evaluación y tratamiento bilingüe para ansiedad y depresión universitarias, TDAH, atención postparto y de etapa familiar, TEPT y manejo de medicamentos — con telesalud adaptada al calendario académico.",
      },
    },
    heroDescription: {
      en: "Psychiatric care for Ave Maria — bilingual support for university students and young families, in person in Naples or by secure telehealth.",
      es: "Atención psiquiátrica para Ave Maria — apoyo bilingüe para estudiantes universitarios y familias jóvenes, en persona en Naples o por telesalud segura.",
    },
    healingParagraph: {
      en: "Ave Maria is a planned community of roughly 7,500 in eastern Collier County, founded in 2005 around Ave Maria University. The town profile skews young — university students, faculty families, and a high share of growing families with school-age children. We offer bilingual sessions, careful ADHD evaluations and college-age anxiety and depression care, with telehealth that respects exam weeks and academic breaks. The drive to our Park Shore office is about 50–60 minutes via Oil Well Rd and I-75, so most ongoing care happens by secure video.",
      es: "Ave Maria es una comunidad planificada de aproximadamente 7,500 habitantes en el este del condado de Collier, fundada en 2005 alrededor de Ave Maria University. El perfil del pueblo es joven — estudiantes universitarios, familias del profesorado y una proporción alta de familias en crecimiento con niños en edad escolar. Ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria, con telesalud que respeta semanas de exámenes y recesos académicos. El trayecto a Park Shore es de aproximadamente 50–60 minutos por Oil Well Rd y la I-75, por lo que la mayor parte del seguimiento es por video seguro.",
    },
    servicesIntro: {
      en: "These are the services Ave Maria families and students ask about most — anxiety and depression, ADHD evaluation, medication management, and care that fits the academic calendar.",
      es: "Estos son los servicios que más nos consultan familias y estudiantes de Ave Maria — ansiedad y depresión, evaluación de TDAH, manejo de medicamentos y atención adaptada al calendario académico.",
    },
    routeIntro: {
      en: "From Ave Maria our Park Shore office is about 50–60 minutes west via Oil Well Rd and I-75. Most ongoing care happens by telehealth.",
      es: "Desde Ave Maria, nuestra oficina queda a 50–60 minutos al oeste por Oil Well Rd y la I-75. La mayor parte del seguimiento se hace por telesalud.",
    },
    routeSteps: {
      en: [
        "Head west on Oil Well Rd (CR-858) from Ave Maria",
        "Continue ~16 miles to I-75 at Exit 111 (Immokalee Rd)",
        "Take I-75 south briefly, then exit onto Pine Ridge Rd west (Exit 116)",
        "Turn left (south) on US-41 to 4760 Tamiami Trl N #25 in Park Shore",
      ],
      es: [
        "Diríjase al oeste por Oil Well Rd (CR-858) desde Ave Maria",
        "Continúe ~16 millas hasta la I-75 en el Exit 111 (Immokalee Rd)",
        "Tome la I-75 al sur brevemente, luego salga en Pine Ridge Rd al oeste (Exit 116)",
        "Gire a la izquierda (sur) en US-41 hasta 4760 Tamiami Trl N #25 en Park Shore",
      ],
    },
    duration: { en: '50-60 minutes', es: '50-60 minutos' },
    bottomNote: {
      en: "Serving Ave Maria with care that fits university and family life — bilingual sessions, telehealth that respects the academic calendar, and an in-person Park Shore office when an extended visit is needed. Call (239) 423-0272.",
      es: "Atendiendo a Ave Maria con atención adaptada a la vida universitaria y familiar — sesiones bilingües, telesalud que respeta el calendario académico, y oficina presencial en Park Shore cuando se necesita una visita extendida. (239) 423-0272.",
    },
    featureBadges: [
      { en: 'University-Family Focus', es: 'Enfoque Universitario y Familiar' },
      { en: 'Fits the Academic Calendar', es: 'Adaptada al Calendario Académico' },
      { en: 'Telehealth-First Care', es: 'Atención por Telesalud' },
      { en: 'Bilingual (EN/ES)', es: 'Bilingüe (EN/ES)' },
      { en: 'College-Age Care', es: 'Atención para Edad Universitaria' },
      { en: 'ADHD Evaluations', es: 'Evaluaciones de TDAH' },
    ],
    serviceNotes: {
      en: [
        "College-age anxiety care with telehealth that respects exam weeks.",
        "Support for university students, faculty families and young parents.",
        "Careful adult ADHD evaluations — a frequent request from Ave Maria students.",
        "Trauma-informed care by secure video that fits academic schedules.",
        "Long-term mood stabilization that continues through academic breaks.",
        "Medication management mostly by telehealth, with a Naples visit when needed.",
      ],
      es: [
        "Atención de ansiedad universitaria con telesalud que respeta las semanas de exámenes.",
        "Apoyo para estudiantes universitarios, familias del profesorado y padres jóvenes.",
        "Evaluaciones cuidadosas de TDAH para adultos — una solicitud frecuente de estudiantes de Ave Maria.",
        "Atención informada en trauma por video seguro que se adapta a horarios académicos.",
        "Estabilización del ánimo a largo plazo que continúa durante los recesos académicos.",
        "Manejo de medicamentos principalmente por telesalud, con una visita a Naples cuando se necesite.",
      ],
    },
    neighborhoods: {
      en: ['Ave Maria University', 'Maple Ridge', 'Del Webb Naples', 'La Piazza / Town Center', 'Avalon Park', 'Coquina at Maple Ridge', 'Emerson Park'],
      es: ['Ave Maria University', 'Maple Ridge', 'Del Webb Naples', 'La Piazza / Town Center', 'Avalon Park', 'Coquina at Maple Ridge', 'Emerson Park'],
    },
    localContext: {
      en: "Ave Maria is a planned community of roughly 7,500 in eastern Collier County, founded in 2005 around Ave Maria University. With a young profile of students, faculty families and growing families, we offer bilingual sessions, careful ADHD evaluations, and college-age anxiety and depression care — with telehealth that respects the academic calendar, since the drive to Park Shore runs about 50–60 minutes via Oil Well Rd and I-75.",
      es: "Ave Maria es una comunidad planificada de aproximadamente 7,500 habitantes en el este del condado de Collier, fundada en 2005 alrededor de Ave Maria University. Con un perfil joven de estudiantes, familias del profesorado y familias en crecimiento, ofrecemos sesiones bilingües, evaluaciones cuidadosas de TDAH y atención de ansiedad y depresión en edad universitaria — con telesalud que respeta el calendario académico, ya que el viaje a Park Shore es de unos 50–60 minutos por Oil Well Rd y la I-75.",
    },
  },
};
