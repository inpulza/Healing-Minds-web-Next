import { Link } from '@/lib/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-16 lg:py-20 from-green-700 to-green-800 text-white bg-[#14532d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-6" data-testid="cta-title">
            {language === 'en' 
              ? <>Ready to Take the <span className="font-display italic text-green-200">First</span> Step?</>
              : <>¿Listo/a para Dar el <span className="font-display italic text-green-200">Primer</span> Paso?</>
            }
          </h2>
          <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
            {language === 'en'
              ? 'Change begins with a simple conversation. I am here to listen to you, understand you, and walk with you toward a fuller and more balanced life.'
              : 'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.'
            }
          </p>
          
          <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
            <Button
              className="group inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full text-base sm:text-xl font-semibold transition-all duration-300 bg-white text-green-700 hover:bg-green-50 px-4 sm:px-10 py-6 sm:py-8 hover:shadow-xl hover:-translate-y-2 mb-6"
              data-testid="cta-button"
            >
              <span className="text-center">{language === 'en' ? 'Schedule My Consultation Now' : 'Agendar mi Consulta Ahora'}</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-800 flex-shrink-0">
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </Button>
          </Link>
          
          <p className="text-green-200 text-sm max-w-2xl mx-auto">
            {language === 'en'
              ? 'Consultations use privacy safeguards and are governed by applicable medical privacy laws. Review the practice privacy notice and consent documents for details.'
              : 'Las consultas utilizan medidas de privacidad y se rigen por las leyes aplicables de privacidad médica. Consulte el aviso de privacidad y los documentos de consentimiento para conocer los detalles.'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
