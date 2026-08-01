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
  LazyTestimonials,
  LazyReviews,
  LazyForPatients,
  LazyFAQ,
  LazyContact,
  LazyFooter,
  LazyTelehealthSection,
  LazyCTASection
} from '@/components/LazyComponents';
import { updateSEO } from '@/utils/seo';
// Removed unused imports: CharmHealthBooking, icons moved to TelehealthSection for performance

const Home = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Expert Psychiatric Care in Naples, FL - Anxiety, Depression, ADHD, Therapy | Dr. Melva Reve'
        : 'Atención Psiquiátrica Experta en Naples, FL - Ansiedad, Depresión, TDAH, Terapia | Dra. Melva Reve',
      description: language === 'en'
        ? 'Dr. Melva Reve provides expert psychiatric care in Naples, FL. Specializing in anxiety, depression, ADHD, and therapy. Mental health services for Southwest Florida. Call (239) 423-0272.'
        : 'La psiquiatra Dra. Melva Reve brinda atención psiquiátrica experta en Naples, FL. Especializada en ansiedad, depresión, TDAH y terapia. Servicios de salud mental para el suroeste de Florida. Llame (239) 423-0272.',
      keywords: language === 'en'
        ? 'expert psychiatric care Naples FL, psychiatrist Naples, anxiety treatment Naples FL, depression treatment Naples FL, ADHD therapy Naples, Naples mental health, Southwest Florida psychiatrist, Dr Melva Reve psychiatrist'
        : 'atención psiquiátrica experta Naples FL, psiquiatra con licencia Naples, tratamiento ansiedad Naples FL, tratamiento depresión Naples FL, terapia TDAH Naples, salud mental Naples, psiquiatra suroeste Florida, Dra Melva Reve psiquiatra',
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
        <SuspenseWrapper priority="low">
          <LazyForPatients />
        </SuspenseWrapper>
        <SuspenseWrapper priority="low">
          <LazyFAQ />
        </SuspenseWrapper>
        <SuspenseWrapper priority="low">
          <LazyContact headingLevel="h2" />
        </SuspenseWrapper>
      </main>
      <SuspenseWrapper priority="low">
        <LazyFooter />
      </SuspenseWrapper>
    </div>
  );
};

export default Home;
