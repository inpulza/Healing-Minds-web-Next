import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Privacy Policy - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Política de Privacidad - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Privacy Policy for Healing Minds Psychiatry website. Learn how we collect, use, and protect your personal information in compliance with Florida and federal privacy laws.'
        : 'Política de Privacidad del sitio web de Healing Minds Psychiatry. Conozca cómo recopilamos, usamos y protegemos su información personal cumpliendo con las leyes de privacidad de Florida y federales.',
      keywords: language === 'en'
        ? 'privacy policy, data protection, personal information, FIPA compliance, psychiatry privacy, medical privacy'
        : 'política privacidad, protección datos, información personal, cumplimiento FIPA, privacidad psiquiátrica, privacidad médica',
      lang: language,
      canonical: language === 'en' ? '/privacy-policy' : '/es/politica-privacidad'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="privacy-policy-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                  Last Updated: August 22, 2025
                </p>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    This Privacy Policy describes how Healing Minds Psychiatry ("we", "our"), operated by Vidal Healing Minds Corp., collects, uses and protects the personal information you provide when using our website https://www.healingmindsp.com/ (the "Site").
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    This policy applies to all Site visitors. For information about our patients, please see our "Notice of Privacy Practices" (NPP), which is governed by HIPAA law.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">1. Information We Collect</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We collect information to provide and improve our services. The types of information we collect are:
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">a) Information You Provide Voluntarily:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                      <li><strong>Contact Forms:</strong> When you contact us through a form, we collect your name, email address, phone number and the content of your message.</li>
                      <li><strong>Appointment Scheduling:</strong> When scheduling an appointment through our third-party portal (Charm Health), you may provide personal and health information. Such collection is governed by that provider's terms and privacy policy.</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">b) Information We Collect Automatically:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      When you visit our Site, we automatically collect certain information about your device and browsing behavior through cookies and similar technologies. This information includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                      <li>Your Internet Protocol (IP) address.</li>
                      <li>Browser type and operating system.</li>
                      <li>Pages you visit within our Site and time spent.</li>
                      <li>Access dates and times.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">2. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use cookies and similar technologies to operate our Site and analyze its performance. The specific tools we use include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Necessary Cookies:</strong> Essential for the technical operation of the Site.</li>
                    <li><strong>Google Analytics:</strong> We use this tool to understand how visitors interact with our Site. Google Analytics collects information anonymously and provides us with reports on website traffic and trends.</li>
                    <li><strong>Google Ads:</strong> We use Google Ads cookies to track conversions from our ads and to show relevant advertising to visitors on other websites (remarketing).</li>
                    <li><strong>Microsoft Clarity:</strong> We use this tool to capture how users interact with our website through session recordings and heat maps. This helps us identify usability issues and improve user experience. The information collected is anonymous to the extent possible.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use the information collected for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>To respond to your questions and requests.</li>
                    <li>To operate, maintain and improve our Site and services.</li>
                    <li>To analyze Site usage and optimize user experience.</li>
                    <li>For marketing and advertising purposes, such as measuring the performance of our Google Ads campaigns.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">4. How We Share Your Information</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We do not sell your personal information. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Service Providers:</strong> We share information with third-party companies that provide services to us, such as web hosting (Hostinger), data analytics (Google, Microsoft) and advertising platforms (Google). These providers only have access to information necessary to perform their functions and are required to protect it.</li>
                    <li><strong>Legal Purposes:</strong> We may disclose your information if required by law or in response to a valid legal request, such as a court order or subpoena.</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition or asset sale, your personal information may be transferred to the acquiring entity.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">5. Data Security</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We have implemented reasonable administrative, technical and physical security measures to protect personal information against unauthorized access, disclosure, alteration and destruction, in compliance with the Florida Information Protection Act (FIPA). However, no method of Internet transmission is 100% secure.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">6. Security Breach Notification</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    In the event of a security breach affecting your personal information, we will comply with applicable laws. In accordance with the Florida Information Protection Act (FIPA), we will notify affected individuals and the Florida Department of Legal Affairs without undue delay, and no later than 30 days after determining that a breach has occurred.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">7. Children's Privacy</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our Website is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so we can delete it.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">8. Third-Party Site Links</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our Site may contain links to other websites that are not operated by us (such as our appointment portal). If you click on a third-party link, you will be directed to that third party's site. We strongly recommend that you review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content or practices of any third-party sites or services.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">9. Your Privacy Choices and Rights</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You have control over the information collected through cookies and tracking technologies.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Browser Settings:</strong> You can set your browser to reject all or some cookies, or to alert you when cookies are being sent. Please note that if you disable cookies, some parts of this Site may not be accessible or function properly.</li>
                    <li><strong>Google Analytics Opt-out:</strong> To prevent your data from being used by Google Analytics, you can install Google's browser opt-out add-on, available at: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 underline">https://tools.google.com/dlpage/gaoptout</a>.</li>
                    <li><strong>Google Ads Settings:</strong> You can manage your ad preferences and opt out of personalized advertising from Google at their Ad Center: <a href="https://myadcenter.google.com/" className="text-blue-600 dark:text-blue-400 underline">https://myadcenter.google.com/</a>.</li>
                    <li><strong>Microsoft Privacy Controls:</strong> You can manage your data and privacy settings with Microsoft through their privacy dashboard: <a href="https://account.microsoft.com/privacy" className="text-blue-600 dark:text-blue-400 underline">https://account.microsoft.com/privacy</a>.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">10. Changes to this Privacy Policy</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may update our Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date at the top.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">11. Contact Information</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                      <p className="font-semibold">Healing Minds Psychiatry</p>
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
                    Esta Política de Privacidad describe cómo Healing Minds Psychiatry ("nosotros", "nuestro"), operado por Vidal Healing Minds Corp., recopila, utiliza y protege la información personal que usted proporciona al usar nuestro sitio web https://www.healingmindsp.com/ (el "Sitio").
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Esta política se aplica a todos los visitantes del Sitio. Para la información de nuestros pacientes, por favor, consulte nuestro "Aviso de Prácticas de Privacidad" (NPP), que se rige por la ley HIPAA.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">1. Información que Recopilamos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Recopilamos información para proporcionar y mejorar nuestros servicios. Los tipos de información que recopilamos son:
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">a) Información que Usted Proporciona Voluntariamente:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                      <li><strong>Formularios de Contacto:</strong> Cuando se comunica con nosotros a través de un formulario, recopilamos su nombre, dirección de correo electrónico, número de teléfono y el contenido de su mensaje.</li>
                      <li><strong>Programación de Citas:</strong> Al programar una cita a través de nuestro portal de terceros (Charm Health), puede que proporcione información personal y de salud. Dicha recopilación se rige por los términos y la política de privacidad de ese proveedor.</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">b) Información que Recopilamos Automáticamente:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Cuando usted visita nuestro Sitio, recopilamos automáticamente cierta información sobre su dispositivo y su comportamiento de navegación a través de cookies y tecnologías similares. Esta información incluye:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                      <li>Su dirección de Protocolo de Internet (IP).</li>
                      <li>Tipo de navegador y sistema operativo.</li>
                      <li>Páginas que visita dentro de nuestro Sitio y tiempo de permanencia.</li>
                      <li>Fechas y horas de acceso.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">2. Cookies y Tecnologías de Seguimiento</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Utilizamos cookies y tecnologías similares para operar nuestro Sitio y analizar su rendimiento. Las herramientas específicas que utilizamos incluyen:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Cookies Necesarias:</strong> Esenciales para el funcionamiento técnico del Sitio.</li>
                    <li><strong>Google Analytics:</strong> Utilizamos esta herramienta para entender cómo los visitantes interactúan con nuestro Sitio. Google Analytics recopila información de forma anónima y nos proporciona informes sobre el tráfico y las tendencias del sitio web.</li>
                    <li><strong>Google Ads:</strong> Utilizamos cookies de Google Ads para realizar un seguimiento de las conversiones de nuestros anuncios y para mostrar publicidad relevante a los visitantes en otros sitios web (remarketing).</li>
                    <li><strong>Microsoft Clarity:</strong> Utilizamos esta herramienta para capturar cómo los usuarios interactúan con nuestro sitio web a través de grabaciones de sesiones y mapas de calor (heatmaps). Esto nos ayuda a identificar problemas de usabilidad y a mejorar la experiencia del usuario. La información recopilada es anónima en la medida de lo posible.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">3. Cómo Usamos su Información</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Utilizamos la información recopilada para los siguientes propósitos:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Para responder a sus preguntas y solicitudes.</li>
                    <li>Para operar, mantener y mejorar nuestro Sitio y servicios.</li>
                    <li>Para analizar el uso del Sitio y optimizar la experiencia del usuario.</li>
                    <li>Para fines de marketing y publicidad, como medir el rendimiento de nuestras campañas en Google Ads.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">4. Cómo Compartimos su Información</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    No vendemos su información personal. Podemos compartir su información únicamente en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Proveedores de Servicios:</strong> Compartimos información con empresas de terceros que nos prestan servicios, como el alojamiento web (Hostinger), análisis de datos (Google, Microsoft) y plataformas de publicidad (Google). Estos proveedores solo tienen acceso a la información necesaria para realizar sus funciones y están obligados a protegerla.</li>
                    <li><strong>Fines Legales:</strong> Podemos divulgar su información si así lo exige la ley o en respuesta a una solicitud legal válida, como una orden judicial o una citación.</li>
                    <li><strong>Transferencias Comerciales:</strong> En caso de una fusión, adquisición o venta de activos, su información personal puede ser transferida a la entidad adquirente.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">5. Seguridad de los Datos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Hemos implementado medidas de seguridad administrativas, técnicas y físicas razonables para proteger la información personal contra el acceso, la divulgación, la alteración y la destrucción no autorizados, en conformidad con la Ley de Protección de la Información de Florida (FIPA). Sin embargo, ningún método de transmisión por Internet es 100% seguro.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">6. Notificación en Caso de Brecha de Seguridad</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    En el caso de una brecha de seguridad que afecte a su información personal, cumpliremos con las leyes aplicables. De acuerdo con la Ley de Protección de la Información de Florida (FIPA), notificaremos a las personas afectadas y al Departamento de Asuntos Legales de Florida sin demoras indebidas, y a más tardar 30 días después de determinar que ha ocurrido una brecha.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">7. Privacidad de los Niños</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Nuestro Sitio Web no está dirigido a niños menores de 13 años. No recopilamos intencionadamente información personal de niños menores de 13 años. Si usted es un padre o tutor y cree que su hijo nos ha proporcionado información personal, por favor, póngase en contacto con nosotros para que podamos eliminarla.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">8. Enlaces a Sitios de Terceros</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Nuestro Sitio puede contener enlaces a otros sitios web que no son operados por nosotros (como nuestro portal de citas). Si hace clic en un enlace de un tercero, será dirigido al sitio de ese tercero. Le recomendamos encarecidamente que revise la Política de Privacidad de cada sitio que visite. No tenemos control ni asumimos ninguna responsabilidad por el contenido o las prácticas de los sitios o servicios de terceros.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">9. Sus Opciones y Derechos de Privacidad</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Usted tiene control sobre la información que se recopila a través de cookies y tecnologías de seguimiento.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Configuración del Navegador:</strong> Puede configurar su navegador para que rechace todas o algunas cookies, o para que le avise cuando se envíen cookies. Tenga en cuenta que si deshabilita las cookies, es posible que algunas partes de este Sitio no sean accesibles o no funcionen correctamente.</li>
                    <li><strong>Exclusión de Google Analytics:</strong> Para evitar que sus datos sean utilizados por Google Analytics, puede instalar el complemento de inhabilitación para navegadores de Google, disponible en: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 underline">https://tools.google.com/dlpage/gaoptout</a>.</li>
                    <li><strong>Configuración de Anuncios de Google:</strong> Puede gestionar sus preferencias de anuncios y optar por no recibir publicidad personalizada de Google en su Centro de Anuncios: <a href="https://myadcenter.google.com/" className="text-blue-600 dark:text-blue-400 underline">https://myadcenter.google.com/</a>.</li>
                    <li><strong>Controles de Privacidad de Microsoft:</strong> Puede gestionar sus datos y la configuración de privacidad con Microsoft a través de su panel de privacidad: <a href="https://account.microsoft.com/privacy" className="text-blue-600 dark:text-blue-400 underline">https://account.microsoft.com/privacy</a>.</li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">10. Cambios a esta Política de Privacidad</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Podemos actualizar nuestra Política de Privacidad periódicamente. Le notificaremos de cualquier cambio publicando la nueva política en esta página y actualizando la fecha de "Última actualización" en la parte superior.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">11. Información de Contacto</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos en:
                    </p>
                    <div className="mt-4 space-y-2 text-green-800 dark:text-green-300">
                      <p className="font-semibold">Healing Minds Psychiatry</p>
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

export default PrivacyPolicy;