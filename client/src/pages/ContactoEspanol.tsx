import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ContactoEspanol = () => {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // Force Spanish language for this page
    setLanguage('es');
    
    const seoData = {
      title: 'Contactar Dra. Melva Reve - Reservar Consulta Psiquiátrica Naples FL',
      description: 'Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.',
      keywords: 'contactar psiquiatra Naples, reservar consulta psiquiátrica Naples, teléfono psiquiatra Naples FL',
      lang: 'es',
      canonical: '/es/contacto'
    };
    updateSEO(seoData);
  }, [setLanguage]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactoEspanol;