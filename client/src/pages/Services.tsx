import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Services from '@/components/Services';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ServicesPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Psychiatric Services Naples FL - Anxiety, Depression, ADHD Treatment'
        : 'Servicios Psiquiátricos Naples FL - Tratamiento Ansiedad, Depresión, TDAH',
      description: language === 'en'
        ? 'Comprehensive psychiatric services in Naples, FL. Treatment for anxiety, depression, ADHD, PTSD, bipolar disorder, and OCD. Bilingual care available.'
        : 'Servicios psiquiátricos integrales en Naples, FL. Tratamiento para ansiedad, depresión, TDAH, TEPT, trastorno bipolar y TOC. Atención bilingüe disponible.',
      keywords: language === 'en'
        ? 'psychiatric services Naples, anxiety treatment Naples, depression treatment Naples, ADHD treatment Naples, PTSD treatment Naples'
        : 'servicios psiquiátricos Naples, tratamiento ansiedad Naples, tratamiento depresión Naples, tratamiento TDAH Naples, tratamiento TEPT Naples',
      lang: language,
      canonical: language === 'en' ? '/services' : '/es/servicios'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
