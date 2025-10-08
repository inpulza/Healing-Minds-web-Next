import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { VideoIcon, Shield, Clock, Users, CheckCircle, MapPin, Monitor, ArrowRight } from 'lucide-react';
import InsuranceLogos from '@/components/InsuranceLogos';
import LocationFAQ from '@/components/LocationFAQ';
import WellnessIcon from '@/components/WellnessIcon';

const TelepsychiatryFlorida = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Telepsychiatry Florida | Online Psychiatrist (Bilingual) | Healing Minds'
        : 'Telepsiquiatría Florida | Psiquiatra Online (Bilingüe) | Healing Minds',
      description: language === 'en'
        ? 'Access a board-certified psychiatrist from anywhere in Florida. Dr. Melva Reve offers expert telepsychiatry for anxiety, depression & ADHD. Secure & confidential. Book online.'
        : 'Acceda a una psiquiatra certificada desde cualquier lugar de Florida. La Dra. Melva Reve ofrece telepsiquiatría experta para ansiedad, depresión y TDAH. Segura y confidencial. Reserve en línea.',
      keywords: language === 'en'
        ? 'telepsychiatry Florida, online psychiatrist Florida, telehealth psychiatry FL, virtual psychiatrist Florida, telepsiquiatria Florida'
        : 'telepsiquiatría Florida, psiquiatra online Florida, telepsiquiatría FL, psiquiatra virtual Florida',
      lang: language,
      canonical: language === 'en' ? '/telepsychiatry-florida' : '/es/telepsiquiatria-florida'
    };
    updateSEO(seoData);
  }, [language]);

  const content = {
    en: {
      hero: {
        title: "Expert Psychiatric Care from Anywhere in Florida",
        subtitle: "Receive medication management and confidential consultations with Dr. Melva Reve, board-certified psychiatrist, through our secure Telepsychiatry service.",
        description: "At Healing Minds Psychiatry, we believe that access to exceptional mental health care should have no boundaries. Our Telepsychiatry (Telehealth) service eliminates distance and time barriers, connecting you with Dr. Melva Reve from the comfort and privacy of your home, wherever you are in Florida.",
        ctaPrimary: "Schedule Virtual Appointment Now",
        ctaSecondary: "Call for Information: (239) 423-0272"
      },
      benefits: {
        title: "The Benefits of Telepsychiatry",
        description: "Our virtual care service is designed with you in mind, offering a combination of convenience, privacy, and access to expert care.",
        items: [
          {
            icon: MapPin,
            title: "Direct Access to an Expert, Without Barriers",
            description: "Whether you live in Miami, Orlando, Tampa, or a rural community, our Telehealth service gives you direct access to a board-certified psychiatrist with over 15 years of experience, without the need to search for a local provider."
          },
          {
            icon: Clock,
            title: "Maximum Convenience and Time Savings",
            description: "Eliminate the stress of traffic, long wait times, and the need to take time off work or leave home. Our virtual appointments fit your schedule, allowing you to receive the care you need efficiently."
          },
          {
            icon: Shield,
            title: "Absolute Privacy and Comfort",
            description: "Receive care in a space where you feel completely safe and comfortable: your own home. Telepsychiatry consultations offer a level of privacy that many patients prefer."
          },
          {
            icon: Users,
            title: "Continuity of Care",
            description: "Ideal for seasonal residents (\"snowbirds\"), college students, or anyone traveling within Florida. Telepsychiatry ensures your treatment is never interrupted, no matter where you are."
          }
        ]
      },
      process: {
        title: "Our Process: Simple, Secure, and Centered on You",
        description: "Getting started with telepsychiatry is a simple and straightforward process.",
        steps: [
          {
            number: "1",
            title: "Easy Contact and Scheduling",
            description: "Call us or use our online booking portal to schedule your first Telehealth consultation. Our team will guide you through the initial forms digitally."
          },
          {
            number: "2",
            title: "Confirmation and Secure Link",
            description: "You will receive a confirmation email with a unique and secure link for your video session. Our platform is completely private and HIPAA compliant."
          },
          {
            number: "3",
            title: "Your Confidential Consultation with Dr. Reve",
            description: "At your appointment time, simply click the link from your smartphone, tablet, or computer. You'll have your complete psychiatric evaluation or follow-up appointment directly with Dr. Reve, in English or Spanish."
          }
        ]
      },
      services: {
        title: "Complete Psychiatry Services via Telemedicine",
        description: "Our virtual platform allows us to offer our full range of diagnostic and medication management services for adults (18+).",
        subtitle: "All our telepsychiatry services are available completely in Spanish or English, ensuring clear communication and culturally sensitive care.",
        list: [
          "Initial Psychiatric Evaluation: A comprehensive consultation to establish an accurate diagnosis.",
          "Medication Management for Anxiety and Depression: Expert treatment and follow-up for these conditions.",
          "ADHD Treatment: Evaluation and medication management for ADHD in adults.",
          "Care for Bipolar Disorder and PTSD: Continuous follow-up for complex conditions.",
          "Follow-up Consultations and Prescription Renewals: Efficient appointments to ensure continuity of your treatment. Prescriptions are sent electronically to your pharmacy of choice anywhere in Florida."
        ]
      },
      platform: {
        title: "A Secure Platform You Can Trust",
        description: "The confidentiality of your information is our top priority. At Healing Minds Psychiatry, we use the leading CharmHealth platform, a fully secure electronic health records (EHR) and telemedicine system. All your communications, records, and video sessions are encrypted and comply with the strictest HIPAA privacy regulations."
      },
      doctor: {
        title: "Meet Your Virtual Psychiatrist: Dr. Melva Reve",
        description: "When you schedule a Telehealth appointment, you're not talking to a random provider. You're connecting directly with Dr. Melva Reve, a board-certified psychiatrist with over 15 years of experience. Her compassionate and bilingual approach, combined with her expertise in psychiatric medicine, ensures you receive the highest standard of care, regardless of distance."
      },
      cta: {
        title: "Ready to Take the First Step?",
        description: "Quality mental health care is just a click away.",
        button: "Schedule My Virtual Appointment"
      }
    },
    es: {
      hero: {
        title: "Atención Psiquiátrica Experta desde Cualquier Lugar de Florida",
        subtitle: "Reciba manejo de medicamentos y consultas confidenciales con la Dra. Melva Reve, psiquiatra certificada, a través de nuestro servicio seguro de Telepsiquiatría.",
        description: "En Healing Minds Psychiatry, creemos que el acceso a un cuidado de salud mental excepcional no debería tener fronteras. Nuestro servicio de Telepsiquiatría (Telehealth) elimina las barreras de la distancia y el tiempo, conectándote con la Dra. Melva Reve desde la comodidad y privacidad de tu hogar, estés donde estés en Florida.",
        ctaPrimary: "Agendar Cita Virtual Ahora",
        ctaSecondary: "Llamar para Información: (239) 423-0272"
      },
      benefits: {
        title: "Los Beneficios de la Telepsiquiatría",
        description: "Nuestro servicio de atención virtual está diseñado pensando en ti, ofreciendo una combinación de conveniencia, privacidad y acceso a cuidado experto.",
        items: [
          {
            icon: MapPin,
            title: "Acceso Directo a un Experto, Sin Barreras",
            description: "No importa si vives en Miami, Orlando, Tampa o en una comunidad rural. Nuestro servicio de Telehealth te da acceso directo a una psiquiatra certificada con más de 15 años de experiencia, sin necesidad de buscar un proveedor local."
          },
          {
            icon: Clock,
            title: "Máxima Conveniencia y Ahorro de Tiempo",
            description: "Elimina el estrés del tráfico, los largos tiempos de espera y la necesidad de ausentarte del trabajo o de casa. Nuestras citas virtuales se adaptan a tu agenda, permitiéndote recibir la atención que necesitas de manera eficiente."
          },
          {
            icon: Shield,
            title: "Privacidad y Comodidad Absolutas",
            description: "Recibe atención en un espacio donde te sientas completamente seguro y cómodo: tu propio hogar. Las consultas de telepsiquiatría ofrecen un nivel de privacidad que muchos pacientes prefieren."
          },
          {
            icon: Users,
            title: "Continuidad de la Atención",
            description: "Ideal para residentes estacionales (\"snowbirds\"), estudiantes universitarios o cualquier persona que viaje dentro de Florida. La telepsiquiatría asegura que tu tratamiento nunca se interrumpa, sin importar dónde te encuentres."
          }
        ]
      },
      process: {
        title: "Nuestro Proceso: Simple, Seguro y Centrado en Ti",
        description: "Comenzar con la telepsiquiatría es un proceso sencillo y directo.",
        steps: [
          {
            number: "1",
            title: "Contacto y Programación Sencillos",
            description: "Llámanos o utiliza nuestro portal de reservas en línea para programar tu primera consulta de Telehealth. Nuestro equipo te guiará a través de los formularios iniciales de manera digital."
          },
          {
            number: "2",
            title: "Confirmación y Enlace Seguro",
            description: "Recibirás un correo electrónico de confirmación con un enlace único y seguro para tu sesión de video. Nuestra plataforma es completamente privada y compatible con las regulaciones de HIPAA."
          },
          {
            number: "3",
            title: "Tu Consulta Confidencial con la Dra. Reve",
            description: "A la hora de tu cita, simplemente haz clic en el enlace desde tu smartphone, tablet o computadora. Tendrás tu evaluación psiquiátrica completa o tu cita de seguimiento directamente con la Dra. Reve, en inglés o español."
          }
        ]
      },
      services: {
        title: "Servicios Completos de Psiquiatría a través de Telemedicina",
        description: "Nuestra plataforma virtual nos permite ofrecer nuestra gama completa de servicios de diagnóstico y manejo de medicamentos para adultos (18+).",
        subtitle: "Todos nuestros servicios de telepsiquiatría están disponibles completamente en español o inglés, garantizando una comunicación clara y una atención culturalmente sensible.",
        list: [
          "Evaluación Psiquiátrica Inicial: Una consulta integral para establecer un diagnóstico preciso.",
          "Manejo de Medicamentos para Ansiedad y Depresión: Tratamiento y seguimiento experto para estas condiciones.",
          "Tratamiento de TDAH: Evaluación y manejo de medicación para el TDAH en adultos.",
          "Cuidado para Trastorno Bipolar y TEPT (PTSD): Seguimiento continuo para condiciones complejas.",
          "Consultas de Seguimiento y Renovación de Recetas: Citas eficientes para asegurar la continuidad de tu tratamiento. Las recetas se envían electrónicamente a tu farmacia de preferencia en cualquier lugar de Florida."
        ]
      },
      platform: {
        title: "Una Plataforma Segura en la que Puedes Confiar",
        description: "La confidencialidad de tu información es nuestra máxima prioridad. En Healing Minds Psychiatry, utilizamos la plataforma líder CharmHealth, un sistema de registros médicos electrónicos (EHR) y telemedicina completamente seguro. Todas tus comunicaciones, registros y sesiones de video están encriptados y cumplen con las más estrictas regulaciones de privacidad de HIPAA."
      },
      doctor: {
        title: "Conozca a su Psiquiatra Virtual: Dra. Melva Reve",
        description: "Cuando agendas una cita de Telehealth, no estás hablando con un proveedor al azar. Estás conectando directamente con la Dra. Melva Reve, una psiquiatra certificada con más de 15 años de experiencia. Su enfoque compasivo y bilingüe, combinado con su pericia en medicina psiquiátrica, asegura que recibas el más alto estándar de atención, sin importar la distancia."
      },
      cta: {
        title: "¿Listo para Dar el Primer Paso?",
        description: "La atención de salud mental de calidad está a solo un clic de distancia.",
        button: "Agendar Mi Cita Virtual"
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <WellnessIcon size="lg" color="blue" className="opacity-80">
                  <VideoIcon />
                </WellnessIcon>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-blue-800" data-testid="telepsychiatry-title">
                  {currentContent.hero.title}
                </h1>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-6 max-w-4xl mx-auto font-body leading-relaxed" data-testid="telepsychiatry-subtitle">
                {currentContent.hero.subtitle}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-8 font-body leading-relaxed" data-testid="telepsychiatry-description">
                {currentContent.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/contact">
                  <Button 
                    className="group inline-flex items-center justify-center gap-2 rounded-full text-lg font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 px-8 py-6"
                    data-testid="button-schedule-virtual"
                  >
                    <VideoIcon className="w-5 h-5" />
                    <span>{currentContent.hero.ctaPrimary}</span>
                  </Button>
                </Link>
                <a href="tel:+12394230272">
                  <Button 
                    variant="outline"
                    className="group inline-flex items-center justify-center gap-2 rounded-full text-lg font-semibold transition-all duration-300 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6"
                    data-testid="button-call-info"
                  >
                    <span>{currentContent.hero.ctaSecondary}</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="benefits-title">
                {currentContent.benefits.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="benefits-description">
                {currentContent.benefits.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentContent.benefits.items.map((benefit, index) => (
                <div key={index} className="bg-blue-50 rounded-2xl p-8 border border-blue-100" data-testid={`benefit-${index}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <WellnessIcon size="md" color="blue">
                        <benefit.icon />
                      </WellnessIcon>
                    </div>
                    <div>
                      <h3 className="text-xl font-body font-bold text-blue-800 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-700 font-body leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="process-title">
                {currentContent.process.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="process-description">
                {currentContent.process.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentContent.process.steps.map((step, index) => (
                <div key={index} className="relative" data-testid={`process-step-${index}`}>
                  <div className="bg-white rounded-2xl p-8 border border-blue-100 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-body font-bold text-blue-800">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < currentContent.process.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="services-title">
                {currentContent.services.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 font-body leading-relaxed" data-testid="services-description">
                {currentContent.services.description}
              </p>
              <p className="text-lg sm:text-xl text-blue-700 font-semibold max-w-3xl mx-auto font-body leading-relaxed" data-testid="services-subtitle">
                {currentContent.services.subtitle}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <ul className="space-y-4">
                  {currentContent.services.list.map((service, index) => (
                    <li key={index} className="flex items-start gap-3" data-testid={`service-${index}`}>
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 font-body leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blue-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <WellnessIcon size="lg" color="blue">
                  <Shield />
                </WellnessIcon>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800" data-testid="platform-title">
                  {currentContent.platform.title}
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed" data-testid="platform-description">
                {currentContent.platform.description}
              </p>
            </div>
          </div>
        </section>

        {/* Doctor Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 rounded-3xl p-8 sm:p-12 border border-blue-100">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-6" data-testid="doctor-title">
                {currentContent.doctor.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed" data-testid="doctor-description">
                {currentContent.doctor.description}
              </p>
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <InsuranceLogos />

        {/* FAQ Section - Will be populated with FAQs */}
        {/* <LocationFAQ locationFAQs={telepsychiatryFAQs} /> */}

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-blue-50 to-blue-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-blue-800 mb-4" data-testid="cta-title">
              {currentContent.cta.title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 font-body leading-relaxed" data-testid="cta-description">
              {currentContent.cta.description}
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="group inline-flex items-center justify-center gap-3 rounded-full text-xl font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 px-12 py-8"
                data-testid="button-schedule-final"
              >
                <VideoIcon className="w-6 h-6" />
                <span>{currentContent.cta.button}</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TelepsychiatryFlorida;
