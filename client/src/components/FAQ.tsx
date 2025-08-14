import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronDown } from 'lucide-react';
import { IconHelp } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';

const FAQ = () => {
  const { language } = useLanguage();
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: language === 'en' 
        ? 'What can I expect in my first session?'
        : '¿Qué puedo esperar en mi primera sesión?',
      answer: language === 'en'
        ? 'Your first session is a comprehensive evaluation where we\'ll discuss your current challenges, history, and goals. It\'s a collaborative process designed to create a personalized treatment plan that works for you. It typically lasts 75 minutes.'
        : 'Su primera sesión es una evaluación integral donde discutiremos sus desafíos actuales, historial y objetivos. Es un proceso colaborativo diseñado para crear un plan de tratamiento personalizado que funcione para usted. Típicamente dura 75 minutos.'
    },
    {
      question: language === 'en'
        ? 'What is the difference between a psychiatrist and a psychologist?'
        : '¿Cuál es la diferencia entre un psiquiatra y un psicólogo?',
      answer: language === 'en'
        ? 'A psychiatrist is a medical doctor who can prescribe medications and provide medical treatment for mental health conditions. A psychologist focuses on therapy and counseling but cannot prescribe medications. As a psychiatrist, Dr. Reve can provide both therapy and medication management.'
        : 'Un psiquiatra es un médico que puede recetar medicamentos y proporcionar tratamiento médico para condiciones de salud mental. Un psicólogo se enfoca en terapia y consejería pero no puede recetar medicamentos. Como psiquiatra, la Dra. Reve puede proporcionar tanto terapia como manejo de medicamentos.'
    },
    {
      question: language === 'en'
        ? 'Is my information kept confidential?'
        : '¿Se mantiene confidencial mi información?',
      answer: language === 'en'
        ? 'Yes, absolutely. All information shared in our sessions is strictly confidential and protected by HIPAA laws. Information is only shared with your written consent or in rare cases required by law for safety reasons.'
        : 'Sí, absolutamente. Toda la información compartida en nuestras sesiones es estrictamente confidencial y está protegida por las leyes HIPAA. La información solo se comparte con su consentimiento por escrito o en casos raros requeridos por ley por razones de seguridad.'
    },
    {
      question: language === 'en'
        ? 'How do I know if I need medication?'
        : '¿Cómo sé si necesito medicación?',
      answer: language === 'en'
        ? 'Medication decisions are always made collaboratively between you and Dr. Reve. We\'ll discuss your symptoms, treatment history, and preferences. Many conditions can be treated with therapy alone, while others may benefit from a combination of therapy and medication.'
        : 'Las decisiones sobre medicación siempre se toman en colaboración entre usted y la Dra. Reve. Discutiremos sus síntomas, historial de tratamiento y preferencias. Muchas condiciones pueden tratarse solo con terapia, mientras que otras pueden beneficiarse de una combinación de terapia y medicación.'
    },
    {
      question: language === 'en'
        ? 'Do you accept insurance?'
        : '¿Aceptan seguro médico?',
      answer: language === 'en'
        ? 'We accept most major insurance plans. Our staff will verify your benefits and explain your coverage before your first appointment. We also offer flexible payment options for those without insurance coverage.'
        : 'Aceptamos la mayoría de los planes de seguro principales. Nuestro personal verificará sus beneficios y explicará su cobertura antes de su primera cita. También ofrecemos opciones de pago flexibles para aquellos sin cobertura de seguro.'
    },
    {
      question: language === 'en'
        ? 'How often will I need to come in for appointments?'
        : '¿Con qué frecuencia necesitaré venir a las citas?',
      answer: language === 'en'
        ? 'Appointment frequency depends on your individual needs and treatment plan. Initially, appointments may be weekly or bi-weekly. As you progress, the frequency may decrease. We\'ll work together to find a schedule that supports your mental health goals.'
        : 'La frecuencia de las citas depende de sus necesidades individuales y plan de tratamiento. Inicialmente, las citas pueden ser semanales o quincenales. A medida que progrese, la frecuencia puede disminuir. Trabajaremos juntos para encontrar un horario que apoye sus objetivos de salud mental.'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <WellnessIcon size="md" color="green" className="opacity-80">
              <IconHelp />
            </WellnessIcon>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-body font-bold text-green-800" data-testid="faq-title">
              {language === 'en' ? <>Frequently <span className="font-display italic text-green-700">Asked</span> Questions</> : <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span></>}
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed" data-testid="faq-description">
            {language === 'en'
              ? 'Find answers to common questions about psychiatric care and our services.'
              : 'Encuentre respuestas a preguntas comunes sobre atención psiquiátrica y nuestros servicios.'
            }
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenItem(openItem === index ? null : index)}
                className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-green-50 transition-colors duration-200"
                data-testid={`faq-question-${index}`}
              >
                <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 pr-4 sm:pr-8">
                  {faq.question}
                </h3>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  openItem === index 
                    ? 'bg-green-600' 
                    : 'bg-green-200'
                }`}>
                  <ChevronDown 
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                      openItem === index 
                        ? 'text-white rotate-180' 
                        : 'text-green-700'
                    }`} 
                  />
                </div>
              </button>
              
              {openItem === index && (
                <div className="px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6">
                  <div className="pt-2 border-t border-green-100">
                    <p 
                      className="text-gray-600 font-body leading-relaxed text-lg"
                      data-testid={`faq-answer-${index}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;