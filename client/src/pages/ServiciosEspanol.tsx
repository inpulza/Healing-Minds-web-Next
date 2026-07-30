import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ServicesSection from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { renderRichText } from '@/components/RichText';
import { servicesIndexContent } from '@/data/pageContent/services/servicesIndex';
import { Link } from '@/lib/navigation';
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
  const content = servicesIndexContent.es;
  const section = (key: string) => content.sections.find((x) => x.key === key)!;
  const approach = content.sections
    .filter((x) => /^approach-\d+$/.test(x.key ?? ''))
    .map((x) => ({ title: x.heading!, description: x.paragraphs![0] }));
  const steps = content.sections
    .filter((x) => /^expect-\d+$/.test(x.key ?? ''))
    .map((x, i) => ({ step: String(i + 1), title: x.heading!, desc: x.paragraphs![0] }));
  const faqs = content.sections
    .filter((x) => /^faq-\d+$/.test(x.key ?? ''))
    .map((x) => ({ q: x.heading!, a: x.paragraphs![0] }));

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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">

        {/* Page Hero — unique H1 */}
        <section className="py-14 sm:py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-green-700 font-semibold text-sm uppercase tracking-widest mb-3">
                {section('eyebrow').paragraphs![0]}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-900 mb-6 leading-tight" data-testid="servicios-title">
                {renderRichText(content.title, undefined, 'font-display italic text-green-700')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed" data-testid="servicios-description">
                {section('heroDescription').paragraphs![0]}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/es/contacto">
                  <Button className="bg-green-800 text-white hover:bg-green-700 rounded-full px-7 py-3 font-semibold">
                    {section('heroBookCta').paragraphs![0]}
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
                <span>{section('quickInfo').bullets![0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-300" />
                <span>{section('quickInfo').bullets![1]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-300" />
                <span>{section('quickInfo').bullets![2]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-300" />
                <span>{section('quickInfo').bullets![3]}</span>
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
                {renderRichText(section('approachHeading').heading!, undefined, 'font-display italic text-green-700')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                {section('approachHeading').paragraphs![0]}
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
                  {renderRichText(section('insuranceHeading').heading!, undefined, 'font-display italic text-green-700')}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {section('insuranceHeading').paragraphs![0]}
                </p>
                <ul className="space-y-3 mb-8">
                  {section('insuranceBullets').bullets!.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/es/politica-facturacion">
                  <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                    {section('insuranceCta').paragraphs![0]}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-900 mb-6">
                  {renderRichText(section('expectHeading').heading!, undefined, 'font-display italic text-green-700')}
                </h2>
                <div className="space-y-5">
                  {steps.map((item) => (
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
                      {section('expectCta').paragraphs![0]}
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
                {renderRichText(section('faqHeading').heading!, undefined, 'font-display italic text-green-700')}
              </h2>
              <p className="text-gray-600">
                {section('faqHeading').paragraphs![0]}
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
              {renderRichText(section('ctaHeading').heading!, undefined, 'font-display italic text-green-200')}
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              {section('ctaHeading').paragraphs![0]}
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {section('cities').bullets!.map(city => (
                <span key={city} className="bg-green-700 text-green-100 px-4 py-1.5 rounded-full text-sm font-medium">{city}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/es/contacto">
                <Button className="bg-white text-green-800 hover:bg-green-50 rounded-full px-8 py-3 font-semibold">
                  {section('ctaBook').paragraphs![0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/es/ubicaciones/psiquiatra-naples">
                <Button variant="outline" className="border-white text-white hover:bg-green-700 rounded-full px-8 py-3 font-semibold">
                  <MapPin className="w-4 h-4 mr-2" />
                  {section('ctaLocation').paragraphs![0]}
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
