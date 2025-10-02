import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const TermsOfService = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Terms of Service - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Términos de Servicio - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Terms of Service for Healing Minds Psychiatry website. Understand the rules and conditions for using our psychiatric services and website in Naples, FL.'
        : 'Términos de Servicio del sitio web de Healing Minds Psychiatry. Comprenda las reglas y condiciones para usar nuestros servicios psiquiátricos y sitio web en Naples, FL.',
      keywords: language === 'en'
        ? 'terms of service, website terms, psychiatric services terms, medical terms, Naples psychiatry'
        : 'términos servicio, términos sitio web, términos servicios psiquiátricos, términos médicos, psiquiatría Naples',
      lang: language,
      canonical: language === 'en' ? '/terms-of-service' : '/es/terminos-servicio'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="terms-of-service-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                  Last Updated: August 22, 2025
                </p>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Welcome to the Healing Minds Psychiatry website (the "Website"), operated by Vidal Healing Minds Corp. ("we," "our," or "the Company").
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Please read these Terms of Use ("Terms") carefully. By accessing or using this Website, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with all these Terms, do not use this Website.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    By using this Website, you confirm that you have read, understood, and agreed to be legally bound by these Terms. We reserve the right to modify these Terms at any time, and such modifications will take effect immediately upon posting.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">2. MEDICAL DISCLAIMER</h2>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                    <p className="text-red-800 dark:text-red-300 font-semibold uppercase">
                      THE CONTENT OF THIS WEBSITE, INCLUDING TEXT, GRAPHICS, IMAGES, AND ANY OTHER MATERIAL, IS PROVIDED FOR INFORMATIONAL PURPOSES ONLY. IT IS NOT INTENDED TO BE A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. ALWAYS SEEK THE ADVICE OF YOUR PHYSICIAN OR OTHER QUALIFIED HEALTH PROVIDER WITH ANY QUESTIONS YOU MAY HAVE ABOUT A MEDICAL CONDITION. NEVER DISREGARD PROFESSIONAL MEDICAL ADVICE OR DELAY SEEKING IT BECAUSE OF SOMETHING YOU HAVE READ ON THIS WEBSITE.
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                    <p className="text-red-800 dark:text-red-300 font-bold">
                      IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL 911 OR YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">3. Telehealth Services</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    This Website offers the ability to schedule and access remote healthcare services ("Telehealth").
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Telehealth Consent:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      By requesting and using our Telehealth services, you consent to receiving medical care through telecommunications technologies. You acknowledge that Florida law permits a provider-patient relationship to be established through Telehealth. You understand that there are inherent limitations to Telehealth, including the inability to perform a complete physical examination. By using these services, you accept the associated risks and limitations.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Third-Party Platforms:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Our Telehealth services are provided through a third-party platform, Charm Health. Use of such platform is subject to Charm Health's terms and privacy policy, in addition to ours. We are not responsible for the operation, security, or availability of third-party platforms.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">4. Website Use and Prohibited Conduct</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree to use the Website only for lawful purposes. The following is strictly prohibited:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Using the Website in any way that could damage, disable, overburden, or impair our servers or networks.</li>
                    <li>Attempting to gain unauthorized access to any part of the Website, other user accounts, or computer systems.</li>
                    <li>Posting, uploading, or transmitting any content to the Website, as user content contribution is not permitted.</li>
                    <li>Using the Website for any illegal purpose or to solicit the performance of any illegal activity.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">5. Intellectual Property</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    All content present on this Website, including but not limited to text, logos, graphics, icons, and software, is the property of Vidal Healing Minds Corp. or its licensors and is protected by United States copyright and trademark laws.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">6. Third-Party Site Links</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    The Website may contain links to third-party websites (such as our Charm Health appointment portal). These links are provided solely for your convenience. We have no control over the content or practices of these sites and assume no responsibility for them.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">7. DISCLAIMER OF WARRANTIES</h2>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                      THE WEBSITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE WILL BE ERROR-FREE OR THAT ACCESS WILL BE UNINTERRUPTED.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">8. LIMITATION OF LIABILITY</h2>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER VIDAL HEALING MINDS CORP., NOR ITS DIRECTORS, EMPLOYEES, OR AGENTS SHALL BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THIS WEBSITE OR ITS SERVICES.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">9. Indemnification</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree to defend, indemnify, and hold harmless Vidal Healing Minds Corp. and its affiliates from and against any claims, damages, costs, and expenses, including attorney fees, arising from or related to your use of the Website or your violation of these Terms.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">10. Governing Law and Jurisdiction</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    These Terms shall be governed and interpreted in accordance with the laws of the State of Florida, without giving effect to any conflict of law principles. Any dispute arising from these Terms shall be resolved exclusively in state or federal courts located in Collier County, Florida.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">11. Contact Information</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      If you have any questions about these Terms of Use, please contact us at:
                    </p>
                    <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                      <p className="font-semibold">Healing Minds Psychiatry</p>
                      <p>(Vidal Healing Minds Corp.)</p>
                      <p>4760 Tamiami Trl N # 25</p>
                      <p>Naples, FL 34103</p>
                      <p>Email: info@healingmindsp.com</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                  Última actualización: 22 de agosto de 2025
                </p>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Bienvenido al sitio web de Healing Minds Psychiatry (el "Sitio Web"), operado por Vidal Healing Minds Corp. ("nosotros", "nuestro" o "la Compañía").
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Lea atentamente estos Términos de Uso ("Términos"). Al acceder o utilizar este Sitio Web, usted acepta estar sujeto a estos Términos y a nuestra Política de Privacidad. Si no está de acuerdo con todos estos Términos, no utilice este Sitio Web.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">1. Aceptación de los Términos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Al utilizar este Sitio Web, usted confirma que ha leído, entendido y aceptado estar legalmente obligado por estos Términos. Nos reservamos el derecho de modificar estos Términos en cualquier momento, y dichas modificaciones entrarán en vigor inmediatamente después de su publicación.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">2. DESCARGO DE RESPONSABILIDAD MÉDICA</h2>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                    <p className="text-red-800 dark:text-red-300 font-semibold uppercase">
                      EL CONTENIDO DE ESTE SITIO WEB, INCLUYENDO TEXTO, GRÁFICOS, IMÁGENES Y CUALQUIER OTRO MATERIAL, SE PROPORCIONA ÚNICAMENTE CON FINES INFORMATIVOS. NO PRETENDE SER UN SUSTITUTO DEL CONSEJO, DIAGNÓSTICO O TRATAMIENTO MÉDICO PROFESIONAL. SIEMPRE BUSQUE EL CONSEJO DE SU MÉDICO U OTRO PROVEEDOR DE SALUD CUALIFICADO CON CUALQUIER PREGUNTA QUE PUEDA TENER SOBRE UNA CONDICIÓN MÉDICA. NUNCA IGNORE EL CONSEJO MÉDICO PROFESIONAL NI RETRASE SU BÚSQUEDA DEBIDO A ALGO QUE HAYA LEÍDO EN ESTE SITIO WEB.
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                    <p className="text-red-800 dark:text-red-300 font-bold">
                      SI CREE QUE PUEDE TENER UNA EMERGENCIA MÉDICA, LLAME AL 911 O A SU NÚMERO DE EMERGENCIA LOCAL DE INMEDIATO.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">3. Servicios de Telesalud</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Este Sitio Web ofrece la posibilidad de programar y acceder a servicios de atención médica a distancia ("Telesalud").
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Consentimiento para Telesalud:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Al solicitar y utilizar nuestros servicios de Telesalud, usted consiente en recibir atención médica a través de tecnologías de telecomunicaciones. Usted reconoce que la ley de Florida permite que se establezca una relación proveedor-paciente a través de la Telesalud. Usted entiende que existen limitaciones inherentes a la Telesalud, incluyendo la imposibilidad de realizar un examen físico completo. Al utilizar estos servicios, usted acepta los riesgos y limitaciones asociados.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plataformas de Terceros:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Nuestros servicios de Telesalud se proporcionan a través de una plataforma de terceros, Charm Health. El uso de dicha plataforma está sujeto a los términos y la política de privacidad de Charm Health, además de los nuestros. No somos responsables de la operación, seguridad o disponibilidad de plataformas de terceros.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">4. Uso del Sitio Web y Conducta Prohibida</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Usted se compromete a utilizar el Sitio Web únicamente para fines lícitos. Queda estrictamente prohibido:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Utilizar el Sitio Web de cualquier manera que pueda dañar, deshabilitar, sobrecargar o perjudicar nuestros servidores o redes.</li>
                    <li>Intentar obtener acceso no autorizado a cualquier parte del Sitio Web, cuentas de otros usuarios o sistemas informáticos.</li>
                    <li>Publicar, cargar o transmitir cualquier contenido en el Sitio Web, ya que no se permite la contribución de contenido por parte de los usuarios.</li>
                    <li>Utilizar el Sitio Web para cualquier fin ilegal o para solicitar la realización de cualquier actividad ilegal.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">5. Propiedad Intelectual</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Todo el contenido presente en este Sitio Web, incluyendo, entre otros, texto, logotipos, gráficos, iconos y software, es propiedad de Vidal Healing Minds Corp. o de sus licenciantes y está protegido por las leyes de derechos de autor y marcas registradas de los Estados Unidos.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">6. Enlaces a Sitios de Terceros</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    El Sitio Web puede contener enlaces a sitios web de terceros (como nuestro portal de citas Charm Health). Estos enlaces se proporcionan únicamente para su conveniencia. No tenemos control sobre el contenido o las prácticas de estos sitios y no asumimos ninguna responsabilidad por ellos.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">7. DESCARGO DE GARANTÍAS</h2>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                      EL SITIO WEB Y SU CONTENIDO SE PROPORCIONAN "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, YA SEAN EXPRESAS O IMPLÍCITAS. NO GARANTIZAMOS QUE EL SITIO WEB ESTÉ LIBRE DE ERRORES O QUE SU ACCESO SEA ININTERRUMPIDO.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">8. LIMITACIÓN DE RESPONSABILIDAD</h2>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold uppercase">
                      EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, NI VIDAL HEALING MINDS CORP., NI SUS DIRECTORES, EMPLEADOS O AGENTES SERÁN RESPONSABLES DE NINGÚN DAÑO DIRECTO, INDIRECTO, INCIDENTAL, ESPECIAL O CONSECUENTE QUE RESULTE DEL USO O LA IMPOSIBILIDAD DE USAR ESTE SITIO WEB O SUS SERVICIOS.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">9. Indemnización</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Usted se compromete a defender, indemnizar y eximir de responsabilidad a Vidal Healing Minds Corp. y sus afiliados de y contra cualquier reclamación, daño, costo y gasto, incluidos los honorarios de abogados, que surjan de o estén relacionados con su uso del Sitio Web o su violación de estos Términos.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">10. Ley Aplicable y Jurisdicción</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de Florida, sin dar efecto a ningún principio de conflicto de leyes. Cualquier disputa que surja de estos Términos se resolverá exclusivamente en los tribunales estatales o federales ubicados en el Condado de Collier, Florida.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">11. Información de Contacto</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Si tiene alguna pregunta sobre estos Términos de Uso, por favor contáctenos en:
                    </p>
                    <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                      <p className="font-semibold">Healing Minds Psychiatry</p>
                      <p>(Vidal Healing Minds Corp.)</p>
                      <p>4760 Tamiami Trl N # 25</p>
                      <p>Naples, FL 34103</p>
                      <p>Correo electrónico: info@healingmindsp.com</p>
                    </div>
                  </div>
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

export default TermsOfService;