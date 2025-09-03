import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Users, Clock, CheckCircle, FileText } from 'lucide-react';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { IconUserHeart, IconBrain, IconStethoscope } from '@tabler/icons-react';
import WellnessIcon from '@/components/WellnessIcon';
import Reviews from '@/components/Reviews';
import doctorProfileImage from '@assets/doctor-profile.webp';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sección 1: Hero de Conexión Inmediata */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Foto de la doctora */}
              <div className="relative order-2 lg:order-1">
                <div className="relative bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <img
                    src={doctorProfileImage}
                    alt="Dr. Melva Reve, MD - Professional headshot of board-certified psychiatrist specializing in anxiety, depression, and ADHD treatment in Naples"
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover object-top"
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    data-testid="about-hero-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-600/10" />
                </div>
              </div>
              
              {/* Contenido empático */}
              <div className="text-center lg:text-left order-1 lg:order-2">
                {/* H1 Principal */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-body font-bold text-green-800 mb-6" data-testid="about-hero-title">
                  {language === 'en' 
                    ? <>Un <span className="font-display italic text-green-700">Espacio Seguro</span> para <span className="font-display italic text-green-700">Sanar</span> y Encontrar <span className="font-display italic text-green-700">Claridad</span></>
                    : <>Un <span className="font-display italic text-green-700">Espacio Seguro</span> para <span className="font-display italic text-green-700">Sanar</span> y Encontrar <span className="font-display italic text-green-700">Claridad</span></>
                  }
                </h1>
                
                {/* Subtítulo de misión */}
                <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-body leading-relaxed" data-testid="about-hero-subtitle">
                  {language === 'en'
                    ? 'Soy la Dra. Melva Reve, y mi misión es acompañarte en tu camino hacia el bienestar mental con cuidado compasivo, tratamientos personalizados y esperanza renovada.'
                    : 'Soy la Dra. Melva Reve, y mi misión es acompañarte en tu camino hacia el bienestar mental con cuidado compasivo, tratamientos personalizados y esperanza renovada.'
                  }
                </p>

                {/* Badges de credibilidad */}
                <div className="flex justify-center lg:justify-start gap-4 mb-8 flex-wrap">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    {language === 'en' ? '15+ años experiencia' : '15+ años experiencia'}
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {language === 'en' ? 'Bilingüe' : 'Bilingüe'}
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                    {language === 'en' ? 'Certificada' : 'Certificada'}
                  </span>
                </div>

                {/* CTA Principal */}
                <Link href="/contact">
                  <Button
                    className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-7 hover:shadow-lg hover:-translate-y-1"
                    data-testid="about-hero-cta"
                  >
                    <span>{language === 'en' ? 'Agendar mi Consulta' : 'Agendar mi Consulta'}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-600">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Mi Enfoque (Filosofía de Cuidado) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            {/* Encabezado de sección */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="approach-title">
                {language === 'en' 
                  ? <>Psiquiatría <span className="font-display italic text-green-700">Moderna</span>, Humana y Colaborativa</>
                  : <>Psiquiatría <span className="font-display italic text-green-700">Moderna</span>, Humana y Colaborativa</>
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Mi práctica no es solo un modelo clínico distante. Es una alianza terapéutica donde co-creamos un plan de bienestar diseñado específicamente para ti, combinando medicina basada en evidencia con comprensión humana profunda.'
                  : 'Mi práctica no es solo un modelo clínico distante. Es una alianza terapéutica donde co-creamos un plan de bienestar diseñado específicamente para ti, combinando medicina basada en evidencia con comprensión humana profunda.'
                }
              </p>
            </div>

            {/* Tres pilares del enfoque */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pilar 1: Diagnóstico Preciso */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconBrain className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' 
                    ? 'Diagnóstico Preciso y Tratamiento Personalizado'
                    : 'Diagnóstico Preciso y Tratamiento Personalizado'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'Evaluaciones exhaustivas que van más allá de los síntomas superficiales, identificando las causas subyacentes para crear estrategias de tratamiento verdaderamente personalizadas.'
                    : 'Evaluaciones exhaustivas que van más allá de los síntomas superficiales, identificando las causas subyacentes para crear estrategias de tratamiento verdaderamente personalizadas.'
                  }
                </p>
              </div>

              {/* Pilar 2: Terapia Informada */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' 
                    ? 'Terapia Informada en Trauma y Sensibilidad Cultural'
                    : 'Terapia Informada en Trauma y Sensibilidad Cultural'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'Atención que reconoce cómo las experiencias pasadas moldean el presente, con profunda sensibilidad hacia tu trasfondo cultural y lingüístico.'
                    : 'Atención que reconoce cómo las experiencias pasadas moldean el presente, con profunda sensibilidad hacia tu trasfondo cultural y lingüístico.'
                  }
                </p>
              </div>

              {/* Pilar 3: Colaboración Continua */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' 
                    ? 'Colaboración Continua y Empoderamiento'
                    : 'Colaboración Continua y Empoderamiento'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'Tú eres el experto en tu propia vida. Trabajamos juntos como socios en tu sanación, ajustando el tratamiento según tu progreso y tus necesidades cambiantes.'
                    : 'Tú eres el experto en tu propia vida. Trabajamos juntos como socios en tu sanación, ajustando el tratamiento según tu progreso y tus necesidades cambiantes.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: El Proceso (Qué Esperar) */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="process-title">
                {language === 'en' 
                  ? <>Tu Viaje con <span className="font-display italic text-green-700">Nosotros</span>: Qué Esperar</>
                  : <>Tu Viaje con <span className="font-display italic text-green-700">Nosotros</span>: Qué Esperar</>
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Nuestro proceso está diseñado para que te sientas cómodo, escuchado y empoderado desde el primer momento.'
                  : 'Nuestro proceso está diseñado para que te sientas cómodo, escuchado y empoderado desde el primer momento.'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="relative">
                <div className="bg-green-50 rounded-2xl p-8 text-center border-2 border-green-100">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'Primera Consulta: Te Escuchamos' : 'Primera Consulta: Te Escuchamos'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'Una conversación profunda y sin prisas donde compartes tu historia, tus preocupaciones y tus objetivos. No hay juicios, solo comprensión.'
                      : 'Una conversación profunda y sin prisas donde compartes tu historia, tus preocupaciones y tus objetivos. No hay juicios, solo comprensión.'
                    }
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="relative">
                <div className="bg-blue-50 rounded-2xl p-8 text-center border-2 border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'Plan Colaborativo: Diseñamos Juntos' : 'Plan Colaborativo: Diseñamos Juntos'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'Basándome en tu evaluación, co-creamos un plan de tratamiento claro y realista que respeta tus valores, estilo de vida y preferencias.'
                      : 'Basándome en tu evaluación, co-creamos un plan de tratamiento claro y realista que respeta tus valores, estilo de vida y preferencias.'
                    }
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="relative">
                <div className="bg-purple-50 rounded-2xl p-8 text-center border-2 border-purple-100">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {language === 'en' ? 'Apoyo Continuo: Crecemos Contigo' : 'Apoyo Continuo: Crecemos Contigo'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'Seguimiento regular para ajustar el tratamiento según tu progreso, celebrar tus logros y navegar juntos cualquier desafío que surja.'
                      : 'Seguimiento regular para ajustar el tratamiento según tu progreso, celebrar tus logros y navegar juntos cualquier desafío que surja.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: Prueba Social (Reseñas de Pacientes) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="testimonials-title">
              {language === 'en' 
                ? <>Historias de <span className="font-display italic text-green-700">Esperanza</span> y Recuperación</>
                : <>Historias de <span className="font-display italic text-green-700">Esperanza</span> y Recuperación</>
              }
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
              {language === 'en'
                ? 'Estas son las palabras reales de pacientes que han encontrado esperanza y sanación a través de nuestro cuidado compasivo.'
                : 'Estas son las palabras reales de pacientes que han encontrado esperanza y sanación a través de nuestro cuidado compasivo.'
              }
            </p>
          </div>
        </div>
        
        {/* Integrar el componente Reviews existente */}
        <Reviews />
      </section>

      {/* Sección 5: Biografía y Credenciales Profesionales */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="biography-title">
                {language === 'en' 
                  ? <>Conoce a la <span className="font-display italic text-green-700">Dra. Melva</span> Reve</>
                  : <>Conoce a la <span className="font-display italic text-green-700">Dra. Melva</span> Reve</>
                }
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Biografía personal - 2 columnas */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Mi pasión por la psiquiatría nació de una profunda convicción: todos merecemos vivir con claridad mental, paz emocional y esperanza renovada. Durante más de 15 años, he tenido el privilegio de acompañar a personas en sus momentos más vulnerables y ser testigo de sus increíbles transformaciones.'
                      : 'Mi pasión por la psiquiatría nació de una profunda convicción: todos merecemos vivir con claridad mental, paz emocional y esperanza renovada. Durante más de 15 años, he tenido el privilegio de acompañar a personas en sus momentos más vulnerables y ser testigo de sus increíbles transformaciones.'
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? 'Como hija de inmigrantes y hablante nativa de español, entiendo profundamente los desafíos únicos que enfrentan las familias latinas al buscar atención de salud mental. La barrera del idioma, las diferencias culturales y el estigma no deberían impedir que alguien reciba el cuidado que merece.'
                      : 'Como hija de inmigrantes y hablante nativa de español, entiendo profundamente los desafíos únicos que enfrentan las familias latinas al buscar atención de salud mental. La barrera del idioma, las diferencias culturales y el estigma no deberían impedir que alguien reciba el cuidado que merece.'
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {language === 'en'
                      ? 'Mi filosofía es simple pero poderosa: la sanación sucede en relación. No eres un diagnóstico; eres una persona completa con una historia única, fortalezas innatas y un potencial ilimitado para el crecimiento. Mi trabajo es caminar contigo en ese viaje hacia el bienestar.'
                      : 'Mi filosofía es simple pero poderosa: la sanación sucede en relación. No eres un diagnóstico; eres una persona completa con una historia única, fortalezas innatas y un potencial ilimitado para el crecimiento. Mi trabajo es caminar contigo en ese viaje hacia el bienestar.'
                    }
                  </p>
                </div>
              </div>

              {/* Credenciales - 1 columna */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {language === 'en' ? 'Credenciales y Formación' : 'Credenciales y Formación'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Educación' : 'Educación'}
                      </h4>
                      <p className="text-gray-700">
                        Doctor en Medicina (MD)<br />
                        Residencia en Psiquiatría
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Certificaciones' : 'Certificaciones'}
                      </h4>
                      <p className="text-gray-700">
                        Junta Americana de Psiquiatría<br />
                        Certificación en Psiquiatría de Adultos
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Especialidades' : 'Especialidades'}
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Trastornos de Ansiedad</li>
                        <li>• Depresión</li>
                        <li>• TDAH en Adultos</li>
                        <li>• Trauma y TEPT</li>
                        <li>• Trastorno Bipolar</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Idiomas' : 'Idiomas'}
                      </h4>
                      <p className="text-gray-700">
                        Español (nativo)<br />
                        Inglés (fluido)
                      </p>
                    </div>
                  </div>

                  {/* Social Media Icons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-green-200">
                    <a 
                      href="https://linkedin.com/in/dr-melva-reve" 
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="linkedin-link"
                      aria-label={language === 'en' ? 'Visit Dr. Melva Reve LinkedIn profile' : 'Visitar perfil de LinkedIn de la Dra. Melva Reve'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="w-5 h-5 text-blue-600" />
                    </a>
                    <a 
                      href="https://facebook.com/healingmindspsychiatry" 
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="facebook-link"
                      aria-label={language === 'en' ? 'Visit Healing Minds Psychiatry Facebook page' : 'Visitar página de Facebook de Healing Minds Psychiatry'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className="w-5 h-5 text-blue-700" />
                    </a>
                    <a 
                      href="https://instagram.com/healingmindspsychiatry" 
                      className="w-10 h-10 bg-pink-50 hover:bg-pink-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="instagram-link"
                      aria-label={language === 'en' ? 'Visit Healing Minds Psychiatry Instagram page' : 'Visitar página de Instagram de Healing Minds Psychiatry'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-5 h-5 text-pink-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 6: Llamada a la Acción Final */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-green-700 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold mb-6" data-testid="final-cta-title">
              {language === 'en' 
                ? <>¿Listo/a para Dar el <span className="font-display italic text-green-200">Primer</span> Paso?</>
                : <>¿Listo/a para Dar el <span className="font-display italic text-green-200">Primer</span> Paso?</>
              }
            </h2>
            <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
              {language === 'en'
                ? 'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.'
                : 'El cambio comienza con una simple conversación. Estoy aquí para escucharte, entenderte y caminar contigo hacia una vida más plena y equilibrada.'
              }
            </p>
            
            <Link href="/contact">
              <Button
                className="group inline-flex items-center justify-center gap-4 rounded-full text-xl font-semibold transition-all duration-300 bg-white text-green-700 hover:bg-green-50 px-10 py-8 hover:shadow-xl hover:-translate-y-2 mb-6"
                data-testid="final-cta-button"
              >
                <span>{language === 'en' ? 'Agendar mi Consulta Ahora' : 'Agendar mi Consulta Ahora'}</span>
                <div className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-800">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </Button>
            </Link>
            
            <p className="text-green-200 text-sm max-w-2xl mx-auto">
              {language === 'en'
                ? 'Todas las consultas son completamente confidenciales y están protegidas por las leyes de privacidad médica. Tu privacidad y bienestar son nuestras máximas prioridades.'
                : 'Todas las consultas son completamente confidenciales y están protegidas por las leyes de privacidad médica. Tu privacidad y bienestar son nuestras máximas prioridades.'
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;