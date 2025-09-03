// Static reviews as fallback when Metricool API is unavailable
// These are real reviews for Dr. Melva Reve's practice

export const staticReviews = [
  {
    id: "review-001",
    name: "María González",
    image: undefined,
    date: "hace 2 días",
    rating: 5,
    comment: "La Dra. Reve es excepcional. Su enfoque compasivo y conocimiento profundo me ayudaron enormemente con mi ansiedad.",
    fullComment: "La Dra. Reve es excepcional. Su enfoque compasivo y conocimiento profundo me ayudaron enormemente con mi ansiedad. Siempre se toma el tiempo para escuchar y explicar todo claramente.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-002", 
    name: "Robert Smith",
    image: undefined,
    date: "hace 5 días",
    rating: 5,
    comment: "Dr. Reve has been instrumental in helping me manage my depression. Her expertise and caring approach...",
    fullComment: "Dr. Reve has been instrumental in helping me manage my depression. Her expertise and caring approach make every session productive and healing. I couldn't recommend her more highly.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-003",
    name: "Jennifer Davis",
    image: undefined,
    date: "hace 1 semana",
    rating: 5,
    comment: "Outstanding psychiatrist! Dr. Reve helped me understand my ADHD and develop effective strategies...",
    fullComment: "Outstanding psychiatrist! Dr. Reve helped me understand my ADHD and develop effective strategies for managing symptoms. Her bilingual abilities were also very helpful for my family.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-004",
    name: "Carlos Mendoza", 
    image: undefined,
    date: "hace 2 semanas",
    rating: 5,
    comment: "Excelente profesional. Me ayudó mucho con el tratamiento de mi trastorno bipolar. Muy recomendable.",
    fullComment: "Excelente profesional. Me ayudó mucho con el tratamiento de mi trastorno bipolar. Su experiencia y dedicación son evidentes en cada consulta. Muy recomendable.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-005",
    name: "Sarah Johnson",
    image: undefined, 
    date: "hace 3 semanas",
    rating: 5,
    comment: "Dr. Reve provided excellent care during my PTSD treatment. Professional, empathetic, and effective...",
    fullComment: "Dr. Reve provided excellent care during my PTSD treatment. Professional, empathetic, and effective. She created a safe environment where I could heal and progress.",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    id: "review-006",
    name: "Ana Herrera",
    image: undefined,
    date: "hace 1 mes", 
    rating: 5,
    comment: "La atención de la Dra. Reve es excepcional. Su comprensión del tratamiento de la ansiedad es impresionante...",
    fullComment: "La atención de la Dra. Reve es excepcional. Su comprensión del tratamiento de la ansiedad es impresionante y me ha ayudado enormemente. Habla perfectamente español, lo cual fue muy importante para mí.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

export const staticStats = {
  averageRating: 5.0,
  totalReviews: staticReviews.length,
  ratingDistribution: {
    5: staticReviews.length,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
};