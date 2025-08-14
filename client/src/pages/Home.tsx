import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import About from '@/components/About';
import Services from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import Testimonials from '@/components/Testimonials';
import ForPatients from '@/components/ForPatients';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
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
        <Stats />
        <About />
        <Services />
        <BilingualCare />
        <Testimonials />
        <ForPatients />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
