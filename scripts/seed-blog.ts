import { and, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import {
  blogAuthors,
  blogCategories,
  blogPosts,
  blogPostTags,
  blogTags,
  type BlogAuthor,
  type BlogCategory,
  type BlogPost,
  type BlogTag,
} from "../shared/schema";

const TRANSLATION_GROUP_ID = "4a6829e5-68cc-4b2a-9c51-19616ec41f8b";
const PUBLISHED_AT = new Date("2026-06-23T12:00:00.000Z");

async function getOrCreateAuthor(): Promise<BlogAuthor> {
  const [existing] = await db
    .select()
    .from(blogAuthors)
    .where(eq(blogAuthors.name, "Dr. Melva Reve Urgelles"))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(blogAuthors)
    .values({
      name: "Dr. Melva Reve Urgelles",
      title: "Psychiatrist",
      bio: "Dr. Melva Reve provides bilingual psychiatric care in Naples, Florida, with clinical focus on anxiety, depression, ADHD, PTSD, medication management, and telepsychiatry.",
      imageUrl: "/doctor-profile-v2.webp",
    })
    .returning();

  return created;
}

async function getOrCreateCategory(language: "en" | "es"): Promise<BlogCategory> {
  const category = language === "es"
    ? {
        name: "Ansiedad",
        slug: "ansiedad",
        description: "Educacion sobre ansiedad, atencion psiquiatrica y opciones de tratamiento.",
      }
    : {
        name: "Anxiety Treatment",
        slug: "anxiety-treatment",
        description: "Education about anxiety, psychiatric care, and treatment options.",
      };

  const [existing] = await db
    .select()
    .from(blogCategories)
    .where(and(eq(blogCategories.language, language), eq(blogCategories.slug, category.slug)))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(blogCategories)
    .values({
      ...category,
      language,
    })
    .returning();

  return created;
}

async function getOrCreateTag(name: string, slug: string, language: "en" | "es"): Promise<BlogTag> {
  const [existing] = await db
    .select()
    .from(blogTags)
    .where(and(eq(blogTags.language, language), eq(blogTags.slug, slug)))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(blogTags)
    .values({ name, slug, language })
    .returning();

  return created;
}

async function upsertPost(values: typeof blogPosts.$inferInsert): Promise<BlogPost> {
  const [existing] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.language, values.language || "en"), eq(blogPosts.slug, values.slug)))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(blogPosts)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db.insert(blogPosts).values(values).returning();
  return created;
}

async function attachTags(postId: number, tagIds: number[]): Promise<void> {
  if (tagIds.length === 0) return;

  await db
    .insert(blogPostTags)
    .values(tagIds.map(tagId => ({ postId, tagId })))
    .onConflictDoNothing();
}

