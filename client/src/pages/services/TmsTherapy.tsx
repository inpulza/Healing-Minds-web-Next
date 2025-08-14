import { useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ServiceHeroMasonry } from '@/components/ServiceHeroMasonry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSEO } from '@/utils/seo';
import { ArrowRight, CheckCircle, Phone, Calendar, MapPin, Clock, Zap, Info } from 'lucide-react';
import { IconBrain, IconHeart, IconMoodHappy, IconBolt, IconTarget } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

// Import generated images
import doctorImage from "@assets/generated_images/Professional_psychiatrist_office_photo_e259ed9b.png";
import tmsImage from "@assets/generated_images/TMS_therapy_equipment_38dd31e3.png";
import therapyRoomImage from "@assets/generated_images/Therapy_room_interior_4b5878fd.png";

const TmsTherapy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'TMS Therapy Naples FL - Transcranial Magnetic Stimulation | Dr. Melva Reve'
        : 'Terapia TMS Naples FL - Estimulación Magnética Transcraneal | Dra. Melva Reve',
      description: language === 'en'
        ? 'Advanced TMS therapy in Naples, FL for treatment-resistant depression. Dr. Melva Reve offers transcranial magnetic stimulation as FDA-approved, non-invasive treatment option. Insurance covered.'
        : 'Terapia TMS avanzada en Naples, FL para depresión resistente al tratamiento. La Dra. Melva Reve ofrece estimulación magnética transcraneal como opción de tratamiento no invasiva aprobada por FDA. Cubierto por seguro.',
      keywords: language === 'en'
        ? 'TMS therapy Naples FL, transcranial magnetic stimulation Naples, treatment resistant depression Naples, TMS psychiatrist Naples, magnetic therapy Naples, non-invasive depression treatment Naples'
        : 'terapia TMS Naples FL, estimulación magnética transcraneal Naples, depresión resistente tratamiento Naples, psiquiatra TMS Naples, terapia magnética Naples, tratamiento depresión no invasivo Naples',
      lang: language,
      canonical: language === 'en' ? '/services/tms-therapy' : '/es/servicios/terapia-tms'
    };
    updateSEO(seoData);
  }, [language]);

  const benefits = language === 'en' ? [
    'FDA-approved for treatment-resistant depression',
    'Non-invasive, no anesthesia required',
    'Outpatient procedure with no downtime',
    'Minimal side effects compared to medications',
    'No memory or cognitive effects',
    'Can be combined with other treatments',
    'Insurance coverage often available',
    'Proven effective in clinical studies'
  ] : [
    'Aprobado por FDA para depresión resistente al tratamiento',
    'No invasivo, no requiere anestesia',
    'Procedimiento ambulatorio sin tiempo de inactividad',
    'Efectos secundarios mínimos comparado con medicamentos',
    'No hay efectos en memoria o cognición',
    'Puede combinarse con otros tratamientos',
    'Cobertura de seguro a menudo disponible',
    'Efectividad comprobada en estudios clínicos'
  ];

  const candidatesCriteria = language === 'en' ? [
    {
      title: 'Treatment-Resistant Depression',
      description: 'Have tried multiple antidepressant medications without sufficient improvement.'
    },
    {
      title: 'Major Depressive Disorder',
      description: 'Diagnosed with major depression and experiencing significant symptoms.'
    },
    {
      title: 'Unable to Tolerate Medications',
      description: 'Experience severe side effects from antidepressant medications.'
    },
    {
      title: 'Seeking Non-Drug Options',
      description: 'Prefer to avoid or reduce psychiatric medications while maintaining treatment.'
    },
    {
      title: 'Adolescent Depression',
      description: 'FDA-approved for teens (13+) with treatment-resistant depression.'
    },
    {
      title: 'Other Conditions',
      description: 'May be considered for certain anxiety disorders and other psychiatric conditions.'
    }
  ] : [
    {
      title: 'Depresión Resistente al Tratamiento',
      description: 'Ha probado múltiples medicamentos antidepresivos sin mejoría suficiente.'
    },
    {
      title: 'Trastorno Depresivo Mayor',
      description: 'Diagnosticado con depresión mayor y experimentando síntomas significativos.'
    },
    {
      title: 'No Puede Tolerar Medicamentos',
      description: 'Experimenta efectos secundarios severos de medicamentos antidepresivos.'
    },
    {
      title: 'Busca Opciones Sin Medicamentos',
      description: 'Prefiere evitar o reducir medicamentos psiquiátricos mientras mantiene tratamiento.'
    },
    {
      title: 'Depresión Adolescente',
      description: 'Aprobado por FDA para adolescentes (13+) con depresión resistente al tratamiento.'
    },
    {
      title: 'Otras Condiciones',
      description: 'Puede considerarse para ciertos trastornos de ansiedad y otras condiciones psiquiátricas.'
    }
  ];

  const treatmentProcess = language === 'en' ? [
    {
      step: '1',
      title: 'Initial Consultation',
      description: 'Comprehensive evaluation to determine if TMS is appropriate for your specific condition and history.'
    },
    {
      step: '2',
      title: 'Treatment Planning',
      description: 'Brain mapping and personalized treatment protocol development based on your individual needs.'
    },
    {
      step: '3',
      title: 'TMS Sessions',
      description: 'Daily 20-minute sessions for 4-6 weeks, typically 5 days per week in our comfortable setting.'
    },
    {
      step: '4',
      title: 'Progress Monitoring',
      description: 'Regular assessment of symptoms and treatment response with adjustments as needed.'
    },
    {
      step: '5',
      title: 'Maintenance Care',
      description: 'Follow-up sessions as needed to maintain treatment benefits and prevent relapse.'
    },
    {
      step: '6',
      title: 'Ongoing Support',
      description: 'Continued psychiatric care and coordination with other treatments for optimal outcomes.'
    }
  ] : [
    {
      step: '1',
      title: 'Consulta Inicial',
      description: 'Evaluación integral para determinar si TMS es apropiado para su condición específica e historia.'
    },
    {
      step: '2',
      title: 'Planificación del Tratamiento',
      description: 'Mapeo cerebral y desarrollo de protocolo de tratamiento personalizado basado en sus necesidades individuales.'
    },
    {
      step: '3',
      title: 'Sesiones de TMS',
      description: 'Sesiones diarias de 20 minutos por 4-6 semanas, típicamente 5 días por semana en nuestro ambiente cómodo.'
    },
    {
      step: '4',
      title: 'Monitoreo del Progreso',
      description: 'Evaluación regular de síntomas y respuesta al tratamiento con ajustes según sea necesario.'
    },
    {
      step: '5',
      title: 'Cuidado de Mantenimiento',
      description: 'Sesiones de seguimiento según sea necesario para mantener beneficios del tratamiento y prevenir recaída.'
    },
    {
      step: '6',
      title: 'Apoyo Continuo',
      description: 'Atención psiquiátrica continua y coordinación con otros tratamientos para resultados óptimos.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section with Masonry Layout */}
        <ServiceHeroMasonry
          tagline={{
            en: 'Advanced Brain Therapy',
            es: 'Terapia Cerebral Avanzada'
          }}
          title={{
            en: 'TMS Therapy in Naples, FL',
            es: 'Terapia TMS en Naples, FL'
          }}
          description={{
            en: 'Break through treatment-resistant depression with TMS therapy. Dr. Melva Reve offers FDA-approved transcranial magnetic stimulation - a revolutionary, non-invasive treatment that helps when medications haven\'t worked.',
            es: 'Supere la depresión resistente al tratamiento con terapia TMS. La Dra. Melva Reve ofrece estimulación magnética transcraneal aprobada por FDA - un tratamiento revolucionario, no invasivo que ayuda cuando los medicamentos no han funcionado.'
          }}
          specialNote={{
            es: '<strong>TMS es una opción esperanzadora cuando otros tratamientos no han funcionado.</strong> Esta tecnología avanzada ofrece nueva esperanza para la recuperación sin los efectos secundarios de medicamentos adicionales. Es seguro, efectivo y respaldado por investigación científica.'
          }}
          facts={{
            title: {
              en: 'TMS Facts',
              es: 'Datos sobre TMS'
            },
            items: [
              {
                en: 'FDA-approved for treatment-resistant depression',
                es: 'Aprobado por FDA para depresión resistente'
              },
              {
                en: 'Non-invasive, no anesthesia required',
                es: 'No invasivo, no requiere anestesia'
              },
              {
                en: '50-60% response rate in clinical trials',
                es: '50-60% tasa de respuesta en ensayos clínicos'
              },
              {
                en: 'Insurance coverage often available',
                es: 'Cobertura de seguro frecuentemente disponible'
              }
            ]
          }}
          quickStats={{
            items: [
              {
                en: '20-minute daily sessions',
                es: 'Sesiones diarias de 20 minutos'
              },
              {
                en: '4-6 week treatment course',
                es: 'Curso de tratamiento de 4-6 semanas'
              },
              {
                en: 'Minimal side effects',
                es: 'Efectos secundarios mínimos'
              }
            ]
          }}
          images={{
            doctorImage,
            therapyRoomImage: tmsImage,
            symbolImage: therapyRoomImage
          }}
        />

      </main>
      
      <Footer />
    </div>
  );
};

export default TmsTherapy;
