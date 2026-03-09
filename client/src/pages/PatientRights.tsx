import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Shield, Heart } from 'lucide-react';

const PatientRights = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Patient Rights & Responsibilities | Healing Minds Psychiatry'
        : 'Derechos y Responsabilidades del Paciente | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Learn about your rights and responsibilities as a patient at Healing Minds Psychiatry, ensuring a respectful and collaborative therapeutic relationship.'
        : 'Conozca sus derechos y responsabilidades como paciente en Healing Minds Psychiatry, asegurando una relación terapéutica respetuosa y colaborativa.',
      keywords: language === 'en'
        ? 'patient rights, patient responsibilities, HIPAA, confidentiality, informed consent, mental health rights Florida'
        : 'derechos paciente, responsabilidades paciente, HIPAA, confidencialidad, consentimiento informado, derechos salud mental Florida',
      lang: language,
      canonical: language === 'en' ? '/patient-rights' : '/es/derechos-paciente'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Patient Rights and Responsibilities' : 'Derechos y Responsabilidades del Paciente'}
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="patient-rights-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    We believe that a successful therapeutic relationship is built on mutual respect and collaboration. Below are your rights as a patient and the responsibilities we ask you to assume to ensure the best possible outcome for your treatment.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">Your Rights as a Patient</h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    In accordance with Florida Statutes and federal regulations, you have the right to:
                  </p>

                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Respectful Treatment:</strong> Receive respectful, compassionate, and dignified care at all times, regardless of race, national origin, religion, disability, or payment source.
                    </li>
                    <li>
                      <strong>Complete Confidentiality:</strong> Have your medical information kept confidential in accordance with HIPAA and Florida law. Florida provides enhanced privacy protections for mental health records, requiring your express written consent for most disclosures.
                    </li>
                    <li>
                      <strong>Informed Consent:</strong> Receive clear, understandable information about your diagnosis, treatment options, risks and benefits of medications, and alternative treatments before giving consent.
                    </li>
                    <li>
                      <strong>Active Participation:</strong> Participate actively in decisions about your treatment plan and have your preferences considered.
                    </li>
                    <li>
                      <strong>Right to Refuse Treatment:</strong> Refuse any recommended treatment, including experimental procedures, with an understanding of the medical consequences of your decision.
                    </li>
                    <li>
                      <strong>Access to Records:</strong> Request access to your medical records in accordance with state and federal law, subject to certain safety exceptions.
                    </li>
                    <li>
                      <strong>Second Opinion:</strong> Seek a second opinion from another qualified mental health professional at any time.
                    </li>
                    <li>
                      <strong>Language Services:</strong> Request interpreter services if English is not your primary language or if you have communication barriers.
                    </li>
                    <li>
                      <strong>Clear Information:</strong> Ask questions and receive clear answers about our policies, fees, and billing practices.
                    </li>
                    <li>
                      <strong>File Complaints:</strong> File grievances or complaints about your care without fear of retaliation. You may contact the Florida Department of Health or the Florida Agency for Health Care Administration.
                    </li>
                    <li>
                      <strong>Privacy During Communication:</strong> Communicate privately with your attorney, family members, or other persons of your choosing, subject to reasonable facility rules.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">Your Responsibilities as a Patient</h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    To help us provide you with the best possible care, we ask that you:
                  </p>

                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Provide Accurate Information:</strong> Give complete and accurate information about your medical history, current symptoms, medications, and allergies.
                    </li>
                    <li>
                      <strong>Attend Appointments:</strong> Arrive on time for scheduled appointments or cancel with the required advance notice as outlined in our <a href="/cancellation-policy" className="text-green-600 hover:text-green-700 underline">Cancellation Policy</a>.
                    </li>
                    <li>
                      <strong>Follow Treatment Plan:</strong> Comply with the agreed-upon treatment plan, including taking medications as directed by your provider and following recommended lifestyle modifications.
                    </li>
                    <li>
                      <strong>Communicate Changes:</strong> Promptly report any problems, side effects, or changes in your condition to your healthcare provider.
                    </li>
                    <li>
                      <strong>Honor Financial Obligations:</strong> Make timely payments for services received, including copayments and cancellation fees, as outlined in our <a href="/billing-policy" className="text-green-600 hover:text-green-700 underline">Billing Policy</a>.
                    </li>
                    <li>
                      <strong>Ask Questions:</strong> Seek clarification when you don't understand your diagnosis, treatment plan, or instructions.
                    </li>
                    <li>
                      <strong>Respectful Behavior:</strong> Treat our staff and other patients with courtesy, respect, and consideration.
                    </li>
                    <li>
                      <strong>Inform Us of Coverage Changes:</strong> Notify our office promptly of any changes to your insurance coverage or contact information.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Filing a Complaint</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you have concerns about your care or believe your rights have been violated, you may file a complaint with:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Florida Department of Health</p>
                      <p className="text-gray-700 dark:text-gray-300">Consumer Services Unit</p>
                      <p className="text-gray-700 dark:text-gray-300">Phone: 1-850-245-4444 (Monday-Friday, 8am-5pm EST)</p>
                      <p className="text-gray-700 dark:text-gray-300">Mailing Address: 4052 Bald Cypress Way, Bin C-75, Tallahassee, FL 32399-3275</p>
                      <p className="text-gray-700 dark:text-gray-300">Website: <a href="https://www.floridahealth.gov" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">floridahealth.gov</a></p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Agency for Health Care Administration (AHCA)</p>
                      <p className="text-gray-700 dark:text-gray-300">Health Care Complaint Hotline</p>
                      <p className="text-gray-700 dark:text-gray-300">Phone: 1-888-419-3456 (24/7 automated system)</p>
                      <p className="text-gray-700 dark:text-gray-300">TTY (Florida Relay): 1-800-955-8771</p>
                      <p className="text-gray-700 dark:text-gray-300">Mailing Address: 2727 Mahan Drive, Mail Stop #3, Tallahassee, FL 32308</p>
                      <p className="text-gray-700 dark:text-gray-300">Website: <a href="https://www.ahca.myflorida.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">ahca.myflorida.com</a></p>
                      <p className="text-gray-700 dark:text-gray-300">Online Complaint Form: <a href="https://apps.ahca.myflorida.com/smcforms/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">File a Complaint</a></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Acknowledgment</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    By receiving services at Healing Minds Psychiatry, you acknowledge that you have been informed of your rights and responsibilities as a patient and agree to participate in your treatment in accordance with these principles.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Creemos que una relación terapéutica exitosa se basa en el respeto mutuo y la colaboración. A continuación, se describen sus derechos como paciente y las responsabilidades que le pedimos que asuma para asegurar el mejor resultado posible de su tratamiento.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">Sus Derechos como Paciente</h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    De acuerdo con los Estatutos de Florida y las regulaciones federales, usted tiene derecho a:
                  </p>

                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Trato Respetuoso:</strong> Recibir un trato respetuoso, compasivo y digno en todo momento, independientemente de su raza, origen nacional, religión, discapacidad o forma de pago.
                    </li>
                    <li>
                      <strong>Confidencialidad Completa:</strong> Mantener su información médica confidencial de acuerdo con HIPAA y la ley de Florida. Florida proporciona protecciones de privacidad mejoradas para registros de salud mental, requiriendo su consentimiento escrito expreso para la mayoría de las divulgaciones.
                    </li>
                    <li>
                      <strong>Consentimiento Informado:</strong> Recibir información clara y comprensible sobre su diagnóstico, opciones de tratamiento, riesgos y beneficios de los medicamentos, y tratamientos alternativos antes de dar su consentimiento.
                    </li>
                    <li>
                      <strong>Participación Activa:</strong> Participar activamente en las decisiones sobre su plan de tratamiento y que sus preferencias sean consideradas.
                    </li>
                    <li>
                      <strong>Derecho a Rechazar Tratamiento:</strong> Rechazar cualquier tratamiento recomendado, incluidos los procedimientos experimentales, comprendiendo las consecuencias médicas de su decisión.
                    </li>
                    <li>
                      <strong>Acceso a Registros:</strong> Solicitar acceso a sus registros médicos de acuerdo con la ley estatal y federal, sujeto a ciertas excepciones de seguridad.
                    </li>
                    <li>
                      <strong>Segunda Opinión:</strong> Buscar una segunda opinión de otro profesional de salud mental calificado en cualquier momento.
                    </li>
                    <li>
                      <strong>Servicios de Idioma:</strong> Solicitar servicios de intérprete si el inglés no es su idioma principal o si tiene barreras de comunicación.
                    </li>
                    <li>
                      <strong>Información Clara:</strong> Hacer preguntas y recibir respuestas claras sobre nuestras políticas, tarifas y prácticas de facturación.
                    </li>
                    <li>
                      <strong>Presentar Quejas:</strong> Presentar quejas o reclamos sobre su atención sin temor a represalias. Puede contactar al Departamento de Salud de Florida o a la Agencia para la Administración del Cuidado de la Salud de Florida.
                    </li>
                    <li>
                      <strong>Privacidad Durante Comunicación:</strong> Comunicarse en privado con su abogado, familiares u otras personas de su elección, sujeto a reglas razonables de las instalaciones.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-6 w-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-0">Sus Responsabilidades como Paciente</h2>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Para ayudarnos a brindarle la mejor atención posible, le pedimos que:
                  </p>

                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Proporcione Información Precisa:</strong> Brinde información completa y precisa sobre su historial médico, síntomas actuales, medicamentos y alergias.
                    </li>
                    <li>
                      <strong>Asista a las Citas:</strong> Llegue a tiempo a las citas programadas o cancele con el aviso previo requerido según se describe en nuestra <a href="/es/politica-cancelacion" className="text-green-600 hover:text-green-700 underline">Política de Cancelación</a>.
                    </li>
                    <li>
                      <strong>Siga el Plan de Tratamiento:</strong> Cumpla con el plan de tratamiento acordado, incluyendo tomar medicamentos según las indicaciones de su proveedor y seguir las modificaciones de estilo de vida recomendadas.
                    </li>
                    <li>
                      <strong>Comunique Cambios:</strong> Reporte de inmediato cualquier problema, efecto secundario o cambio en su condición a su proveedor de atención médica.
                    </li>
                    <li>
                      <strong>Honre Obligaciones Financieras:</strong> Realice pagos oportunos por los servicios recibidos, incluidos copagos y cargos por cancelación, según se describe en nuestra <a href="/es/politica-facturacion" className="text-green-600 hover:text-green-700 underline">Política de Facturación</a>.
                    </li>
                    <li>
                      <strong>Haga Preguntas:</strong> Busque aclaraciones cuando no comprenda su diagnóstico, plan de tratamiento o instrucciones.
                    </li>
                    <li>
                      <strong>Comportamiento Respetuoso:</strong> Trate a nuestro personal y a otros pacientes con cortesía, respeto y consideración.
                    </li>
                    <li>
                      <strong>Infórmenos de Cambios en Cobertura:</strong> Notifique a nuestra oficina de inmediato sobre cualquier cambio en su cobertura de seguro o información de contacto.
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Presentar una Queja</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Si tiene inquietudes sobre su atención o cree que sus derechos han sido violados, puede presentar una queja con:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Departamento de Salud de Florida</p>
                      <p className="text-gray-700 dark:text-gray-300">Unidad de Servicios al Consumidor</p>
                      <p className="text-gray-700 dark:text-gray-300">Teléfono: 1-850-245-4444 (Lunes-Viernes, 8am-5pm EST)</p>
                      <p className="text-gray-700 dark:text-gray-300">Dirección Postal: 4052 Bald Cypress Way, Bin C-75, Tallahassee, FL 32399-3275</p>
                      <p className="text-gray-700 dark:text-gray-300">Sitio web: <a href="https://www.floridahealth.gov" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">floridahealth.gov</a></p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Agencia para la Administración del Cuidado de la Salud (AHCA)</p>
                      <p className="text-gray-700 dark:text-gray-300">Línea Directa de Quejas de Cuidado de la Salud</p>
                      <p className="text-gray-700 dark:text-gray-300">Teléfono: 1-888-419-3456 (Sistema automatizado 24/7)</p>
                      <p className="text-gray-700 dark:text-gray-300">TTY (Servicio de Relay de Florida): 1-800-955-8771</p>
                      <p className="text-gray-700 dark:text-gray-300">Dirección Postal: 2727 Mahan Drive, Mail Stop #3, Tallahassee, FL 32308</p>
                      <p className="text-gray-700 dark:text-gray-300">Sitio web: <a href="https://www.ahca.myflorida.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">ahca.myflorida.com</a></p>
                      <p className="text-gray-700 dark:text-gray-300">Formulario de Quejas en Línea: <a href="https://apps.ahca.myflorida.com/smcforms/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">Presentar una Queja</a></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reconocimiento de la Política</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Al recibir servicios en Healing Minds Psychiatry, usted reconoce que ha sido informado de sus derechos y responsabilidades como paciente y acepta participar en su tratamiento de acuerdo con estos principios.
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

export default PatientRights;
