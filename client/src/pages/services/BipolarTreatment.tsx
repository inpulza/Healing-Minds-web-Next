import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Activity } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconMoodUp, IconMoodSad } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import bipolarImage from "@assets/generated_images/Wellness_meditation_space_ae6f4d77.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const BipolarTreatment = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Bipolar Disorder Treatment Naples FL - Mood Stabilization | Dr. Melva Reve'
        : 'Tratamiento Trastorno Bipolar Naples FL - Estabilización del Ánimo | Dra. Melva Reve',
      description: language === 'en'
        ? 'Expert bipolar disorder treatment in Naples, FL. Dr. Melva Reve provides comprehensive care for bipolar I, II, and cyclothymia. Mood stabilization, medication management, bilingual services.'
        : 'Tratamiento experto de trastorno bipolar en Naples, FL. La Dra. Melva Reve brinda atención integral para bipolar I, II y ciclotimia. Estabilización del ánimo, manejo de medicamentos, servicios bilingües.',
      keywords: language === 'en'
        ? 'bipolar disorder treatment Naples FL, mood stabilization Naples, bipolar psychiatrist Naples, manic depression treatment Naples, mood swings Naples, lithium treatment Naples'
        : 'tratamiento trastorno bipolar Naples FL, estabilización ánimo Naples, psiquiatra bipolar Naples, tratamiento depresión maníaca Naples, cambios humor Naples, tratamiento litio Naples',
      lang: language,
      canonical: language === 'en' ? '/services/bipolar-treatment' : '/es/servicios/tratamiento-bipolar'
    };
    updateSEO(seoData);
  }, [language]);

  const symptoms = language === 'en' ? [
    {
      type: 'Manic Episodes',
      icon: IconMoodUp,
      items: [
        'Elevated, euphoric mood',
        'Decreased need for sleep',
        'Racing thoughts or rapid speech',
        'Increased energy or activity',
        'Poor judgment or risky behavior',
        'Grandiose thoughts or inflated self-esteem'
      ]
    },
    {
      type: 'Depressive Episodes',
      icon: IconMoodSad,
      items: [
        'Persistent sadness or emptiness',
        'Loss of interest in activities',
        'Fatigue or loss of energy',
        'Difficulty concentrating',
        'Sleep disturbances',
        'Thoughts of death or suicide'
      ]
    }
  ] : [
    {
      type: 'Episodios Maníacos',
      icon: IconMoodUp,
      items: [
        'Estado de ánimo elevado, eufórico',
        'Disminución de la necesidad de dormir',
        'Pensamientos acelerados o habla rápida',
        'Aumento de energía o actividad',
        'Mal juicio o comportamiento arriesgado',
        'Pensamientos grandiosos o autoestima inflada'
      ]
    },
    {
      type: 'Episodios Depresivos',
      icon: IconMoodSad,
      items: [
        'Tristeza persistente o vacío',
        'Pérdida de interés en actividades',
        'Fatiga o pérdida de energía',
        'Dificultad para concentrarse',
        'Trastornos del sueño',
        'Pensamientos de muerte o suicidio'
      ]
    }
  ];

  const bipolarTypes = language === 'en' ? [
    {
      title: 'Bipolar I Disorder',
      description: 'Characterized by at least one manic episode that lasts 7 days or requires hospitalization.',
      features: [
        'Full manic episodes',
        'May include depressive episodes',
        'Significant functional impairment',
        'Often requires mood stabilizers'
      ]
    },
    {
      title: 'Bipolar II Disorder',
      description: 'Involves hypomanic episodes and major depressive episodes, but no full manic episodes.',
      features: [
        'Hypomanic episodes (less severe)',
        'Major depressive episodes',
        'Often misdiagnosed as depression',
        'Requires specialized treatment approach'
      ]
    },
    {
      title: 'Cyclothymic Disorder',
      description: 'Chronic mood instability with numerous periods of hypomanic and depressive symptoms.',
      features: [
        'Milder but chronic symptoms',
        'Symptoms for at least 2 years',
        'Periods of normal mood',
        'May progress to Bipolar I or II'
      ]
    }
  ] : [
    {
      title: 'Trastorno Bipolar I',
      description: 'Caracterizado por al menos un episodio maníaco que dura 7 días o requiere hospitalización.',
      features: [
        'Episodios maníacos completos',
        'Puede incluir episodios depresivos',
        'Deterioro funcional significativo',
        'A menudo requiere estabilizadores del ánimo'
      ]
    },
    {
      title: 'Trastorno Bipolar II',
      description: 'Involucra episodios hipomaníacos y episodios depresivos mayores, pero no episodios maníacos completos.',
      features: [
        'Episodios hipomaníacos (menos severos)',
        'Episodios depresivos mayores',
        'A menudo mal diagnosticado como depresión',
        'Requiere enfoque de tratamiento especializado'
      ]
    },
    {
      title: 'Trastorno Ciclotímico',
      description: 'Inestabilidad crónica del ánimo con numerosos períodos de síntomas hipomaníacos y depresivos.',
      features: [
        'Síntomas más leves pero crónicos',
        'Síntomas por al menos 2 años',
        'Períodos de estado de ánimo normal',
        'Puede progresar a Bipolar I o II'
      ]
    }
  ];

  const treatments = language === 'en' ? [
    {
      title: 'Comprehensive Mood Assessment',
      description: 'Detailed evaluation to accurately diagnose bipolar disorder type and rule out other conditions.'
    },
    {
      title: 'Mood Stabilizer Management',
      description: 'Expert prescribing and monitoring of mood stabilizers like lithium, anticonvulsants, and atypical antipsychotics.'
    },
    {
      title: 'Episode Prevention Planning',
      description: 'Strategies to identify early warning signs and prevent manic and depressive episodes.'
    },
    {
      title: 'Psychotherapy Coordination',
      description: 'Collaboration with therapists specializing in bipolar disorder, including CBT and family therapy.'
    },
    {
      title: 'Lifestyle & Sleep Management',
      description: 'Guidance on sleep hygiene, routine maintenance, and lifestyle factors crucial for mood stability.'
    },
    {
      title: 'Crisis Intervention Support',
      description: 'Emergency planning and support during acute manic or depressive episodes.'
    }
  ] : [
    {
      title: 'Evaluación Integral del Estado de Ánimo',
      description: 'Evaluación detallada para diagnosticar con precisión el tipo de trastorno bipolar y descartar otras condiciones.'
    },
    {
      title: 'Manejo de Estabilizadores del Ánimo',
      description: 'Prescripción experta y monitoreo de estabilizadores del ánimo como litio, anticonvulsivos y antipsicóticos atípicos.'
    },
    {
      title: 'Planificación de Prevención de Episodios',
      description: 'Estrategias para identificar señales de advertencia temprana y prevenir episodios maníacos y depresivos.'
    },
    {
      title: 'Coordinación de Psicoterapia',
      description: 'Colaboración con terapeutas especializados en trastorno bipolar, incluyendo TCC y terapia familiar.'
    },
    {
      title: 'Manejo de Estilo de Vida y Sueño',
      description: 'Orientación sobre higiene del sueño, mantenimiento de rutina y factores de estilo de vida cruciales para la estabilidad del ánimo.'
    },
    {
      title: 'Apoyo en Intervención de Crisis',
      description: 'Planificación de emergencia y apoyo durante episodios agudos maníacos o depresivos.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Mood Stability',
            es: 'Estabilidad del Ánimo'
          }}
          title={{
            en: 'Bipolar Disorder Treatment in Naples, FL',
            es: 'Tratamiento de Trastorno Bipolar en Naples, FL'
          }}
          description={{
            en: 'Find balance and stability with expert bipolar disorder treatment. Dr. Melva Reve provides comprehensive care for mood stabilization, helping you manage both manic and depressive episodes effectively.',
            es: 'Encuentre equilibrio y estabilidad con tratamiento experto de trastorno bipolar. La Dra. Melva Reve brinda atención integral para estabilización del ánimo, ayudándole a manejar episodios maníacos y depresivos efectivamente.'
          }}
          specialNote={{
            es: '<strong>El trastorno bipolar es una condición médica tratable.</strong> Con el tratamiento adecuado, puede lograr estabilidad del ánimo y vivir una vida plena. Ofrecemos atención especializada que comprende su cultura y necesidades.'
          }}
          facts={{
            title: {
              en: 'Bipolar Facts',
              es: 'Datos sobre Bipolar'
            },
            items: [
              {
                en: '2.8% of adults have bipolar disorder',
                es: '2.8% de adultos tienen trastorno bipolar'
              },
              {
                en: 'Mood stabilizers are highly effective',
                es: 'Los estabilizadores del ánimo son muy efectivos'
              },
              {
                en: 'Early treatment improves outcomes',
                es: 'El tratamiento temprano mejora resultados'
              },
              {
                en: 'Cultural sensitivity in treatment',
                es: 'Sensibilidad cultural en el tratamiento'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: 'Mood stabilizer management',
                es: 'Manejo de estabilizadores del ánimo'
              },
              {
                en: 'Episode prevention planning',
                es: 'Planificación de prevención de episodios'
              },
              {
                en: 'Crisis intervention support',
                es: 'Apoyo en intervención de crisis'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: bipolarImage,
            symbolImage: therapyRoomImage
          }}
        /> 

      </main>
      
      <Footer />
    </div>
  );
};

export default BipolarTreatment;
