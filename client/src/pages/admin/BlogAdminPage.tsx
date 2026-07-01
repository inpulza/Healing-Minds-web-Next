import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  FilePenLine,
  LogOut,
  Plus,
  Sparkles,
  Wrench,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest, queryClient } from '@/lib/queryClient';

type BlogStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
type BlogLanguage = 'en' | 'es';

type BlogAuthor = {
  id: number;
  name: string;
  title: string | null;
};

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  language: BlogLanguage;
};

type BlogTag = {
  id: number;
  name: string;
  slug: string;
  language: BlogLanguage;
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  translationGroupId: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  authorId: number | null;
  categoryId: number | null;
  status: BlogStatus;
  isFeatured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  readingTime: number | null;
  publishedAt: string | null;
  updatedAt: string;
  author: BlogAuthor | null;
  category: BlogCategory | null;
  tags: BlogTag[];
};

type PublishCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail?: string;
};

type BlogVerificationSeverity = 'blocking' | 'warning' | 'info';
type BlogVerificationFixType =
  | 'slug'
  | 'metaTitle'
  | 'metaDescription'
  | 'readingTime'
  | 'featuredImageAlt'
  | 'medicalDisclaimer'
  | 'tags'
  | 'internalLinks';

type BlogVerificationCheck = {
  id: string;
  label: string;
  ok: boolean;
  severity: BlogVerificationSeverity;
  message: string;
  detail?: string;
  count?: number;
  required?: number;
  fixType?: BlogVerificationFixType;
};

type BlogVerificationReport = {
  isReady: boolean;
  score: number;
  summary: string;
  checks: BlogVerificationCheck[];
  blocking: BlogVerificationCheck[];
  warnings: BlogVerificationCheck[];
  passed: BlogVerificationCheck[];
};

type BlogFixResult = {
  success: boolean;
  fixType: BlogVerificationFixType;
  message: string;
  changedFields: string[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  checks?: PublishCheck[];
  verification?: BlogVerificationReport;
};

type FixApiResponse = {
  success: boolean;
  data: {
    result: BlogFixResult;
    post: BlogPost;
    verification: BlogVerificationReport;
    checks: PublishCheck[];
  };
};

type BlogResearchSource = {
  id: string;
  title: string;
  publisher: string;
  domain: string;
  url: string;
  sourceCategory: 'institutional' | 'clinical' | 'crisis';
  summary: string;
  confidence: 'low' | 'medium' | 'high';
  accessedAt: string;
};

type BlogResearchBrief = {
  confidence: 'low' | 'medium' | 'high';
  sources: BlogResearchSource[];
  riskNotes: string[];
};

type BlogSemanticMemoryMatch = {
  postId: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  status: BlogStatus;
  score: number;
  overlapTerms: string[];
  recommendation: 'create_new' | 'change_angle' | 'update_existing';
};

type BlogSemanticMemory = {
  recommendation: 'create_new' | 'change_angle' | 'update_existing';
  matches: BlogSemanticMemoryMatch[];
  riskNotes: string[];
};

type BlogEditorialBrief = {
  targetWordCount: number;
  minimumWordCount: number;
  maximumWordCount: number;
  searchIntent: string;
  audience: string;
  requiredSections: string[];
  requiredInternalLinks: string[];
  sourceRequirement: string;
  riskNotes: string[];
};

type AiGenerationNotes = {
  riskNotes: string[];
  research?: BlogResearchBrief;
  semanticMemory?: BlogSemanticMemory;
  editorialBrief?: BlogEditorialBrief;
};

type GenerateDraftApiResponse = ApiResponse<BlogPost> & {
  ai?: AiGenerationNotes;
};

type SessionResponse = {
  success: boolean;
  authenticated: boolean;
  mode: 'off' | 'replit' | 'custom';
  loginUrl: string | null;
  admin: { username: string; role: string } | null;
};

type FormState = {
  id?: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  translationGroupId: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  authorId: string;
  categoryId: string;
  status: BlogStatus;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  tagIds: number[];
};

type GenerateDraftFormState = {
  topic: string;
  additionalContext: string;
  targetKeyword: string;
  language: BlogLanguage;
  authorId: string;
  categoryId: string;
  tagIds: number[];
};

const statusLabels: Record<BlogStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending review',
  published: 'Published',
  rejected: 'Rejected',
};

const statusClasses: Record<BlogStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending_review: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

