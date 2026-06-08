import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ServicesSection from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ChevronDown,
  Brain,
  Heart,
  Phone,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

const ServiciosEspanol = () => {
  const { setLanguage } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setLanguage('es');

    const seoData = {
      title: 'Servicios Psiquiátricos en Naples FL — Ansiedad, Depresión, TDAH | Healing Minds',
      description: 'Servicios psiquiátricos integrales en Naples, FL por la Dra. Melva Reve. Tratamiento basado en evidencia para ansiedad, depresión, TDAH, TEPT y trastorno bipolar. Atención bilingüe, presencial y telehealth. Llame (239) 423-0272.',
      keywords: 'servicios psiquiátricos Naples FL, tratamiento ansiedad Naples, tratamiento depresión Naples, tratamiento TDAH Naples, tratamiento TEPT Naples, tratamiento bipolar Naples, manejo medicamentos Naples, psiquiatra bilingüe Naples',
      lang: 'es',
      canonical: '/es/servicios'
    };
    updateSEO(seoData);
  }, [setLanguage]);

  const faqs = [
    {
      q: '¿Qué condiciones psiquiátricas trata Healing Minds?',
      a: 'La Dra. Melva Reve ofrece atención experta para trastornos de ansiedad, depresión, TDAH (en adultos y adolescentes), TEPT, trastorno bipolar y manejo de medicamentos. Cada plan de tratamiento es personalizado según sus síntomas, historial y objetivos.'
    },
    {
      q: '¿Aceptan seguro médico para servicios psiquiátricos?',
      a: 'Sí. Aceptamos la mayoría de los planes de seguro principales, incluyendo Medicare, Aetna, Cigna, BlueCross BlueShield, United Healthcare y otros. También hay tarifas de pago personal y planes de pago flexibles disponibles. Verificamos sus beneficios antes de la primera cita.'
    },
    {
      q: '¿Cuánto dura la primera cita psiquiátrica?',
      a: 'Las consultas iniciales duran 40–60 minutos. Esta evaluación integral cubre su historial de salud mental, síntomas actuales, medicamentos y objetivos de tratamiento. Las citas de seguimiento suelen durar 20–30 minutos.'
    },
    {
      q: '¿Está disponible la telesalud para atención psiquiátrica?',
      a: 'Sí. Healing Minds ofrece citas de telesalud seguras y conformes con HIPAA en toda Florida. La telesalud es especialmente conveniente para citas de seguimiento, manejo de medicamentos y pacientes fuera del área de Naples.'
    },
    {
      q: '¿Ofrecen servicios psiquiátricos en español?',
      a: 'Sí. La Dra. Melva Reve es completamente bilingüe en inglés y español, brindando atención psiquiátrica culturalmente sensible a las comunidades hispanas y latinas de Naples y el suroeste de Florida.'
    },
    {
      q: '¿Qué tan pronto puedo obtener una cita?',
      a: 'Las citas para nuevos pacientes generalmente están disponibles en 1–2 semanas. Puede reservar en línea a través de nuestro sistema de programación o llamar al (239) 423-0272. Los espacios de telesalud suelen tener mayor disponibilidad.'
    }
  ];

  const approach = [
    {
      title: 'Tratamiento Basado en Evidencia',
      description: 'Cada plan de tratamiento está fundamentado en la investigación psiquiátrica más reciente, combinando manejo de medicamentos con enfoques terapéuticos comprobados para su condición específica.'
    },
    {
      title: 'Planes de Atención Personalizados',
      description: 'No hay dos pacientes iguales. La Dra. Reve desarrolla estrategias de tratamiento individualizadas adaptadas a su historial único, estilo de vida y objetivos — no un enfoque genérico.'
    },
    {
      title: 'Bilingüe y Culturalmente Sensible',
      description: 'Atención completamente bilingüe en inglés y español, con competencia cultural que refleja las diversas comunidades de Naples y el suroeste de Florida.'
    },
    {
      title: 'Opciones Presenciales y de Telesalud',
      description: 'Atención flexible: visite nuestra oficina en Naples o conéctese de forma segura en línea. La telesalud está disponible en toda Florida para máxima conveniencia.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">

        {/* Page Hero — unique H1 */}
        <section className="py-14 sm:py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-green-700 font-semibold text-sm uppercase tracking-widest mb-3">
                Naples, FL · Suroeste de Florida
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-900 mb-6 leading-tight" data-testid="servicios-title">
                <span className="font-display italic text-green-700">Servicios</span> Psiquiátricos en Naples, FL
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed" data-testid="servicios-description">
                La Dra. Melva Reve ofrece atención psiquiátrica basada en evidencia para ansiedad, depresión, TDAH, TEPT y más. Aceptando nuevos pacientes — en persona en Naples y por telesalud en toda Florida.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/es/contacto">
                  <Button className="bg-green-800 text-white hover:bg-green-700 rounded-full px-7 py-3 font-semibold">
                    Reservar una Cita
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+12394230272">
                  <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50 rounded-full px-7 py-3 font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    (239) 423-0272
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick info bar */}
        <section className="bg-green-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-300" />
                <span>Naples, FL 34103</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-300" />
                <span>Lun–Vie, horarios flexibles</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-300" />
                <span>Presencial y telesalud</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-300" />
                <span>Bilingüe EN/ES</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bilingual care — Spanish-specific differentiator kept from original */}
        <BilingualCare />

        {/* Shared services cards section */}
        <ServicesSection />

        {/* Treatment Approach */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-900 mb-4">
                Nuestro <span className="font-display italic text-green-700">Enfoque</span> de Tratamiento
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Lo que hace diferente la atención psiquiátrica en Healing Minds de una visita clínica estándar.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {approach.map((item, i) => (
                <Card key={i} className="p-6 bg-white border-green-100 hover:shadow-md transition-shadow">
                  <CheckCircle className="w-8 h-8 text-green-700 mb-4" />
                  <h3 className="font-semibold text-green-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance & Process */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-900 mb-6">
                  Seguro y <span className="font-display italic text-green-700">Cómo Comenzar</span>
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Aceptamos la mayoría de los planes de seguro principales y verificamos sus beneficios antes de su primera cita para que no haya sorpresas de facturación. Las tarifas de pago personal y los planes de pago están disponibles para pacientes sin seguro.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Se acepta Medicare',
                    'La mayoría de los planes de seguro comerciales principales',
                    'Citas de telesalud cubiertas por la mayoría de los planes',
                    'Estimados de buena fe para pago personal',
                    'Planes de pago flexibles disponibles'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/es/politica-facturacion">
                  <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                    Ver Política de Facturación
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-900 mb-6">
                  Qué <span className="font-display italic text-green-700">Esperar</span>
                </h2>
                <div className="space-y-5">
                  {[
                    { step: '1', title: 'Reservar su Cita', desc: 'Programe en línea o llame al (239) 423-0272. Los nuevos pacientes generalmente son atendidos en 1–2 semanas.' },
                    { step: '2', title: 'Evaluación Inicial (40–60 min)', desc: 'Una evaluación integral de su historial de salud mental, síntomas actuales, medicamentos y objetivos de tratamiento.' },
                    { step: '3', title: 'Plan de Tratamiento Personalizado', desc: 'La Dra. Reve desarrolla un plan personalizado que puede incluir manejo de medicamentos, derivaciones a terapia, o ambos.' },
                    { step: '4', title: 'Atención de Seguimiento Continua', desc: 'Citas de seguimiento regulares de 20–30 min para monitorear el progreso, ajustar el tratamiento y apoyar su recuperación.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/es/para-pacientes">
                    <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                      Recursos e Información para Pacientes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-900 mb-4">
                Preguntas <span className="font-display italic text-green-700">Frecuentes</span>
              </h2>
              <p className="text-gray-600">
                Preguntas comunes sobre los servicios psiquiátricos en Healing Minds en Naples, FL.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-green-100 overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-green-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-semibold text-green-900 text-base leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-green-700 flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-700 text-sm leading-relaxed border-t border-green-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local context + CTA */}
        <section className="py-16 bg-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-body font-bold mb-4">
              Atendiendo Naples y el <span className="font-display italic text-green-200">Suroeste de Florida</span>
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Healing Minds Psychiatry atiende a pacientes de Naples, Bonita Springs, Marco Island, Estero, Fort Myers y comunidades cercanas en los condados de Collier y Lee. La telesalud extiende nuestro alcance a toda Florida.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {['Naples', 'Bonita Springs', 'Marco Island', 'Estero', 'Fort Myers'].map(city => (
                <span key={city} className="bg-green-700 text-green-100 px-4 py-1.5 rounded-full text-sm font-medium">{city}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/es/contacto">
                <Button className="bg-white text-green-800 hover:bg-green-50 rounded-full px-8 py-3 font-semibold">
                  Reservar su Cita
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/locations/psychiatrist-naples">
                <Button variant="outline" className="border-white text-white hover:bg-green-700 rounded-full px-8 py-3 font-semibold">
                  <MapPin className="w-4 h-4 mr-2" />
                  Nuestra Ubicación en Naples
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ServiciosEspanol;
