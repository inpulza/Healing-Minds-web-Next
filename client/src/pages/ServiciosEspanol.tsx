import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Services from '@/components/Services';
import BilingualCare from '@/components/BilingualCare';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ServiciosEspanol = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Set language to Spanish for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Servicios en Español - Psiquiatra Bilingüe Naples FL | Dra. Melva Reve',
      description: 'Servicios psiquiátricos completos en español en Naples, FL. La Dra. Melva Reve ofrece atención culturalmente sensible para ansiedad, depresión, TDAH y más.',
      keywords: 'psiquiatra español Naples, servicios psiquiátricos español FL, psiquiatra bilingüe Naples, atención mental español',
      lang: 'es',
      canonical: '/servicios-espanol'
    };
    updateSEO(seoData);
  }, [setLanguage]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section for Spanish Services */}
        <section className="py-20 bg-light-green">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6" data-testid="servicios-title">
              Servicios en Español
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" data-testid="servicios-description">
              La Dra. Melva Reve ofrece servicios psiquiátricos completos en español, brindando atención culturalmente sensible a la comunidad hispana en Naples, Florida.
            </p>
          </div>
        </section>
        
        <BilingualCare />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServiciosEspanol;
