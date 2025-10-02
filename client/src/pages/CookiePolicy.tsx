import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const CookiePolicy = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'Cookie Policy - Healing Minds Psychiatry | Dr. Melva Reve Naples FL'
        : 'Política de Cookies - Healing Minds Psychiatry | Dra. Melva Reve Naples FL',
      description: language === 'en'
        ? 'Cookie Policy for Healing Minds Psychiatry website. Learn about the cookies and tracking technologies we use to improve your browsing experience.'
        : 'Política de Cookies del sitio web de Healing Minds Psychiatry. Conozca sobre las cookies y tecnologías de seguimiento que usamos para mejorar su experiencia de navegación.',
      keywords: language === 'en'
        ? 'cookie policy, tracking technologies, web analytics, website cookies, privacy preferences'
        : 'política cookies, tecnologías seguimiento, análisis web, cookies sitio web, preferencias privacidad',
      lang: language,
      canonical: language === 'en' ? '/cookie-policy' : '/es/politica-cookies'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="cookie-policy-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-12 font-semibold">
                  Last Updated: August 22, 2025
                </p>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    This Cookie Policy explains what cookies are, how we use them on the website https://www.healingmindsp.com/ (the "Site"), the types of cookies we use, the information we collect through cookies and how that information is used.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">What are cookies?</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Cookies are small text files that are stored in your browser or device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site. Cookies allow us to recognize your device and remember information about your preferences or past actions.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Types of Cookies We Use</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We classify the cookies used on our Site into the following categories:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">1. Strictly Necessary Cookies</h3>
                      <p className="text-blue-800 dark:text-blue-300">
                        These cookies are essential for you to browse the Site and use its features, such as accessing secure areas. Without these cookies, services you have asked for cannot be provided.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">2. Performance / Analytics Cookies</h3>
                      <p className="text-green-800 dark:text-green-300 mb-3">
                        These cookies collect information about how visitors use our Site, for example, which pages they visit most often and if they receive error messages. The information these cookies collect is aggregated and therefore anonymous. It is only used to improve how the Site works. Specifically, we use:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-300 ml-4">
                        <li><strong>Google Analytics:</strong> To analyze site traffic and user behavior.</li>
                        <li><strong>Microsoft Clarity:</strong> To generate heat maps and session recordings that help us understand how users interact with pages and improve usability.</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">3. Marketing / Advertising Cookies</h3>
                      <p className="text-purple-800 dark:text-purple-300 mb-3">
                        These cookies are used to track user activity on the web in order to offer more relevant advertising and measure the effectiveness of our advertising campaigns. On our Site, we use:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-300 ml-4">
                        <li><strong>Google Ads:</strong> To track conversions from our ads and to show you personalized ads on other websites (remarketing) based on your previous visit to our Site.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">How to Manage Your Cookie Preferences</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You have full control over the use of cookies on our Site.
                  </p>
                  
                  <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Cookie Consent Tool:</strong> The primary way to manage your preferences is through the cookie consent banner that is presented to you the first time you visit our Site. Through this tool, you can accept or reject the different categories of non-essential cookies.</li>
                    <li><strong>Browser Settings:</strong> In addition to our consent tool, most web browsers allow you to control most cookies through their settings. You can set your browser to notify you when you receive a cookie, giving you the option to accept it or not. You can also block all cookies. To learn how to do this, refer to the "Help" section of your browser.</li>
                    <li><strong>Third-Party Opt-out Links:</strong> You can opt out of tracking by certain third parties by visiting the following links:
                      <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                        <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 underline">https://tools.google.com/dlpage/gaoptout</a></li>
                        <li><strong>Google Ads:</strong> <a href="https://myadcenter.google.com/" className="text-blue-600 dark:text-blue-400 underline">https://myadcenter.google.com/</a></li>
                        <li><strong>Microsoft:</strong> <a href="https://account.microsoft.com/privacy" className="text-blue-600 dark:text-blue-400 underline">https://account.microsoft.com/privacy</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Third-Party Cookies</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Some of the cookies on our Site are set by third-party organizations. This is the case with cookies from Google and Microsoft. These companies manage the cookies and data they collect according to their own privacy policies. We recommend that you review them to understand how they use your information.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Changes to this Cookie Policy</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Therefore, please re-visit this policy regularly to stay informed.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Contact Information</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      If you have any questions about our use of cookies, you can contact us at:
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
                    Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en el sitio web https://www.healingmindsp.com/ (el "Sitio"), los tipos de cookies que usamos, la información que recopilamos mediante cookies y cómo se utiliza esa información.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">¿Qué son las cookies?</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Las cookies son pequeños archivos de texto que se almacenan en su navegador o dispositivo cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio. Las cookies nos permiten reconocer su dispositivo y recordar información sobre sus preferencias o acciones pasadas.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tipos de Cookies que Utilizamos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Clasificamos las cookies utilizadas en nuestro Sitio en las siguientes categorías:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">1. Cookies Estrictamente Necesarias</h3>
                      <p className="text-blue-800 dark:text-blue-300">
                        Estas cookies son esenciales para que pueda navegar por el Sitio y utilizar sus funciones, como acceder a áreas seguras. Sin estas cookies, los servicios que ha solicitado no se pueden proporcionar.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">2. Cookies de Rendimiento / Analíticas</h3>
                      <p className="text-green-800 dark:text-green-300 mb-3">
                        Estas cookies recopilan información sobre cómo los visitantes utilizan nuestro Sitio, por ejemplo, qué páginas visitan con más frecuencia y si reciben mensajes de error. La información que recopilan estas cookies es agregada y, por lo tanto, anónima. Solo se utiliza para mejorar el funcionamiento del Sitio. Específicamente, utilizamos:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-300 ml-4">
                        <li><strong>Google Analytics:</strong> Para analizar el tráfico del sitio y el comportamiento del usuario.</li>
                        <li><strong>Microsoft Clarity:</strong> Para generar mapas de calor y grabaciones de sesiones que nos ayudan a entender cómo los usuarios interactúan con las páginas y a mejorar la usabilidad.</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">3. Cookies de Marketing / Publicidad</h3>
                      <p className="text-purple-800 dark:text-purple-300 mb-3">
                        Estas cookies se utilizan para rastrear la actividad de los usuarios en la web con el fin de ofrecer publicidad más relevante y medir la eficacia de nuestras campañas publicitarias. En nuestro Sitio, utilizamos:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-300 ml-4">
                        <li><strong>Google Ads:</strong> Para realizar un seguimiento de las conversiones de nuestros anuncios y para mostrarle anuncios personalizados en otros sitios web (remarketing) basados en su visita anterior a nuestro Sitio.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cómo Gestionar sus Preferencias de Cookies</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Usted tiene el control total sobre el uso de cookies en nuestro Sitio.
                  </p>
                  
                  <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Herramienta de Consentimiento de Cookies:</strong> La principal forma de gestionar sus preferencias es a través del banner de consentimiento de cookies que se le presenta la primera vez que visita nuestro Sitio. A través de esta herramienta, puede aceptar o rechazar las diferentes categorías de cookies no esenciales.</li>
                    <li><strong>Configuración del Navegador:</strong> Además de nuestra herramienta de consentimiento, la mayoría de los navegadores web le permiten controlar la mayoría de las cookies a través de su configuración. Puede configurar su navegador para que le notifique cuando reciba una cookie, dándole la opción de aceptarla o no. También puede bloquear todas las cookies. Para saber cómo hacerlo, consulte la sección de "Ayuda" de su navegador.</li>
                    <li><strong>Enlaces de Exclusión de Terceros:</strong> Puede optar por no participar en el seguimiento de ciertos terceros visitando los siguientes enlaces:
                      <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                        <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 underline">https://tools.google.com/dlpage/gaoptout</a></li>
                        <li><strong>Google Ads:</strong> <a href="https://myadcenter.google.com/" className="text-blue-600 dark:text-blue-400 underline">https://myadcenter.google.com/</a></li>
                        <li><strong>Microsoft:</strong> <a href="https://account.microsoft.com/privacy" className="text-blue-600 dark:text-blue-400 underline">https://account.microsoft.com/privacy</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cookies de Terceros</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Algunas de las cookies de nuestro Sitio son establecidas por organizaciones de terceros. Este es el caso de las cookies de Google y Microsoft. Estas empresas gestionan las cookies y los datos que recopilan de acuerdo con sus propias políticas de privacidad. Le recomendamos que las revise para entender cómo utilizan su información.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cambios a esta Política de Cookies</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, le pedimos que revise esta política regularmente para mantenerse informado.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Información de Contacto</h2>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Si tiene alguna pregunta sobre nuestro uso de cookies, puede contactarnos en:
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

export default CookiePolicy;