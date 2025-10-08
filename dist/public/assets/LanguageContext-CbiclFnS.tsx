import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { hasBilingualCounterpart } from '../utils/urlMapping';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [location] = useLocation();

  // URL-driven language sync: automatically set language based on current URL
  // Only for pages with bilingual counterparts to preserve manual language selection
  useEffect(() => {
    if (hasBilingualCounterpart(location)) {
      const urlLanguage = location.startsWith('/es') ? 'es' : 'en';
      if (urlLanguage !== language) {
        setLanguage(urlLanguage);
      }
    }
  }, [location, language]);

  const translations = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.forPatients': 'For Patients',
      'nav.contact': 'Contact',
      'nav.bookNow': 'Book Now',
      
      // Hero Section
      'hero.title': 'Find Your Path to Clarity',
      'hero.subtitle': 'with Dr. Melva Reve',
      'hero.description': 'Compassionate and expert psychiatric care in Naples, FL, designed to help you navigate life\'s challenges and foster lasting well-being.',
      'hero.bookConsultation': 'Book a Consultation',
      'hero.learnMore': 'Learn More',
      
      // Stats
      'stats.experience': 'Years of Experience',
      'stats.successRate': 'Patient Success Rate',
      'stats.rating': 'Positive Reviews',
      
      // About
      'about.title': 'About Dr. Melva Reve',
      'about.description1': 'Dr. Melva Reve is a board-certified psychiatrist with over 15 years of experience providing compassionate mental health care to adults in Naples, Florida, and surrounding areas. She specializes in treating anxiety disorders, depression, ADHD, PTSD, and other psychiatric conditions.',
      'about.description2': 'As a bilingual practitioner fluent in both English and Spanish, Dr. Reve is uniquely positioned to serve the diverse community of Southwest Florida with culturally sensitive care that respects individual backgrounds and experiences.',
      'about.credential1': 'MD from University of Miami Miller School of Medicine',
      // 'about.credential2': 'Board Certified by American Board of Psychiatry and Neurology',
      'about.credential3': 'Member of American Psychiatric Association',
      'about.credential4': 'Fluent in English and Spanish',
      'about.scheduleConsultation': 'Schedule Consultation',
      
      // Services
      'services.title': 'Comprehensive Psychiatric Services',
      'services.description': 'Dr. Reve provides evidence-based treatment for a wide range of mental health conditions, offering personalized care tailored to each patient\'s unique needs.',
      'services.anxiety.title': 'Anxiety Disorders',
      'services.anxiety.description': 'Treatment for generalized anxiety, panic disorder, social anxiety, and phobias. Comprehensive approach using therapy and medication management.',
      'services.depression.title': 'Depression Treatment',
      'services.depression.description': 'Evidence-based treatment for major depression, persistent depressive disorder, and seasonal affective disorder.',
      'services.adhd.title': 'ADHD Treatment',
      'services.adhd.description': 'Comprehensive evaluation and treatment for adult ADHD, including medication management and behavioral strategies.',
      'services.ptsd.title': 'PTSD & Trauma',
      'services.ptsd.description': 'Specialized treatment for post-traumatic stress disorder and trauma-related conditions using evidence-based approaches.',
      'services.bipolar.title': 'Bipolar Disorder',
      'services.bipolar.description': 'Comprehensive mood stabilization and management for all types of bipolar disorder with individualized treatment plans.',
      'services.ocd.title': 'OCD Treatment',
      'services.ocd.description': 'Specialized treatment for obsessive-compulsive disorder using evidence-based therapeutic approaches and medication.',
      
      // Contact
      'contact.title': 'Get in Touch',
      'contact.description': 'Ready to take the first step toward better mental health? Contact us to schedule your consultation.',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.address': 'Address',
      'contact.emergency': 'Emergency Services',
      'contact.form.title': 'Send us a Message',
      'contact.form.firstName': 'First Name',
      'contact.form.lastName': 'Last Name',
      'contact.form.email': 'Email Address',
      'contact.form.phone': 'Phone Number',
      'contact.form.preferredLanguage': 'Preferred Language',
      'contact.form.message': 'Message',
      'contact.form.send': 'Send Message',
    },
    es: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.about': 'Acerca de',
      'nav.services': 'Servicios',
      'nav.forPatients': 'Para Pacientes',
      'nav.contact': 'Contacto',
      'nav.bookNow': 'Reservar Cita',
      
      // Hero Section
      'hero.title': 'Encuentra tu Camino hacia la Claridad',
      'hero.subtitle': 'con la Dra. Melva Reve',
      'hero.description': 'Atención psiquiátrica compasiva y experta en Naples, FL, diseñada para ayudarte a navegar los desafíos de la vida y fomentar el bienestar duradero.',
      'hero.bookConsultation': 'Reservar Consulta',
      'hero.learnMore': 'Saber Más',
      
      // Stats
      'stats.experience': 'Años de Experiencia',
      'stats.successRate': 'Tasa de Éxito del Paciente',
      'stats.rating': 'Reseñas Positivas',
      
      // About
      'about.title': 'Acerca de la Dra. Melva Reve',
      'about.description1': 'La Dra. Melva Reve es una psiquiatra certificada con más de 15 años de experiencia brindando atención compasiva de salud mental a adultos en Naples, Florida, y áreas circundantes. Se especializa en el tratamiento de trastornos de ansiedad, depresión, TDAH, TEPT y otras condiciones psiquiátricas.',
      'about.description2': 'Como profesional bilingüe que habla inglés y español con fluidez, la Dra. Reve está en una posición única para servir a la diversa comunidad del suroeste de Florida con atención culturalmente sensible que respeta los antecedentes y experiencias individuales.',
      'about.credential1': 'MD de la Escuela de Medicina Miller de la Universidad de Miami',
      'about.credential2': 'Certificada por la Junta Americana de Psiquiatría y Neurología',
      'about.credential3': 'Miembro de la Asociación Psiquiátrica Americana',
      'about.credential4': 'Fluida en inglés y español',
      'about.scheduleConsultation': 'Programar Consulta',
      
      // Services
      'services.title': 'Servicios Psiquiátricos Integrales',
      'services.description': 'La Dra. Reve proporciona tratamiento basado en evidencia para una amplia gama de condiciones de salud mental, ofreciendo atención personalizada adaptada a las necesidades únicas de cada paciente.',
      'services.anxiety.title': 'Trastornos de Ansiedad',
      'services.anxiety.description': 'Tratamiento para ansiedad generalizada, trastorno de pánico, ansiedad social y fobias. Enfoque integral utilizando terapia y manejo de medicamentos.',
      'services.depression.title': 'Tratamiento de Depresión',
      'services.depression.description': 'Tratamiento basado en evidencia para depresión mayor, trastorno depresivo persistente y trastorno afectivo estacional.',
      'services.adhd.title': 'Tratamiento de TDAH',
      'services.adhd.description': 'Evaluación y tratamiento integral para TDAH en adultos, incluyendo manejo de medicamentos y estrategias conductuales.',
      'services.ptsd.title': 'TEPT y Trauma',
      'services.ptsd.description': 'Tratamiento especializado para el trastorno de estrés postraumático y condiciones relacionadas con trauma usando enfoques basados en evidencia.',
      'services.bipolar.title': 'Trastorno Bipolar',
      'services.bipolar.description': 'Estabilización y manejo integral del estado de ánimo para todos los tipos de trastorno bipolar con planes de tratamiento individualizados.',
      'services.ocd.title': 'Tratamiento de TOC',
      'services.ocd.description': 'Tratamiento especializado para el trastorno obsesivo-compulsivo utilizando enfoques terapéuticos basados en evidencia y medicación.',
      
      // Contact
      'contact.title': 'Ponte en Contacto',
      'contact.description': '¿Listo para dar el primer paso hacia una mejor salud mental? Contáctanos para programar tu consulta.',
      'contact.phone': 'Teléfono',
      'contact.email': 'Correo Electrónico',
      'contact.address': 'Dirección',
      'contact.emergency': 'Servicios de Emergencia',
      'contact.form.title': 'Envíanos un Mensaje',
      'contact.form.firstName': 'Nombre',
      'contact.form.lastName': 'Apellido',
      'contact.form.email': 'Correo Electrónico',
      'contact.form.phone': 'Número de Teléfono',
      'contact.form.preferredLanguage': 'Idioma Preferido',
      'contact.form.message': 'Mensaje',
      'contact.form.send': 'Enviar Mensaje',
    },
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
