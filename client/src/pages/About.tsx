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
        : 'Acerca de la Dra. Melva Reve - Psiquiatra en Naples, FL',
      description: language === 'en'
        ? 'Meet Dr. Melva Reve, MD, a Naples psychiatrist with active Florida medical license ME165518, bilingual care and defined clinical focus areas.'
        : 'Conozca a la Dra. Melva Reve, MD, psiquiatra en Naples con licencia médica activa de Florida ME165518, atención bilingüe y áreas de enfoque clínico.',
      keywords: language === 'en'
        ? 'Dr Melva Reve Naples, psychiatrist biography, psychiatrist Naples, bilingual psychiatrist FL'
        : 'Dra Melva Reve Naples, biografía psiquiatra, psiquiatra con licencia Naples, psiquiatra bilingüe FL',
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