async function seed(): Promise<void> {
  const author = await getOrCreateAuthor();
  const enCategory = await getOrCreateCategory("en");
  const esCategory = await getOrCreateCategory("es");

  const enTags = await Promise.all([
    getOrCreateTag("Anxiety", "anxiety", "en"),
    getOrCreateTag("Medication Management", "medication-management", "en"),
    getOrCreateTag("Naples Psychiatry", "naples-psychiatry", "en"),
  ]);

  const esTags = await Promise.all([
    getOrCreateTag("Ansiedad", "ansiedad", "es"),
    getOrCreateTag("Manejo de Medicamentos", "manejo-medicamentos", "es"),
    getOrCreateTag("Psiquiatria Naples", "psiquiatria-naples", "es"),
  ]);

  const enPost = await upsertPost({
    title: "Understanding Anxiety Treatment in Naples: What Patients Can Expect",
    slug: "understanding-anxiety-treatment-naples",
    language: "en",
    translationGroupId: TRANSLATION_GROUP_ID,
    excerpt: "A practical overview of how psychiatric anxiety treatment works, when medication management may help, and what patients in Naples can expect from care.",
    content: `<p>Anxiety treatment starts with a careful clinical conversation, not a rushed label. At Healing Minds Psychiatry, the first goal is to understand what the patient is experiencing day to day: sleep, appetite, concentration, panic symptoms, avoidance, medical history, current medications, and the situations that make symptoms worse.</p>
<h2>Why evaluation matters</h2>
<p>Many patients arrive after trying to manage anxiety alone for months or years. A psychiatric evaluation helps separate generalized anxiety, panic symptoms, trauma responses, depression, ADHD overlap, sleep disruption, and medical factors that can imitate anxiety. That distinction matters because treatment should match the real pattern, not just the loudest symptom.</p>
<h2>Medication management is individualized</h2>
<p>Medication is not the right answer for every person, but it can be helpful when anxiety is interfering with work, relationships, sleep, or daily function. Dr. Melva Reve reviews benefits, risks, timing, side effects, and follow-up expectations so patients understand the plan. The goal is steady improvement with thoughtful monitoring, not automatic medication changes.</p>
<h2>Care can continue by telepsychiatry</h2>
<p>For patients across Florida, telepsychiatry can make follow-up more consistent after the initial treatment plan is established. Consistency is important because anxiety treatment often improves through measured adjustments, patient feedback, and coordination with therapy or primary care when appropriate.</p>
<p>This article is educational and is not a substitute for emergency care or individualized medical advice. If you are in immediate danger or thinking about harming yourself, call 911 or go to the nearest emergency room.</p>`,
    featuredImage: "/doctor-consultation.webp",
    featuredImageAlt: "Psychiatric consultation at Healing Minds Psychiatry in Naples",
    authorId: author.id,
    categoryId: enCategory.id,
    status: "published",
    isFeatured: true,
    metaTitle: "Anxiety Treatment in Naples | Healing Minds Psychiatry",
    metaDescription: "Learn what to expect from anxiety treatment in Naples, including evaluation, medication management, follow-up care, and telepsychiatry.",
    readingTime: 4,
    publishedAt: PUBLISHED_AT,
  });

  const esPost = await upsertPost({
    title: "Tratamiento de Ansiedad en Naples: Que Pueden Esperar los Pacientes",
    slug: "tratamiento-ansiedad-naples",
    language: "es",
    translationGroupId: TRANSLATION_GROUP_ID,
    excerpt: "Una guia practica sobre como funciona el tratamiento psiquiatrico de la ansiedad, cuando el manejo de medicamentos puede ayudar y que esperar en consulta.",
    content: `<p>El tratamiento de la ansiedad empieza con una conversacion clinica cuidadosa, no con una etiqueta rapida. En Healing Minds Psychiatry, el primer objetivo es entender que esta viviendo el paciente en su dia a dia: sueno, apetito, concentracion, sintomas de panico, evitacion, historial medico, medicamentos actuales y situaciones que empeoran los sintomas.</p>
<h2>Por que importa la evaluacion</h2>
<p>Muchos pacientes llegan despues de intentar manejar la ansiedad solos durante meses o anos. Una evaluacion psiquiatrica ayuda a diferenciar ansiedad generalizada, sintomas de panico, respuestas al trauma, depresion, posible solapamiento con ADHD, problemas de sueno y factores medicos que pueden parecer ansiedad. Esa diferencia importa porque el tratamiento debe responder al patron real, no solo al sintoma mas fuerte.</p>
<h2>El manejo de medicamentos es individual</h2>
<p>La medicacion no es la respuesta correcta para todas las personas, pero puede ayudar cuando la ansiedad afecta el trabajo, las relaciones, el sueno o la funcion diaria. La Dra. Melva Reve revisa beneficios, riesgos, tiempos, efectos secundarios y expectativas de seguimiento para que el paciente entienda el plan. La meta es una mejoria estable con monitoreo cuidadoso, no cambios automaticos.</p>
<h2>El cuidado puede continuar por telepsiquiatria</h2>
<p>Para pacientes en Florida, la telepsiquiatria puede hacer que el seguimiento sea mas constante despues de establecer el plan inicial. La consistencia es importante porque el tratamiento de ansiedad suele mejorar con ajustes medidos, retroalimentacion del paciente y coordinacion con terapia o cuidado primario cuando corresponde.</p>
<p>Este articulo es educativo y no sustituye la atencion de emergencia ni el consejo medico individual. Si esta en peligro inmediato o piensa hacerse dano, llame al 911 o vaya a la sala de emergencia mas cercana.</p>`,
    featuredImage: "/doctor-consultation.webp",
    featuredImageAlt: "Consulta psiquiatrica en Healing Minds Psychiatry en Naples",
    authorId: author.id,
    categoryId: esCategory.id,
    status: "published",
    isFeatured: true,
    metaTitle: "Tratamiento de Ansiedad en Naples | Healing Minds Psychiatry",
    metaDescription: "Aprenda que esperar del tratamiento de ansiedad en Naples, incluyendo evaluacion, manejo de medicamentos, seguimiento y telepsiquiatria.",
    readingTime: 4,
    publishedAt: PUBLISHED_AT,
  });

  await attachTags(enPost.id, enTags.map(tag => tag.id));
  await attachTags(esPost.id, esTags.map(tag => tag.id));

  console.log(`Seeded blog posts: ${enPost.slug}, ${esPost.slug}`);
}

seed()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
