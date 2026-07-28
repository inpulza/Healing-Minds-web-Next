import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ForPatientsSection from '@/components/ForPatients';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { forPatientsContent } from '@/data/pageContent/mainPages/forPatients';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  ChevronDown,
  FileText,
  Phone,
  ArrowRight,
  ClipboardList,
  Calendar,
  Shield,
  Info,
  Receipt
} from 'lucide-react';

const ForPatientsPage = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Patient Resources — First Visit, Insurance & FAQ | Healing Minds Naples'
        : 'Recursos para Pacientes — Primera Visita, Seguro y FAQ | Healing Minds Naples',
      description: language === 'en'
        ? 'Everything new and returning patients need to know before their appointment at Healing Minds in Naples, FL. First-visit checklist, insurance verification, telehealth instructions, and FAQs.'
        : 'Todo lo que los pacientes nuevos y existentes necesitan saber antes de su cita en Healing Minds en Naples, FL. Lista de verificación para la primera visita, verificación de seguro, instrucciones de telesalud y preguntas frecuentes.',
      keywords: language === 'en'
        ? 'psychiatrist new patient Naples, first visit psychiatry Naples, mental health insurance Naples, telehealth psychiatry Florida, patient resources Healing Minds'
        : 'psiquiatra nuevo paciente Naples, primera visita psiquiatría Naples, seguro salud mental Naples, telesalud psiquiatría Florida, recursos pacientes Healing Minds',
      lang: language,
      canonical: language === 'en' ? '/for-patients' : '/es/para-pacientes'
    };
    updateSEO(seoData);
  }, [language]);

  const content = forPatientsContent[language];
  const s = (key: string) => content.sections.find((section) => section.key === key)!;

  const firstVisitChecklist = s('checklistItems').bullets!;

  const telehealthStepsSection = s('telehealthSteps');
  const telehealthSteps = telehealthStepsSection.bullets!.map((title, i) => ({
    title,
    desc: telehealthStepsSection.paragraphs![i]
  }));

  const verificationSection = s('verificationCards');
  const verificationCards = verificationSection.bullets!.map((title, i) => ({
    step: String(i + 1),
    title,
    desc: verificationSection.paragraphs![i]
  }));

  const policyLinks = s('policyLinks').bullets!;

  const faqsSection = s('faqs');
  const faqs = faqsSection.bullets!.map((q, i) => ({
    q,
    a: faqsSection.paragraphs![i]
  }));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">

        {/* Page Hero */}
        <section className="py-14 sm:py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-green-700 font-semibold text-sm uppercase tracking-widest mb-3">
                {s('eyebrow').paragraphs![0]}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-900 mb-6 leading-tight">
                {language === 'en'
                  ? <>For <span className="font-display italic text-green-700">Patients</span> — Everything You Need to Know</>
                  : <>Para <span className="font-display italic text-green-700">Pacientes</span> — Todo lo que Necesita Saber</>
                }
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
                {s('heroDescription').paragraphs![0]}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                  <Button className="bg-green-800 text-white hover:bg-green-700 rounded-full px-7 py-3 font-semibold">
                    {s('heroActions').bullets![0]}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+12394230272">
                  <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50 rounded-full px-7 py-3 font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    {s('heroActions').bullets![1]}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Shared ForPatients component (insurance, what to expect, policy links) */}
        <ForPatientsSection />

        {/* First-Visit Checklist */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-body font-bold text-green-900">
                    {language === 'en'
                      ? <>First-Visit <span className="font-display italic text-green-700">Checklist</span></>
                      : <>Lista para la <span className="font-display italic text-green-700">Primera Visita</span></>
                    }
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  {s('checklistIntro').paragraphs![0]}
                </p>
                <ul className="space-y-3">
                  {firstVisitChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Telehealth Instructions */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-body font-bold text-green-900">
                    {language === 'en'
                      ? <>Telehealth <span className="font-display italic text-green-700">Instructions</span></>
                      : <>Instrucciones de <span className="font-display italic text-green-700">Telesalud</span></>
                    }
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  {s('telehealthIntro').paragraphs![0]}
                </p>
                <div className="space-y-4">
                  {telehealthSteps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 text-sm mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Verification Process */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-body font-bold text-green-900">
                  {language === 'en'
                    ? <>Insurance <span className="font-display italic text-green-700">Verification</span> Process</>
                    : <>Proceso de <span className="font-display italic text-green-700">Verificación</span> de Seguro</>
                  }
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                {s('verificationIntro').paragraphs![0]}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationCards.map((item) => (
                <Card key={item.step} className="p-6 border-green-100 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href={language === 'en' ? '/billing-policy' : '/es/politica-facturacion'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <FileText className="w-4 h-4 mr-2" />
                  {policyLinks[0]}
                </Button>
              </Link>
              <Link href={language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  {policyLinks[1]}
                </Button>
              </Link>
              <Link href={language === 'en' ? '/patient-rights' : '/es/derechos-paciente'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Shield className="w-4 h-4 mr-2" />
                  {policyLinks[2]}
                </Button>
              </Link>
              <Link href={language === 'en' ? '/no-surprises-act' : '/es/ley-sin-sorpresas'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Receipt className="w-4 h-4 mr-2" />
                  {policyLinks[3]}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-body font-bold text-green-900">
                  {language === 'en'
                    ? <>Patient <span className="font-display italic text-green-700">FAQ</span></>
                    : <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span></>
                  }
                </h2>
              </div>
              <p className="text-gray-600">
                {s('faqIntro').paragraphs![0]}
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

        {/* CTA */}
        <section className="py-16 bg-green-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-body font-bold mb-4">
              {language === 'en'
                ? <>Ready to <span className="font-display italic text-green-200">Get Started?</span></>
                : <>¿Listo para <span className="font-display italic text-green-200">Comenzar?</span></>
              }
            </h2>
            <p className="text-green-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              {s('ctaBody').paragraphs![0]}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                <Button className="bg-white text-green-800 hover:bg-green-50 rounded-full px-8 py-3 font-semibold">
                  {s('ctaButtons').bullets![0]}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={language === 'en' ? '/services' : '/es/servicios'}>
                <Button variant="outline" className="border-white text-white hover:bg-green-700 rounded-full px-8 py-3 font-semibold">
                  {s('ctaButtons').bullets![1]}
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

export default ForPatientsPage;