function getPostPath(post: Pick<BlogPost, 'language' | 'slug'>): string {
  return post.language === 'es' ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
}

function sanitizePreviewHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'a', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 255);
}

function createEmptyForm(authors: BlogAuthor[], categories: BlogCategory[]): FormState {
  const defaultLanguage: BlogLanguage = 'en';
  const defaultCategory = categories.find(category => category.language === defaultLanguage) || categories[0];
  return {
    title: '',
    slug: '',
    language: defaultLanguage,
    translationGroupId: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    authorId: authors[0]?.id ? String(authors[0].id) : '',
    categoryId: defaultCategory?.id ? String(defaultCategory.id) : '',
    status: 'draft',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    tagIds: [],
  };
}

function createGenerateDraftForm(authors: BlogAuthor[], categories: BlogCategory[]): GenerateDraftFormState {
  const defaultLanguage: BlogLanguage = 'en';
  const defaultCategory = categories.find(category => category.language === defaultLanguage) || categories[0];
  return {
    topic: '',
    additionalContext: '',
    targetKeyword: '',
    language: defaultLanguage,
    authorId: authors[0]?.id ? String(authors[0].id) : '',
    categoryId: defaultCategory?.id ? String(defaultCategory.id) : '',
    tagIds: [],
  };
}

function formFromPost(post: BlogPost): FormState {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    language: post.language,
    translationGroupId: post.translationGroupId,
    excerpt: post.excerpt || '',
    content: post.content || '',
    featuredImage: post.featuredImage || '',
    featuredImageAlt: post.featuredImageAlt || '',
    authorId: post.authorId ? String(post.authorId) : '',
    categoryId: post.categoryId ? String(post.categoryId) : '',
    status: post.status,
    isFeatured: post.isFeatured,
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    tagIds: post.tags.map(tag => tag.id),
  };
}

function toGenerateDraftPayload(form: GenerateDraftFormState) {
  return {
    topic: form.topic,
    additionalContext: form.additionalContext || undefined,
    targetKeyword: form.targetKeyword || undefined,
    language: form.language,
    authorId: Number(form.authorId),
    categoryId: Number(form.categoryId),
    tagIds: form.tagIds,
  };
}

