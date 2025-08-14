import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import doctorImage from '@assets/doctor-consultation.jpg';

const DoctorSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 shadow-lg border border-green-100">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Content */}
            <div className="text-green-800 order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-4 sm:mb-6" data-testid="doctor-section-title">
                {language === 'en' 
                  ? <>Dedicated to your <span className="font-display italic text-green-700">mental health</span>, every day</>
                  : <>Dedicados a su <span className="font-display italic text-green-700">salud mental</span>, todos los días</>
                }
              </h2>
              
              <div className="mb-6 sm:mb-8">
                <div className="text-3xl sm:text-4xl font-bold mb-2 text-green-600" data-testid="patient-count">15+</div>
                <div className="text-gray-600 font-body text-sm sm:text-base" data-testid="patient-label">
                  {language === 'en' ? 'Years of experience' : 'Años de experiencia'}
                </div>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-body leading-relaxed" data-testid="doctor-section-description">
                {language === 'en'
                  ? 'We provide compassionate care and advanced treatments tailored to your needs. Experience convenient access to mental healthcare.'
                  : 'Brindamos atención compasiva y tratamientos avanzados adaptados a sus necesidades. Experimente un acceso conveniente a la atención de salud mental.'
                }
              </p>

              <Link href="/services">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-6 sm:py-7"
                  data-testid="explore-services-button"
                >
                  <span>{language === 'en' ? 'Explore services' : 'Explorar servicios'}</span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </Button>
              </Link>
            </div>

            {/* Doctor Image */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={doctorImage}
                  alt="Dr. Melva Reve - Board Certified Psychiatrist"
                  className="w-full h-full object-cover"
                  data-testid="doctor-section-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;