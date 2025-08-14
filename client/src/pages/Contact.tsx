import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const ContactPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Contact Dr. Melva Reve - Book Psychiatric Consultation Naples FL'
        : 'Contactar Dra. Melva Reve - Reservar Consulta Psiquiátrica Naples FL',
      description: language === 'en'
        ? 'Contact Healing Minds Psychiatry in Naples, FL to schedule your consultation. Call (239) 423-0272 or send a message. Bilingual services available.'
        : 'Contacte Healing Minds Psychiatry en Naples, FL para programar su consulta. Llame (239) 423-0272 o envíe un mensaje. Servicios bilingües disponibles.',
      keywords: language === 'en'
        ? 'contact psychiatrist Naples, book psychiatric consultation Naples, psychiatrist phone Naples FL'
        : 'contactar psiquiatra Naples, reservar consulta psiquiátrica Naples, teléfono psiquiatra Naples FL',
      lang: language,
      canonical: language === 'en' ? '/contact' : '/es/contacto'
    };
    updateSEO(seoData);
  }, [language]);

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

export default ContactPage;
