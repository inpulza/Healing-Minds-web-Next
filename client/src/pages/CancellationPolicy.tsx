import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const CancellationPolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Cancellation & No-Show Policy | Healing Minds Psychiatry'
        : 'Política de Cancelación y No Asistencia | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Please review our 24-hour cancellation and no-show policy for appointments at Healing Minds Psychiatry in Naples, FL.'
        : 'Por favor revise nuestra política de cancelación de 24 horas y no asistencia para citas en Healing Minds Psychiatry en Naples, FL.',
      keywords: language === 'en'
        ? 'cancellation policy, no-show policy, appointment cancellation, late cancellation fee, psychiatry appointments Naples'
        : 'política cancelación, política no asistencia, cancelación citas, cargo cancelación tardía, citas psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Cancellation and No-Show Policy' : 'Política de Cancelación y No Asistencia'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="cancellation-policy-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    At Healing Minds Psychiatry, we are committed to providing exceptional and timely care to all of our patients. When you schedule an appointment, we reserve that time exclusively for you. Late cancellations and absences prevent us from being able to offer that space to another patient who needs it.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    For this reason, we maintain a strict <strong>24 business hours cancellation policy</strong>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cancellation Requirement</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We ask that if you need to cancel or reschedule your appointment, you do so with at least <strong>24 business hours' notice</strong>. This allows us to offer the space to someone else on our waiting list.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Late Cancellation or No-Show Fee</h2>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Cancellations made with <strong>less than 24 business hours' notice</strong> prior to the scheduled appointment time will be subject to a late cancellation fee of <strong>$50.00</strong>.
                    </li>
                    <li>
                      Patients who <strong>fail to show up</strong> for their appointment without notifying the clinic will also be subject to a <strong>$50.00</strong> fee.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Appointment Confirmation</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    As a courtesy, our system or staff may attempt to contact you to confirm your appointment. However, <strong>it is the patient's responsibility to remember, attend, or cancel their appointment on time</strong>. Failure to receive a confirmation call or message does not exempt you from this policy.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Exceptions</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We understand that serious and unavoidable medical emergencies can occur. Exceptions to this policy for documented emergencies will be considered on a case-by-case basis, at the clinic's discretion.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Acknowledgment</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    By scheduling an appointment with Healing Minds Psychiatry, you acknowledge and agree to the terms of our Cancellation and No-Show Policy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    En Healing Minds Psychiatry, nos comprometemos a proporcionar una atención excepcional y oportuna a todos nuestros pacientes. Cuando usted agenda una cita, reservamos ese tiempo exclusivamente para usted. Las cancelaciones tardías y las ausencias impiden que podamos ofrecer ese espacio a otro paciente que lo necesite.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Por esta razón, mantenemos una estricta <strong>política de cancelación de 24 horas hábiles</strong>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Requisito de Cancelación</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Le pedimos que, si necesita cancelar o reprogramar su cita, lo haga con al menos <strong>24 horas hábiles de antelación</strong>. Esto nos permite ofrecer el espacio a otra persona en nuestra lista de espera.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cargo por Cancelación Tardía o No Asistencia</h2>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      Las cancelaciones realizadas con <strong>menos de 24 horas hábiles</strong> de antelación a la hora de la cita programada estarán sujetas a un cargo por cancelación tardía de <strong>$50.00</strong>.
                    </li>
                    <li>
                      Los pacientes que <strong>no se presenten</strong> a su cita sin notificar a la clínica también estarán sujetos a un cargo de <strong>$50.00</strong>.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Confirmación de Citas</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Como cortesía, nuestro sistema o personal puede intentar contactarlo para confirmar su cita. Sin embargo, <strong>es responsabilidad del paciente recordar, asistir o cancelar su cita a tiempo</strong>. El no recibir una llamada o mensaje de confirmación no exime de la aplicación de esta política.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Excepciones a la Política</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Entendemos que pueden ocurrir emergencias médicas graves e inevitables. Las excepciones a esta política por emergencias documentadas se considerarán caso por caso, a discreción de la clínica.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reconocimiento de la Política</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Al agendar una cita con Healing Minds Psychiatry, usted reconoce y acepta los términos de nuestra Política de Cancelación y No Asistencia.
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

export default CancellationPolicy;
