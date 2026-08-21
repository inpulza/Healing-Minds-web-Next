import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InsuranceLogos from '@/components/InsuranceLogos';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { 
  LazyDoctorSection,
  LazyServices,
  LazyBilingualCare,
  LazyServiceAreas,
  LazyReviews,
  LazyForPatients,
  LazyFAQ,
  LazyContact,
  LazyFooter,
  LazyTelehealthSection,
  LazyCTASection
} from '@/components/LazyComponents';
import { updateSEO } from '@/utils/seo';

const HomeEspanol = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Force Spanish language for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Atención Psiquiátrica Experta en Naples, FL - Ansiedad, Depresión, TDAH, Terapia | Dra. Melva Reve',
      description: 'La psiquiatra Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida. Llame (239) 423-0272.',
      keywords: 'atención psiquiátrica experta Naples FL, psiquiatra con licencia Naples, tratamiento ansiedad Naples FL, tratamiento depresión Naples FL, terapia TDAH Naples, salud mental Naples, psiquiatra suroeste Florida, Dra Melva Reve psiquiatra',
      lang: 'es',
      canonical: '/es'
    };
    updateSEO(seoData);
  }, [setLanguage]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InsuranceLogos />
        
        {/* Telehealth Services Section - Now lazy loaded for performance */}
        <SuspenseWrapper priority="medium">
          <LazyTelehealthSection />
        </SuspenseWrapper>
        
        <SuspenseWrapper priority="high" preload>
          <LazyDoctorSection />
        </SuspenseWrapper>
        <SuspenseWrapper priority="high" preload>
          <LazyServices />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyBilingualCare />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyServiceAreas />
        </SuspenseWrapper>
        
        {/* CTA disruptivo a mitad de página */}
        <SuspenseWrapper priority="medium">
          <LazyCTASection />
        </SuspenseWrapper>
        
        <SuspenseWrapper priority="medium">
          <LazyReviews />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium" preload>
          <LazyFAQ />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium">
          <LazyForPatients />
        </SuspenseWrapper>
        <SuspenseWrapper priority="medium" preload>
          <LazyContact headingLevel="h2" />
        </SuspenseWrapper>
      </main>
      <SuspenseWrapper priority="low">
        <LazyFooter />
      </SuspenseWrapper>
    </div>
  );
};

export default HomeEspanol;
