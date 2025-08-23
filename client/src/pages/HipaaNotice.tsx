import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { updateSEO } from '@/utils/seo';

const HipaaNotice = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const seoData = {
      title: language === 'en' 
        ? 'HIPAA Notice of Privacy Practices - Healing Minds Psychiatry | Dr. Melva Reve'
        : 'Aviso de Prácticas de Privacidad HIPAA - Healing Minds Psychiatry | Dra. Melva Reve',
      description: language === 'en'
        ? 'HIPAA Notice of Privacy Practices for Healing Minds Psychiatry patients. Learn how your protected health information is used and protected under federal law.'
        : 'Aviso de Prácticas de Privacidad HIPAA para pacientes de Healing Minds Psychiatry. Conozca cómo su información de salud protegida es usada y protegida bajo la ley federal.',
      keywords: language === 'en'
        ? 'HIPAA notice, privacy practices, protected health information, patient rights, medical privacy, psychiatric privacy'
        : 'aviso HIPAA, prácticas privacidad, información salud protegida, derechos paciente, privacidad médica, privacidad psiquiátrica',
      lang: language,
      canonical: language === 'en' ? '/hipaa-notice' : '/es/aviso-hipaa'
    };
    updateSEO(seoData);
  }, [language]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-center mb-12 text-gray-900 dark:text-white">
            {language === 'en' ? 'HIPAA Notice of Privacy Practices' : 'Aviso de Prácticas de Privacidad HIPAA'}
          </h1>
          <div className="prose prose-lg max-w-none dark:prose-invert" data-testid="hipaa-notice-content">
            {language === 'en' ? (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg mb-6">
                    <p className="text-blue-800 dark:text-blue-300 font-semibold text-lg">
                      Healing Minds Psychiatry<br />
                      4760 Tamiami Tr N, Unit 25<br />
                      Naples, FL - 34103-3025
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">
                    Effective Date: [TO BE PROVIDED]
                  </p>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    HIPAA (Health Insurance Portability and Accountability Act) of 1996 mandates data privacy and security for safeguarding patient's medical information.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Please review this notice carefully. It describes how medical information about you may be used and disclosed and how to get access to this information.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">USES AND DISCLOSURES OF PROTECTED HEALTH INFORMATION</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    The providers of this clinic keep a record of the healthcare services we provide. You may ask to see and copy that record (copy charges may apply, per New York State law).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your protected health information may be used and disclosed by your physician, our office staff and others outside of our office that are involved in your care and treatment for the purpose of providing health care services to you, to pay your healthcare bills, to support the operation of the physician's practice, and other uses required by law.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">TREATMENT:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We will use and disclose your protected health information to provide, coordinate, or manage your health care and any related services. This includes the coordination or management of your health care with a third party. For example, we would disclose your protected health information, as necessary, to a home health agency that provides care to you. As another example, your protected health information may be provided to a physician to whom you have been referred to ensure that the physician has the necessary information to diagnose or treat you.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">PAYMENT:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your protected health information will be used, as needed, to obtain payment for your health care services. For example, obtaining approval for a hospital stay may require that your relevant protected health information be disclosed to the health plan to obtain approval for the hospital admission.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">HEALTHCARE OPERATIONS:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may use or disclose, as needed, your protected health information in order to support the business activities of your physician's practice. These activities include, but are not limited to, quality assessment activities, employee review activities, training of medical students, licensing, and conducting or arranging for other business activities. For example, we may disclose your protected health information to medical school students that see patients at our office. We may also call you by name in the waiting room when your physician is ready to see you. We may use or disclose your protected health information, as needed, to contact you to remind you of your appointment.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">USE REQUIRED BY LAW:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may use or disclose your protected health information in the following situations without your authorization. These situations include: as Required By Law, Public Health Issues as required by law, Communicable Diseases: Health Oversight; Abuse or Neglect; Food and Drug Administration requirements; Legal Proceedings; Law Enforcement; Coroners; Funeral Directors; and Organ Donation; Research; Criminal Activity; Military Activity and National Security; Worker's Compensation; Inmates. Under the law, we must make disclosures to you and when, required by the Secretary of the Department of Health and Human Services.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">YOUR RIGHTS</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    The following is a statement of your rights with respect to your protected health information.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">Right to Inspect and Copy</h4>
                    <p className="text-green-800 dark:text-green-300">
                      You have the right to inspect and copy your protected health information. Under federal law, however, you may not inspect or copy the following records; psychotherapy notes; information compiled in reasonable anticipation of, or use in, a civil, criminal or administrative action or proceeding, and protected health information that is subject to law that prohibits access to protected health information.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Right to Request Restrictions</h4>
                    <p className="text-blue-800 dark:text-blue-300">
                      You have the right to request a restriction of your protected health information. This means you may ask us not to use or disclose any part of your protected health information for the purposes of treatment, payment or healthcare operations. You may also request that any part of your protected health information not be disclosed to family members or friends who may be involved in your care or for notification purposes as described in this Notice of Privacy Practices. Your request must state the specific restriction requested and to whom you want the restriction to apply. Your physician is not required to agree to a restriction that you may request. If the physician believes it is in your best interest to permit use and disclosure of your protected health information, your protected health information will not be restricted. You then have the right to use another Healthcare Professional.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Right to Confidential Communications</h4>
                    <p className="text-purple-800 dark:text-purple-300">
                      You have the right to request to receive confidential communications from us by alternative means or at an alternative location.
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">Right to Accounting of Disclosures</h4>
                    <p className="text-orange-800 dark:text-orange-300">
                      You have a right to receive an accounting of certain disclosures we have made, if any, of your protected health information. We reserve the right to change the terms of this notice and will inform you by mail of any changes. You then have the right to object or withdraw as provided in this notice.
                    </p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">Right to Request Amendment</h4>
                    <p className="text-indigo-800 dark:text-indigo-300">
                      You may have the right to have your physician amend your protected health information. If we deny your request for amendment, you have the right to file a statement of disagreement with us and we may prepare a rebuttal to your statement and will provide you with a copy of any such rebuttal.
                    </p>
                  </div>

                  <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-3">Right to a Paper Copy</h4>
                    <p className="text-pink-800 dark:text-pink-300">
                      You have the right to obtain a paper copy of this notice from us, upon request, even if you have agreed to accept this notice electronically.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">COMPLAINTS</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    You may complain to us or the Secretary of Health and Human Services if you believe your privacy rights have been violated by us. You may file a complaint with us by notifying our office of your complaint. We will not retaliate against you for filing a complaint.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-3">LEGAL REQUIREMENTS</h3>
                  <p className="text-red-800 dark:text-red-300">
                    We are required by law to maintain the privacy of and provide individuals with this notice of our legal duties and privacy practices with respect to protected health information. If you have any objections to this form, please ask to speak with our HIPAA Compliance Officer in person or by phone at our main phone number.
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">PATIENT SIGNATURE</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                    [This section would be completed during patient intake at the practice]
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg mb-6">
                    <p className="text-blue-800 dark:text-blue-300 font-semibold text-lg">
                      Healing Minds Psychiatry<br />
                      4760 Tamiami Tr N, Unit 25<br />
                      Naples, FL - 34103-3025
                    </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">
                    Fecha de Vigencia: [A SER PROPORCIONADA]
                  </p>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    HIPAA (Ley de Portabilidad y Responsabilidad del Seguro de Salud) de 1996 exige la privacidad y seguridad de los datos para salvaguardar la información médica del paciente.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Por favor, revise este aviso cuidadosamente. Describe cómo se puede usar y divulgar la información médica sobre usted y cómo obtener acceso a esta información.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">USOS Y DIVULGACIONES DE INFORMACIÓN DE SALUD PROTEGIDA</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Los proveedores de esta clínica mantienen un registro de los servicios de atención médica que proporcionamos. Puede pedir ver y copiar ese registro (pueden aplicar cargos por copia, según la ley del estado de Nueva York).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Su información de salud protegida puede ser utilizada y divulgada por su médico, nuestro personal de oficina y otros fuera de nuestra oficina que estén involucrados en su atención y tratamiento con el propósito de brindarle servicios de atención médica, pagar sus facturas de atención médica, apoyar la operación de la práctica del médico y otros usos requeridos por ley.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">TRATAMIENTO:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Utilizaremos y divulgaremos su información de salud protegida para proporcionar, coordinar o administrar su atención médica y cualquier servicio relacionado. Esto incluye la coordinación o administración de su atención médica con un tercero. Por ejemplo, divulgaríamos su información de salud protegida, según sea necesario, a una agencia de atención domiciliaria que le brinde atención. Como otro ejemplo, su información de salud protegida puede proporcionarse a un médico al que ha sido referido para asegurar que el médico tenga la información necesaria para diagnosticarlo o tratarlo.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">PAGO:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Su información de salud protegida se utilizará, según sea necesario, para obtener el pago de sus servicios de atención médica. Por ejemplo, obtener aprobación para una estadía en el hospital puede requerir que su información de salud protegida relevante sea divulgada al plan de salud para obtener aprobación para la admisión hospitalaria.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">OPERACIONES DE ATENCIÓN MÉDICA:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Podemos usar o divulgar, según sea necesario, su información de salud protegida para apoyar las actividades comerciales de la práctica de su médico. Estas actividades incluyen, pero no se limitan a, actividades de evaluación de calidad, actividades de revisión de empleados, capacitación de estudiantes de medicina, licencias y realizar u organizar otras actividades comerciales. Por ejemplo, podemos divulgar su información de salud protegida a estudiantes de medicina que ven pacientes en nuestra oficina. También podemos llamarlo por su nombre en la sala de espera cuando su médico esté listo para verlo. Podemos usar o divulgar su información de salud protegida, según sea necesario, para contactarlo para recordarle su cita.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">USO REQUERIDO POR LEY:</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Podemos usar o divulgar su información de salud protegida en las siguientes situaciones sin su autorización. Estas situaciones incluyen: según lo Requerido por Ley, Problemas de Salud Pública según lo requerido por ley, Enfermedades Transmisibles: Supervisión de Salud; Abuso o Negligencia; requisitos de la Administración de Alimentos y Medicamentos; Procedimientos Legales; Aplicación de la Ley; Forenses; Directores de Funerarias; y Donación de Órganos; Investigación; Actividad Criminal; Actividad Militar y Seguridad Nacional; Compensación de Trabajadores; Reclusos. Bajo la ley, debemos hacer divulgaciones a usted y cuando sea requerido por el Secretario del Departamento de Salud y Servicios Humanos.
                  </p>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">SUS DERECHOS</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Lo siguiente es una declaración de sus derechos con respecto a su información de salud protegida.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3">Derecho a Inspeccionar y Copiar</h4>
                    <p className="text-green-800 dark:text-green-300">
                      Tiene derecho a inspeccionar y copiar su información de salud protegida. Sin embargo, bajo la ley federal, no puede inspeccionar o copiar los siguientes registros: notas de psicoterapia; información compilada en anticipación razonable de, o uso en, una acción o procedimiento civil, criminal o administrativo, e información de salud protegida que esté sujeta a ley que prohíba el acceso a información de salud protegida.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Derecho a Solicitar Restricciones</h4>
                    <p className="text-blue-800 dark:text-blue-300">
                      Tiene derecho a solicitar una restricción de su información de salud protegida. Esto significa que puede pedirnos que no usemos o divulguemos ninguna parte de su información de salud protegida para los propósitos de tratamiento, pago u operaciones de atención médica. También puede solicitar que cualquier parte de su información de salud protegida no sea divulgada a familiares o amigos que puedan estar involucrados en su atención o para propósitos de notificación como se describe en este Aviso de Prácticas de Privacidad. Su solicitud debe establecer la restricción específica solicitada y a quién quiere que se aplique la restricción. Su médico no está obligado a aceptar una restricción que pueda solicitar. Si el médico cree que es en su mejor interés permitir el uso y divulgación de su información de salud protegida, su información de salud protegida no será restringida. Entonces tiene derecho a usar otro Profesional de la Salud.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">Derecho a Comunicaciones Confidenciales</h4>
                    <p className="text-purple-800 dark:text-purple-300">
                      Tiene derecho a solicitar recibir comunicaciones confidenciales de nosotros por medios alternativos o en una ubicación alternativa.
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">Derecho a Contabilidad de Divulgaciones</h4>
                    <p className="text-orange-800 dark:text-orange-300">
                      Tiene derecho a recibir una contabilidad de ciertas divulgaciones que hayamos hecho, si las hay, de su información de salud protegida. Nos reservamos el derecho de cambiar los términos de este aviso y le informaremos por correo de cualquier cambio. Entonces tiene derecho a objetar o retirarse según se proporciona en este aviso.
                    </p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">Derecho a Solicitar Enmienda</h4>
                    <p className="text-indigo-800 dark:text-indigo-300">
                      Puede tener derecho a que su médico enmiende su información de salud protegida. Si denegamos su solicitud de enmienda, tiene derecho a presentar una declaración de desacuerdo con nosotros y podemos preparar una refutación a su declaración y le proporcionaremos una copia de dicha refutación.
                    </p>
                  </div>

                  <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 p-6 rounded-lg">
                    <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-3">Derecho a una Copia Impresa</h4>
                    <p className="text-pink-800 dark:text-pink-300">
                      Tiene derecho a obtener una copia impresa de este aviso de nosotros, previa solicitud, incluso si ha aceptado recibir este aviso electrónicamente.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">QUEJAS</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Puede quejarse con nosotros o con el Secretario de Salud y Servicios Humanos si cree que sus derechos de privacidad han sido violados por nosotros. Puede presentar una queja con nosotros notificando a nuestra oficina de su queja. No tomaremos represalias contra usted por presentar una queja.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-3">REQUISITOS LEGALES</h3>
                  <p className="text-red-800 dark:text-red-300">
                    Estamos obligados por ley a mantener la privacidad y proporcionar a las personas este aviso de nuestros deberes legales y prácticas de privacidad con respecto a la información de salud protegida. Si tiene alguna objeción a este formulario, por favor solicite hablar con nuestro Oficial de Cumplimiento HIPAA en persona o por teléfono a nuestro número de teléfono principal.
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">FIRMA DEL PACIENTE</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                    [Esta sección se completaría durante la admisión del paciente en la práctica]
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HipaaNotice;