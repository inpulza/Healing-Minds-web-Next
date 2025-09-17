import { Link } from 'wouter';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Users, CheckCircle, Play, Linkedin, Facebook, Instagram, Brain } from 'lucide-react';
import WellnessIcon from '@/components/WellnessIcon';
import Reviews from '@/components/Reviews';
import { useTikTokVideos } from '@/hooks/useTikTokVideos';
import doctorProfileImage from '@assets/doctor-profile-v2.webp';

const About = () => {
  const { language } = useLanguage();
  const { data: tikTokVideos, isLoading: isLoadingVideos } = useTikTokVideos();

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
                  ? <>A <span className="font-display italic text-green-700">Safe Space</span> to <span className="font-display italic text-green-700">Heal</span> and Find <span className="font-display italic text-green-700">Clarity</span></>
                  : <>Un <span className="font-display italic text-green-700">Espacio Seguro</span> para <span className="font-display italic text-green-700">Sanar</span> y Encontrar <span className="font-display italic text-green-700">Claridad</span></>
                }
              </h1>
              
              {/* Subtítulo de misión */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-body leading-relaxed" data-testid="about-hero-subtitle">
                {language === 'en'
                  ? 'I am Dr. Melva Reve, and my mission is to accompany you on your journey toward mental wellness with compassionate care, personalized treatments, and renewed hope.'
                  : 'Soy la Dra. Melva Reve, y mi misión es acompañarte en tu camino hacia el bienestar mental con cuidado compasivo, tratamientos personalizados y esperanza renovada.'
                }
              </p>

              {/* Badges de credibilidad */}
              <div className="flex justify-center lg:justify-start gap-4 mb-8 flex-wrap">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  {language === 'en' ? '15+ years experience' : '15+ años experiencia'}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  {language === 'en' ? 'Bilingual' : 'Bilingüe'}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                  {language === 'en' ? 'Board Certified' : 'Certificada'}
                </span>
              </div>

              {/* CTA Principal */}
              <Link href="/contact">
                <Button
                  className="group inline-flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all duration-300 bg-green-700 text-white hover:bg-green-800 px-8 py-7 hover:shadow-lg hover:-translate-y-1"
                  data-testid="about-hero-cta"
                >
                  <span>{language === 'en' ? 'Schedule Consultation' : 'Agendar mi Consulta'}</span>
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
                {language === 'en' 
                  ? <>A <span className="font-display italic text-green-700">Conversation</span> with Dr. Reve</>
                  : <>Una <span className="font-display italic text-green-700">Conversación</span> con la Dra. Reve</>
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Get to know me through these educational videos where I share insights about mental health, answer common questions, and provide guidance for your wellness journey.'
                  : 'Conóceme a través de estos videos educativos donde comparto conocimientos sobre salud mental, respondo preguntas comunes y brindo orientación para tu viaje de bienestar.'
                }
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
                  {language === 'en' 
                    ? 'Have a Question for Dr. Reve?'
                    : '¿Tienes una Pregunta para la Dra. Reve?'
                  }
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'Follow me on TikTok for daily mental health tips and feel free to ask your questions directly!'
                    : '¡Sígueme en TikTok para consejos diarios de salud mental y no dudes en hacer tus preguntas directamente!'
                  }
                </p>
                <a
                  href="https://www.tiktok.com/@dra.melvavidal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-black text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-medium sm:font-semibold text-sm sm:text-lg hover:bg-gray-800 transition-colors duration-300"
                  data-testid="tiktok-follow-button"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.183-.11 6.44 6.44 0 0 0-6.444 6.444 6.44 6.44 0 0 0 6.444 6.444 6.44 6.44 0 0 0 6.444-6.444V8.862a8.23 8.23 0 0 0 4.789 1.515v-3.446a4.792 4.792 0 0 1-.817-.245z"/>
                  </svg>
                  <span>
                    {language === 'en' ? 'Follow @dra.melvavidal' : 'Seguir @dra.melvavidal'}
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
                {language === 'en' 
                  ? <>Meet <span className="font-display italic text-green-700">Dr. Melva</span> Reve</>
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
                      ? <>My passion for <span className="font-bold text-green-600">psychiatry</span> was born from a deep conviction: we all deserve to live with <span className="font-bold text-green-600">mental clarity</span>, <span className="font-bold text-green-600">emotional peace</span>, and renewed hope. For over <span className="font-bold text-green-600">15 years</span>, I have had the privilege of accompanying people in their most vulnerable moments and witnessing their incredible transformations through <span className="font-bold text-green-600">evidence-based treatment</span> and <span className="font-bold text-green-600">compassionate care</span>.</>
                      : <>Mi pasión por la <span className="font-bold text-green-600">psiquiatría</span> nació de una profunda convicción: todos merecemos vivir con <span className="font-bold text-green-600">claridad mental</span>, <span className="font-bold text-green-600">paz emocional</span> y esperanza renovada. Durante más de <span className="font-bold text-green-600">15 años</span>, he tenido el privilegio de acompañar a personas en sus momentos más vulnerables y ser testigo de sus increíbles transformaciones a través del <span className="font-bold text-green-600">tratamiento basado en evidencia</span> y <span className="font-bold text-green-600">cuidado compasivo</span>.</>
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? <>As the daughter of immigrants and a <span className="font-bold text-green-600">native Spanish speaker</span>, I deeply understand the unique challenges <span className="font-bold text-green-600">Latino families</span> face when seeking <span className="font-bold text-green-600">mental health care</span>. <span className="font-bold text-green-600">Language barriers</span>, cultural differences, and stigma should not prevent someone from receiving the care they deserve. My <span className="font-bold text-green-600">bilingual practice</span> ensures that every patient feels heard, understood, and respected in their preferred language, creating a bridge of trust that is essential for effective <span className="font-bold text-green-600">psychiatric treatment</span>.</>
                      : <>Como hija de inmigrantes y <span className="font-bold text-green-600">hablante nativa de español</span>, entiendo profundamente los desafíos únicos que enfrentan las <span className="font-bold text-green-600">familias latinas</span> al buscar <span className="font-bold text-green-600">atención de salud mental</span>. La <span className="font-bold text-green-600">barrera del idioma</span>, las diferencias culturales y el estigma no deberían impedir que alguien reciba el cuidado que merece. Mi <span className="font-bold text-green-600">práctica bilingüe</span> asegura que cada paciente se sienta escuchado, entendido y respetado en su idioma preferido, creando un puente de confianza que es esencial para un <span className="font-bold text-green-600">tratamiento psiquiátrico</span> efectivo.</>
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? <>My philosophy is simple but powerful: <span className="font-bold text-green-600">healing happens in relationship</span>. You are not a diagnosis; you are a complete person with a unique story, innate strengths, and unlimited potential for growth. My job is to walk with you on that journey toward <span className="font-bold text-green-600">wellness</span> and <span className="font-bold text-green-600">recovery</span>.</>
                      : <>Mi filosofía es simple pero poderosa: <span className="font-bold text-green-600">la sanación sucede en relación</span>. No eres un diagnóstico; eres una persona completa con una historia única, fortalezas innatas y un potencial ilimitado para el crecimiento. Mi trabajo es caminar contigo en ese viaje hacia el <span className="font-bold text-green-600">bienestar</span> y la <span className="font-bold text-green-600">recuperación</span>.</>
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? <>My approach combines the latest advances in <span className="font-bold text-green-600">psychiatric medicine</span> with time-honored principles of <span className="font-bold text-green-600">therapeutic alliance</span>. Whether you're struggling with <span className="font-bold text-green-600">anxiety</span>, <span className="font-bold text-green-600">depression</span>, <span className="font-bold text-green-600">ADHD</span>, <span className="font-bold text-green-600">PTSD</span>, or <span className="font-bold text-green-600">bipolar disorder</span>, I believe in creating a safe space where vulnerability becomes strength and challenges become opportunities for growth.</>
                      : <>Mi enfoque combina los últimos avances en <span className="font-bold text-green-600">medicina psiquiátrica</span> con principios consagrados de <span className="font-bold text-green-600">alianza terapéutica</span>. Ya sea que estés luchando con <span className="font-bold text-green-600">ansiedad</span>, <span className="font-bold text-green-600">depresión</span>, <span className="font-bold text-green-600">TDAH</span>, <span className="font-bold text-green-600">TEPT</span> o <span className="font-bold text-green-600">trastorno bipolar</span>, creo en crear un espacio seguro donde la vulnerabilidad se convierte en fortaleza y los desafíos se convierten en oportunidades de crecimiento.</>
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {language === 'en'
                      ? <>In my practice in <span className="font-bold text-green-600">Naples, Florida</span>, I've witnessed countless stories of transformation. From the anxious professional who learned to manage their stress, to the mother who overcame postpartum depression, to the teenager who found their voice again after trauma - each journey reminds me why I chose this calling. My commitment extends beyond traditional <span className="font-bold text-green-600">medication management</span> to include <span className="font-bold text-green-600">psychoeducation</span>, <span className="font-bold text-green-600">lifestyle interventions</span>, and collaborative care planning that empowers you to be an active participant in your healing.</>
                      : <>En mi práctica en <span className="font-bold text-green-600">Naples, Florida</span>, he sido testigo de innumerables historias de transformación. Desde el profesional ansioso que aprendió a manejar su estrés, hasta la madre que superó la depresión posparto, hasta el adolescente que encontró su voz nuevamente después del trauma - cada viaje me recuerda por qué elegí esta vocación. Mi compromiso se extiende más allá del tradicional <span className="font-bold text-green-600">manejo de medicamentos</span> para incluir <span className="font-bold text-green-600">psicoeducación</span>, <span className="font-bold text-green-600">intervenciones de estilo de vida</span> y planificación de cuidado colaborativo que te empodera a ser un participante activo en tu sanación.</>
                    }
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {language === 'en'
                      ? <>Every session is an opportunity to reclaim your narrative, to rediscover your resilience, and to build the life you deserve. My role as your <span className="font-bold text-green-600">psychiatrist</span> is not just to diagnose and treat, but to walk alongside you as you navigate the path toward <span className="font-bold text-green-600">mental wellness</span>, <span className="font-bold text-green-600">emotional balance</span>, and renewed hope. Together, we'll create a treatment plan that honors your unique circumstances, respects your cultural background, and aligns with your personal goals for recovery and growth.</>
                      : <>Cada sesión es una oportunidad para reclamar tu narrativa, redescubrir tu resistencia y construir la vida que mereces. Mi papel como tu <span className="font-bold text-green-600">psiquiatra</span> no es solo diagnosticar y tratar, sino caminar a tu lado mientras navegas el camino hacia el <span className="font-bold text-green-600">bienestar mental</span>, el <span className="font-bold text-green-600">equilibrio emocional</span> y la esperanza renovada. Juntos, crearemos un plan de tratamiento que honre tus circunstancias únicas, respete tu trasfondo cultural y se alinee con tus metas personales de recuperación y crecimiento.</>
                    }
                  </p>
                </div>
              </div>

              {/* Credenciales - 1 columna */}
              <div className="lg:col-span-1">
                <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {language === 'en' ? 'Credentials and Training' : 'Credenciales y Formación'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Board Certification' : 'Certificación Médica'}
                      </h4>
                      <p className="text-gray-700">
                        {language === 'en' 
                          ? 'Board Certified in Adult Psychiatry'
                          : 'Certificada en Psiquiatría de Adultos'
                        }
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Medical Education' : 'Educación Médica'}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {language === 'en' 
                          ? <>Doctor of Medicine (M.D.)<br />Psychiatric Residency Training<br />Specialized Training in Cultural Competency</>
                          : <>Doctora en Medicina (M.D.)<br />Residencia en Psiquiatría<br />Entrenamiento Especializado en Competencia Cultural</>
                        }
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Areas of Specialization' : 'Áreas de Especialización'}
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {language === 'en' 
                          ? <>
                            <li>• Anxiety Disorders</li>
                            <li>• Depression</li>
                            <li>• Adult ADHD</li>
                            <li>• Trauma and PTSD</li>
                            <li>• Bipolar Disorder</li>
                          </>
                          : <>
                            <li>• Trastornos de Ansiedad</li>
                            <li>• Depresión</li>
                            <li>• TDAH en Adultos</li>
                            <li>• Trauma y TEPT</li>
                            <li>• Trastorno Bipolar</li>
                          </>
                        }
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        {language === 'en' ? 'Languages' : 'Idiomas'}
                      </h4>
                      <p className="text-gray-700">
                        {language === 'en' 
                          ? <>Spanish (native)<br />English (fluent)</>
                          : <>Español (nativo)<br />Inglés (fluido)</>
                        }
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
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                    <a 
                      href="https://facebook.com/healingmindspsychiatry" 
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-300"
                      data-testid="facebook-link"
                      aria-label={language === 'en' ? 'Visit Healing Minds Psychiatry Facebook page' : 'Visitar página de Facebook de Healing Minds Psychiatry'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-5 h-5 text-blue-700" />
                    </a>
                    <a 
                      href="https://instagram.com/healingmindspsychiatry" 
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
                {language === 'en' 
                  ? <>Your <span className="font-display italic text-green-700">Journey</span> with Us: What to Expect</>
                  : <>Tu Viaje con <span className="font-display italic text-green-700">Nosotros</span>: Qué Esperar</>
                }
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
                {language === 'en'
                  ? 'Our process is designed to make you feel comfortable, heard, and empowered from the very first moment.'
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