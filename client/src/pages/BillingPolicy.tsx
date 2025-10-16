import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const BillingPolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Billing & Fees Policy | Healing Minds Psychiatry'
        : 'Política de Facturación y Pagos | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Learn about billing, fees, insurance, and payment policies at Healing Minds Psychiatry in Naples, FL.'
        : 'Conozca sobre facturación, tarifas, seguros y políticas de pago en Healing Minds Psychiatry en Naples, FL.',
      keywords: language === 'en'
        ? 'billing policy, payment fees, insurance copayment, credit card fees, psychiatry billing Naples'
        : 'política facturación, tarifas pago, copago seguro, tarifas tarjeta crédito, facturación psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/billing-policy' : '/es/politica-facturacion'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Billing and Payment Policy' : 'Política de Facturación y Pagos'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="billing-policy-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Our goal is to be transparent about our rates and billing policies so you can focus on your well-being. We are committed to providing clear information about all costs associated with your care.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Insurance Coverage</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We accept a variety of major insurance plans. It is the patient's responsibility to verify coverage and benefits with their insurance provider before the appointment. Our team can assist you with this process if needed.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Please contact our office to confirm whether we accept your specific insurance plan and to understand your coverage details, including deductibles and out-of-pocket maximums.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Copayments</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    All copayments required by your insurance must be paid at the time of service. We accept credit cards, debit cards, cash, and checks.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Self-Pay Patients</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We offer competitive rates for patients who do not use insurance. Please contact our office for an updated list of our consultation fees and service rates. We are happy to provide a good faith estimate of costs for scheduled services upon request.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Late Cancellation Fees</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    As detailed in our <a href="/cancellation-policy" className="text-green-600 hover:text-green-700 underline">Cancellation Policy</a>, a $50.00 fee will be charged for late cancellations or no-shows.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Credit Card Processing Fee</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Please be aware that all payments made by credit card, including cancellation fees, are subject to a <strong>non-refundable 3% processing fee</strong> on the total amount. This fee is charged by our payment processing provider to cover transaction costs.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Example:</strong> A $50.00 charge will result in a total of $51.50 (including the 3% processing fee).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>How to Avoid This Fee:</strong> You may pay with cash, check, or debit card to avoid the credit card processing fee.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Insurance Claims Processing</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We will submit claims to your insurance company on your behalf. Please note that insurance processing times vary by provider, typically ranging from 2-6 weeks. Any remaining balance after insurance payment is your responsibility and must be paid within 30 days of billing.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Payment Plans and Financial Assistance</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you are experiencing financial hardship, please speak with our billing department. We may be able to arrange a payment plan or discuss other options to help make your care more affordable.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Billing Questions</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you have questions about your bill or need clarification on any charges, please contact our billing department at <a href="tel:+12394230272" className="text-green-600 hover:text-green-700 underline">(239) 423-0272</a> or email us at <a href="mailto:info@healingmindsp.com" className="text-green-600 hover:text-green-700 underline">info@healingmindsp.com</a>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Acknowledgment</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    By receiving services at Healing Minds Psychiatry, you acknowledge and agree to our Billing and Payment Policy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Nuestro objetivo es ser transparentes sobre nuestras tarifas y políticas de facturación para que usted pueda centrarse en su bienestar. Nos comprometemos a proporcionar información clara sobre todos los costos asociados con su atención.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Seguros Médicos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Aceptamos una variedad de los principales planes de seguro. Es responsabilidad del paciente verificar su cobertura y beneficios con su proveedor de seguros antes de la cita. Nuestro equipo puede asistirle en este proceso si lo necesita.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Por favor, contacte nuestra oficina para confirmar si aceptamos su plan de seguro específico y para entender los detalles de su cobertura, incluyendo deducibles y máximos de gastos de bolsillo.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Copagos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Todos los copagos requeridos por su seguro deben ser pagados en el momento del servicio. Aceptamos tarjetas de crédito, tarjetas de débito, efectivo y cheques.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Pacientes de Pago Privado (Self-Pay)</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ofrecemos tarifas competitivas para pacientes que no utilizan seguro. Por favor, contacte nuestra oficina para obtener una lista actualizada de nuestras tarifas de consulta y servicios. Con gusto proporcionamos un estimado de buena fe de los costos para servicios programados cuando lo solicite.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cargos por Cancelación Tardía</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Como se detalla en nuestra <a href="/es/politica-cancelacion" className="text-green-600 hover:text-green-700 underline">Política de Cancelación</a>, se aplicará un cargo de $50.00 por cancelaciones tardías o ausencias.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tarifa de Procesamiento de Tarjeta de Crédito</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Por favor, tenga en cuenta que todos los pagos realizados con tarjeta de crédito, incluyendo los cargos por cancelación, están sujetos a una <strong>tarifa de procesamiento no reembolsable del 3%</strong> sobre el monto total. Este cargo es aplicado por nuestro proveedor de procesamiento de pagos para cubrir los costos de transacción.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Ejemplo:</strong> Un cargo de $50.00 resultará en un total de $51.50 (incluyendo la tarifa de procesamiento del 3%).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Cómo Evitar Esta Tarifa:</strong> Puede pagar con efectivo, cheque o tarjeta de débito para evitar la tarifa de procesamiento de tarjeta de crédito.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Procesamiento de Reclamos de Seguro</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Enviaremos los reclamos a su compañía de seguros en su nombre. Tenga en cuenta que los tiempos de procesamiento de seguros varían según el proveedor, típicamente oscilando entre 2-6 semanas. Cualquier saldo restante después del pago del seguro es su responsabilidad y debe pagarse dentro de los 30 días de la facturación.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Planes de Pago y Asistencia Financiera</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Si está experimentando dificultades financieras, por favor hable con nuestro departamento de facturación. Es posible que podamos organizar un plan de pago o discutir otras opciones para ayudar a que su atención sea más asequible.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Preguntas sobre Facturación</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Si tiene preguntas sobre su factura o necesita aclaración sobre algún cargo, por favor contacte nuestro departamento de facturación al <a href="tel:+12394230272" className="text-green-600 hover:text-green-700 underline">(239) 423-0272</a> o envíenos un email a <a href="mailto:info@healingmindsp.com" className="text-green-600 hover:text-green-700 underline">info@healingmindsp.com</a>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reconocimiento de la Política</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Al recibir servicios en Healing Minds Psychiatry, usted reconoce y acepta nuestra Política de Facturación y Pagos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPolicy;
