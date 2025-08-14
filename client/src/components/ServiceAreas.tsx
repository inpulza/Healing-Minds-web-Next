import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Navigation, Clock, Users } from 'lucide-react';

const ServiceAreas: React.FC = () => {
  const { language } = useLanguage();

  const serviceAreas = [
    {
      name: 'Naples, FL',
      population: '22,088',
      distance: language === 'en' ? 'Main Office' : 'Oficina Principal',
      coordinates: { x: 200, y: 180 }, // Center position
      isMainOffice: true
    },
    {
      name: 'Marco Island, FL', 
      population: '17,963',
      distance: language === 'en' ? '20 min drive' : '20 min en auto',
      coordinates: { x: 140, y: 240 }, // Southwest of Naples
      isMainOffice: false
    },
    {
      name: 'Bonita Springs, FL',
      population: '57,755', 
      distance: language === 'en' ? '25 min drive' : '25 min en auto',
      coordinates: { x: 200, y: 120 }, // North of Naples
      isMainOffice: false
    },
    {
      name: 'Estero, FL',
      population: '36,939',
      distance: language === 'en' ? '30 min drive' : '30 min en auto',
      coordinates: { x: 260, y: 100 }, // Northeast of Naples
      isMainOffice: false
    }
  ];

  // Custom SVG Map Component
  const CustomSVGMap = () => (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        data-testid="custom-map-svg"
      >
        {/* Definitions for patterns and gradients */}
        <defs>
          {/* Grid Pattern */}
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16a34a" strokeWidth="0.3" opacity="0.3"/>
          </pattern>
          
          {/* Water gradient */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#dbeafe", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#bfdbfe", stopOpacity:1}} />
          </linearGradient>
          
          {/* Land gradient */}
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#f0fdf4", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#ecfdf5", stopOpacity:1}} />
          </linearGradient>
          
          {/* Service area circle gradient */}
          <radialGradient id="serviceAreaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor:"#16a34a", stopOpacity:0.05}} />
            <stop offset="70%" style={{stopColor:"#16a34a", stopOpacity:0.1}} />
            <stop offset="100%" style={{stopColor:"#16a34a", stopOpacity:0.2}} />
          </radialGradient>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
        
        {/* Gulf of Mexico (Water) - Left side */}
        <path
          d="M 0 0 Q 80 50 120 100 Q 140 150 160 200 Q 180 250 200 300 L 0 300 Z"
          fill="url(#waterGradient)"
          stroke="#93c5fd" 
          strokeWidth="1"
          opacity="0.8"
        />
        
        {/* Main land area */}
        <path
          d="M 120 100 Q 180 80 250 90 Q 320 100 380 120 Q 390 180 400 240 L 400 300 L 200 300 Q 180 250 160 200 Q 140 150 120 100"
          fill="url(#landGradient)"
          stroke="#86efac"
          strokeWidth="1"
          opacity="0.9"
        />
        
        {/* Everglades area (darker green) */}
        <path
          d="M 300 200 Q 350 220 400 240 L 400 300 L 350 300 Q 320 280 300 200"
          fill="#dcfce7"
          opacity="0.6"
        />

        {/* Service coverage area circle */}
        <circle
          cx="200"
          cy="180"
          r="80"
          fill="url(#serviceAreaGradient)"
          stroke="#16a34a"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.6"
        />

        {/* Roads/Highways */}
        <path
          d="M 200 50 Q 220 100 200 150 Q 180 200 200 250"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
          opacity="0.7"
        />
        <path
          d="M 150 120 Q 200 130 250 120 Q 300 115 350 120"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          opacity="0.7"
        />

        {/* Service area markers */}
        {serviceAreas.map((area, index) => (
          <g key={index}>
            {/* Marker circle */}
            <circle
              cx={area.coordinates.x}
              cy={area.coordinates.y}
              r={area.isMainOffice ? 6 : 4}
              fill={area.isMainOffice ? '#16a34a' : '#3b82f6'}
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Pulse effect for main office */}
            {area.isMainOffice && (
              <circle
                cx={area.coordinates.x}
                cy={area.coordinates.y}
                r="10"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                opacity="0.6"
                className="animate-ping"
              />
            )}
            
            {/* City label */}
            <g>
              <rect
                x={area.coordinates.x - (area.name.length * 3)}
                y={area.coordinates.y - 20}
                width={area.name.length * 6}
                height="16"
                rx="8"
                fill="white"
                stroke={area.isMainOffice ? '#16a34a' : '#3b82f6'}
                strokeWidth="1"
                className="drop-shadow-sm"
                opacity="0.95"
              />
              <text
                x={area.coordinates.x}
                y={area.coordinates.y - 8}
                textAnchor="middle"
                className="text-xs font-semibold"
                fill={area.isMainOffice ? '#16a34a' : '#1e40af'}
                style={{ fontSize: '10px' }}
              >
                {area.name.split(',')[0]}
              </text>
            </g>
          </g>
        ))}

        {/* Compass rose */}
        <g transform="translate(360, 40)">
          <circle cx="0" cy="0" r="15" fill="white" stroke="#16a34a" strokeWidth="1" className="drop-shadow-sm"/>
          <path d="M 0 -12 L 3 -3 L 0 0 L -3 -3 Z" fill="#16a34a"/>
          <text x="0" y="-18" textAnchor="middle" className="text-xs font-bold" fill="#16a34a" style={{ fontSize: '8px' }}>N</text>
        </g>

        {/* Scale indicator */}
        <g transform="translate(20, 270)">
          <rect x="0" y="0" width="60" height="20" rx="10" fill="white" stroke="#16a34a" strokeWidth="1" opacity="0.9"/>
          <line x1="10" y1="10" x2="30" y2="10" stroke="#16a34a" strokeWidth="2"/>
          <text x="35" y="14" className="text-xs" fill="#16a34a" style={{ fontSize: '8px' }}>30mi</text>
        </g>

        {/* Location labels */}
        <text x="50" y="150" className="text-xs font-medium" fill="#1e40af" style={{ fontSize: '10px' }}>Gulf of Mexico</text>
      </svg>

      {/* Compass icon overlay */}
      <div className="absolute top-4 right-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-green-200">
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
      </div>
    </div>
  );

  // Simple fallback for older browsers
  const SimpleFallbackMap = () => (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Service Area Markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[320px] max-h-[240px]">
          {/* Naples - Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute -top-8 -left-4 whitespace-nowrap">
                <span className="text-xs font-bold text-green-800 bg-white px-2 py-1 rounded-md shadow-sm">Naples</span>
              </div>
            </div>
          </div>

          {/* Marco Island - Southwest */}
          <div className="absolute bottom-1/4 left-1/4">
            <div className="relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
              <div className="absolute -top-8 -left-6 whitespace-nowrap">
                <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Marco Island</span>
              </div>
            </div>
          </div>

          {/* Bonita Springs - North */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
              <div className="absolute -top-8 -left-8 whitespace-nowrap">
                <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Bonita Springs</span>
              </div>
            </div>
          </div>

          {/* Estero - Northeast */}
          <div className="absolute top-1/3 right-1/4">
            <div className="relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-lg"></div>
              <div className="absolute -top-8 -left-4 whitespace-nowrap">
                <span className="text-xs font-medium text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm">Estero</span>
              </div>
            </div>
          </div>

          {/* Service Area Coverage Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-green-300 rounded-full opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 right-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
      </div>

      {/* Browser compatibility message */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2">
          <p className="text-xs text-blue-800 text-center">
            {language === 'en' 
              ? 'Interactive service area map'
              : 'Mapa interactivo de áreas de servicio'
            }
          </p>
        </div>
      </div>
    </div>
  );

  const stats = [
    {
      icon: Users,
      value: '150,000+',
      label: language === 'en' ? 'Residents Served' : 'Residentes Atendidos'
    },
    {
      icon: MapPin,
      value: '4',
      label: language === 'en' ? 'Service Areas' : 'Áreas de Servicio'
    },
    {
      icon: Clock,
      value: '30min',
      label: language === 'en' ? 'Max Drive Time' : 'Tiempo Máx. en Auto'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-green-50" data-testid="service-areas">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-green-800 mb-4 sm:mb-6" data-testid="service-areas-title">
            {language === 'en' 
              ? 'Serving Southwest Florida'
              : 'Sirviendo el Suroeste de Florida'
            }
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed" data-testid="service-areas-description">
            {language === 'en'
              ? 'Quality psychiatric care delivered across Collier County and surrounding areas. We bring professional mental health services to your community.'
              : 'Atención psiquiátrica de calidad entregada en el Condado de Collier y áreas circundantes. Llevamos servicios profesionales de salud mental a su comunidad.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Map Visualization */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-green-100">
              <CustomSVGMap />

              {/* Map Legend */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
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

          {/* Service Areas List & Stats */}
          <div className="order-1 lg:order-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-800 mb-1">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Service Areas List */}
            <div className="space-y-4" data-testid="service-areas-list">
              {serviceAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-green-50 hover:shadow-md transition-shadow duration-300">
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
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-green-800 mb-1 sm:mb-2">
                    {language === 'en' ? 'Main Office Location' : 'Ubicación de Oficina Principal'}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-2 leading-relaxed">
                    Naples, FL 34102<br />
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