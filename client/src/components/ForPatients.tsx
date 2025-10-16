import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, FileText, Shield, DollarSign, Phone } from 'lucide-react';
import { Link } from 'wouter';

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
      title: language === 'en' ? 'Initial Consultation (15 minutes)' : 'Consulta Inicial (15 minutos)',
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



  return (
    <section id="for-patients" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-body font-bold text-gray-900 mb-6" data-testid="for-patients-title">
            {language === 'en' ? <>For <span className="font-display italic text-green-700">Patients</span></> : <>Para <span className="font-display italic text-green-700">Pacientes</span></>}
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

        {/* Important Policies Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            {language === 'en' ? 'Important Policies' : 'Políticas Importantes'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href={language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'} data-testid="link-cancellation-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <FileText className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Cancellation Policy' : 'Política de Cancelación'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? '24-hour notice required' 
                      : 'Aviso de 24 horas requerido'}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/billing-policy' : '/es/politica-facturacion'} data-testid="link-billing-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <DollarSign className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Billing Policy' : 'Política de Facturación'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Insurance & payment information' 
                      : 'Información de seguro y pagos'}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/emergency-policy' : '/es/politica-emergencias'} data-testid="link-emergency-policy">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Phone className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Emergency Policy' : 'Política de Emergencias'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Crisis & emergency resources' 
                      : 'Recursos de crisis y emergencia'}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href={language === 'en' ? '/patient-rights' : '/es/derechos-paciente'} data-testid="link-patient-rights">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-8 h-8 text-primary-green mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Patient Rights' : 'Derechos del Paciente'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Your rights & responsibilities' 
                      : 'Sus derechos y responsabilidades'}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ForPatients;
