import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ForPatients from '@/components/ForPatients';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ParaPacientesEspanol = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Force Spanish language for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Para Pacientes - Seguro, Citas y FAQ | Healing Minds Naples',
      description: 'Información importante para pacientes sobre seguro, citas y atención psiquiátrica en Healing Minds Naples. FAQ y qué esperar.',
      keywords: 'seguro psiquiatra Naples, citas psiquiátricas Naples, FAQ salud mental Naples',
      lang: 'es',
      canonical: '/es/para-pacientes'
    };
    updateSEO(seoData);
  }, [setLanguage]);

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

export default ParaPacientesEspanol;