function toPayload(form: FormState) {
  return {
    title: form.title,
    slug: form.slug,
    language: form.language,
    translationGroupId: form.translationGroupId || undefined,
    excerpt: form.excerpt,
    content: form.content,
    featuredImage: form.featuredImage || null,
    featuredImageAlt: form.featuredImageAlt || null,
    authorId: Number(form.authorId),
    categoryId: Number(form.categoryId),
    isFeatured: form.isFeatured,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    tagIds: form.tagIds,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: 'include' });
  if (response.status === 401) {
    throw new Error('401');
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export default function BlogAdminPage() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<BlogLanguage | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [generateForm, setGenerateForm] = useState<GenerateDraftFormState | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [checks, setChecks] = useState<PublishCheck[]>([]);
  const [verification, setVerification] = useState<BlogVerificationReport | null>(null);
  const [fixingCheck, setFixingCheck] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [aiNotes, setAiNotes] = useState<AiGenerationNotes | null>(null);

  const sessionQuery = useQuery<SessionResponse>({
    queryKey: ['/api/admin/session'],
    queryFn: () => fetchJson('/api/admin/session'),
  });

  const authenticated = Boolean(sessionQuery.data?.authenticated);

  const postsQuery = useQuery<ApiResponse<BlogPost[]>>({
    queryKey: [`/api/admin/blog/posts?status=${statusFilter}&language=${languageFilter}&search=${encodeURIComponent(search)}`],
    enabled: authenticated,
  });

  const statsQuery = useQuery<ApiResponse<Record<BlogStatus, number>>>({
    queryKey: ['/api/admin/blog/stats'],
    enabled: authenticated,
  });

  const authorsQuery = useQuery<ApiResponse<BlogAuthor[]>>({
    queryKey: ['/api/admin/blog/authors'],
    enabled: authenticated,
  });

  const categoriesQuery = useQuery<ApiResponse<BlogCategory[]>>({
    queryKey: ['/api/admin/blog/categories'],
    enabled: authenticated,
  });

  const tagsQuery = useQuery<ApiResponse<BlogTag[]>>({
    queryKey: ['/api/admin/blog/tags'],
    enabled: authenticated,
  });

  const authors = authorsQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];
  const tags = tagsQuery.data?.data || [];
  const posts = postsQuery.data?.data || [];
  const stats = statsQuery.data?.data;

  const availableCategories = useMemo(
    () => categories.filter(category => category.language === (form?.language || 'en')),
    [categories, form?.language],
  );
  const availableTags = useMemo(
    () => tags.filter(tag => tag.language === (form?.language || 'en')),
    [tags, form?.language],
  );
  const availableGenerateCategories = useMemo(
    () => categories.filter(category => category.language === (generateForm?.language || 'en')),
    [categories, generateForm?.language],
  );
  const availableGenerateTags = useMemo(
    () => tags.filter(tag => tag.language === (generateForm?.language || 'en')),
    [tags, generateForm?.language],
  );

  const saveMutation = useMutation({
    mutationFn: async (currentForm: FormState) => {
      const response = currentForm.id
        ? await apiRequest('PUT', `/api/admin/blog/posts/${currentForm.id}`, toPayload(currentForm))
        : await apiRequest('POST', '/api/admin/blog/posts', toPayload(currentForm));
      return response.json() as Promise<ApiResponse<BlogPost>>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Save failed');
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ postId, status }: { postId: number; status: BlogStatus }) => {
      const response = await apiRequest('PATCH', `/api/admin/blog/posts/${postId}/status`, { status });
      return response.json() as Promise<ApiResponse<BlogPost>>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Status update failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest('DELETE', `/api/admin/blog/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Delete failed');
    },
  });

  const seoMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('POST', `/api/admin/blog/posts/${postId}/seo-check?google=false`);
      return response.json();
    },
    onSuccess: () => setActionError(null),
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'SEO check failed');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('GET', `/api/admin/blog/posts/${postId}/verify`);
      return response.json() as Promise<ApiResponse<BlogVerificationReport>>;
    },
    onSuccess: data => {
      setVerification(data.data);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Verification failed');
    },
  });

  const fixMutation = useMutation({
    mutationFn: async ({ postId, fixType }: { postId: number; fixType: BlogVerificationFixType }) => {
      setFixingCheck(fixType);
      const response = await apiRequest('POST', `/api/admin/blog/posts/${postId}/fix`, { fixType });
      return response.json() as Promise<FixApiResponse>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data.post));
      setChecks(data.data.checks || []);
      setVerification(data.data.verification);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Fix failed');
    },
    onSettled: () => setFixingCheck(null),
  });

  const generateDraftMutation = useMutation({
    mutationFn: async (currentForm: GenerateDraftFormState) => {
      const response = await apiRequest('POST', '/api/admin/blog/generate-draft', toGenerateDraftPayload(currentForm));
      return response.json() as Promise<GenerateDraftApiResponse>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      setAiNotes(data.ai || null);
      setGenerateOpen(false);
      setEditorOpen(true);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setGenerateError(null);
      setActionError(null);
    },
    onError: error => {
      setGenerateError(error instanceof Error ? error.message : 'AI draft generation failed');
    },
  });

  const openGenerateDraft = () => {
    setGenerateForm(createGenerateDraftForm(authors, categories));
    setGenerateError(null);
    setAiNotes(null);
    setGenerateOpen(true);
  };

  const openNewPost = () => {
    setForm(createEmptyForm(authors, categories));
    setChecks([]);
    setVerification(null);
    setAiNotes(null);
    setActionError(null);
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setForm(formFromPost(post));
    setChecks([]);
    setVerification(null);
    setAiNotes(null);
    setActionError(null);
    setEditorOpen(true);
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(current => current ? { ...current, [key]: value } : current);
  };

  const updateGenerateForm = <K extends keyof GenerateDraftFormState>(key: K, value: GenerateDraftFormState[K]) => {
    setGenerateForm(current => current ? { ...current, [key]: value } : current);
  };

  const generateDraft = () => {
    if (!generateForm) return;
    generateDraftMutation.mutate(generateForm);
  };

  const saveCurrentForm = () => {
    if (!form) return;
    saveMutation.mutate(form);
  };

  const submitForReview = () => {
    if (!form?.id) return;
    statusMutation.mutate({ postId: form.id, status: 'pending_review' });
  };

  const publishCurrent = () => {
    if (!form?.id) return;
    statusMutation.mutate({ postId: form.id, status: 'published' });
  };
  const canPublishCurrent = form?.status === 'pending_review' || form?.status === 'published';

  const logout = async () => {
    await apiRequest('POST', '/api/admin/logout');
    navigate('/admin/login');
  };

  if (sessionQuery.isLoading) {
    return <main className="min-h-screen bg-slate-50 p-8 text-slate-700">Checking admin session...</main>;
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 text-amber-600" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-semibold">Admin login required</h1>
              <p className="mt-2 text-sm text-slate-600">Sign in before managing blog content.</p>
              <Button className="mt-5" onClick={() => navigate('/admin/login')}>
                Go to login
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Healing Minds Psychiatry</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Blog Editorial Admin</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
            <Button variant="outline" onClick={openGenerateDraft} disabled={authors.length === 0 || categories.length === 0}>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              AI Generate
            </Button>
            <Button onClick={openNewPost}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              New Post
            </Button>
          </div>
        </header>

        <section className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(statusLabels) as BlogStatus[]).map(status => (
            <div key={status} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{statusLabels[status]}</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.[status] ?? 0}</p>
            </div>
          ))}
        </section>

        {actionError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
              <Input
                className="pl-9"
                placeholder="Search title, slug, excerpt"
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={value => setStatusFilter(value as BlogStatus | 'all')}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(statusLabels) as BlogStatus[]).map(status => (
                  <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={value => setLanguageFilter(value as BlogLanguage | 'all')}>
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading posts...</TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No posts found.</TableCell>
                </TableRow>
              ) : posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="mt-1 text-xs text-slate-500">/{post.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusClasses[post.status]}>{statusLabels[post.status]}</Badge>
                  </TableCell>
                  <TableCell>{post.language.toUpperCase()}</TableCell>
                  <TableCell>{post.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {post.status === 'published' && (
                        <Button variant="ghost" size="icon" asChild title="Open published post">
                          <a href={getPostPath(post)} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Preview"
                        onClick={() => {
                          setPreviewPost(post);
                          setPreviewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditPost(post)}>
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        disabled={post.status === 'published' || deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Article Generator</DialogTitle>
            <DialogDescription>Create an unpublished draft for editorial review.</DialogDescription>
          </DialogHeader>

          {generateForm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-topic">Topic</Label>
                <Input
                  id="ai-topic"
                  value={generateForm.topic}
                  placeholder="e.g., Anxiety treatment options in Naples"
                  onChange={event => updateGenerateForm('topic', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-keyword">Target keyword</Label>
                <Input
                  id="ai-keyword"
                  value={generateForm.targetKeyword}
                  placeholder="Optional"
                  onChange={event => updateGenerateForm('targetKeyword', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-context">Additional context</Label>
                <Textarea
                  id="ai-context"
                  value={generateForm.additionalContext}
                  rows={4}
                  placeholder="Angle, local focus, or points to include. Do not include patient-identifying information."
                  onChange={event => updateGenerateForm('additionalContext', event.target.value)}
                />
                <p className="text-xs text-slate-500">Do not paste patient names, emails, phone numbers, dates of birth, or private clinical details.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={generateForm.language}
                    onValueChange={value => {
                      const language = value as BlogLanguage;
                      const category = categories.find(item => item.language === language);
                      setGenerateForm(current => current ? {
                        ...current,
                        language,
                        categoryId: category ? String(category.id) : '',
                        tagIds: [],
                      } : current);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Author</Label>
                  <Select value={generateForm.authorId} onValueChange={value => updateGenerateForm('authorId', value)}>
                    <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author.id} value={String(author.id)}>{author.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={generateForm.categoryId} onValueChange={value => updateGenerateForm('categoryId', value)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {availableGenerateCategories.map(category => (
                      <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border border-slate-200 p-4">
                <h3 className="text-sm font-semibold">Tags</h3>
                <div className="mt-3 grid max-h-44 gap-2 overflow-auto sm:grid-cols-2">
                  {availableGenerateTags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={generateForm.tagIds.includes(tag.id)}
                        onCheckedChange={checked => {
                          setGenerateForm(current => {
                            if (!current) return current;
                            return {
                              ...current,
                              tagIds: checked
                                ? Array.from(new Set([...current.tagIds, tag.id]))
                                : current.tagIds.filter(id => id !== tag.id),
                            };
                          });
                        }}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {generateError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {generateError}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>Cancel</Button>
            <Button
              onClick={generateDraft}
              disabled={!generateForm?.topic.trim() || !generateForm.authorId || !generateForm.categoryId || generateDraftMutation.isPending}
            >
              {generateDraftMutation.isPending ? 'Generating...' : 'Generate Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form?.id ? 'Edit blog post' : 'New blog post'}</DialogTitle>
            <DialogDescription>Drafts stay unpublished until human review and publish approval.</DialogDescription>
          </DialogHeader>

          {form && (
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {aiNotes && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-emerald-950">AI research notes</h3>
                          {aiNotes.research && (
                            <Badge className="bg-white text-emerald-800">Source confidence: {aiNotes.research.confidence}</Badge>
                          )}
                          {aiNotes.semanticMemory && (
                            <Badge className="bg-white text-emerald-800">Memory: {aiNotes.semanticMemory.recommendation.replace(/_/g, ' ')}</Badge>
                          )}
                          {aiNotes.editorialBrief && (
                            <Badge className="bg-white text-emerald-800">Target: {aiNotes.editorialBrief.targetWordCount} words</Badge>
                          )}
                        </div>

                        {aiNotes.editorialBrief && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-emerald-950">Editorial structure used</p>
                            <p className="text-xs text-emerald-900">{aiNotes.editorialBrief.searchIntent}</p>
                            <p className="text-xs text-emerald-800">Visible for this generated draft only; it is not persisted after reload.</p>
                            <ul className="grid gap-1 text-xs text-emerald-900 sm:grid-cols-2">
                              {aiNotes.editorialBrief.requiredSections.map(section => (
                                <li key={section}>- {section}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiNotes.research?.sources.length ? (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-emerald-950">Trusted sources used for the draft</p>
                            <ul className="space-y-1 text-xs text-emerald-900">
                              {aiNotes.research.sources.map(source => (
                                <li key={source.id}>
                                  <a className="inline-flex items-center gap-1 underline" href={source.url} target="_blank" rel="noreferrer">
                                    {source.title}
                                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                  </a>
                                  <span className="text-emerald-800"> - {source.publisher}, accessed {source.accessedAt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {aiNotes.semanticMemory?.matches.length ? (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-emerald-950">Possible topic overlap</p>
                            <ul className="space-y-1 text-xs text-emerald-900">
                              {aiNotes.semanticMemory.matches.slice(0, 3).map(match => (
                                <li key={match.postId}>
                                  {match.title} ({match.status}, score {match.score}) - {match.recommendation.replace(/_/g, ' ')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {[...(aiNotes.riskNotes || []), ...(aiNotes.research?.riskNotes || []), ...(aiNotes.semanticMemory?.riskNotes || []), ...(aiNotes.editorialBrief?.riskNotes || [])].length > 0 && (
                          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-emerald-900">
                            {[...(aiNotes.riskNotes || []), ...(aiNotes.research?.riskNotes || []), ...(aiNotes.semanticMemory?.riskNotes || []), ...(aiNotes.editorialBrief?.riskNotes || [])]
                              .slice(0, 6)
                              .map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Title</Label>
                    <Input
                      id="post-title"
                      value={form.title}
                      onChange={event => {
                        const title = event.target.value;
                        setForm(current => current ? {
                          ...current,
                          title,
                          slug: current.slug || slugify(title),
                          metaTitle: current.metaTitle || title.slice(0, 70),
                        } : current);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-slug">Slug</Label>
                    <Input id="post-slug" value={form.slug} onChange={event => updateForm('slug', slugify(event.target.value))} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={form.language}
                      onValueChange={value => {
                        const language = value as BlogLanguage;
                        const category = categories.find(item => item.language === language);
                        setForm(current => current ? {
                          ...current,
                          language,
                          categoryId: category ? String(category.id) : '',
                          tagIds: [],
                        } : current);
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="translation-group">Translation group</Label>
                    <Input id="translation-group" value={form.translationGroupId} onChange={event => updateForm('translationGroupId', event.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea id="excerpt" value={form.excerpt} rows={3} onChange={event => updateForm('excerpt', event.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content HTML</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    rows={16}
                    className="font-mono text-sm"
                    onChange={event => updateForm('content', event.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta title</Label>
                    <Input id="meta-title" value={form.metaTitle} maxLength={70} onChange={event => updateForm('metaTitle', event.target.value)} />
                    <p className="text-xs text-slate-500">{form.metaTitle.length}/70</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta description</Label>
                    <Textarea id="meta-description" value={form.metaDescription} rows={3} maxLength={160} onChange={event => updateForm('metaDescription', event.target.value)} />
                    <p className="text-xs text-slate-500">{form.metaDescription.length}/160</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="featured-image">Featured image URL</Label>
                    <Input id="featured-image" value={form.featuredImage} onChange={event => updateForm('featuredImage', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featured-alt">Featured image alt text</Label>
                    <Input id="featured-alt" value={form.featuredImageAlt} onChange={event => updateForm('featuredImageAlt', event.target.value)} />
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-md border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold">Editorial fields</h3>
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Select value={form.authorId} onValueChange={value => updateForm('authorId', value)}>
                        <SelectTrigger><SelectValue placeholder="Select author" /></SelectTrigger>
                        <SelectContent>
                          {authors.map(author => (
                            <SelectItem key={author.id} value={String(author.id)}>{author.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={form.categoryId} onValueChange={value => updateForm('categoryId', value)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {availableCategories.map(category => (
                            <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={form.isFeatured} onCheckedChange={value => updateForm('isFeatured', value === true)} />
                      Featured post
                    </label>
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold">Tags</h3>
                  <div className="mt-3 max-h-48 space-y-2 overflow-auto">
                    {availableTags.map(tag => (
                      <label key={tag.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={form.tagIds.includes(tag.id)}
                          onCheckedChange={checked => {
                            setForm(current => {
                              if (!current) return current;
                              return {
                                ...current,
                                tagIds: checked
                                  ? Array.from(new Set([...current.tagIds, tag.id]))
                                  : current.tagIds.filter(id => id !== tag.id),
                              };
                            });
                          }}
                        />
                        {tag.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold">Publish checklist</h3>
                  <div className="mt-3 space-y-2">
                    {verification ? (
                      <div className="space-y-3">
                        <div className="rounded-md bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-900">Verification score</p>
                            <Badge className={verification.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                              {verification.score}%
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-slate-600">{verification.summary}</p>
                        </div>
                        {verification.checks.map(check => (
                          <div key={check.id} className="flex items-start gap-2 text-sm">
                            {check.ok ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                            ) : (
                              <AlertTriangle className={`mt-0.5 h-4 w-4 ${check.severity === 'blocking' ? 'text-red-600' : 'text-amber-600'}`} />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className={check.ok ? 'text-slate-700' : check.severity === 'blocking' ? 'text-red-700' : 'text-amber-800'}>
                                  {check.label}
                                </p>
                                {!check.ok && check.fixType && form.id && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    disabled={fixMutation.isPending}
                                    onClick={() => fixMutation.mutate({ postId: form.id!, fixType: check.fixType! })}
                                  >
                                    <Wrench className="mr-1 h-3 w-3" aria-hidden="true" />
                                    {fixingCheck === check.fixType ? 'Fixing' : 'Fix'}
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{check.message}</p>
                              {check.detail && <p className="break-words text-xs text-slate-500">{check.detail}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : checks.length === 0 ? (
                      <p className="text-sm text-slate-600">Save the post to run checks.</p>
                    ) : checks.map(check => (
                      <div key={check.id} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 ${check.ok ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <div>
                          <p className={check.ok ? 'text-slate-700' : 'text-red-700'}>{check.label}</p>
                          {check.detail && <p className="text-xs text-slate-500">{check.detail}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {actionError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {actionError}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            {form?.id && (
              <>
                <Button variant="outline" onClick={submitForReview} disabled={statusMutation.isPending}>
                  Submit review
                </Button>
                <Button variant="outline" onClick={() => statusMutation.mutate({ postId: form.id!, status: 'draft' })} disabled={statusMutation.isPending}>
                  Move to draft
                </Button>
                <Button variant="outline" onClick={() => verifyMutation.mutate(form.id!)} disabled={verifyMutation.isPending}>
                  Verify
                </Button>
                <Button variant="outline" onClick={() => seoMutation.mutate(form.id!)} disabled={seoMutation.isPending}>
                  SEO check
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Close</Button>
            <Button onClick={saveCurrentForm} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save draft'}
            </Button>
            {form?.id && (
              <Button
                onClick={publishCurrent}
                disabled={statusMutation.isPending || !canPublishCurrent}
                title={canPublishCurrent ? undefined : 'Submit review before publishing'}
              >
                Publish
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewPost?.title || 'Preview'}</DialogTitle>
            <DialogDescription>{previewPost?.excerpt}</DialogDescription>
          </DialogHeader>
          {previewPost && (
            <article className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: sanitizePreviewHtml(previewPost.content || '') }} />
            </article>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
