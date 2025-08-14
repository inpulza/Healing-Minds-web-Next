import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { IconStethoscope } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import doctorImage from '@assets/doctor-consultation.jpg';

const DoctorSection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-12 lg:p-16 shadow-lg border border-green-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-green-800">
              <div className="flex items-start gap-3 mb-6">
                <WellnessIcon size="sm" color="green" className="mt-1 opacity-80">
                  <IconStethoscope />
                </WellnessIcon>
                <h2 className="text-3xl lg:text-5xl font-display font-bold" data-testid="doctor-section-title">
                  {language === 'en' 
                    ? 'Dedicated to your mental health, every day'
                    : 'Dedicados a su salud mental, todos los días'
                  }
                </h2>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold mb-2 text-green-600" data-testid="patient-count">15+</div>
                <div className="text-gray-600 font-body" data-testid="patient-label">
                  {language === 'en' ? 'Years of experience' : 'Años de experiencia'}
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-8 font-body leading-relaxed" data-testid="doctor-section-description">
                {language === 'en'
                  ? 'We provide compassionate care and advanced treatments tailored to your needs. Experience convenient access to mental healthcare.'
                  : 'Brindamos atención compasiva y tratamientos avanzados adaptados a sus necesidades. Experimente un acceso conveniente a la atención de salud mental.'
                }
              </p>

              <Link href="/services">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-10 py-8"
                  data-testid="explore-services-button"
                >
                  <span>{language === 'en' ? 'Explore services' : 'Explorar servicios'}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </Link>
            </div>

            {/* Doctor Image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
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