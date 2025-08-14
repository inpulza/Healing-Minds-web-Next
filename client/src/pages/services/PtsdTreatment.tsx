import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Shield } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconShield } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import ptsdImage from "@assets/generated_images/Hope_and_growth_symbolism_978bb907.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const PtsdTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'PTSD Treatment Naples FL - Trauma Therapy & Psychiatric Care | Dr. Melva Reve'
        : 'Tratamiento TEPT Naples FL - Terapia de Trauma y Atención Psiquiátrica | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert PTSD treatment in Naples, FL. Dr. Melva Reve provides trauma-informed psychiatric care for post-traumatic stress disorder. Bilingual services, evidence-based treatment approaches.'
        : 'Tratamiento experto de TEPT en Naples, FL. La Dra. Melva Reve brinda atención psiquiátrica informada en trauma para trastorno de estrés postraumático. Servicios bilingües, enfoques de tratamiento basados en evidencia.',
      keywords: language === 'en'
        ? 'PTSD treatment Naples FL, trauma therapy Naples, post traumatic stress disorder Naples, PTSD psychiatrist Naples, trauma informed care Naples, military PTSD Naples'
        : 'tratamiento TEPT Naples FL, terapia trauma Naples, trastorno estrés postraumático Naples, psiquiatra TEPT Naples, atención informada trauma Naples, TEPT militar Naples',
      lang: language,
      canonical: language === 'en' ? '/services/ptsd-treatment' : '/es/servicios/tratamiento-tept'
    };
    updateSEO(seoData);
  }, [language]);

  const symptoms = language === 'en' ? [
    'Intrusive memories or flashbacks',
    'Nightmares or sleep disturbances',
    'Avoidance of trauma reminders',
    'Emotional numbing or detachment',
    'Hypervigilance or being easily startled',
    'Difficulty concentrating',
    'Irritability or anger outbursts',
    'Negative thoughts about oneself'
  ] : [
    'Memorias intrusivas o flashbacks',
    'Pesadillas o trastornos del sueño',
    'Evitación de recordatorios del trauma',
    'Entumecimiento emocional o desapego',
    'Hipervigilancia o sobresaltarse fácilmente',
    'Dificultad para concentrarse',
    'Irritabilidad o arrebatos de ira',
    'Pensamientos negativos sobre uno mismo'
  ];

  const traumaTypes = language === 'en' ? [
    {
      title: 'Combat & Military Trauma',
      description: 'Specialized care for veterans and active military personnel dealing with combat-related PTSD.'
    },
    {
      title: 'Accident & Injury Trauma',
      description: 'Treatment for PTSD resulting from car accidents, workplace injuries, or other traumatic incidents.'
    },
    {
      title: 'Personal Violence',
      description: 'Sensitive care for survivors of assault, domestic violence, or other personal trauma.'
    },
    {
      title: 'Medical Trauma',
      description: 'Support for trauma related to serious illness, medical procedures, or hospital experiences.'
    },
    {
      title: 'Natural Disasters',
      description: 'Treatment for PTSD resulting from hurricanes, floods, or other natural catastrophes.'
    },
    {
      title: 'Childhood Trauma',
      description: 'Specialized approach for adults dealing with the lasting effects of childhood trauma.'
    }
  ] : [
    {
      title: 'Trauma de Combate y Militar',
      description: 'Atención especializada para veteranos y personal militar activo que trata con TEPT relacionado con combate.'
    },
    {
      title: 'Trauma de Accidentes y Lesiones',
      description: 'Tratamiento para TEPT resultante de accidentes automovilísticos, lesiones laborales u otros incidentes traumáticos.'
    },
    {
      title: 'Violencia Personal',
      description: 'Atención sensible para sobrevivientes de asalto, violencia doméstica u otro trauma personal.'
    },
    {
      title: 'Trauma Médico',
      description: 'Apoyo para trauma relacionado con enfermedad grave, procedimientos médicos o experiencias hospitalarias.'
    },
    {
      title: 'Desastres Naturales',
      description: 'Tratamiento para TEPT resultante de huracanes, inundaciones u otras catástrofes naturales.'
    },
    {
      title: 'Trauma de la Infancia',
      description: 'Enfoque especializado para adultos que lidian con los efectos duraderos del trauma infantil.'
    }
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Trauma-Informed Assessment',
      description: 'Comprehensive evaluation using trauma-specific tools to understand your unique experience and symptoms.'
    },
    {
      title: 'Medication Management',
      description: 'Careful prescribing of medications to manage PTSD symptoms, including antidepressants and anxiety medications.'
    },
    {
      title: 'Evidence-Based Therapy Coordination',
      description: 'Coordination with trauma therapists specializing in EMDR, CPT, and other proven PTSD treatments.'
    },
    {
      title: 'Crisis Safety Planning',
      description: 'Development of personalized safety plans to manage triggers and crisis situations effectively.'
    },
    {
      title: 'Sleep & Nightmare Management',
      description: 'Specialized treatment for trauma-related sleep disturbances and recurring nightmares.'
    },
    {
      title: 'Family & Support System Education',
      description: 'Guidance for loved ones on how to provide support and understand PTSD recovery.'
    }
  ] : [
    {
      title: 'Evaluación Informada en Trauma',
      description: 'Evaluación integral usando herramientas específicas de trauma para entender su experiencia única y síntomas.'
    },
    {
      title: 'Manejo de Medicamentos',
      description: 'Prescripción cuidadosa de medicamentos para manejar síntomas de TEPT, incluyendo antidepresivos y medicamentos para ansiedad.'
    },
    {
      title: 'Coordinación de Terapia Basada en Evidencia',
      description: 'Coordinación con terapeutas de trauma especializados en EMDR, CPT y otros tratamientos comprobados para TEPT.'
    },
    {
      title: 'Planificación de Seguridad en Crisis',
      description: 'Desarrollo de planes de seguridad personalizados para manejar desencadenantes y situaciones de crisis efectivamente.'
    },
    {
      title: 'Manejo del Sueño y Pesadillas',
      description: 'Tratamiento especializado para trastornos del sueño relacionados con trauma y pesadillas recurrentes.'
    },
    {
      title: 'Educación para Familia y Sistema de Apoyo',
      description: 'Orientación para seres queridos sobre cómo brindar apoyo y entender la recuperación del TEPT.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Trauma Recovery',
            es: 'Recuperación del Trauma'
          }}
          title={{
            en: 'PTSD Treatment in Naples, FL',
            es: 'Tratamiento de TEPT en Naples, FL'
          }}
          description={{
            en: 'Find healing and reclaim your life with expert PTSD treatment. Dr. Melva Reve provides trauma-informed psychiatric care with compassion, understanding, and evidence-based approaches.',
            es: 'Encuentre sanación y reclame su vida con tratamiento experto de TEPT. La Dra. Melva Reve brinda atención psiquiátrica informada en trauma con compasión, comprensión y enfoques basados en evidencia.'
          }}
          specialNote={{
            es: '<strong>El trauma no define quién es usted.</strong> La recuperación es posible con el apoyo adecuado. Nuestro enfoque respeta su cultura y experiencias, ofreciendo un espacio seguro para sanar sin juicio ni estigma.'
          }}
          facts={{
            title: {
              en: 'PTSD Facts',
              es: 'Datos sobre TEPT'
            },
            items: [
              {
                en: '3.5% of adults experience PTSD annually',
                es: '3.5% de adultos experimentan TEPT anualmente'
              },
              {
                en: 'Trauma-informed care is essential',
                es: 'La atención informada en trauma es esencial'
              },
              {
                en: 'Recovery is possible with treatment',
                es: 'La recuperación es posible con tratamiento'
              },
              {
                en: 'Cultural competency matters',
                es: 'La competencia cultural importa'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Trauma-informed assessment',
                es: 'Evaluación informada en trauma'
              },
              {
                en: 'Evidence-based therapy coordination',
                es: 'Coordinación de terapia basada en evidencia'
              },
              {
                en: 'Crisis safety planning',
                es: 'Planificación de seguridad en crisis'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: ptsdImage,
            symbolImage: therapyRoomImage
          }}
        />

      </main>
      
      <Footer />
    </div>
  );
};

export default PtsdTreatment;
