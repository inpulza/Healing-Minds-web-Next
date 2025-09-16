import { transactionalSections } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CharmHealthBooking from '@/components/CharmHealthBooking';
import WellnessIcon from '@/components/WellnessIcon';
import { 
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  Shield,
  Video,
  Award,
  GraduationCap,
  Users,
  Languages,
  Heart,
  MapPin,
  CreditCard,
  User,
  TrendingUp,
  ArrowRight,
  Star
} from 'lucide-react';

// Icon mapping resolver
const iconMap = {
  "CheckCircle": CheckCircle,
  "Clock": Clock,
  "Phone": Phone,
  "Calendar": Calendar,
  "Shield": Shield,
  "Video": Video,
  "Award": Award,
  "GraduationCap": GraduationCap,
  "Users": Users,
  "Languages": Languages,
  "Heart": Heart,
  "MapPin": MapPin,
  "CreditCard": CreditCard,
  "User": User,
  "TrendingUp": TrendingUp,
  "ArrowRight": ArrowRight,
  "Star": Star
};

interface TransactionalContentProps {
  locationName?: string;
  className?: string;
}

const TransactionalContent: React.FC<TransactionalContentProps> = ({ 
  locationName = '', 
  className = '' 
}) => {
  const { language } = useLanguage();

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || CheckCircle;
  };

  return (
    <div className={`space-y-16 ${className}`}>
      {/* 1. Why Book Online Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <WellnessIcon size="md" color="green" className="opacity-70">
                <Calendar />
              </WellnessIcon>
            </div>
            <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
              <span className="font-display italic text-green-700">
                {transactionalSections.whyBookOnline[language].titleHighlight}
              </span>{' '}
              {transactionalSections.whyBookOnline[language].title.replace(transactionalSections.whyBookOnline[language].titleHighlight, '').trim()}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
              {transactionalSections.whyBookOnline[language].subtitle}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {transactionalSections.whyBookOnline[language].benefits.map((benefit, index) => {
              const IconComponent = getIconComponent(benefit.icon);
              
              return (
                <Card key={index} className="card-modern group hover:shadow-lg transition-all duration-300" data-testid={`benefit-card-${index}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-green-700" />
                    </div>
                    <h3 className="text-xl font-body font-bold text-green-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 font-body leading-relaxed">{benefit.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-green-50 border border-green-100 rounded-2xl p-8">
            <div className="mb-4">
              <CharmHealthBooking variant="prominent" />
            </div>
            <p className="text-sm text-orange-600 font-semibold bg-orange-50 border border-orange-200 rounded-full px-4 py-2 inline-block" data-testid="urgency-text">
              ⚡ {transactionalSections.whyBookOnline[language].urgencyText}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Trust & Credibility Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <WellnessIcon size="md" color="blue" className="opacity-70">
                <Award />
              </WellnessIcon>
            </div>
            <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
              <span className="font-display italic text-blue-700">
                {transactionalSections.trustCredibility[language].titleHighlight}
              </span>{' '}
              {transactionalSections.trustCredibility[language].title.replace(transactionalSections.trustCredibility[language].titleHighlight, '').trim()}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
              {transactionalSections.trustCredibility[language].subtitle}
            </p>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {transactionalSections.trustCredibility[language].credentials.map((credential, index) => {
              const IconComponent = getIconComponent(credential.icon);
              
              return (
                <Card key={index} className="card-modern group hover:shadow-lg transition-all duration-300" data-testid={`credential-card-${index}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-body font-bold text-blue-800 mb-3">{credential.title}</h3>
                    <p className="text-gray-600 font-body leading-relaxed">{credential.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group" data-testid="stat-experience">
                <div className="text-4xl font-bold text-blue-700 mb-2">
                  {transactionalSections.trustCredibility[language].stats.experience}
                </div>
                <div className="text-gray-600 font-body">
                  {language === 'en' ? 'Years Experience' : 'Años de Experiencia'}
                </div>
              </div>
              <div className="group" data-testid="stat-patients">
                <div className="text-4xl font-bold text-blue-700 mb-2">
                  {transactionalSections.trustCredibility[language].stats.patients}
                </div>
                <div className="text-gray-600 font-body">
                  {language === 'en' ? 'Patients Served' : 'Pacientes Atendidos'}
                </div>
              </div>
              <div className="group" data-testid="stat-satisfaction">
                <div className="text-4xl font-bold text-blue-700 mb-2">
                  {transactionalSections.trustCredibility[language].stats.satisfaction}
                </div>
                <div className="text-gray-600 font-body">
                  {language === 'en' ? 'Patient Satisfaction' : 'Satisfacción del Paciente'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Emergency & Urgency Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <WellnessIcon size="md" color="orange" className="opacity-70">
                <Clock />
              </WellnessIcon>
            </div>
            <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
              <span className="font-display italic text-red-700">
                {transactionalSections.emergencyUrgency[language].titleHighlight}
              </span>{' '}
              {transactionalSections.emergencyUrgency[language].title.replace(transactionalSections.emergencyUrgency[language].titleHighlight, '').trim()}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
              {transactionalSections.emergencyUrgency[language].subtitle}
            </p>
          </div>

          {/* Emergency Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {transactionalSections.emergencyUrgency[language].services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              
              return (
                <Card key={index} className="card-modern group hover:shadow-lg transition-all duration-300" data-testid={`emergency-service-card-${index}`}>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-red-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-body font-bold text-red-800 mb-2">{service.title}</h3>
                      <p className="text-gray-600 font-body leading-relaxed mb-3">{service.description}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                        {service.availability}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Emergency Numbers & CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-body font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Emergency Resources' : 'Recursos de Emergencia'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {transactionalSections.emergencyUrgency[language].emergencyNumbers.map((emergency, index) => (
                  <div key={index} className="text-center" data-testid={`emergency-number-${index}`}>
                    <a 
                      href={`tel:${emergency.number}`}
                      className="text-2xl font-bold text-red-700 hover:text-red-800 transition-colors block mb-1"
                    >
                      {emergency.number}
                    </a>
                    <p className="text-sm text-gray-600">{emergency.description}</p>
                  </div>
                ))}
              </div>
              <CharmHealthBooking variant="prominent" />
              <p className="text-sm text-red-600 font-semibold mt-4" data-testid="emergency-disclaimer">
                ⚠️ {transactionalSections.emergencyUrgency[language].disclaimer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Competitive Advantages Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <WellnessIcon size="md" color="purple" className="opacity-70">
                <Star />
              </WellnessIcon>
            </div>
            <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
              <span className="font-display italic text-purple-700">
                {transactionalSections.competitiveAdvantages[language].titleHighlight}
              </span>{' '}
              {transactionalSections.competitiveAdvantages[language].title.replace(transactionalSections.competitiveAdvantages[language].titleHighlight, '').trim()}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
              {transactionalSections.competitiveAdvantages[language].subtitle}
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {transactionalSections.competitiveAdvantages[language].advantages.map((advantage, index) => {
              const IconComponent = getIconComponent(advantage.icon);
              
              return (
                <Card key={index} className="card-modern group hover:shadow-lg transition-all duration-300" data-testid={`advantage-card-${index}`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-body font-bold text-purple-800 mb-3">{advantage.title}</h3>
                    <p className="text-gray-600 font-body leading-relaxed mb-3">{advantage.description}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                      {advantage.benefit}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Social Proof & CTA */}
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <p className="text-lg text-gray-600 font-body mb-6">
              {transactionalSections.competitiveAdvantages[language].socialProof}
            </p>
            <CharmHealthBooking variant="prominent" />
          </div>
        </div>
      </section>

      {/* 5. Patient Success Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <WellnessIcon size="md" color="green" className="opacity-70">
                <TrendingUp />
              </WellnessIcon>
            </div>
            <h2 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-4">
              <span className="font-display italic text-emerald-700">
                {transactionalSections.patientSuccess[language].titleHighlight}
              </span>{' '}
              {transactionalSections.patientSuccess[language].title.replace(transactionalSections.patientSuccess[language].titleHighlight, '').trim()}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
              {transactionalSections.patientSuccess[language].subtitle}
            </p>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {transactionalSections.patientSuccess[language].successMetrics.map((metric, index) => {
              const IconComponent = getIconComponent(metric.icon);
              
              return (
                <Card key={index} className="card-modern group hover:shadow-lg transition-all duration-300 text-center" data-testid={`success-metric-${index}`}>
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-700 mb-2">{metric.percentage}</div>
                  <h3 className="text-xl font-body font-bold text-emerald-800 mb-3">{metric.title}</h3>
                  <p className="text-gray-600 font-body leading-relaxed">{metric.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Patient Journey Examples */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 mb-12">
            <h3 className="text-2xl font-body font-bold text-gray-900 text-center mb-8">
              {language === 'en' ? 'Patient Journey Examples' : 'Ejemplos de Trayectoria del Paciente'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {transactionalSections.patientSuccess[language].journeyExamples.map((journey, index) => (
                <div key={index} className="text-center" data-testid={`journey-example-${index}`}>
                  <h4 className="text-lg font-body font-bold text-emerald-800 mb-2">{journey.condition}</h4>
                  <p className="text-sm text-emerald-600 font-semibold mb-4">{journey.timeframe}</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {journey.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {transactionalSections.patientSuccess[language].testimonialHighlights.map((testimonial, index) => (
              <Card key={index} className="card-modern" data-testid={`testimonial-${index}`}>
                <div className="text-center">
                  <div className="text-4xl text-emerald-500 mb-4">"</div>
                  <p className="text-gray-700 font-body italic mb-4 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-emerald-100 pt-4">
                    <p className="text-sm font-semibold text-emerald-700">{testimonial.location}</p>
                    <p className="text-xs text-gray-500">{testimonial.condition}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
            <h3 className="text-2xl font-body font-bold text-emerald-800 mb-4">
              {transactionalSections.patientSuccess[language].cta}
            </h3>
            <CharmHealthBooking variant="prominent" />
            <div className="mt-4 text-sm text-emerald-600 font-semibold">
              {language === 'en' ? '🌟 Join our success stories today' : '🌟 Únase a nuestras historias de éxito hoy'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransactionalContent;