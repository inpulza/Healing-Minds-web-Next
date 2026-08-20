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
        "Yes, absolutely. All information shared in our sessions is strictly confidential and protected by HIPAA laws. Information is only shared with your written consent or in rare cases required by law for safety reasons.",
    },
    {
      question: "How do I know if I need medication?",
      answer:
        "Medication decisions are always made collaboratively between you and Dr. Reve. We'll discuss your symptoms, treatment history, and preferences. Many conditions can be treated with therapy alone, while others may benefit from a combination of therapy and medication.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "We accept most major insurance plans. Our staff will verify your benefits and explain your coverage before your first appointment. We also offer flexible payment options for those without insurance coverage.",
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
        "Sí, absolutamente. Toda la información compartida en nuestras sesiones es estrictamente confidencial y está protegida por las leyes HIPAA. La información solo se comparte con su consentimiento por escrito o en casos raros requeridos por ley por razones de seguridad.",
    },
    {
      question: "¿Cómo sé si necesito medicación?",
      answer:
        "Las decisiones sobre medicación siempre se toman en colaboración entre usted y la Dra. Reve. Discutiremos sus síntomas, historial de tratamiento y preferencias. Muchas condiciones pueden tratarse solo con terapia, mientras que otras pueden beneficiarse de una combinación de terapia y medicación.",
    },
    {
      question: "¿Aceptan seguro médico?",
      answer:
        "Aceptamos la mayoría de los planes de seguro principales. Nuestro personal verificará sus beneficios y explicará su cobertura antes de su primera cita. También ofrecemos opciones de pago flexibles para aquellos sin cobertura de seguro.",
    },
    {
      question: "¿Con qué frecuencia necesitaré venir a las citas?",
      answer:
        "La frecuencia de las citas depende de sus necesidades individuales y plan de tratamiento. Inicialmente, las citas pueden ser semanales o quincenales. A medida que progrese, la frecuencia puede disminuir. Trabajaremos juntos para encontrar un horario que apoye sus objetivos de salud mental.",
    },
  ],
};
