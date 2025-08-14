import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const About = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-12 lg:p-16 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Doctor Image */}
            <div className="relative">
              <div className="bg-gray-100 rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700&q=80"
                  alt="Dr. Melva Reve - Board Certified Psychiatrist in Naples, FL"
                  className="w-full h-[500px] object-cover"
                  data-testid="about-doctor-image"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Header badges */}
              <div className="flex justify-center lg:justify-start gap-4 mb-6">
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-body">
                  {language === 'en' ? 'Naples Health Center' : 'Centro de Salud Naples'}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-body">
                  {language === 'en' ? 'Psychiatry' : 'Psiquiatría'}
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6" data-testid="about-title">
                Dr. Melva Reve
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 font-body leading-relaxed max-w-md mx-auto lg:mx-0" data-testid="about-description">
                {language === 'en'
                  ? 'A dedicated psychiatrist focused on mental health and patient-centered care.'
                  : 'Una psiquiatra dedicada enfocada en la salud mental y el cuidado centrado en el paciente.'
                }
              </p>

              {/* Social icons placeholder */}
              <div className="flex justify-center lg:justify-start gap-4 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-500 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-700 rounded"></div>
                </div>
              </div>

              <Link href="/contact">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-8 py-4"
                  data-testid="about-book-now"
                >
                  <span>{language === 'en' ? 'Book now' : 'Reservar ahora'}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
