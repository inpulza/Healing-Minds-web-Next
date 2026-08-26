import { useLanguage } from '@/hooks/useLanguage';
import { acceptedInsurancePlans } from '@/data/acceptedInsurancePlans';
import MobileInsuranceCarousel from '@/components/MobileInsuranceCarousel';
import OptimizedImage from '@/components/OptimizedImage';

type AcceptedInsuranceGalleryProps = {
  compact?: boolean;
  testId: string;
  testIdPrefix: string;
  mobileTestId: string;
};

const AcceptedInsuranceGallery = ({
  compact = false,
  testId,
  testIdPrefix,
  mobileTestId,
}: AcceptedInsuranceGalleryProps) => {
  const { language } = useLanguage();
  const logos = acceptedInsurancePlans.map((plan) => ({
    src: plan.src,
    alt: plan.alt[language],
    name: plan.name,
  }));
  const rows = [acceptedInsurancePlans.slice(0, 5), acceptedInsurancePlans.slice(5, 10), acceptedInsurancePlans.slice(10)];

  return (
    <div data-testid={testId} data-plan-count={acceptedInsurancePlans.length}>
      <MobileInsuranceCarousel
        logos={logos}
        testId={mobileTestId}
        logoTestIdPrefix={testIdPrefix}
        pauseLabel={language === 'en' ? 'Pause logo rotation' : 'Pausar rotación de logotipos'}
        resumeLabel={language === 'en' ? 'Resume logo rotation' : 'Reanudar rotación de logotipos'}
      />

      <div className={`hidden md:flex flex-col items-center ${compact ? 'gap-2 lg:gap-3' : 'gap-4 lg:gap-6'}`}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex flex-wrap justify-center ${compact ? 'gap-3 lg:gap-5' : 'gap-4 lg:gap-8'}`}
          >
            {row.map((plan, index) => (
              <div
                key={plan.slug}
                className="group flex items-center justify-center"
                data-testid={`${testIdPrefix}-${plan.slug}`}
                data-insurance-plan={plan.slug}
              >
                <OptimizedImage
                  src={plan.src}
                  alt={plan.alt[language]}
                  className={`${compact ? 'h-14 w-24 lg:h-16 lg:w-28' : 'h-28 w-36 lg:h-32 lg:w-48'} object-contain grayscale transition-all duration-300 hover:scale-105 hover:grayscale-0 motion-reduce:transition-none`}
                  width={compact ? 112 : 192}
                  height={compact ? 64 : 128}
                  priority={false}
                  sizes={compact ? '112px' : '(max-width: 1024px) 144px, 192px'}
                  style={{
                    containIntrinsicSize: compact ? '112px 64px' : '192px 128px',
                    contentVisibility: rowIndex === 0 && index < 2 ? 'visible' : 'auto',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedInsuranceGallery;
