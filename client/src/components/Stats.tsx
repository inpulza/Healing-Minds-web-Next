import { useLanguage } from '@/hooks/useLanguage';

const Stats = () => {
  const { language } = useLanguage();

  const services = [
    'Anxiety Disorders',
    'Depression Treatment',
    'ADHD Assessment',
    'PTSD Therapy',
    'Bipolar Disorder',
    'OCD Treatment',
    'Panic Disorders',
    'Social Anxiety',
    'Mood Stabilization',
    'Trauma-Informed Care',
    'Medication Management',
    'Psychoeducation',
    'Crisis Intervention',
    'Stress Management'
  ];

  const servicesSpanish = [
    'Trastornos de Ansiedad',
    'Tratamiento de Depresión',
    'Evaluación de TDAH',
    'Terapia para TEPT',
    'Trastorno Bipolar',
    'Tratamiento TOC',
    'Trastornos de Pánico',
    'Ansiedad Social',
    'Estabilización del Estado de Ánimo',
    'Atención Informada por Trauma',
    'Manejo de Medicamentos',
    'Psicoeducación',
    'Intervención de Crisis',
    'Manejo del Estrés'
  ];

  const displayServices = language === 'en' ? services : servicesSpanish;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[95%] mx-auto">
        <div className="bg-gray-100 rounded-3xl py-6 relative overflow-hidden">
          {/* Continuous sliding animation */}
          <div className="flex animate-scroll whitespace-nowrap">
            {/* First set */}
            <div className="flex items-center space-x-8 text-green-700 font-body font-medium text-lg px-4">
              {displayServices.map((service, index) => (
                <div key={index} className="flex items-center space-x-8">
                  <span className="whitespace-nowrap">{service}</span>
                  <span className="text-green-400">•</span>
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex items-center space-x-8 text-green-700 font-body font-medium text-lg px-4">
              {displayServices.map((service, index) => (
                <div key={`duplicate-${index}`} className="flex items-center space-x-8">
                  <span className="whitespace-nowrap">{service}</span>
                  <span className="text-green-400">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
