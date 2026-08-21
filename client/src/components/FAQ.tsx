import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronDown, HelpCircle } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import { homeFaqs } from '@/data/homeFaqs';

const FAQ = () => {
  const { language } = useLanguage();
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = homeFaqs[language];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <WellnessIcon size="md" color="green" className="opacity-80">
              <HelpCircle />
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
                aria-expanded={openItem === index}
                aria-controls={`faq-answer-panel-${index}`}
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
              
              <div
                id={`faq-answer-panel-${index}`}
                aria-hidden={openItem !== index}
                className={`px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6 ${openItem === index ? 'block' : 'hidden'}`}
              >
                  <div className="pt-2 border-t border-green-100">
                    <p 
                      className="text-gray-600 font-body leading-relaxed text-lg"
                      data-testid={`faq-answer-${index}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
