import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InsuranceLogos from '@/components/InsuranceLogos';
import DoctorSection from '@/components/DoctorSection';
import About from '@/components/About';
import Services from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import ForPatients from '@/components/ForPatients';
import Contact from '@/components/Contact';
import ServiceAreas from '@/components/ServiceAreas';
import Footer from '@/components/Footer';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import { updateSEO } from '@/utils/seo';

const Home = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Dr. Melva Reve - Compassionate Psychiatric Care in Naples, FL | Healing Minds'
        : 'Dra. Melva Reve - Atención Psiquiátrica Compasiva en Naples, FL | Healing Minds',
      description: language === 'en'
        ? 'Expert psychiatric care for adults in Naples, FL. Dr. Melva Reve offers bilingual treatment for anxiety, depression, ADHD, and PTSD. 15+ years experience. Book your consultation today.'
        : 'Atención psiquiátrica experta para adultos en Naples, FL. La Dra. Melva Reve ofrece tratamiento bilingüe para ansiedad, depresión, TDAH y TEPT. Más de 15 años de experiencia. Reserve su consulta hoy.',
      keywords: language === 'en'
        ? 'psychiatrist Naples FL, psychiatric care Naples, anxiety treatment Naples, depression treatment Naples, bilingual psychiatrist, Spanish speaking psychiatrist Naples'
        : 'psiquiatra Naples FL, atención psiquiátrica Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, psiquiatra bilingüe, psiquiatra español Naples',
      lang: language,
      canonical: language === 'en' ? '/' : '/es'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InsuranceLogos />
        
        {/* Telehealth Booking Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-body font-bold text-gray-900 mb-4">
                {language === 'en' ? (
                  <>
                    <span className="font-display italic text-blue-700">Telehealth</span> Services Available
                  </>
                ) : (
                  <>
                    Servicios de <span className="font-display italic text-blue-700">Telesalud</span> Disponibles
                  </>
                )}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'en' 
                  ? 'Can\'t make it to our Naples office? Dr. Melva Reve now offers secure telehealth consultations throughout Florida.'
                  : '¿No puede llegar a nuestra oficina de Naples? La Dra. Melva Reve ahora ofrece consultas seguras de telesalud en toda Florida.'
                }
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <CharmHealthBooking variant="prominent" />
            </div>
          </div>
        </section>
        
        <DoctorSection />
        <Services />
        <About />
        <BilingualCare />
        <ServiceAreas />
        <Testimonials />
        <ForPatients />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
