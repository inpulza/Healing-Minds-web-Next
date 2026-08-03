import { useEffect, useMemo, useState } from 'react';
import { assetUrl } from '@/lib/asset-url';
import { Link } from '@/lib/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { updateSEO } from '@/utils/seo';
import doctorConsultation from '@/assets/doctor-consultation.webp';

export type BlogLanguage = 'en' | 'es';

export type BlogPostListItem = {
  id: number;
  slug: string;
  language: BlogLanguage;
  title: string;
  excerpt: string | null;
  category: { name: string; slug: string } | null;
  readingTime: number | null;
  publishedAt: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  isFeatured: boolean;
};

type BlogListResponse = {
  success: boolean;
  data: BlogPostListItem[];
};

type BlogIndexProps = {
  language?: BlogLanguage;
  initialPosts?: BlogPostListItem[];
};

function getBlogPostPath(post: Pick<BlogPostListItem, 'slug' | 'language'>): string {
  return post.language === 'es' ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
}

function formatDate(date: string | null, language: BlogLanguage): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-US' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

const copy = {
  en: {
    title: 'Mental Health Blog',
    eyebrow: 'Healing Minds Psychiatry',
    description: 'Practical education about psychiatric care, anxiety, telepsychiatry, and treatment planning for patients in Naples and across Florida.',
    seoTitle: 'Mental Health Blog | Healing Minds Psychiatry',
    seoDescription: 'Educational articles from Healing Minds Psychiatry about anxiety, telepsychiatry, medication management, and psychiatric care in Naples and Florida.',
    empty: 'No articles are published yet.',
    error: 'The blog could not load right now. Please refresh the page or contact the office if the issue continues.',
    read: 'Read Article',
    allPosts: 'All Articles',
    featured: 'Featured',
    minuteLabel: 'min',
    fallbackCategory: 'Mental Health',
  },
  es: {
    title: 'Blog de Salud Mental',
    eyebrow: 'Healing Minds Psychiatry',
    description: 'Educacion practica sobre atencion psiquiatrica, ansiedad, telepsiquiatria y planes de tratamiento para pacientes en Naples y Florida.',
    seoTitle: 'Blog de Salud Mental | Healing Minds Psychiatry',
    seoDescription: 'Articulos educativos de Healing Minds Psychiatry sobre ansiedad, telepsiquiatria, manejo de medicamentos y atencion psiquiatrica en Naples y Florida.',
    empty: 'Todavia no hay articulos publicados.',
    error: 'El blog no pudo cargar ahora. Actualice la pagina o contacte la oficina si el problema continua.',
    read: 'Leer Articulo',
    allPosts: 'Todos los Articulos',
    featured: 'Destacado',
    minuteLabel: 'min',
    fallbackCategory: 'Salud Mental',
  },
};

