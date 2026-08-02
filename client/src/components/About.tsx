import { Link } from '@/lib/navigation';
import { assetUrl } from '@/lib/asset-url';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users, CheckCircle, Play, Linkedin, Facebook, Instagram, Brain } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import Reviews from '@/components/Reviews';
import { useTikTokVideos } from '@/hooks/useTikTokVideos';
import doctorProfileImage from '@assets/doctor-profile-hq.webp';
import { aboutContent } from '@/data/pageContent/mainPages/about';
import { renderRichText } from '@/components/RichText';
import { socialProfiles } from '@shared/social-profiles';

const About = () => {
  const { language } = useLanguage();
  const { data: tikTokVideos, isLoading: isLoadingVideos } = useTikTokVideos();
  const content = aboutContent[language];
  const section = (key: string) => content.sections.find((x) => x.key === key)!;
  const bio = section('biography').paragraphs!;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero de Conexión Inmediata - Sin contenedor blanco */}
      <section className="py-12 sm:py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Foto de la doctora */}
            <div className="relative order-2 lg:order-1">
              <div className="relative bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
                <img
                  src={assetUrl(doctorProfileImage)}
                  alt="Dr. Melva Reve, MD - Professional headshot of psychiatrist specializing in anxiety, depression, and ADHD treatment in Naples"
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
                {renderRichText(content.title, undefined, 'font-display italic text-green-700')}
              </h1>
              
              {/* Subtítulo de misión */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-body leading-relaxed" data-testid="about-hero-subtitle">
                {section('heroSubtitle').paragraphs![0]}
              </p>

              {/* Badges de credibilidad */}
              <div className="flex justify-center lg:justify-start gap-4 mb-8 flex-wrap">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  {section('heroBadges').bullets![0]}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  {section('heroBadges').bullets![1]}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                  {section('heroBadges').bullets![2]}
                </span>
              </div>

              {/* CTA Principal */}
              <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-7 hover:shadow-lg hover:-translate-y-1"
                  data-testid="about-hero-cta"
                >
                  <span>{section('heroCta').paragraphs![0]}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-green-600">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Videos de la Doctora - Una Conversación con la Dra. Reve */}
      <section className="py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            {/* Encabezado de sección */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="video-section-title">
                {renderRichText(section('videoHeading').heading!, undefined, 'font-display italic text-green-700')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {section('videoHeading').paragraphs![0]}
              </p>
            </div>

            {/* Grid de Videos - Layout Responsivo Compacto */}
            {isLoadingVideos ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border animate-pulse">
                    {/* Cuadrado en móvil, vertical en desktop */}
                    <div className="aspect-square lg:aspect-[9/16] bg-gray-200" />
                    {/* Info solo en desktop */}
                    <div className="hidden lg:block p-4">
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {tikTokVideos?.slice(0, 4).map((video, index) => (
                  <div key={video.id} className="bg-gray-50 rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 group">
                    <a 
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      data-testid={`video-link-${index + 1}`}
                    >
                      {/* Cuadrado en móvil, vertical en desktop */}
                      <div className="aspect-square lg:aspect-[9/16] relative overflow-hidden">
                        {video.thumbnail ? (
                          <>
                            <img 
                              src={video.thumbnail}
                              alt={`Video de la Dra. Reve: ${video.title}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                              {/* Botón de play más pequeño en móvil */}
                              <div className="w-10 h-10 lg:w-16 lg:h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-5 h-5 lg:w-8 lg:h-8 text-gray-800 ml-0.5 lg:ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center h-full">
                            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-5 h-5 lg:w-8 lg:h-8 text-green-600 ml-0.5 lg:ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Info solo visible en desktop */}
                      <div className="hidden lg:block p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" data-testid={`video-title-${index + 1}`}>
                          {video.title.length > 60 ? `${video.title.substring(0, 60)}...` : video.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>💬 {video.commentCount}</span>
                          {video.reactionCount > 0 && <span>❤️ {video.reactionCount}</span>}
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Call to Action para TikTok */}
            <div className="text-center">
              <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">
                  {section('videoCta').heading!}
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {section('videoCta').paragraphs![0]}
                </p>
                <a
                  href={socialProfiles.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-black text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-medium sm:font-semibold text-sm sm:text-lg hover:bg-gray-800 transition-colors duration-300"
                  data-testid="tiktok-follow-button"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.183-.11 6.44 6.44 0 0 0-6.444 6.444 6.44 6.44 0 0 0 6.444 6.444 6.44 6.44 0 0 0 6.444-6.444V8.862a8.23 8.23 0 0 0 4.789 1.515v-3.446a4.792 4.792 0 0 1-.817-.245z"/>
                  </svg>
                  <span>
                    {section('videoCta').paragraphs![1]} {socialProfiles.tiktok.handle}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Biografía y Credenciales Profesionales - Meet Dr. Melva Reve */}
      <section className="py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="biography-title">
                {renderRichText(section('biographyHeading').heading!, undefined, 'font-display italic text-green-700')}
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Biografía personal - 2 columnas */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {renderRichText(bio[0], undefined, 'font-bold text-green-600')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {renderRichText(bio[1], undefined, 'font-bold text-green-600')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {renderRichText(bio[2], undefined, 'font-bold text-green-600')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {renderRichText(bio[3], undefined, 'font-bold text-green-600')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {renderRichText(bio[4], undefined, 'font-bold text-green-600')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {renderRichText(bio[5], undefined, 'font-bold text-green-600')}
                  </p>
                </div>
              </div>

              {/* Credenciales - 1 columna */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {section('credentialsHeading').heading!}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {section('credCertification').heading!}
                      </h4>
                      <p className="text-gray-700">
                        {section('credCertification').paragraphs![0]}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {section('credEducation').heading!}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {section('credEducation').paragraphs![0]}<br />{section('credEducation').paragraphs![1]}<br />{section('credEducation').paragraphs![2]}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {section('credSpecialization').heading!}
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {section('credSpecialization').bullets!.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {section('credLanguages').heading!}
                      </h4>
                      <p className="text-gray-700">
                        {section('credLanguages').paragraphs![0]}<br />{section('credLanguages').paragraphs![1]}
                      </p>
                    </div>
                  </div>

                  {/* Social Media Icons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-green-200">
                    <a 
                      href={socialProfiles.linkedin.url}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="linkedin-link"
                      aria-label={language === 'en' ? 'Visit Dr. Melva Reve LinkedIn profile' : 'Visitar perfil de LinkedIn de la Dra. Melva Reve'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                    <a 
                      href={socialProfiles.facebook.url}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="facebook-link"
                      aria-label={language === 'en' ? 'Visit Healing Minds Psychiatry Facebook page' : 'Visitar página de Facebook de Healing Minds Psychiatry'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-5 h-5 text-blue-700" />
                    </a>
                    <a 
                      href={socialProfiles.instagram.url}
                      className="w-10 h-10 bg-pink-50 hover:bg-pink-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="instagram-link"
                      aria-label={language === 'en' ? 'Visit Healing Minds Psychiatry Instagram page' : 'Visitar página de Instagram de Healing Minds Psychiatry'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4: El Proceso (Qué Esperar) */}
      <section className="py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="process-title">
                {renderRichText(section('processHeading').heading!, undefined, 'font-display italic text-green-700')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {section('processHeading').paragraphs![0]}
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
                    {language === 'en' ? 'First Consultation: We Listen' : 'Primera Consulta: Te Escuchamos'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'A deep, unhurried conversation where you share your story, concerns, and goals. No judgments, only understanding.'
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
                    {language === 'en' ? 'Collaborative Plan: We Design Together' : 'Plan Colaborativo: Diseñamos Juntos'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'Based on your evaluation, we co-create a clear and realistic treatment plan that respects your values, lifestyle, and preferences.'
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
                    {language === 'en' ? 'Ongoing Support: We Grow with You' : 'Apoyo Continuo: Crecemos Contigo'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'en'
                      ? 'Regular follow-up to adjust treatment according to your progress, celebrate your achievements, and navigate together any challenges that arise.'
                      : 'Seguimiento regular para ajustar el tratamiento según tu progreso, celebrar tus logros y navegar juntos cualquier desafío que surja.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 5: Prueba Social (Reseñas de Pacientes) */}
      <section className="py-16 lg:py-20 bg-green-50">
        {/* Integrar el componente Reviews existente */}
        <Reviews />
      </section>

      {/* Sección 6: Mi Enfoque (Filosofía de Cuidado) */}
      <section className="py-16 lg:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-7 lg:px-8">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border">
            {/* Encabezado de sección */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-6" data-testid="approach-title">
                {language === 'en' 
                  ? <><span className="font-display italic text-green-700">Modern</span>, Human and Collaborative Psychiatry</>
                  : <>Psiquiatría <span className="font-display italic text-green-700">Moderna</span>, Humana y Colaborativa</>
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'My practice is not just a distant clinical model. It is a therapeutic alliance where we co-create a wellness plan designed specifically for you, combining evidence-based medicine with deep human understanding.'
                  : 'Mi práctica no es solo un modelo clínico distante. Es una alianza terapéutica donde co-creamos un plan de bienestar diseñado específicamente para ti, combinando medicina basada en evidencia con comprensión humana profunda.'
                }
              </p>
            </div>

            {/* Tres pilares del enfoque */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pilar 1: Diagnóstico Preciso */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' 
                    ? 'Precise Diagnosis and Personalized Treatment'
                    : 'Diagnóstico Preciso y Tratamiento Personalizado'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'Comprehensive evaluations that go beyond surface symptoms, identifying underlying causes to create truly personalized treatment strategies.'
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
                    ? 'Trauma-Informed Therapy and Cultural Sensitivity'
                    : 'Terapia Informada en Trauma y Sensibilidad Cultural'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'Care that recognizes how past experiences shape the present, with deep sensitivity toward your cultural and linguistic background.'
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
                    ? 'Continuous Collaboration and Empowerment'
                    : 'Colaboración Continua y Empoderamiento'
                  }
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en'
                    ? 'You are the expert in your own life. We work together as partners in your healing, adjusting treatment according to your progress and changing needs.'
                    : 'Tú eres el experto en tu propia vida. Trabajamos juntos como socios en tu sanación, ajustando el tratamiento según tu progreso y tus necesidades cambiantes.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
