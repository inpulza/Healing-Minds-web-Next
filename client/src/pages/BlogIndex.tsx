import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { updateSEO } from '@/utils/seo';
import doctorConsultation from '@/assets/doctor-consultation.webp';

type BlogLanguage = 'en' | 'es';

type BlogPostListItem = {
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
};

type BlogListResponse = {
  success: boolean;
  data: BlogPostListItem[];
};

type BlogIndexProps = {
  language?: BlogLanguage;
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
    minuteLabel: 'min',
    fallbackCategory: 'Salud Mental',
  },
};

const BlogIndex = ({ language = 'en' }: BlogIndexProps) => {
  const { setLanguage } = useLanguage();
  const text = copy[language];
  const blogPath = language === 'es' ? '/es/blog' : '/blog';

  const { data, isLoading, isError } = useQuery<BlogListResponse>({
    queryKey: [`/api/blog/posts?language=${language}`],
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
                {[0, 1].map(index => (
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
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {posts.map(post => {
                  const postPath = getBlogPostPath(post);
                  return (
                    <Card key={post.id} className="overflow-hidden border-green-100 rounded-lg shadow-sm">
                      <Link href={postPath} aria-label={`${text.read}: ${post.title}`}>
                        <img
                          src={post.featuredImage || doctorConsultation}
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
