import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { AlertTriangle, Phone } from 'lucide-react';

const EmergencyPolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Emergency & Crisis Policy | Healing Minds Psychiatry'
        : 'Política de Emergencia y Crisis | Healing Minds Psychiatry',
      description: language === 'en'
        ? 'Important information regarding mental health emergencies. Healing Minds Psychiatry is not an emergency service. Know who to call in a crisis.'
        : 'Información importante sobre emergencias de salud mental. Healing Minds Psychiatry no es un servicio de emergencia. Sepa a quién llamar en una crisis.',
      keywords: language === 'en'
        ? 'mental health emergency, crisis policy, suicide prevention, 988 lifeline, Baker Act Florida, crisis intervention'
        : 'emergencia salud mental, política crisis, prevención suicidio, línea 988, Baker Act Florida, intervención crisis',
      lang: language,
      canonical: language === 'en' ? '/emergency-policy' : '/es/politica-emergencias'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Emergency and Crisis Policy' : 'Política de Emergencia y Crisis'}
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="emergency-policy-content">
            {language === 'en' ? (
              <div className="space-y-8">
                {/* Alert Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">IMPORTANT: We Are NOT an Emergency Service</h3>
                      <p className="text-red-700 dark:text-red-300">
                        If you or a loved one is experiencing a life-threatening mental health crisis, DO NOT contact our office. Call 911 or use the emergency resources listed below immediately.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Your safety is our highest priority. It is essential that you understand the scope of our services and know who to contact in case of a mental health emergency.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Our Practice Is NOT an Emergency Service</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Healing Minds Psychiatry is an outpatient psychiatric care clinic that operates <strong>by appointment only</strong>. We are not equipped to handle emergencies or mental health crises. Our staff is not available outside of office hours for crisis situations.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Office Hours:</strong> Monday through Friday, 9:00 AM to 5:00 PM. We are closed on weekends and holidays.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">In Case of an Emergency</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you or a loved one is experiencing a life-threatening mental health crisis (such as suicidal thoughts, self-harm, or a severe medication reaction), please <strong>DO NOT</strong> contact our office.
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-green-600" />
                      Take ONE of These Actions IMMEDIATELY:
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">1. Call 911</p>
                        <p className="text-gray-700 dark:text-gray-300">Or go to the nearest emergency room for immediate assistance.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">2. 988 Suicide & Crisis Lifeline</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Call or text 988</strong> to reach trained crisis counselors 24/7. Free, confidential support for people in distress.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available in English and Spanish</p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">3. Crisis Text Line</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Text <strong>"HELLO"</strong> to <strong>741741</strong> to connect with a crisis counselor via text message.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">4. David Lawrence Center (Collier County)</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Call <strong>(239) 455-8500</strong> for local crisis intervention services available 24/7.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Florida Crisis Resources</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Florida has a comprehensive crisis response system with Mobile Response Teams (MRTs) available statewide. These teams provide in-person and telehealth crisis intervention, screening, safety planning, and care coordination.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    For more information about crisis services in your area, call <strong>211</strong> or visit the Florida Department of Children and Families crisis services website.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Communication After a Crisis</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Once the emergency situation has been stabilized, please contact our office during business hours to inform us and coordinate the next steps in your treatment. We are here to support your ongoing mental health care and recovery.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can reach us at <a href="tel:+12394230272" className="text-green-600 hover:text-green-700 underline">(239) 423-0272</a> or email <a href="mailto:info@healingmindsp.com" className="text-green-600 hover:text-green-700 underline">info@healingmindsp.com</a>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Understanding the Baker Act</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    The Baker Act (Florida Mental Health Act) allows for involuntary examination of individuals experiencing acute mental health crises when they pose a danger to themselves or others. If you or someone you know is Baker Acted, they will receive a 72-hour evaluation at a designated receiving facility.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    For questions about the Baker Act or patient rights, contact the Florida Department of Children and Families or consult with legal counsel.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Policy Acknowledgment</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    By receiving services at Healing Minds Psychiatry, you acknowledge that you understand our Emergency and Crisis Policy and know how to access appropriate emergency resources when needed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Alert Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">IMPORTANTE: NO Somos un Servicio de Emergencia</h3>
                      <p className="text-red-700 dark:text-red-300">
                        Si usted o un ser querido está experimentando una crisis de salud mental que ponga en riesgo su vida, NO contacte nuestra oficina. Llame al 911 o use los recursos de emergencia listados a continuación inmediatamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Su seguridad es nuestra máxima prioridad. Es fundamental que entienda el alcance de nuestros servicios y sepa a quién contactar en caso de una emergencia de salud mental.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Nuestra Práctica NO es un Servicio de Emergencia</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Healing Minds Psychiatry es una clínica de atención psiquiátrica ambulatoria que opera <strong>únicamente con citas programadas</strong>. No estamos equipados para manejar emergencias o crisis de salud mental. Nuestro personal no está disponible fuera del horario de oficina para situaciones de crisis.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Horario de Oficina:</strong> Lunes a viernes, 9:00 AM a 5:00 PM. Estamos cerrados los fines de semana y días festivos.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">En Caso de una Emergencia</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Si usted o un ser querido está experimentando una crisis de salud mental que ponga en riesgo su vida (como pensamientos suicidas, autolesiones o una reacción grave a un medicamento), por favor, <strong>NO</strong> contacte nuestra oficina.
                  </p>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-green-600" />
                      Haga UNA de las Siguientes Acciones INMEDIATAMENTE:
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">1. Llame al 911</p>
                        <p className="text-gray-700 dark:text-gray-300">O diríjase a la sala de emergencias más cercana para asistencia inmediata.</p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">2. Línea Nacional de Prevención del Suicidio y Crisis - 988</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Llame o envíe un mensaje de texto al 988</strong> para comunicarse con consejeros de crisis capacitados 24/7. Apoyo gratuito y confidencial.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disponible en inglés y español</p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">3. Línea de Texto en Crisis</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Envíe un mensaje de texto con <strong>"HELLO"</strong> al <strong>741741</strong> para conectarse con un consejero de crisis por mensaje de texto.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-600 pl-4">
                        <p className="font-bold text-gray-900 dark:text-white">4. David Lawrence Center (Condado de Collier)</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Llame al <strong>(239) 455-8500</strong> para servicios locales de intervención en crisis disponibles 24/7.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Recursos de Crisis en Florida</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Florida tiene un sistema integral de respuesta a crisis con Equipos Móviles de Respuesta (MRTs) disponibles en todo el estado. Estos equipos proporcionan intervención en crisis en persona y por telesalud, evaluación, planificación de seguridad y coordinación de atención.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Para más información sobre servicios de crisis en su área, llame al <strong>211</strong> o visite el sitio web de servicios de crisis del Departamento de Niños y Familias de Florida.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Comunicación Después de una Crisis</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Una vez que la situación de emergencia esté estabilizada, por favor, póngase en contacto con nuestra oficina durante el horario comercial para informarnos y coordinar los siguientes pasos de su tratamiento. Estamos aquí para apoyar su atención continua de salud mental y recuperación.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Puede comunicarse con nosotros al <a href="tel:+12394230272" className="text-green-600 hover:text-green-700 underline">(239) 423-0272</a> o por email a <a href="mailto:info@healingmindsp.com" className="text-green-600 hover:text-green-700 underline">info@healingmindsp.com</a>.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Entendiendo el Baker Act</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    El Baker Act (Ley de Salud Mental de Florida) permite el examen involuntario de personas que experimentan crisis agudas de salud mental cuando representan un peligro para sí mismas o para otros. Si usted o alguien que conoce es sometido al Baker Act, recibirá una evaluación de 72 horas en un centro receptor designado.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Para preguntas sobre el Baker Act o los derechos del paciente, contacte al Departamento de Niños y Familias de Florida o consulte con un abogado.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reconocimiento de la Política</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Al recibir servicios en Healing Minds Psychiatry, usted reconoce que comprende nuestra Política de Emergencia y Crisis y sabe cómo acceder a los recursos de emergencia apropiados cuando sea necesario.
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

export default EmergencyPolicy;
