import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';

const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    { 
      value: '15+', 
      label: t('stats.experience'),
      testId: 'stat-experience'
    },
    { 
      value: '98%', 
      label: t('stats.successRate'),
      testId: 'stat-success-rate'
    },
    { 
      value: '4.9/5', 
      label: t('stats.rating'),
      testId: 'stat-rating'
    }
  ];

  return (
    <section className="bg-light-green py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200" data-testid={stat.testId}>
              <div className="text-4xl font-bold text-primary-green mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-gray-700">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
