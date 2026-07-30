import React from 'react';
import { Link } from '@/lib/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Navigation, Clock, Users } from 'lucide-react';
import southwestFloridaMap from '../assets/southwest-florida-map.webp';
import southwestFloridaMap400 from '../assets/southwest-florida-map-400w.webp';
import southwestFloridaMap600 from '../assets/southwest-florida-map-600w.webp';
import { assetUrl } from '@/lib/asset-url';

const ServiceAreas: React.FC = () => {
  const { language } = useLanguage();

  const locationPath = (enSlug: string, esSlug: string) =>
    language === 'en' ? `/locations/${enSlug}` : `/es/ubicaciones/${esSlug}`;

  const serviceAreas = [
    {
      name: 'Naples, FL',
      population: '22,088',
      distance: language === 'en' ? 'Main Office' : 'Oficina Principal',
      coordinates: [26.1420, -81.7948] as [number, number],
      isMainOffice: true,
      path: locationPath('psychiatrist-naples', 'psiquiatra-naples')
    },
    {
      name: 'Marco Island, FL', 
      population: '17,963',
      distance: language === 'en' ? '20 min drive' : '20 min en auto',
      coordinates: [25.9412, -81.7273] as [number, number],
      isMainOffice: false,
      path: locationPath('psychiatrist-marco-island', 'psiquiatra-marco-island')
    },
    {
      name: 'Bonita Springs, FL',
      population: '57,755', 
      distance: language === 'en' ? '25 min drive' : '25 min en auto',
      coordinates: [26.3398, -81.7787] as [number, number],
      isMainOffice: false,
      path: locationPath('psychiatrist-bonita-springs', 'psiquiatra-bonita-springs')
    },
    {
      name: 'Estero, FL',
      population: '36,939',
      distance: language === 'en' ? '30 min drive' : '30 min en auto',
      coordinates: [26.4376, -81.8067] as [number, number],
      isMainOffice: false,
      path: locationPath('psychiatrist-estero', 'psiquiatra-estero')
    }
  ];

  // Center coordinates for Southwest Florida view
  const mapCenter: [number, number] = [26.1420, -81.7948]; // Naples center

  const stats = [
    {
      icon: Users,
      value: '150,000+',
      label: language === 'en' ? 'Residents Served' : 'Residentes'
    },
    {
      icon: MapPin,
      value: '4',
      label: language === 'en' ? 'Service Areas' : 'Áreas'
    },
    {
      icon: Clock,
      value: '30min',
      label: language === 'en' ? 'Max Drive Time' : 'Tiempo Máx'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50" data-testid="service-areas">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-body font-bold text-green-800 mb-4 sm:mb-6" data-testid="service-areas-title">
            {language === 'en' 
              ? <>Serving <span className="font-display italic text-green-700">Southwest</span> Florida</>
              : <>Sirviendo el <span className="font-display italic text-green-700">Suroeste</span> de Florida</>
            }
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="service-areas-description">
            {language === 'en'
              ? 'Quality psychiatric care delivered across Collier County and surrounding areas. We bring professional mental health services to your community.'
              : 'Atención psiquiátrica de calidad entregada en el Condado de Collier y áreas circundantes. Llevamos servicios profesionales de salud mental a su comunidad.'
            }
          </p>
        </div>

        {/* Stats - Above Map */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <stat.icon className="w-12 h-12 p-3 bg-green-100 rounded-lg text-green-600 flex-shrink-0" />
                <div className="text-2xl font-bold text-green-800 whitespace-nowrap">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* Real Google Maps Background */}
          <div className="relative order-2 lg:order-1 lg:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                
                {/* Google Maps Screenshot as Background */}
                <div className="absolute inset-0">
                  <img 
                    src={assetUrl(southwestFloridaMap)}
                    srcSet={`
                      ${assetUrl(southwestFloridaMap400)} 400w,
                      ${assetUrl(southwestFloridaMap600)} 600w,
                      ${assetUrl(southwestFloridaMap)} 800w
                    `}
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px"
                    alt="Southwest Florida service area map showing Naples, Marco Island, Bonita Springs, and Estero with psychiatric care coverage locations"
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* City Markers positioned exactly over map locations - with overflow prevention */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Naples - Center (Main Office) - Based on map position */}
                  <div className="absolute" style={{top: '68%', left: '37%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full shadow-lg animate-pulse border-2 border-white"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-[120px] text-center">
                        <span className="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded-md shadow-lg inline-block">
                          Naples ⭐
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Marco Island - Bottom area */}
                  <div className="absolute" style={{top: '88%', left: '40%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-[120px] text-center">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg inline-block">
                          Marco Island
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estero - North center area */}
                  <div className="absolute" style={{top: '36%', left: '38%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-[100px] text-center">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg inline-block">
                          Estero
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bonita Springs - Fort Myers area */}
                  <div className="absolute" style={{top: '28%', left: '25%', transform: 'translate(-50%, -50%)'}}>
                    <div className="relative">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-[120px] text-center">
                        <span className="text-xs font-medium text-white bg-blue-600 px-2 py-1 rounded-md shadow-lg inline-block">
                          Bonita Springs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Coverage Circle around Naples */}
                  <div className="absolute" style={{top: '68%', left: '37%', transform: 'translate(-50%, -50%)'}}>
                    <div className="w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-full bg-green-500 bg-opacity-10 border border-green-400 border-opacity-20"></div>
                  </div>
                </div>

                {/* Compass */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                </div>

                {/* Distance Scale */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white bg-opacity-90 rounded-lg shadow-lg px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <div className="w-8 h-0.5 bg-gray-500"></div>
                      <span>30 mi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Main Office' : 'Oficina Principal'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'en' ? 'Service Areas' : 'Áreas de Servicio'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas List & Contact */}
          <div className="order-1 lg:order-2 lg:col-span-1 space-y-6">
            {/* Service Areas List */}
            <div className="space-y-4" data-testid="service-areas-list">
              {serviceAreas.map((area, index) => (
                <Link
                  key={index}
                  href={area.path}
                  className="block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-green-50 hover:shadow-md hover:border-green-200 transition-all duration-300"
                  data-testid={`service-area-link-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-green-800 mb-1">{area.name}</h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          {language === 'en' ? `Population: ${area.population}` : `Población: ${area.population}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-semibold text-green-600">{area.distance}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {language === 'en' ? 'from office' : 'desde oficina'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-green-800 mb-1 sm:mb-2">
                    {language === 'en' ? 'Main Office Location' : 'Ubicación de Oficina Principal'}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-2 leading-relaxed">
                    4760 Tamiami Trl N # 25, Naples, FL 34103<br />
                    {language === 'en' 
                      ? 'Serving all surrounding communities' 
                      : 'Sirviendo todas las comunidades circundantes'
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {language === 'en'
                      ? 'Telehealth services available for all service areas'
                      : 'Servicios de telesalud disponibles para todas las áreas de servicio'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;