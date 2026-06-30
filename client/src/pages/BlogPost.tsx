import { useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Clock, Phone, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { updateSEO } from '@/utils/seo';
import doctorConsultation from '@/assets/doctor-consultation.webp';

type BlogLanguage = 'en' | 'es';

type BlogPostDetail = {
  id: number;
  slug: string;
  language: BlogLanguage;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: { name: string; title: string | null; bio: string | null; imageUrl: string | null } | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ name: string; slug: string }>;
  metaTitle: string | null;
  metaDescription: string | null;
  readingTime: number | null;
  publishedAt: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
};

type BlogPostResponse = {
  success: boolean;
  data: BlogPostDetail;
};

declare global {
  interface Window {
    __SSR_BLOG_POST__?: BlogPostResponse;
  }
}

function getBlogIndexPath(language: BlogLanguage): string {
  return language === 'es' ? '/es/blog' : '/blog';
}

function getBlogPostPath(post: Pick<BlogPostDetail, 'slug' | 'language'>): string {
  return post.language === 'es' ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
}

function getInitialBlogPost(slug: string, language: BlogLanguage): BlogPostResponse | undefined {
  const payload = window.__SSR_BLOG_POST__;
  if (payload?.success && payload.data?.slug === slug && payload.data.language === language) {
    return payload;
  }
  return undefined;
}

function formatDate(date: string | null, language: BlogLanguage): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(language === 'es' ? 'es-US' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function sanitizeClientBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

const copy = {
  en: {
    back: 'Back to Blog',
    notFound: 'Article not found.',
    loadError: 'This article could not load right now.',
    fallbackCategory: 'Mental Health',
    minuteLabel: 'min read',
    ctaTitle: 'Need psychiatric care in Naples or by telehealth in Florida?',
    ctaBody: 'Healing Minds Psychiatry offers thoughtful psychiatric evaluation and follow-up care with Dr. Melva Reve.',
    ctaButton: 'Schedule an Appointment',
    contactPath: '/contact',
  },
  es: {
    back: 'Volver al Blog',
    notFound: 'Articulo no encontrado.',
    loadError: 'Este articulo no pudo cargar ahora.',
    fallbackCategory: 'Salud Mental',
    minuteLabel: 'min lectura',
    ctaTitle: 'Necesita atencion psiquiatrica en Naples o por telehealth en Florida?',
    ctaBody: 'Healing Minds Psychiatry ofrece evaluacion psiquiatrica y seguimiento con la Dra. Melva Reve.',
    ctaButton: 'Programar una Cita',
    contactPath: '/es/contacto',
  },
};

const BlogPost = () => {
  const { setLanguage } = useLanguage();
  const [, enParams] = useRoute('/blog/:slug');
  const [, esParams] = useRoute('/es/blog/:slug');
  const language: BlogLanguage = esParams?.slug ? 'es' : 'en';
  const slug = esParams?.slug || enParams?.slug || '';
  const text = copy[language];
  const blogIndexPath = getBlogIndexPath(language);

  const { data, isLoading, isError } = useQuery<BlogPostResponse>({
    queryKey: [`/api/blog/posts/${slug}?language=${language}`],
    enabled: Boolean(slug),
    initialData: () => getInitialBlogPost(slug, language),
  });

  const post = data?.data;

  useEffect(() => {
    setLanguage(language);
  }, [language, setLanguage]);

  useEffect(() => {
    if (!post) return;

    updateSEO({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || '',
      lang: language,
      canonical: getBlogPostPath(post),
    });
  }, [language, post]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 sm:pt-28 lg:pt-32">
        {isLoading && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="h-8 w-40 bg-green-50 animate-pulse rounded mb-8" />
            <div className="h-16 w-full bg-green-50 animate-pulse rounded mb-4" />
            <div className="h-6 w-2/3 bg-green-50 animate-pulse rounded mb-8" />
            <div className="h-80 w-full bg-green-50 animate-pulse rounded-lg" />
          </section>
        )}

        {isError && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <Card className="p-6 border-red-100 bg-red-50 rounded-lg">
              <p className="text-red-800 mb-4">{text.loadError}</p>
              <Link href={blogIndexPath}>
                <Button variant="outline" className="border-red-200 text-red-800">
                  {text.back}
                </Button>
              </Link>
            </Card>
          </section>
        )}

        {!isLoading && !isError && !post && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <Card className="p-6 border-green-100 rounded-lg">
              <p className="text-gray-700 mb-4">{text.notFound}</p>
              <Link href={blogIndexPath}>
                <Button variant="outline" className="border-green-800 text-green-800">
                  {text.back}
                </Button>
              </Link>
            </Card>
          </section>
        )}

        {post && (
          <article>
            <section className="bg-green-50 border-b border-green-100">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <Link href={blogIndexPath} className="inline-flex items-center text-green-800 font-semibold mb-8 hover:text-green-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {text.back}
                </Link>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-5">
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
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-body font-bold text-green-950 leading-tight mb-6">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                {post.author && (
                  <p className="mt-5 text-sm font-semibold text-green-900">
                    {post.author.name}{post.author.title ? `, ${post.author.title}` : ''}
                  </p>
                )}
              </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <img
                src={post.featuredImage || doctorConsultation}
                alt={post.featuredImageAlt || 'Healing Minds Psychiatry consultation'}
                className="w-full aspect-[16/9] object-cover rounded-lg mb-10"
              />

              <div
                className="prose prose-lg prose-green max-w-none prose-headings:font-body prose-headings:text-green-950 prose-p:text-gray-700 prose-p:leading-8 prose-a:text-green-800"
                dangerouslySetInnerHTML={{ __html: sanitizeClientBlogHtml(post.content || '') }}
              />

              <div className="mt-12 pt-8 border-t border-green-100">
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map(tag => (
                      <span key={tag.slug} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm font-medium">
                        <Tag className="w-3 h-3" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <Card className="p-6 sm:p-8 rounded-lg border-green-100 bg-green-50">
                  <h2 className="text-2xl font-body font-bold text-green-950 mb-3">
                    {text.ctaTitle}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-5">
                    {text.ctaBody}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={text.contactPath}>
                      <Button className="bg-green-800 hover:bg-green-700 text-white rounded-full px-6">
                        {text.ctaButton}
                      </Button>
                    </Link>
                    <a href="tel:+12394230272">
                      <Button variant="outline" className="border-green-800 text-green-800 hover:bg-white rounded-full px-6">
                        <Phone className="w-4 h-4 mr-2" />
                        (239) 423-0272
                      </Button>
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
