import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import About from '@/components/About';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const AcercaEspanol = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Force Spanish language for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Acerca de la Dra. Melva Reve - Psiquiatra en Naples, FL',
      description: 'Conozca a la Dra. Melva Reve, MD, psiquiatra en Naples con licencia médica activa de Florida ME165518, atención bilingüe y áreas de enfoque clínico.',
      keywords: 'Dra Melva Reve Naples, biografía psiquiatra, psiquiatra con licencia Naples, psiquiatra bilingüe FL',
      lang: 'es',
      canonical: '/es/acerca-de'
    };
    updateSEO(seoData);
  }, [setLanguage]);

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

export default AcercaEspanol;