const BlogIndex = ({ language = 'en', initialPosts }: BlogIndexProps) => {
  const { setLanguage } = useLanguage();
  const text = copy[language];
  const blogPath = language === 'es' ? '/es/blog' : '/blog';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<BlogListResponse>({
    queryKey: [`/api/blog/posts?language=${language}`],
    initialData: initialPosts === undefined
      ? undefined
      : { success: true, data: initialPosts },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setLanguage(language);
    updateSEO({
      title: text.seoTitle,
      description: text.seoDescription,
      lang: language,
      canonical: blogPath,
    });
  }, [blogPath, language, setLanguage, text.seoDescription, text.seoTitle]);

  const posts = data?.data ?? [];
  const categories = useMemo(() => {
    const map = new Map<string, { name: string; slug: string }>();
    posts.forEach(post => {
      if (post.category?.slug) {
        map.set(post.category.slug, post.category);
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, language === 'es' ? 'es-US' : 'en-US'),
    );
  }, [language, posts]);
  const visiblePosts = selectedCategory
    ? posts.filter(post => post.category?.slug === selectedCategory)
    : posts;
  const featuredPost = visiblePosts.find(post => post.isFeatured) || visiblePosts[0];
  const regularPosts = featuredPost ? visiblePosts.filter(post => post.id !== featuredPost.id) : visiblePosts;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 sm:pt-28 lg:pt-32">
        <section className="bg-green-50 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-green-800 font-semibold text-sm mb-5">
                <BookOpen className="w-4 h-4" />
                {text.eyebrow}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-950 leading-tight mb-6">
                {text.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                {text.description}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map(index => (
                  <div key={index} className="h-80 bg-green-50 animate-pulse rounded-lg" />
                ))}
              </div>
            )}

            {isError && (
              <Card className="p-6 border-red-100 bg-red-50 rounded-lg">
                <p className="text-red-800">{text.error}</p>
              </Card>
            )}

            {!isLoading && !isError && posts.length === 0 && (
              <Card className="p-6 border-green-100 rounded-lg">
                <p className="text-gray-700">{text.empty}</p>
              </Card>
            )}

            {posts.length > 0 && (
              <div className="space-y-10">
                {categories.length > 1 && (
                  <div className="flex flex-wrap gap-2" aria-label={language === 'es' ? 'Filtrar articulos por categoria' : 'Filter articles by category'}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        selectedCategory === null
                          ? 'bg-green-900 text-white'
                          : 'bg-green-50 text-green-900 hover:bg-green-100'
                      }`}
                    >
                      {text.allPosts}
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-green-900 text-white'
                            : 'bg-green-50 text-green-900 hover:bg-green-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}

                {featuredPost && (
                  <Card className="overflow-hidden rounded-lg border-green-100 bg-green-50 shadow-sm">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                      <Link href={getBlogPostPath(featuredPost)} aria-label={`${text.read}: ${featuredPost.title}`}>
                        <img
                          src={featuredPost.featuredImage || assetUrl(doctorConsultation)}
                          alt={featuredPost.featuredImageAlt || 'Healing Minds Psychiatry consultation'}
                          className="h-72 w-full object-cover lg:h-full"
                          loading="eager"
                        />
                      </Link>
                      <div className="p-6 sm:p-8 lg:p-10">
                        <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                          <span className="rounded-full bg-green-900 px-3 py-1 text-xs font-semibold text-white">
                            {featuredPost.category?.name || text.fallbackCategory}
                          </span>
                          {featuredPost.isFeatured && (
                            <span className="text-green-900 font-semibold">{text.featured}</span>
                          )}
                          {featuredPost.publishedAt && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(featuredPost.publishedAt, language)}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readingTime || 5} {text.minuteLabel}
                          </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-body font-bold text-green-950 leading-tight mb-4">
                          <Link href={getBlogPostPath(featuredPost)} className="hover:text-green-700 transition-colors">
                            {featuredPost.title}
                          </Link>
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-gray-700 leading-relaxed text-lg mb-6">{featuredPost.excerpt}</p>
                        )}
                        <Link href={getBlogPostPath(featuredPost)}>
                          <Button className="bg-green-800 hover:bg-green-700 text-white rounded-full px-5">
                            {text.read}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}

                {regularPosts.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {regularPosts.map(post => {
                  const postPath = getBlogPostPath(post);
                  return (
                    <Card key={post.id} className="overflow-hidden border-green-100 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                      <Link href={postPath} aria-label={`${text.read}: ${post.title}`}>
                        <img
                          src={post.featuredImage || assetUrl(doctorConsultation)}
                          alt={post.featuredImageAlt || 'Healing Minds Psychiatry consultation'}
                          className="w-full h-56 object-cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="text-green-800 font-semibold">{post.category?.name || text.fallbackCategory}</span>
                          {post.publishedAt && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.publishedAt, language)}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readingTime || 5} {text.minuteLabel}
                          </span>
                        </div>
                        <h2 className="text-2xl font-body font-bold text-green-950 mb-3 leading-tight">
                          <Link href={postPath} className="hover:text-green-700 transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        {post.excerpt && <p className="text-gray-700 leading-relaxed mb-6">{post.excerpt}</p>}
                        <Link href={postPath}>
                          <Button className="bg-green-800 hover:bg-green-700 text-white rounded-full px-5">
                            {text.read}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
