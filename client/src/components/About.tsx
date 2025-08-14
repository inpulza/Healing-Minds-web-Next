import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { IconUserHeart } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import doctorProfileImage from '@assets/doctor-profile.png';

const About = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Doctor Image */}
            <div className="relative order-1 lg:order-1">
              <div className="relative bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
                <img
                  src={doctorProfileImage}
                  alt="Dr. Melva Reve - Board Certified Psychiatrist in Naples, FL"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover object-top"
                  data-testid="about-doctor-image"
                />
                {/* Subtle Green Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-600/10" />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center lg:text-left order-2 lg:order-2">
              {/* Header badges */}
              <div className="flex justify-center lg:justify-start gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                <span className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-body">
                  {language === 'en' ? 'Naples Health Center' : 'Centro de Salud Naples'}
                </span>
                <span className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-body">
                  {language === 'en' ? 'Psychiatry' : 'Psiquiatría'}
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <WellnessIcon size="md" color="blue" className="opacity-80">
                  <IconUserHeart />
                </WellnessIcon>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-gray-900" data-testid="about-title">
                  Dr. Melva Reve
                </h2>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 font-body leading-relaxed max-w-lg mx-auto lg:mx-0" data-testid="about-description">
                {language === 'en'
                  ? 'Board-certified psychiatrist with over 15 years of experience in comprehensive mental health care. Dr. Reve specializes in anxiety disorders, depression, ADHD, and trauma-informed therapy, providing personalized treatment plans that integrate evidence-based medicine with compassionate care.'
                  : 'Psiquiatra certificada por la junta con más de 15 años de experiencia en atención integral de salud mental. La Dra. Reve se especializa en trastornos de ansiedad, depresión, TDAH y terapia informada por trauma, brindando planes de tratamiento personalizados que integran medicina basada en evidencia con atención compasiva.'
                }
              </p>

              {/* Credentials */}
              <div className="mb-6 sm:mb-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 font-body">
                  <div>
                    <div className="font-semibold text-green-600">
                      {language === 'en' ? 'Board Certified' : 'Certificada por la Junta'}
                    </div>
                    <div>{language === 'en' ? 'American Board of Psychiatry' : 'Junta Americana de Psiquiatría'}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {language === 'en' ? 'Education' : 'Educación'}
                    </div>
                    <div>{language === 'en' ? 'MD, Psychiatry Residency' : 'MD, Residencia en Psiquiatría'}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {language === 'en' ? 'Languages' : 'Idiomas'}
                    </div>
                    <div>{language === 'en' ? 'English, Spanish' : 'Inglés, Español'}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {language === 'en' ? 'Specialties' : 'Especialidades'}
                    </div>
                    <div>{language === 'en' ? 'Adult Psychiatry' : 'Psiquiatría de Adultos'}</div>
                  </div>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <a 
                  href="https://linkedin.com/in/dr-melva-reve" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                  data-testid="linkedin-link"
                >
                  <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </a>
                <a 
                  href="https://facebook.com/healingmindspsychiatry" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                  data-testid="facebook-link"
                >
                  <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                </a>
                <a 
                  href="https://instagram.com/healingmindspsychiatry" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-50 hover:bg-pink-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                  data-testid="instagram-link"
                >
                  <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                </a>
              </div>

              <Link href="/contact">
                <Button
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 px-6 sm:px-8 py-4 sm:py-5"
                  data-testid="about-book-now"
                >
                  <span>{language === 'en' ? 'Book now' : 'Reservar ahora'}</span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-500">
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
