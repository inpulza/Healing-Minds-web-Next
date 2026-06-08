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

const ForPatientsPage = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const seoData = {
      title: language === 'en'
        ? 'Patient Resources — First Visit, Insurance & FAQ | Healing Minds Naples'
        : 'Recursos para Pacientes — Primera Visita, Seguro y FAQ | Healing Minds Naples',
      description: language === 'en'
        ? 'Everything new and returning patients need to know before their appointment at Healing Minds in Naples, FL. First-visit checklist, insurance verification, telehealth instructions, and FAQs.'
        : 'Todo lo que los pacientes nuevos y existentes necesitan saber antes de su cita en Healing Minds en Naples, FL. Lista de verificación para la primera visita, verificación de seguro, instrucciones de telesalud y preguntas frecuentes.',
      keywords: language === 'en'
        ? 'psychiatrist new patient Naples, first visit psychiatry Naples, mental health insurance Naples, telehealth psychiatry Florida, patient resources Healing Minds'
        : 'psiquiatra nuevo paciente Naples, primera visita psiquiatría Naples, seguro salud mental Naples, telesalud psiquiatría Florida, recursos pacientes Healing Minds',
      lang: language,
      canonical: language === 'en' ? '/for-patients' : '/es/para-pacientes'
    };
    updateSEO(seoData);
  }, [language]);

  const firstVisitChecklist = language === 'en' ? [
    'Photo ID (driver\'s license or passport)',
    'Insurance card(s) — front and back',
    'List of current medications (name, dose, frequency)',
    'Names of any previous psychiatrists or therapists',
    'Medical history summary (relevant diagnoses, hospitalizations)',
    'List of current concerns and symptoms you\'d like to discuss',
    'Emergency contact information',
    'Payment method for copay or self-pay balance'
  ] : [
    'Identificación con foto (licencia de conducir o pasaporte)',
    'Tarjeta(s) de seguro — frente y reverso',
    'Lista de medicamentos actuales (nombre, dosis, frecuencia)',
    'Nombres de psiquiatras o terapeutas anteriores',
    'Resumen del historial médico (diagnósticos relevantes, hospitalizaciones)',
    'Lista de preocupaciones y síntomas actuales que desea discutir',
    'Información de contacto de emergencia',
    'Método de pago para copago o saldo de pago personal'
  ];

  const telehealthSteps = language === 'en' ? [
    { title: 'Book a telehealth slot', desc: 'Select "telehealth" when booking online or mention it when calling (239) 423-0272.' },
    { title: 'Receive your link', desc: 'A secure video link will be emailed to you 24 hours before your appointment. Check your spam folder.' },
    { title: 'Test your setup', desc: 'Use a device with a working camera and microphone. A quiet, private space works best. Chrome or Safari browsers recommended.' },
    { title: 'Join on time', desc: 'Click the link 5 minutes early. You may be placed in a virtual waiting room until Dr. Reve is ready.' },
    { title: 'After your visit', desc: 'Any prescriptions are sent electronically to your pharmacy. Follow-up instructions will be provided by secure message.' }
  ] : [
    { title: 'Reserve un horario de telesalud', desc: 'Seleccione "telesalud" al reservar en línea o menciónelo al llamar al (239) 423-0272.' },
    { title: 'Reciba su enlace', desc: 'Un enlace de video seguro será enviado por correo electrónico 24 horas antes de su cita. Revise su carpeta de spam.' },
    { title: 'Pruebe su configuración', desc: 'Use un dispositivo con cámara y micrófono funcionando. Un espacio tranquilo y privado es lo mejor. Se recomiendan los navegadores Chrome o Safari.' },
    { title: 'Únase a tiempo', desc: 'Haga clic en el enlace 5 minutos antes. Puede ser colocado en una sala de espera virtual hasta que la Dra. Reve esté lista.' },
    { title: 'Después de su visita', desc: 'Las recetas se envían electrónicamente a su farmacia. Las instrucciones de seguimiento se proporcionarán por mensaje seguro.' }
  ];

  const faqs = language === 'en' ? [
    {
      q: 'How do I prepare for my first psychiatric appointment?',
      a: 'Bring your insurance card, photo ID, a list of current medications, and a summary of the symptoms or concerns you want to discuss. Arriving 5–10 minutes early helps with intake paperwork. For telehealth, test your camera and microphone the day before.'
    },
    {
      q: 'How long will I wait before being seen as a new patient?',
      a: 'New patient appointments are typically available within 1–2 weeks of scheduling. Telehealth slots often have greater flexibility. Call (239) 423-0272 or book online to check current availability.'
    },
    {
      q: 'Can I transfer care from another psychiatrist?',
      a: 'Yes. We welcome patients transferring from another provider. Please bring your prior records, a list of current medications, and any relevant diagnostic history to your first appointment. We can also request records on your behalf with a signed release.'
    },
    {
      q: 'What happens if I need to cancel or reschedule?',
      a: 'Please provide at least 24 business hours\' notice to avoid a $50 late cancellation or no-show fee. We understand emergencies happen — genuine medical emergencies are always excepted. See our Cancellation Policy for full details.'
    },
    {
      q: 'Will I be prescribed medication at my first visit?',
      a: 'Not always. The first appointment is an evaluation. Dr. Reve will discuss all treatment options — which may or may not include medication — and will collaborate with you on the best approach for your specific situation.'
    },
    {
      q: 'Is my information kept private and confidential?',
      a: 'Absolutely. All patient information is protected under HIPAA and Florida\'s enhanced mental health privacy statutes. Your records are never shared without your written consent, except in specific legally defined circumstances such as imminent safety risks.'
    },
    {
      q: 'Can I bring a family member or support person to my appointment?',
      a: 'Yes, with your consent. A family member or support person may be present during part or all of your appointment. Please let the front desk know in advance, especially for telehealth visits where space logistics may differ.'
    },
    {
      q: 'What if I have a question between appointments?',
      a: 'Non-urgent questions can be sent through the secure patient portal. For medication concerns that cannot wait, please call the office at (239) 423-0272. In a psychiatric emergency, please call 911 or 988 (Suicide & Crisis Lifeline).'
    }
  ] : [
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
      a: 'Por favor proporcione al menos 24 horas hábiles de aviso para evitar un cargo de $50 por cancelación tardía o ausencia. Entendemos que ocurren emergencias — las emergencias médicas genuinas siempre están exceptuadas. Vea nuestra Política de Cancelación para más detalles.'
    },
    {
      q: '¿Me recetarán medicamentos en mi primera visita?',
      a: 'No necesariamente. La primera cita es una evaluación. La Dra. Reve discutirá todas las opciones de tratamiento — que pueden o no incluir medicamentos — y colaborará con usted en el mejor enfoque para su situación específica.'
    },
    {
      q: '¿Mi información se mantiene privada y confidencial?',
      a: 'Absolutamente. Toda la información del paciente está protegida bajo HIPAA y los estatutos mejorados de privacidad de salud mental de Florida. Sus registros nunca se comparten sin su consentimiento escrito, excepto en circunstancias legales específicamente definidas, como riesgos de seguridad inminentes.'
    },
    {
      q: '¿Puedo traer un familiar o persona de apoyo a mi cita?',
      a: 'Sí, con su consentimiento. Un familiar o persona de apoyo puede estar presente durante parte o toda su cita. Por favor informe a la recepción con anticipación, especialmente para visitas de telesalud donde la logística del espacio puede diferir.'
    },
    {
      q: '¿Qué hago si tengo una pregunta entre citas?',
      a: 'Las preguntas no urgentes se pueden enviar a través del portal de pacientes seguro. Para preocupaciones sobre medicamentos que no pueden esperar, llame a la oficina al (239) 423-0272. En una emergencia psiquiátrica, llame al 911 o al 988 (Línea de Crisis y Suicidio).'
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
                {language === 'en' ? 'Patient Resources · Naples, FL' : 'Recursos para Pacientes · Naples, FL'}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-900 mb-6 leading-tight">
                {language === 'en'
                  ? <>For <span className="font-display italic text-green-700">Patients</span> — Everything You Need to Know</>
                  : <>Para <span className="font-display italic text-green-700">Pacientes</span> — Todo lo que Necesita Saber</>
                }
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
                {language === 'en'
                  ? 'From your first appointment to ongoing care — find everything you need as a new or returning patient at Healing Minds Psychiatry in Naples, FL.'
                  : 'Desde su primera cita hasta la atención continua — encuentre todo lo que necesita como paciente nuevo o existente en Healing Minds Psychiatry en Naples, FL.'
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                  <Button className="bg-green-800 text-white hover:bg-green-700 rounded-full px-7 py-3 font-semibold">
                    {language === 'en' ? 'Book an Appointment' : 'Reservar Cita'}
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

        {/* Shared ForPatients component (insurance, what to expect, policy links) */}
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
                    {language === 'en'
                      ? <>First-Visit <span className="font-display italic text-green-700">Checklist</span></>
                      : <>Lista para la <span className="font-display italic text-green-700">Primera Visita</span></>
                    }
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  {language === 'en'
                    ? 'Bring these items to your initial appointment to make your visit as smooth and productive as possible.'
                    : 'Traiga estos elementos a su cita inicial para que su visita sea lo más fluida y productiva posible.'
                  }
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

              {/* Telehealth Instructions */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-body font-bold text-green-900">
                    {language === 'en'
                      ? <>Telehealth <span className="font-display italic text-green-700">Instructions</span></>
                      : <>Instrucciones de <span className="font-display italic text-green-700">Telesalud</span></>
                    }
                  </h2>
                </div>
                <p className="text-gray-700 mb-6">
                  {language === 'en'
                    ? 'Secure video visits are available throughout Florida. Here\'s how to prepare for your online appointment.'
                    : 'Las visitas por video seguro están disponibles en toda Florida. Así es como prepararse para su cita en línea.'
                  }
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
                  {language === 'en'
                    ? <>Insurance <span className="font-display italic text-green-700">Verification</span> Process</>
                    : <>Proceso de <span className="font-display italic text-green-700">Verificación</span> de Seguro</>
                  }
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                {language === 'en'
                  ? 'We verify your insurance benefits before your first visit so you know exactly what to expect.'
                  : 'Verificamos sus beneficios de seguro antes de su primera visita para que sepa exactamente qué esperar.'
                }
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(language === 'en' ? [
                { step: '1', title: 'Book Your Appointment', desc: 'Schedule online or call. Provide your insurance ID and group number when booking.' },
                { step: '2', title: 'We Contact Your Insurer', desc: 'Our team calls your insurance company to verify coverage, deductibles, and copay amounts for mental health services.' },
                { step: '3', title: 'You Receive a Summary', desc: 'Before your visit, we share what your insurance will cover and your estimated out-of-pocket responsibility.' },
                { step: '4', title: 'No Billing Surprises', desc: 'Arrive knowing your costs. If you\'re self-pay, a Good Faith Estimate is provided per federal requirements.' }
              ] : [
                { step: '1', title: 'Reserve su Cita', desc: 'Programe en línea o llame. Proporcione su ID de seguro y número de grupo al reservar.' },
                { step: '2', title: 'Contactamos a su Asegurador', desc: 'Nuestro equipo llama a su compañía de seguros para verificar cobertura, deducibles y montos de copago para servicios de salud mental.' },
                { step: '3', title: 'Usted Recibe un Resumen', desc: 'Antes de su visita, compartimos lo que cubrirá su seguro y su responsabilidad estimada de gastos de bolsillo.' },
                { step: '4', title: 'Sin Sorpresas de Facturación', desc: 'Llegue sabiendo sus costos. Si es pago personal, se proporciona un Estimado de Buena Fe según los requisitos federales.' }
              ]).map((item) => (
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
              <Link href={language === 'en' ? '/billing-policy' : '/es/politica-facturacion'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <FileText className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Billing Policy' : 'Política de Facturación'}
                </Button>
              </Link>
              <Link href={language === 'en' ? '/cancellation-policy' : '/es/politica-cancelacion'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Cancellation Policy' : 'Política de Cancelación'}
                </Button>
              </Link>
              <Link href={language === 'en' ? '/patient-rights' : '/es/derechos-paciente'}>
                <Button variant="outline" className="border-green-700 text-green-700 hover:bg-green-50 rounded-full">
                  <Shield className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Patient Rights' : 'Derechos del Paciente'}
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
                  {language === 'en'
                    ? <>Patient <span className="font-display italic text-green-700">FAQ</span></>
                    : <>Preguntas <span className="font-display italic text-green-700">Frecuentes</span></>
                  }
                </h2>
              </div>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Answers to the most common questions from new and returning patients.'
                  : 'Respuestas a las preguntas más comunes de pacientes nuevos y existentes.'
                }
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
              {language === 'en'
                ? <>Ready to <span className="font-display italic text-green-200">Get Started?</span></>
                : <>¿Listo para <span className="font-display italic text-green-200">Comenzar?</span></>
              }
            </h2>
            <p className="text-green-100 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              {language === 'en'
                ? 'New patient appointments typically available within 1–2 weeks. In-person in Naples or telehealth throughout Florida. Dr. Reve is accepting new patients now.'
                : 'Citas para nuevos pacientes generalmente disponibles en 1–2 semanas. En persona en Naples o telesalud en toda Florida. La Dra. Reve está aceptando nuevos pacientes ahora.'
              }
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={language === 'en' ? '/contact' : '/es/contacto'}>
                <Button className="bg-white text-green-800 hover:bg-green-50 rounded-full px-8 py-3 font-semibold">
                  {language === 'en' ? 'Book Your Appointment' : 'Reservar su Cita'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={language === 'en' ? '/services' : '/es/servicios'}>
                <Button variant="outline" className="border-white text-white hover:bg-green-700 rounded-full px-8 py-3 font-semibold">
                  {language === 'en' ? 'Explore Our Services' : 'Explorar Nuestros Servicios'}
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

export default ForPatientsPage;
