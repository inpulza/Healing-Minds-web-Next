export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: Record<"en" | "es", readonly HomeFaqItem[]> = {
  en: [
    {
      question: "What can I expect in my first session?",
      answer:
        "Your first session is a comprehensive evaluation where we'll discuss your current challenges, history, and goals. It's a collaborative process designed to create a personalized treatment plan that works for you. The office will confirm the appointment length when you schedule.",
    },
    {
      question: "What is the difference between a psychiatrist and a psychologist?",
      answer:
        "A psychiatrist is a medical doctor who is authorized to order and manage medications for mental health conditions. A psychologist focuses on therapy and counseling but is not authorized to order medications. As a psychiatrist, Dr. Reve can provide both therapy and medication management.",
    },
    {
      question: "Is my information kept confidential?",
      answer:
        "Health information is handled under applicable medical privacy laws and the practice privacy notice. Disclosure may occur with authorization or when otherwise permitted or required by law.",
    },
    {
      question: "How do I know if I need medication?",
      answer:
        "Medication decisions are always made collaboratively between you and Dr. Reve. We'll discuss your symptoms, treatment history, and preferences. Many conditions can be treated with therapy alone, while others may benefit from a combination of therapy and medication.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "Participation and benefits vary by plan and service. Before booking, confirm current participation with our office and verify your specific mental-health, telehealth and cost-sharing benefits directly with your insurer. Self-pay or financial options may be evaluated case by case.",
    },
    {
      question: "How often will I need to come in for appointments?",
      answer:
        "Appointment frequency depends on your individual needs and treatment plan. Initially, appointments may be weekly or bi-weekly. As you progress, the frequency may decrease. We'll work together to find a schedule that supports your mental health goals.",
    },
  ],
  es: [
    {
      question: "¿Qué puedo esperar en mi primera sesión?",
      answer:
        "Su primera sesión es una evaluación integral donde discutiremos sus desafíos actuales, historial y objetivos. Es un proceso colaborativo diseñado para crear un plan de tratamiento personalizado que funcione para usted. La oficina confirmará la duración de la cita cuando la programe.",
    },
    {
      question: "¿Cuál es la diferencia entre un psiquiatra y un psicólogo?",
      answer:
        "Un psiquiatra es un médico autorizado para ordenar y manejar medicamentos para condiciones de salud mental. Un psicólogo se enfoca en terapia y consejería pero no está autorizado para ordenar medicamentos. Como psiquiatra, la Dra. Reve puede proporcionar tanto terapia como manejo de medicamentos.",
    },
    {
      question: "¿Se mantiene confidencial mi información?",
      answer:
        "La información de salud se maneja conforme a las leyes aplicables de privacidad médica y al aviso de privacidad de la práctica. Puede divulgarse con autorización o cuando la ley lo permita o exija.",
    },
    {
      question: "¿Cómo sé si necesito medicación?",
      answer:
        "Las decisiones sobre medicación siempre se toman en colaboración entre usted y la Dra. Reve. Discutiremos sus síntomas, historial de tratamiento y preferencias. Muchas condiciones pueden tratarse solo con terapia, mientras que otras pueden beneficiarse de una combinación de terapia y medicación.",
    },
    {
      question: "¿Aceptan seguro médico?",
      answer:
        "La participación y los beneficios varían según el plan y el servicio. Antes de reservar, confirme la participación vigente con nuestra oficina y verifique directamente con su aseguradora sus beneficios de salud mental, telesalud y costos compartidos. Las opciones de pago privado o ayuda financiera pueden evaluarse caso por caso.",
    },
    {
      question: "¿Con qué frecuencia necesitaré venir a las citas?",
      answer:
        "La frecuencia de las citas depende de sus necesidades individuales y plan de tratamiento. Inicialmente, las citas pueden ser semanales o quincenales. A medida que progrese, la frecuencia puede disminuir. Trabajaremos juntos para encontrar un horario que apoye sus objetivos de salud mental.",
    },
  ],
};
