import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import About from '@/components/About';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const AboutPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'About Dr. Melva Reve - Psychiatrist in Naples, FL'
        : 'Acerca de la Dra. Melva Reve - Psiquiatra Certificada en Naples, FL',
      description: language === 'en'
        ? 'Learn about Dr. Melva Reve, a psychiatrist with 15+ years of experience serving Naples, FL. Bilingual care with cultural sensitivity.'
        : 'Conozca a la Dra. Melva Reve, psiquiatra certificada con más de 15 años de experiencia sirviendo Naples, FL. Atención bilingüe con sensibilidad cultural.',
      keywords: language === 'en'
        ? 'Dr Melva Reve Naples, psychiatrist biography, psychiatrist Naples, bilingual psychiatrist FL'
        : 'Dra Melva Reve Naples, biografía psiquiatra, psiquiatra certificada Naples, psiquiatra bilingüe FL',
      lang: language,
      canonical: language === 'en' ? '/about' : '/es/acerca-de'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16 bg-[#f0fdf4]">
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
