import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, AlertTriangle } from 'lucide-react';

const ForPatients = () => {
  const { language } = useLanguage();

  const insuranceFeatures = [
    language === 'en' ? 'Most major insurance plans accepted' : 'Se aceptan la mayoría de los planes de seguro principales',
    language === 'en' ? 'Self-pay options available' : 'Opciones de pago por cuenta propia disponibles',
    language === 'en' ? 'Telehealth appointments covered' : 'Citas de telesalud cubiertas',
    language === 'en' ? 'Flexible payment plans' : 'Planes de pago flexibles'
  ];

  const expectations = [
    {
      title: language === 'en' ? 'Initial Consultation (60 minutes)' : 'Consulta Inicial (60 minutos)',
      description: language === 'en' 
        ? 'Comprehensive evaluation of your mental health history, current symptoms, and treatment goals.'
        : 'Evaluación integral de su historial de salud mental, síntomas actuales y objetivos de tratamiento.'
    },
    {
      title: language === 'en' ? 'Follow-up Appointments (30-45 minutes)' : 'Citas de Seguimiento (30-45 minutos)',
      description: language === 'en'
        ? 'Regular check-ins to monitor progress, adjust medications, and provide ongoing support.'
        : 'Controles regulares para monitorear el progreso, ajustar medicamentos y brindar apoyo continuo.'
    },
    {
      title: language === 'en' ? 'Treatment Planning' : 'Planificación del Tratamiento',
      description: language === 'en'
        ? 'Collaborative approach to developing a personalized treatment plan that fits your lifestyle and goals.'
        : 'Enfoque colaborativo para desarrollar un plan de tratamiento personalizado que se ajuste a su estilo de vida y objetivos.'
    },
    {
      title: language === 'en' ? 'Between Sessions' : 'Entre Sesiones',
      description: language === 'en'
        ? '24/7 on-call support for urgent situations and medication adjustments as needed.'
        : 'Soporte de guardia 24/7 para situaciones urgentes y ajustes de medicación según sea necesario.'
    }
  ];

  const faqItems = [
    {
      question: language === 'en' ? 'How soon can I get an appointment?' : '¿Qué tan pronto puedo conseguir una cita?',
      answer: language === 'en'
        ? 'We typically offer new patient appointments within 1-2 weeks. Urgent cases can often be accommodated sooner. Call us to discuss your specific needs and timeline.'
        : 'Típicamente ofrecemos citas para pacientes nuevos dentro de 1-2 semanas. Los casos urgentes a menudo pueden ser acomodados antes. Llámenos para discutir sus necesidades específicas y cronograma.'
    },
    {
      question: language === 'en' ? 'Do you offer telehealth appointments?' : '¿Ofrecen citas de telesalud?',
      answer: language === 'en'
        ? 'Yes, we offer secure telehealth appointments for both new and existing patients. This is especially convenient for follow-up visits and medication management.'
        : 'Sí, ofrecemos citas seguras de telesalud para pacientes nuevos y existentes. Esto es especialmente conveniente para visitas de seguimiento y manejo de medicamentos.'
    },
    {
      question: language === 'en' ? 'What should I bring to my first appointment?' : '¿Qué debo traer a mi primera cita?',
      answer: language === 'en'
        ? 'Please bring your insurance card, a valid ID, a list of current medications, and any relevant medical records. We\'ll also send you intake forms to complete before your visit.'
        : 'Por favor traiga su tarjeta de seguro, una identificación válida, una lista de medicamentos actuales, y cualquier registro médico relevante. También le enviaremos formularios de admisión para completar antes de su visita.'
    },
    {
      question: language === 'en' ? 'Do you provide services in Spanish?' : '¿Proporcionan servicios en español?',
      answer: language === 'en'
        ? 'Absolutely. Dr. Reve is fluent in Spanish and provides comprehensive psychiatric services in Spanish, ensuring clear communication and cultural understanding throughout your care.'
        : 'Absolutamente. La Dra. Reve habla español con fluidez y proporciona servicios psiquiátricos integrales en español, asegurando comunicación clara y comprensión cultural durante toda su atención.'
    }
  ];

  return (
    <section id="for-patients" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6" data-testid="for-patients-title">
            {language === 'en' ? 'For Patients' : 'Para Pacientes'}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto" data-testid="for-patients-description">
            {language === 'en'
              ? 'Important information about insurance, appointments, and what to expect during your care.'
              : 'Información importante sobre seguros, citas, y qué esperar durante su atención.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Insurance & Payment */}
          <Card className="bg-light-green p-8" data-testid="insurance-payment-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'Insurance & Payment' : 'Seguro y Pago'}
            </h3>
            <div className="space-y-4 mb-6">
              {insuranceFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-primary-green mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {language === 'en'
                ? 'We verify insurance benefits before your first appointment. Please bring your insurance card and a valid ID to your visit.'
                : 'Verificamos los beneficios del seguro antes de su primera cita. Por favor traiga su tarjeta de seguro y una identificación válida a su visita.'
              }
            </p>
          </Card>

          {/* What to Expect */}
          <Card className="bg-light-green-secondary p-8" data-testid="what-to-expect-card">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'What to Expect' : 'Qué Esperar'}
            </h3>
            <div className="space-y-4">
              {expectations.map((expectation, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {expectation.title}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {expectation.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center" data-testid="faq-title">
            {language === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h3>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4" data-testid="faq-accordion">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-6"
                  data-testid={`faq-item-${index}`}
                >
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-primary-green">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForPatients;
