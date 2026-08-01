import type { BilingualPageContent } from '../types';

export const cookiePolicyContent: BilingualPageContent = {
  en: {
    title: 'Cookie Policy',
    sections: [
      {
        key: 'last-updated',
        paragraphs: [`Last Updated: July 31, 2026`],
      },
      {
        key: 'intro',
        paragraphs: [
          `This Cookie Policy explains what cookies are, how we use them on the website https://www.healingmindsp.com/ (the "Site"), the types of cookies we use, the information we collect through cookies and how that information is used.`,
        ],
      },
      {
        key: 'what-are-cookies',
        heading: `What are cookies?`,
        paragraphs: [
          `Cookies are small text files that are stored in your browser or device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site. Cookies allow us to recognize your device and remember information about your preferences or past actions.`,
        ],
      },
      {
        key: 'types-intro',
        heading: `Types of Cookies We Use`,
        paragraphs: [`We classify the cookies used on our Site into the following categories:`],
      },
      {
        key: 'types-necessary',
        heading: `1. Strictly Necessary Cookies`,
        level: 3,
        paragraphs: [
          `These cookies are essential for you to browse the Site and use its features, such as accessing secure areas. Without these cookies, services you have asked for cannot be provided.`,
        ],
      },
      {
        key: 'types-analytics',
        heading: `2. Performance / Analytics Cookies`,
        level: 3,
        paragraphs: [
          `These cookies collect information about how visitors use our Site, for example, which pages they visit most often and if they receive error messages. The information these cookies collect is aggregated and therefore anonymous. It is only used to improve how the Site works. Specifically, we use:`,
        ],
        bullets: [
          `**Google Analytics:** To analyze site traffic and user behavior.`,
          `**Microsoft Clarity:** To generate heat maps and session recordings that help us understand how users interact with pages and improve usability.`,
        ],
      },
      {
        key: 'types-marketing',
        heading: `3. Marketing / Advertising Cookies`,
        level: 3,
        paragraphs: [
          `These cookies are used to track user activity on the web in order to offer more relevant advertising and measure the effectiveness of our advertising campaigns. On our Site, we use:`,
        ],
        bullets: [
          `**Google Ads:** To track conversions from our ads and to show you personalized ads on other websites (remarketing) based on your previous visit to our Site.`,
          `**TikTok Pixel:** To measure visits and lead actions associated with TikTok campaigns and, when you allow marketing cookies, support campaign optimization and remarketing.`,
        ],
      },
      {
        key: 'manage',
        heading: `How to Manage Your Cookie Preferences`,
        paragraphs: [`You have full control over the use of cookies on our Site.`],
        bullets: [
          `**Cookie Consent Tool:** The primary way to manage your preferences is through the cookie consent banner that is presented to you the first time you visit our Site. Through this tool, you can accept or reject the different categories of non-essential cookies.`,
          `**Browser Settings:** In addition to our consent tool, most web browsers allow you to control most cookies through their settings. You can set your browser to notify you when you receive a cookie, giving you the option to accept it or not. You can also block all cookies. To learn how to do this, refer to the "Help" section of your browser.`,
        ],
      },
      {
        key: 'manage-optout',
        paragraphs: [
          `**Third-Party Opt-out Links:** You can opt out of tracking by certain third parties by visiting the following links:`,
        ],
        bullets: [
          `**Google Analytics:** [https://tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout)`,
          `**Google Ads:** [https://myadcenter.google.com/](https://myadcenter.google.com/)`,
          `**Microsoft:** [https://account.microsoft.com/privacy](https://account.microsoft.com/privacy)`,
          `**TikTok:** [https://www.tiktok.com/legal/page/global/cookie-policy/en](https://www.tiktok.com/legal/page/global/cookie-policy/en)`,
        ],
      },
      {
        key: 'third-party',
        heading: `Third-Party Cookies`,
        paragraphs: [
          `Some of the cookies on our Site are set by third-party organizations. This is the case with cookies from Google, Microsoft and TikTok. These companies manage the cookies and data they collect according to their own privacy policies. We recommend that you review them to understand how they use your information. When marketing consent is withdrawn, our Site calls TikTok's consent-revocation API and clears the TikTok first-party cookies available to this domain; third-party cookies remain under TikTok's control.`,
        ],
      },
      {
        key: 'changes',
        heading: `Changes to this Cookie Policy`,
        paragraphs: [
          `We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Therefore, please re-visit this policy regularly to stay informed.`,
        ],
      },
      {
        key: 'contact',
        heading: `Contact Information`,
        paragraphs: [
          `If you have any questions about our use of cookies, you can contact us at:`,
          `**Healing Minds Psychiatry**`,
          `4760 Tamiami Trl N # 25`,
          `Naples, FL 34103`,
          `Email: info@healingmindsp.com`,
        ],
      },
    ],
  },
  es: {
    title: 'Política de Cookies',
    sections: [
      {
        key: 'last-updated',
        paragraphs: [`Última actualización: 31 de julio de 2026`],
      },
      {
        key: 'intro',
        paragraphs: [
          `Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en el sitio web https://www.healingmindsp.com/ (el "Sitio"), los tipos de cookies que usamos, la información que recopilamos mediante cookies y cómo se utiliza esa información.`,
        ],
      },
      {
        key: 'what-are-cookies',
        heading: `¿Qué son las cookies?`,
        paragraphs: [
          `Las cookies son pequeños archivos de texto que se almacenan en su navegador o dispositivo cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio. Las cookies nos permiten reconocer su dispositivo y recordar información sobre sus preferencias o acciones pasadas.`,
        ],
      },
      {
        key: 'types-intro',
        heading: `Tipos de Cookies que Utilizamos`,
        paragraphs: [`Clasificamos las cookies utilizadas en nuestro Sitio en las siguientes categorías:`],
      },
      {
        key: 'types-necessary',
        heading: `1. Cookies Estrictamente Necesarias`,
        level: 3,
        paragraphs: [
          `Estas cookies son esenciales para que pueda navegar por el Sitio y utilizar sus funciones, como acceder a áreas seguras. Sin estas cookies, los servicios que ha solicitado no se pueden proporcionar.`,
        ],
      },
      {
        key: 'types-analytics',
        heading: `2. Cookies de Rendimiento / Analíticas`,
        level: 3,
        paragraphs: [
          `Estas cookies recopilan información sobre cómo los visitantes utilizan nuestro Sitio, por ejemplo, qué páginas visitan con más frecuencia y si reciben mensajes de error. La información que recopilan estas cookies es agregada y, por lo tanto, anónima. Solo se utiliza para mejorar el funcionamiento del Sitio. Específicamente, utilizamos:`,
        ],
        bullets: [
          `**Google Analytics:** Para analizar el tráfico del sitio y el comportamiento del usuario.`,
          `**Microsoft Clarity:** Para generar mapas de calor y grabaciones de sesiones que nos ayudan a entender cómo los usuarios interactúan con las páginas y a mejorar la usabilidad.`,
        ],
      },
      {
        key: 'types-marketing',
        heading: `3. Cookies de Marketing / Publicidad`,
        level: 3,
        paragraphs: [
          `Estas cookies se utilizan para rastrear la actividad de los usuarios en la web con el fin de ofrecer publicidad más relevante y medir la eficacia de nuestras campañas publicitarias. En nuestro Sitio, utilizamos:`,
        ],
        bullets: [
          `**Google Ads:** Para realizar un seguimiento de las conversiones de nuestros anuncios y para mostrarle anuncios personalizados en otros sitios web (remarketing) basados en su visita anterior a nuestro Sitio.`,
          `**TikTok Pixel:** Para medir visitas y acciones de contacto asociadas con campañas de TikTok y, cuando permite cookies de marketing, apoyar la optimización de campañas y el remarketing.`,
        ],
      },
      {
        key: 'manage',
        heading: `Cómo Gestionar sus Preferencias de Cookies`,
        paragraphs: [`Usted tiene el control total sobre el uso de cookies en nuestro Sitio.`],
        bullets: [
          `**Herramienta de Consentimiento de Cookies:** La principal forma de gestionar sus preferencias es a través del banner de consentimiento de cookies que se le presenta la primera vez que visita nuestro Sitio. A través de esta herramienta, puede aceptar o rechazar las diferentes categorías de cookies no esenciales.`,
          `**Configuración del Navegador:** Además de nuestra herramienta de consentimiento, la mayoría de los navegadores web le permiten controlar la mayoría de las cookies a través de su configuración. Puede configurar su navegador para que le notifique cuando reciba una cookie, dándole la opción de aceptarla o no. También puede bloquear todas las cookies. Para saber cómo hacerlo, consulte la sección de "Ayuda" de su navegador.`,
        ],
      },
      {
        key: 'manage-optout',
        paragraphs: [
          `**Enlaces de Exclusión de Terceros:** Puede optar por no participar en el seguimiento de ciertos terceros visitando los siguientes enlaces:`,
        ],
        bullets: [
          `**Google Analytics:** [https://tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout)`,
          `**Google Ads:** [https://myadcenter.google.com/](https://myadcenter.google.com/)`,
          `**Microsoft:** [https://account.microsoft.com/privacy](https://account.microsoft.com/privacy)`,
          `**TikTok:** [https://www.tiktok.com/legal/page/global/cookie-policy/es](https://www.tiktok.com/legal/page/global/cookie-policy/es)`,
        ],
      },
      {
        key: 'third-party',
        heading: `Cookies de Terceros`,
        paragraphs: [
          `Algunas de las cookies de nuestro Sitio son establecidas por organizaciones de terceros. Este es el caso de las cookies de Google, Microsoft y TikTok. Estas empresas gestionan las cookies y los datos que recopilan de acuerdo con sus propias políticas de privacidad. Le recomendamos que las revise para entender cómo utilizan su información. Cuando retira el consentimiento de marketing, nuestro Sitio llama a la API de revocación de consentimiento de TikTok y elimina las cookies propias de TikTok disponibles para este dominio; las cookies de terceros siguen bajo el control de TikTok.`,
        ],
      },
      {
        key: 'changes',
        heading: `Cambios a esta Política de Cookies`,
        paragraphs: [
          `Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, le pedimos que revise esta política regularmente para mantenerse informado.`,
        ],
      },
      {
        key: 'contact',
        heading: `Información de Contacto`,
        paragraphs: [
          `Si tiene alguna pregunta sobre nuestro uso de cookies, puede contactarnos en:`,
          `**Healing Minds Psychiatry**`,
          `4760 Tamiami Trl N # 25`,
          `Naples, FL 34103`,
          `Correo electrónico: info@healingmindsp.com`,
        ],
      },
    ],
  },
};
