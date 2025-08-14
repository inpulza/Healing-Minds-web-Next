import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ForPatients from '@/components/ForPatients';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ForPatientsPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'For Patients - Insurance, Appointments & FAQ | Healing Minds Naples'
        : 'Para Pacientes - Seguro, Citas y FAQ | Healing Minds Naples',
      description: language === 'en'
        ? 'Important information for patients about insurance, appointments, and psychiatric care at Healing Minds Naples. FAQ and what to expect.'
        : 'Información importante para pacientes sobre seguro, citas y atención psiquiátrica en Healing Minds Naples. FAQ y qué esperar.',
      keywords: language === 'en'
        ? 'psychiatrist insurance Naples, psychiatric appointments Naples, mental health FAQ Naples'
        : 'seguro psiquiatra Naples, citas psiquiátricas Naples, FAQ salud mental Naples',
      lang: language,
      canonical: language === 'en' ? '/for-patients' : '/es/para-pacientes'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <ForPatients />
      </main>
      <Footer />
    </div>
  );
};

export default ForPatientsPage;
