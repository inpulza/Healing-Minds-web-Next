import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ForPatientsSection from '@/components/ForPatients';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  ChevronDown,
  FileText,
  Phone,
  ArrowRight,
  ClipboardList,
  Calendar,
  Shield,
  Info
} from 'lucide-react';

const ParaPacientesEspanol = () => {
  const { setLanguage } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setLanguage('es');

    const seoData = {
      title: 'Recursos para Pacientes — Primera Visita, Seguro y FAQ | Healing Minds Naples',
      description: 'Todo lo que los pacientes nuevos y existentes necesitan saber antes de su cita en Healing Minds en Naples, FL. Lista de verificación para la primera visita, verificación de seguro, instrucciones de telesalud y preguntas frecuentes.',
      keywords: 'psiquiatra nuevo paciente Naples, primera visita psiquiatría Naples, seguro salud mental Naples, telesalud psiquiatría Florida, recursos pacientes Healing Minds',
      lang: 'es',
      canonical: '/es/para-pacientes'
    };
    updateSEO(seoData);
  }, [setLanguage]);

  const firstVisitChecklist = [
    'Identificación con foto (licencia de conducir o pasaporte)',
    'Tarjeta(s) de seguro — frente y reverso',
    'Lista de medicamentos actuales (nombre, dosis, frecuencia)',
    'Nombres de psiquiatras o terapeutas anteriores',
    'Resumen del historial médico (diagnósticos relevantes, hospitalizaciones)',
    'Lista de preocupaciones y síntomas actuales que desea discutir',
    'Información de contacto de emergencia',
    'Método de pago para copago o saldo de pago personal'
  ];

  const telehealthSteps = [
    { title: 'Reserve un horario de telesalud', desc: 'Seleccione "telesalud" al reservar en línea o menciónelo al llamar al (239) 423-0272.' },
    { title: 'Reciba su enlace', desc: 'Un enlace de video seguro será enviado por correo electrónico 24 horas antes de su cita. Revise su carpeta de spam.' },
    { title: 'Pruebe su configuración', desc: 'Use un dispositivo con cámara y micrófono funcionando. Un espacio tranquilo y privado es lo mejor. Se recomiendan los navegadores Chrome o Safari.' },
    { title: 'Únase a tiempo', desc: 'Haga clic en el enlace 5 minutos antes. Puede ser colocado en una sala de espera virtual hasta que la Dra. Reve esté lista.' },
    { title: 'Después de su visita', desc: 'Las recetas se envían electrónicamente a su farmacia. Las instrucciones de seguimiento se proporcionarán por mensaje seguro.' }
  ];

  const faqs = [
    {
      q: '¿Cómo me preparo para mi primera cita psiquiátrica?',
      a: 'Traiga su tarjeta de seguro, identificación con foto, una lista de medicamentos actuales y un resumen de los síntomas o preocupaciones que desea discutir. Llegar 5–10 minutos antes ayuda con los trámites de ingreso. Para telesalud, pruebe su cámara y micrófono el día anterior.'
    },
    {
      q: '¿Cuánto tiempo esperaré para ser atendido como nuevo paciente?',
      a: 'Las citas para nuevos pacientes generalmente están disponibles dentro de 1–2 semanas después de programar. Los horarios de telesalud suelen tener mayor flexibilidad. Llame al (239) 423-0272 o reserve en línea para verificar la disponibilidad actual.'
    },
    {
      q: '¿Puedo transferir mi atención desde otro psiquiatra?',
      a: 'Sí. Damos la bienvenida a pacientes que se transfieren de otro proveedor. Traiga sus registros anteriores, una lista de medicamentos actuales y cualquier historial diagnóstico relevante a su primera cita. También podemos solicitar registros en su nombre con una autorización firmada.'
    },
    {
      q: '¿Qué sucede si necesito cancelar o reprogramar?',
      a: 'Por favor proporcione al menos 24 horas hábiles de aviso para evitar un cargo de $50 por cancelación tardía o ausencia. Entendemos que ocurren emergencias — las emergencias médicas genuinas siempre están exceptuadas.'
    },
    {
      q: '¿Me recetarán medicamentos en mi primera visita?',
      a: 'No necesariamente. La primera cita es una evaluación. La Dra. Reve discutirá todas las opciones de tratamiento — que pueden o no incluir medicamentos — y colaborará con usted en el mejor enfoque para su situación específica.'
    },
    {
      q: '¿Mi información se mantiene privada y confidencial?',
      a: 'Absolutamente. Toda la información del paciente está protegida bajo HIPAA y los estatutos mejorados de privacidad de salud mental de Florida. Sus registros nunca se comparten sin su consentimiento escrito, excepto en circunstancias legales específicamente definidas.'
    },
    {
      q: '¿Puedo traer un familiar o persona de apoyo a mi cita?',
      a: 'Sí, con su consentimiento. Un familiar o persona de apoyo puede estar presente durante parte o toda su cita. Por favor informe a la recepción con anticipación, especialmente para visitas de telesalud.'
    },
    {
      q: '¿Qué hago si tengo una pregunta entre citas?',
      a: 'Las preguntas no urgentes se pueden enviar a través del portal de pacientes seguro. Para preocupaciones sobre medicamentos que no pueden esperar, llame a la oficina al (239) 423-0272. En una emergencia psiquiátrica, llame al 911 o al 988.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">

        {/* Page Hero */}
        <section className="py-14 sm:py-20 bg-gradient-to-br from-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-green-700 font-semibold text-sm uppercase tracking-widest mb-3">
                Recursos para Pacientes · Naples, FL
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-900 mb-6 leading-tight">
                Para <span className="font-display italic text-green-700">Pacientes</span> — Todo lo que Necesita Saber
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
                Desde su primera cita hasta la atención continua — encuentre todo lo que necesita como paciente nuevo o existente en Healing Minds Psychiatry en Naples, FL.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/es/contacto">
                  <Button className="bg-green-800 text-white hover:bg-green-700 rounded-full px-7 py-3 font-semibold">
                    Reservar Cita
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+12394230272">
                  <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50 rounded-full px-7 py-3 font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    (239) 423-0272
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Shared ForPatients component */}
        <ForPatientsSection />

        {/* First-Visit Checklist */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-body font-bold text-green-900">
                    Lista para la <span className="font-display italic text-green-700">Primera Visita</span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Traiga estos elementos a su cita inicial para que su visita sea lo más fluida y productiva posible.
                </p>
                <ul className="space-y-3">
                  {firstVisitChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-body font-bold text-green-900">
                    Instrucciones de <span className="font-display italic text-green-700">Telesalud</span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Las visitas por video seguro están disponibles en toda Florida. Así es como prepararse para su cita en línea.
                </p>
                <div className="space-y-4">
                  {telehealthSteps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 text-sm mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Verification Process */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-body font-bold text-green-900">
                  Proceso de <span className="font-display italic text-green-700">Verificación</span> de Seguro
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Verificamos sus beneficios de seguro antes de su primera visita para que sepa exactamente qué esperar.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Reserve su Cita', desc: 'Programe en línea o llame. Proporcione su ID de seguro y número de grupo al reservar.' },
                { step: '2', title: 'Contactamos a su Asegurador', desc: 'Nuestro equipo llama a su compañía de seguros para verificar cobertura, deducibles y montos de copago para servicios de salud mental.' },
                { step: '3', title: 'Usted Recibe un Resumen', desc: 'Antes de su visita, compartimos lo que cubrirá su seguro y su responsabilidad estimada de gastos de bolsillo.' },
                { step: '4', title: 'Sin Sorpresas de Facturación', desc: 'Llegue sabiendo sus costos. Si es pago personal, se proporciona un Estimado de Buena Fe según los requisitos federales.' }
              ].map((item) => (
                <Card key={item.step} className="p-6 border-green-100 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/es/politica-facturacion">
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Política de Facturación
                </Button>
              </Link>
              <Link href="/es/politica-cancelacion">
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Política de Cancelación
                </Button>
              </Link>
              <Link href="/es/derechos-paciente">
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Derechos del Paciente
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-body font-bold text-green-900">
                  Preguntas <span className="font-display italic text-green-700">Frecuentes</span>
                </h2>
              </div>
              <p className="text-gray-600">
                Respuestas a las preguntas más comunes de pacientes nuevos y existentes.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-green-100 overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-green-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-semibold text-green-900 text-base leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-green-700 flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-700 text-sm leading-relaxed border-t border-green-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-body font-bold mb-4">
              ¿Listo para <span className="font-display italic text-green-200">Comenzar?</span>
            </h2>
            <p className="text-green-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Citas para nuevos pacientes generalmente disponibles en 1–2 semanas. En persona en Naples o telesalud en toda Florida. La Dra. Reve está aceptando nuevos pacientes ahora.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/es/contacto">
                <Button className="bg-white text-green-800 hover:bg-green-50 rounded-full px-8 py-3 font-semibold">
                  Reservar su Cita
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/es/servicios">
                <Button variant="outline" className="border-white text-white hover:bg-green-700 rounded-full px-8 py-3 font-semibold">
                  Explorar Nuestros Servicios
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ParaPacientesEspanol;
