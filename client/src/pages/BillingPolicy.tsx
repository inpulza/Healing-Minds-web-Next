import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import RichText from '@/components/RichText';
import { billingPolicyContent } from '@/data/pageContent/legal/billingPolicy';

const BillingPolicy = () => {
  const { language } = useLanguage();
  const content = billingPolicyContent[language];
  const s = (k: string) => content.sections.find((x) => x.key === k)!;

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
            {content.title}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="billing-policy-content">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {s('intro').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('insurance').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('insurance').paragraphs![0]}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('insurance').paragraphs![1]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('copayments').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('copayments').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('self-pay').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('self-pay').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('late-fees').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('late-fees').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('credit-card').heading}</h2>
                {s('credit-card').paragraphs!.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('claims').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('claims').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('payment-plans').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('payment-plans').paragraphs![0]}
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('questions').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <RichText text={s('questions').paragraphs![0]} linkClassName="text-green-600 hover:text-green-700 underline" />
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{s('acknowledgment').heading}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {s('acknowledgment').paragraphs![0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BillingPolicy;
