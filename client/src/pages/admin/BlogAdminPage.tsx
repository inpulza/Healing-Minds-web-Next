import { useEffect, useMemo, useRef, useState } from 'react';
import { prepareBlogArticleHtml } from '@/lib/blog-article';
import { useLocation } from '@/lib/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  FileText,
  FilePenLine,
  ImageIcon,
  Link2,
  LogOut,
  Loader2,
  Plus,
  RefreshCw,
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
import { LinkIntelligencePanel } from '@/components/admin/blog/LinkIntelligencePanel';
import { PostLinkReportCard } from '@/components/admin/blog/PostLinkReportCard';
import type { BlogPostLinkReport } from '@/components/admin/blog/link-intelligence-types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { truncateSeoText } from '@shared/seo-text';

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
  translationPair?: {
    targetLanguage: BlogLanguage;
    state: 'missing' | 'draft' | 'pending_review' | 'published';
    sibling: Pick<BlogPost, 'id' | 'title' | 'slug' | 'language' | 'status'> | null;
    run: { id: number; status: 'queued' | 'running' | 'failed' | 'interrupted'; error?: string } | null;
  };
};

type BlogPostImage = {
  id: number;
  postId: number;
  role: 'hero' | 'inline';
  slot: string;
  anchorHeading: string | null;
  source: 'curated' | 'ai';
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed';
  reviewStatus: 'candidate' | 'selected' | 'rejected';
  objectKey: string | null;
  publicUrl: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  checksum: string | null;
  alt: string | null;
  caption: string | null;
  model: string | null;
  imageJobId: number | null;
  errorMessage: string | null;
  sortOrder: number;
  createdAt: string;
};

type BlogImageConfig = {
  enabled: boolean;
  model: string;
  storage: string;
};

type BlogImageGenerationJob = {
  id: number;
  postId: number;
  status: 'admitting' | 'queued' | 'running' | 'completed' | 'partial_failed' | 'failed';
  operation: 'generate_set' | 'regenerate_variant';
  role: 'hero' | 'inline' | 'all';
  result: {
    total?: number;
    completed?: number;
    failed?: number;
    pending?: number;
    generating?: number;
    warnings?: string[];
    errorMessage?: string;
    recoveryWarning?: string;
  } | null;
};

type BlogTranslationDetail = {
  source: BlogPost;
  sibling: BlogPost | null;
};

type SiblingImageSyncResult = {
  status: 'synced' | 'skipped';
  reason?: 'missing-sibling' | 'published-sibling' | 'already-aligned';
  sourcePostId: number;
  sourceLanguage?: BlogLanguage;
  targetPostId: number | null;
  selected: BlogPostImage[];
  uploadedCopies: number;
  reusedExisting: number;
  post: BlogPost;
  images: BlogPostImage[];
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
  | 'featuredImage'
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
  linkReport?: BlogPostLinkReport;
};

type FixApiResponse = {
  success: boolean;
  data: {
    result: BlogFixResult;
    post: BlogPost;
    verification: BlogVerificationReport;
    checks: PublishCheck[];
    linkReport?: BlogPostLinkReport;
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

type BlogTopicPlanCandidate = {
  id: string;
  topicCandidateId?: number;
  candidateKey: string;
  batch: number;
  topic: string;
  targetKeyword: string;
  topicKey: string;
  language: BlogLanguage;
  categoryId: number;
  categoryKey: string;
  categoryName: string;
  pillar: string;
  patientStage: string;
  contentFormat: string;
  searchIntent: string;
  tagIds: number[];
  tagNames: string[];
  internalLinks: string[];
  internalLinkTargetIds: string[];
  sourceRecommendationIds: string[];
  score: number;
  noveltyScore: number;
  overlapScore: number;
  recommendation: 'recommended' | 'change_angle' | 'update_existing';
  semanticDecision: 'duplicate' | 'same_cluster_distinct_intent' | 'distinct' | 'judge_unavailable';
  angle: string;
  rationale: string;
  whyTimely: string;
  strategyVersion: string;
  riskNotes: string[];
  research: BlogResearchBrief;
  semanticMemory: BlogSemanticMemory;
  editorialBrief: BlogEditorialBrief;
};

type BlogTopicPlan = {
  runId?: number;
  language: BlogLanguage;
  generatedAt: string;
  strategyVersion: string;
  promptVersion: string;
  selectedCandidateId?: string;
  candidates: BlogTopicPlanCandidate[];
  summary: {
    considered: number;
    returned: number;
    recommended: number;
    changeAngle: number;
    updateExisting: number;
    batches: number;
  };
};

type AiGenerationNotes = {
  riskNotes: string[];
  research?: BlogResearchBrief;
  semanticMemory?: BlogSemanticMemory;
  editorialBrief?: BlogEditorialBrief;
};

type BlogGenerationWorkflowStep = {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'in_progress' | 'failed';
  detail?: string;
};

type BlogGenerationWorkflow = {
  mode: 'manual' | 'auto-generate';
  generatedAt: string;
  authorId?: number;
  selectedCandidate?: BlogTopicPlanCandidate;
  steps: BlogGenerationWorkflowStep[];
};

type GenerateDraftApiResponse = ApiResponse<BlogPost> & {
  ai?: AiGenerationNotes;
  translation?: {
    targetLanguage: BlogLanguage;
    state: string;
    runId?: number | null;
    siblingId?: number;
    recoverable: boolean;
    message?: string;
  };
};

type AutoGenerateApiResponse = GenerateDraftApiResponse & {
  workflow: BlogGenerationWorkflow;
};

type AutoGenerateRunStartResponse = {
  success: boolean;
  data: {
    runId: number;
    status: 'planning' | 'queued' | 'running' | 'completed' | 'failed' | 'interrupted';
    workflow: BlogGenerationWorkflow;
  };
};

type TopicPlanApiResponse = ApiResponse<BlogTopicPlan>;

type SessionResponse = {
  success: boolean;
  authenticated: boolean;
  mode: 'off' | 'replit' | 'custom';
  loginUrl: string | null;
  admin: { username: string; role: string } | null;
};

type RuntimeInfo = {
  runtime: 'live' | 'dev' | 'unknown';
  isReplitDeployment: boolean;
};

type BlogLinkConfig = {
  enabled: boolean;
};

type BlogInternalLinkImpact = {
  id: number;
  title: string;
  slug: string;
  language: BlogLanguage;
  status: BlogStatus;
  path: string;
};

type UnpublishImpact = {
  postId: number;
  slug: string;
  status: BlogStatus;
  publicPath: string;
  linkingPosts: BlogInternalLinkImpact[];
  linkingPostCount: number;
};

type BlogPostUnpublishTarget = Pick<BlogPost, 'id' | 'title' | 'slug' | 'language' | 'status'>;

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
  internalLinks?: string[];
  internalLinkTargetIds?: string[];
  sourceRecommendationIds?: string[];
  topicCandidateId?: number;
  topicKey?: string;
  expertiseAngle?: string;
  plannedStrategy?: {
    contentPillar: string;
    patientStage: string;
    contentFormat: string;
    searchIntent: string;
    topicStrategyVersion: string;
  };
};

type TopicPlannerFormState = {
  language: BlogLanguage;
};

type AutoGenerateFormState = {
  language: BlogLanguage;
  authorId: string;
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

const autoGeneratePendingSteps: BlogGenerationWorkflowStep[] = [
  { id: 'strategy-context', label: 'Strategy context', status: 'pending' },
  { id: 'topic-ideation', label: 'Topic ideation', status: 'pending' },
  { id: 'deterministic-review', label: 'Deterministic review', status: 'pending' },
  { id: 'semantic-review', label: 'Semantic review', status: 'pending' },
  { id: 'topic-selection', label: 'Topic selection', status: 'pending' },
  { id: 'editorial-context', label: 'Editorial context', status: 'pending' },
  { id: 'taxonomy-links', label: 'Taxonomy and internal links', status: 'pending' },
  { id: 'trusted-research', label: 'Trusted research', status: 'pending' },
  { id: 'editorial-brief', label: 'Editorial brief', status: 'pending' },
  { id: 'ai-draft', label: 'AI draft', status: 'pending' },
  { id: 'featured-image', label: 'Featured image', status: 'pending' },
  { id: 'sanitize-save', label: 'Sanitize and save', status: 'pending' },
  { id: 'ai-images', label: 'AI image variants', status: 'pending' },
  { id: 'verify', label: 'Verification', status: 'pending' },
];

function getPostPath(post: Pick<BlogPost, 'language' | 'slug'>): string {
  return post.language === 'es' ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
}

function getBlogIndexPath(language: BlogLanguage): string {
  return language === 'es' ? '/es/blog' : '/blog';
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

function createTopicPlannerForm(): TopicPlannerFormState {
  const defaultLanguage: BlogLanguage = 'en';
  return {
    language: defaultLanguage,
  };
}

function createAutoGenerateForm(authors: BlogAuthor[]): AutoGenerateFormState {
  const defaultLanguage: BlogLanguage = 'en';
  return {
    language: defaultLanguage,
    authorId: authors[0]?.id ? String(authors[0].id) : '',
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
    metaTitle: truncateSeoText(post.metaTitle || '', 60),
    metaDescription: truncateSeoText(post.metaDescription || '', 160),
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
    internalLinks: form.internalLinks || [],
    internalLinkTargetIds: form.internalLinkTargetIds || [],
    sourceRecommendationIds: form.sourceRecommendationIds || [],
    topicCandidateId: form.topicCandidateId,
    topicKey: form.topicKey,
    expertiseAngle: form.expertiseAngle,
    ...(form.plannedStrategy || {}),
  };
}

function toTopicPlannerPayload(form: TopicPlannerFormState) {
  return {
    language: form.language,
  };
}

function toAutoGeneratePayload(form: AutoGenerateFormState) {
  return {
    language: form.language,
    authorId: form.authorId ? Number(form.authorId) : undefined,
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
    metaTitle: truncateSeoText(form.metaTitle, 60),
    metaDescription: truncateSeoText(form.metaDescription, 160),
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

function createBlogImageIdempotencyKey(postId: number): string {
  return `blog-image-${postId}-${globalThis.crypto.randomUUID()}`;
}

export default function BlogAdminPage() {
  const [, navigate] = useLocation();
  const [adminView, setAdminView] = useState<'posts' | 'links'>('posts');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<BlogLanguage | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [autoGenerateOpen, setAutoGenerateOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [generateForm, setGenerateForm] = useState<GenerateDraftFormState | null>(null);
  const [autoGenerateForm, setAutoGenerateForm] = useState<AutoGenerateFormState | null>(null);
  const [plannerForm, setPlannerForm] = useState<TopicPlannerFormState | null>(null);
  const [topicPlan, setTopicPlan] = useState<BlogTopicPlan | null>(null);
  const [autoGenerateWorkflow, setAutoGenerateWorkflow] = useState<BlogGenerationWorkflow | null>(null);
  const [autoGeneratedPost, setAutoGeneratedPost] = useState<BlogPost | null>(null);
  const [autoGenerateRunId, setAutoGenerateRunId] = useState<number | null>(null);
  const [autoGenerateStreaming, setAutoGenerateStreaming] = useState(false);
  const autoGenerateEventSourceRef = useRef<EventSource | null>(null);
  const autoGenerateIdempotencyKeyRef = useRef<string | null>(null);
  const previewRequestIdRef = useRef(0);
  const handledImageJobIdRef = useRef<number | null>(null);
  const reconciledImagePairRef = useRef<string | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState('');
  const [deleteRedirectTargetPath, setDeleteRedirectTargetPath] = useState('');
  const [deleteConfirmNoRedirect, setDeleteConfirmNoRedirect] = useState(false);
  const [unpublishTarget, setUnpublishTarget] = useState<BlogPostUnpublishTarget | null>(null);
  const [unpublishConfirmSlug, setUnpublishConfirmSlug] = useState('');
  const [unpublishRedirectTargetPath, setUnpublishRedirectTargetPath] = useState('');
  const [unpublishConfirmNoRedirect, setUnpublishConfirmNoRedirect] = useState(false);
  const [checks, setChecks] = useState<PublishCheck[]>([]);
  const [verification, setVerification] = useState<BlogVerificationReport | null>(null);
  const [linkReport, setLinkReport] = useState<BlogPostLinkReport | null>(null);
  const [fixingCheck, setFixingCheck] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pairNotice, setPairNotice] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [autoGenerateError, setAutoGenerateError] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [aiNotes, setAiNotes] = useState<AiGenerationNotes | null>(null);

  const sessionQuery = useQuery<SessionResponse>({
    queryKey: ['/api/admin/session'],
    queryFn: () => fetchJson('/api/admin/session'),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const authenticated = Boolean(sessionQuery.data?.authenticated);

  const runtimeQuery = useQuery<ApiResponse<RuntimeInfo>>({
    queryKey: ['/api/admin/runtime'],
    enabled: authenticated,
  });

  const linkConfigQuery = useQuery<ApiResponse<BlogLinkConfig>>({
    queryKey: ['/api/admin/blog/links/config'],
    enabled: authenticated,
  });

  const postsQuery = useQuery<ApiResponse<BlogPost[]>>({
    queryKey: [`/api/admin/blog/posts?status=${statusFilter}&language=${languageFilter}&search=${encodeURIComponent(search)}`],
    enabled: authenticated,
    refetchInterval: query => {
      const response = query.state.data as ApiResponse<BlogPost[]> | undefined;
      return response?.data?.some(post => post.translationPair?.run?.status === 'queued' || post.translationPair?.run?.status === 'running')
        ? 2000
        : false;
    },
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

  const imageConfigQuery = useQuery<ApiResponse<BlogImageConfig>>({
    queryKey: ['/api/admin/blog/images/config'],
    enabled: authenticated,
  });

  const imagesQuery = useQuery<ApiResponse<BlogPostImage[]>>({
    queryKey: [`/api/admin/blog/posts/${form?.id || 'none'}/images`],
    enabled: authenticated && editorOpen && Boolean(form?.id),
  });

  const translationDetailQuery = useQuery<ApiResponse<BlogTranslationDetail>>({
    queryKey: [`/api/admin/blog/posts/${form?.id || 'none'}/translation`],
    enabled: authenticated && editorOpen && Boolean(form?.id),
  });

  const imageJobQuery = useQuery<ApiResponse<BlogImageGenerationJob | null>>({
    queryKey: [`/api/admin/blog/posts/${form?.id || 'none'}/images/job`],
    enabled: authenticated && editorOpen && Boolean(form?.id),
    staleTime: 0,
    refetchInterval: query => {
      const response = query.state.data as ApiResponse<BlogImageGenerationJob | null> | undefined;
      return response?.data?.status === 'admitting'
        || response?.data?.status === 'queued'
        || response?.data?.status === 'running'
        ? 1000
        : false;
    },
  });

  const unpublishImpactQuery = useQuery<ApiResponse<UnpublishImpact>>({
    queryKey: [`/api/admin/blog/posts/${unpublishTarget?.id || 'none'}/unpublish-impact`],
    enabled: authenticated && Boolean(unpublishTarget),
  });

  const authors = authorsQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];
  const tags = tagsQuery.data?.data || [];
  const posts = postsQuery.data?.data || [];
  const images = imagesQuery.data?.data || [];
  const imageJob = imageJobQuery.data?.data || null;
  const imageJobActive = imageJob?.status === 'admitting'
    || imageJob?.status === 'queued'
    || imageJob?.status === 'running';
  const imageConfig = imageConfigQuery.data?.data;
  const translationSibling = translationDetailQuery.data?.data?.sibling || null;
  const stats = statsQuery.data?.data;
  const runtime = runtimeQuery.data?.data?.runtime || 'unknown';
  const linkIntelligenceEnabled = linkConfigQuery.data?.data?.enabled ?? false;
  const previewContent = useMemo(
    () => prepareBlogArticleHtml(previewPost?.content || '').content,
    [previewPost?.content],
  );

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
      setLinkReport(data.linkReport || null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Save failed');
    },
  });

  const refreshImages = (postId: number) => {
    queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/posts/${postId}/images`] });
    queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
  };

  useEffect(() => {
    if (!imageJob || imageJobActive || handledImageJobIdRef.current === imageJob.id) return;
    handledImageJobIdRef.current = imageJob.id;
    refreshImages(imageJob.postId);
  }, [imageJob?.id, imageJob?.postId, imageJob?.status, imageJobActive]);

  const generateImagesMutation = useMutation({
    mutationFn: async ({ postId, role }: { postId: number; role: 'hero' | 'inline' | 'all' }) => {
      const response = await apiRequest(
        'POST',
        `/api/admin/blog/posts/${postId}/images/generate`,
        { role },
        { 'Idempotency-Key': createBlogImageIdempotencyKey(postId) },
      );
      return response.json() as Promise<ApiResponse<BlogImageGenerationJob>>;
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: [`/api/admin/blog/posts/${variables.postId}/images/job`] });
    },
    onSuccess: (data, variables) => {
      handledImageJobIdRef.current = null;
      queryClient.setQueryData(
        [`/api/admin/blog/posts/${variables.postId}/images/job`],
        data,
      );
      setActionError(null);
    },
    onError: (error, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/posts/${variables.postId}/images/job`] });
      setActionError(error instanceof Error ? error.message : 'Image generation failed');
    },
  });

  const reconcileSiblingImagesMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const response = await apiRequest('POST', `/api/admin/blog/posts/${postId}/images/reconcile-sibling`);
      return response.json() as Promise<ApiResponse<SiblingImageSyncResult>>;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [`/api/admin/blog/posts/${variables.postId}/images`],
        { success: true, data: data.data.images },
      );
      if (data.data.targetPostId === variables.postId) {
        setForm(current => current ? {
          ...current,
          featuredImage: data.data.post.featuredImage || current.featuredImage,
          featuredImageAlt: data.data.post.featuredImageAlt || current.featuredImageAlt,
        } : current);
      }
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      if (data.data.status === 'synced') {
        const sourceLabel = data.data.sourceLanguage === 'en' ? 'English' : 'Spanish';
        setPairNotice(`Approved ${sourceLabel} images were synchronized automatically with the sibling draft. No new AI image request was sent.`);
      }
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Sibling images could not be synchronized');
    },
  });

  useEffect(() => {
    if (!editorOpen || !form?.id || !translationSibling || imagesQuery.isLoading) return;
    const pairKey = [form.id, translationSibling.id].sort((a, b) => a - b).join(':');
    if (reconciledImagePairRef.current === pairKey || reconcileSiblingImagesMutation.isPending) return;
    reconciledImagePairRef.current = pairKey;
    reconcileSiblingImagesMutation.mutate({ postId: form.id });
  }, [editorOpen, form?.id, translationSibling?.id, imagesQuery.isLoading]);

  const regenerateImageMutation = useMutation({
    mutationFn: async ({ postId, imageId }: { postId: number; imageId: number }) => {
      const response = await apiRequest(
        'POST',
        `/api/admin/blog/posts/${postId}/images/${imageId}/regenerate`,
        undefined,
        { 'Idempotency-Key': createBlogImageIdempotencyKey(postId) },
      );
      return response.json() as Promise<ApiResponse<BlogImageGenerationJob>>;
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: [`/api/admin/blog/posts/${variables.postId}/images/job`] });
    },
    onSuccess: (data, variables) => {
      handledImageJobIdRef.current = null;
      queryClient.setQueryData(
        [`/api/admin/blog/posts/${variables.postId}/images/job`],
        data,
      );
      setActionError(null);
    },
    onError: (error, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/posts/${variables.postId}/images/job`] });
      setActionError(error instanceof Error ? error.message : 'Image regeneration failed');
    },
  });

  const selectImageMutation = useMutation({
    mutationFn: async ({ postId, imageId }: { postId: number; imageId: number }) => {
      const response = await apiRequest('POST', `/api/admin/blog/posts/${postId}/images/${imageId}/select`);
      return response.json() as Promise<ApiResponse<BlogPostImage>>;
    },
    onSuccess: (data, variables) => {
      if (data.data.role === 'hero' && data.data.publicUrl) {
        setForm(current => current ? {
          ...current,
          featuredImage: data.data.publicUrl || current.featuredImage,
          featuredImageAlt: data.data.alt || current.featuredImageAlt,
        } : current);
      }
      refreshImages(variables.postId);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Image selection failed');
    },
  });

  const deselectImageMutation = useMutation({
    mutationFn: async ({ postId, imageId }: { postId: number; imageId: number }) => {
      const response = await apiRequest('POST', `/api/admin/blog/posts/${postId}/images/${imageId}/deselect`);
      return response.json();
    },
    onSuccess: (_data, variables) => {
      refreshImages(variables.postId);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Could not remove the inline image');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async ({ postId, imageId }: { postId: number; imageId: number }) => {
      await apiRequest('DELETE', `/api/admin/blog/posts/${postId}/images/${imageId}`);
    },
    onSuccess: (_data, variables) => {
      refreshImages(variables.postId);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Image deletion failed');
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      postId,
      status,
      confirmUnpublish,
      confirmSlug,
      redirectTargetPath,
      confirmNoRedirect,
    }: {
      postId: number;
      status: BlogStatus;
      confirmUnpublish?: boolean;
      confirmSlug?: string;
      redirectTargetPath?: string;
      confirmNoRedirect?: boolean;
    }) => {
      const response = await apiRequest('PATCH', `/api/admin/blog/posts/${postId}/status`, {
        status,
        ...(confirmUnpublish ? { confirmUnpublish } : {}),
        ...(confirmSlug ? { confirmSlug: confirmSlug.trim() } : {}),
        ...(redirectTargetPath ? { redirectTargetPath: redirectTargetPath.trim() } : {}),
        ...(confirmNoRedirect ? { confirmNoRedirect } : {}),
      });
      return response.json() as Promise<ApiResponse<BlogPost>>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      setLinkReport(data.linkReport || null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setUnpublishTarget(null);
      setUnpublishConfirmSlug('');
      setUnpublishRedirectTargetPath('');
      setUnpublishConfirmNoRedirect(false);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Status update failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      post,
      confirmSlug,
      redirectTargetPath,
      confirmNoRedirect,
    }: {
      post: BlogPost;
      confirmSlug?: string;
      redirectTargetPath?: string;
      confirmNoRedirect?: boolean;
    }) => {
      await apiRequest(
        'DELETE',
        `/api/admin/blog/posts/${post.id}`,
        post.status === 'published'
          ? {
              confirmPublishedDelete: true,
              confirmSlug: confirmSlug?.trim() || '',
              ...(redirectTargetPath ? { redirectTargetPath: redirectTargetPath.trim() } : {}),
              ...(confirmNoRedirect ? { confirmNoRedirect } : {}),
            }
          : undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setDeleteTarget(null);
      setDeleteConfirmSlug('');
      setDeleteRedirectTargetPath('');
      setDeleteConfirmNoRedirect(false);
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Delete failed');
    },
  });

  const translationMutation = useMutation({
    mutationFn: async ({ postId, refreshDraft = false }: { postId: number; refreshDraft?: boolean }) => {
      const response = await apiRequest(
        'POST',
        `/api/admin/blog/posts/${postId}/translation`,
        refreshDraft ? { refreshDraft: true } : undefined,
      );
      return response.json() as Promise<ApiResponse<{ runId: number | null; status: string }>>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Translation draft could not be queued');
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
      setLinkReport(data.linkReport || null);
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
      setLinkReport(data.data.linkReport || null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
      setActionError(null);
    },
    onError: error => {
      setActionError(error instanceof Error ? error.message : 'Fix failed');
    },
    onSettled: () => setFixingCheck(null),
  });

  const topicPlanMutation = useMutation({
    mutationFn: async (currentForm: TopicPlannerFormState) => {
      const response = await apiRequest('POST', '/api/admin/blog/topic-plan', toTopicPlannerPayload(currentForm));
      return response.json() as Promise<TopicPlanApiResponse>;
    },
    onSuccess: data => {
      setTopicPlan(data.data);
      setPlannerError(null);
    },
    onError: error => {
      setPlannerError(error instanceof Error ? error.message : 'Topic planning failed');
    },
  });

  function subscribeToAutoGenerateRun(runId: number) {
    autoGenerateEventSourceRef.current?.close();
    setAutoGenerateRunId(runId);
    setAutoGenerateStreaming(true);
    window.sessionStorage.setItem('healing-blog-auto-generate-run', String(runId));

    const eventSource = new EventSource(`/api/admin/blog/generation-runs/${encodeURIComponent(runId)}/events`);
    autoGenerateEventSourceRef.current = eventSource;

    eventSource.addEventListener('progress', event => {
      const payload = JSON.parse((event as MessageEvent).data) as { workflow: BlogGenerationWorkflow };
      setAutoGenerateWorkflow(payload.workflow);
      setAutoGenerateError(null);
    });

    eventSource.addEventListener('complete', event => {
      const data = JSON.parse((event as MessageEvent).data) as AutoGenerateApiResponse;
      setAutoGenerateWorkflow(data.workflow);
      setAutoGeneratedPost(data.data);
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      setLinkReport(data.linkReport || null);
      setAiNotes(data.ai || null);
      const targetLabel = data.translation?.targetLanguage === 'es' ? 'Spanish' : 'English';
      setPairNotice(data.translation?.message
        ? `The ${targetLabel} sibling was not queued yet: ${data.translation.message}`
        : `The ${targetLabel} sibling is ${data.translation?.state || 'queued'} and remains private until separate review and publication.`);
      setAutoGenerateError(null);
      setAutoGenerateStreaming(false);
      autoGenerateIdempotencyKeyRef.current = null;
      window.sessionStorage.removeItem('healing-blog-auto-generate-run');
      window.sessionStorage.removeItem('healing-blog-auto-generate-idempotency');
      eventSource.close();
      if (autoGenerateEventSourceRef.current === eventSource) autoGenerateEventSourceRef.current = null;
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/stats'] });
      queryClient.invalidateQueries({ predicate: query => String(query.queryKey[0]).startsWith('/api/admin/blog/posts') });
    });

    const handleTerminalFailure = async (event: Event) => {
      const payload = JSON.parse((event as MessageEvent).data) as {
        message?: string;
        workflow?: BlogGenerationWorkflow;
        postId?: number | null;
        partialSuccess?: boolean;
      };
      if (payload.workflow) setAutoGenerateWorkflow(payload.workflow);
      if (payload.postId && payload.partialSuccess) {
        try {
          const partial = await fetchJson<ApiResponse<BlogPost>>(`/api/admin/blog/posts/${payload.postId}`);
          setAutoGeneratedPost(partial.data);
          setForm(formFromPost(partial.data));
          setChecks(partial.checks || []);
          setVerification(partial.verification || null);
          setLinkReport(partial.linkReport || null);
          setAutoGenerateError('Generation stopped after saving a private draft. Open and review the recovered draft; no duplicate was created.');
        } catch {
          setAutoGenerateError(payload.message || 'Generation stopped after saving a private draft');
        }
      } else {
        setAutoGenerateError(payload.message || 'Auto generation failed');
      }
      setAutoGenerateStreaming(false);
      autoGenerateIdempotencyKeyRef.current = null;
      window.sessionStorage.removeItem('healing-blog-auto-generate-run');
      window.sessionStorage.removeItem('healing-blog-auto-generate-idempotency');
      eventSource.close();
      if (autoGenerateEventSourceRef.current === eventSource) autoGenerateEventSourceRef.current = null;
    };

    eventSource.addEventListener('failed', handleTerminalFailure);
    eventSource.addEventListener('interrupted', handleTerminalFailure);
    eventSource.onerror = () => {
      if (eventSource.readyState !== EventSource.CLOSED) {
        setAutoGenerateError('Progress connection interrupted. Reconnecting to the same run...');
      }
    };
  }

  const autoGenerateMutation = useMutation({
    mutationFn: async (currentForm: AutoGenerateFormState) => {
      const idempotencyKey = autoGenerateIdempotencyKeyRef.current
        || window.sessionStorage.getItem('healing-blog-auto-generate-idempotency')
        || crypto.randomUUID();
      autoGenerateIdempotencyKeyRef.current = idempotencyKey;
      window.sessionStorage.setItem('healing-blog-auto-generate-idempotency', idempotencyKey);
      const response = await fetch('/api/admin/blog/generation-runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        credentials: 'include',
        body: JSON.stringify(toAutoGeneratePayload(currentForm)),
      });
      const data = await response.json() as (AutoGenerateRunStartResponse & { message?: string; workflow?: BlogGenerationWorkflow; runId?: number });
      if (!response.ok || !data.success) {
        const error = new Error(data.message || 'Auto generation failed') as Error & { workflow?: BlogGenerationWorkflow; runId?: number };
        error.workflow = data.workflow;
        error.runId = data.runId;
        throw error;
      }
      return data as AutoGenerateRunStartResponse;
    },
    onSuccess: data => {
      setAutoGenerateWorkflow(data.data.workflow);
      setAutoGenerateError(null);
      subscribeToAutoGenerateRun(data.data.runId);
      setActionError(null);
    },
    onError: error => {
      const runError = error as Error & { workflow?: BlogGenerationWorkflow; runId?: number };
      const workflow = runError.workflow;
      setAutoGenerateWorkflow(workflow || null);
      setAutoGeneratedPost(null);
      if (runError.runId) {
        setAutoGenerateError('Another Auto Generate run is already active. Reconnected to that run.');
        subscribeToAutoGenerateRun(runError.runId);
      } else {
        setAutoGenerateStreaming(false);
        setAutoGenerateError(error instanceof Error ? error.message : 'Auto generation failed');
      }
    },
  });

  useEffect(() => {
    if (!authenticated || autoGenerateEventSourceRef.current) return;
    const storedRunId = window.sessionStorage.getItem('healing-blog-auto-generate-run');
    if (storedRunId) {
      setAutoGenerateOpen(true);
      const runId = Number(storedRunId);
      if (!Number.isInteger(runId) || runId <= 0) {
        window.sessionStorage.removeItem('healing-blog-auto-generate-run');
      } else {
        subscribeToAutoGenerateRun(runId);
        return;
      }
    }

    const storedIdempotencyKey = window.sessionStorage.getItem('healing-blog-auto-generate-idempotency');
    if (!storedIdempotencyKey) return;
    autoGenerateIdempotencyKeyRef.current = storedIdempotencyKey;
    void (async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          const response = await fetchJson<ApiResponse<{ id: number }>>(
            `/api/admin/blog/generation-runs/by-key?key=${encodeURIComponent(storedIdempotencyKey)}`,
          );
          setAutoGenerateOpen(true);
          subscribeToAutoGenerateRun(response.data.id);
          return;
        } catch {
          if (attempt < 5) await new Promise(resolve => window.setTimeout(resolve, 500));
        }
      }
      window.sessionStorage.removeItem('healing-blog-auto-generate-idempotency');
      autoGenerateIdempotencyKeyRef.current = null;
    })();

    return () => {
      autoGenerateEventSourceRef.current?.close();
      autoGenerateEventSourceRef.current = null;
    };
  }, [authenticated]);

  useEffect(() => () => {
    autoGenerateEventSourceRef.current?.close();
    autoGenerateEventSourceRef.current = null;
  }, []);

  const generateDraftMutation = useMutation({
    mutationFn: async (currentForm: GenerateDraftFormState) => {
      const response = await apiRequest('POST', '/api/admin/blog/generate-draft', toGenerateDraftPayload(currentForm));
      return response.json() as Promise<GenerateDraftApiResponse>;
    },
    onSuccess: data => {
      setForm(formFromPost(data.data));
      setChecks(data.checks || []);
      setVerification(data.verification || null);
      setLinkReport(data.linkReport || null);
      setAiNotes(data.ai || null);
      const targetLabel = data.translation?.targetLanguage === 'es' ? 'Spanish' : 'English';
      setPairNotice(data.translation?.message
        ? `The ${targetLabel} sibling was not queued yet: ${data.translation.message}`
        : `The ${targetLabel} sibling is ${data.translation?.state || 'queued'} and remains private until separate review and publication.`);
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
    setPairNotice(null);
    setAiNotes(null);
    setGenerateOpen(true);
  };

  const openAutoGenerate = () => {
    setAutoGenerateForm(createAutoGenerateForm(authors));
    setAutoGenerateWorkflow(null);
    setAutoGeneratedPost(null);
    setAutoGenerateError(null);
    setPairNotice(null);
    setAiNotes(null);
    if (!autoGenerateStreaming) {
      setAutoGenerateRunId(null);
    }
    setAutoGenerateOpen(true);
  };

  const openTopicPlanner = () => {
    setPlannerForm(createTopicPlannerForm());
    setTopicPlan(null);
    setPlannerError(null);
    setPlannerOpen(true);
  };

  const openNewPost = () => {
    reconciledImagePairRef.current = null;
    setForm(createEmptyForm(authors, categories));
    setChecks([]);
    setVerification(null);
    setLinkReport(null);
    setAiNotes(null);
    setActionError(null);
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    reconciledImagePairRef.current = null;
    setForm(formFromPost(post));
    setChecks([]);
    setVerification(null);
    setLinkReport(null);
    setAiNotes(null);
    setActionError(null);
    setEditorOpen(true);
  };

  const openTranslationSibling = async (siblingId: number) => {
    try {
      const response = await fetchJson<ApiResponse<BlogPost>>(`/api/admin/blog/posts/${siblingId}`);
      openEditPost(response.data);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Translation sibling could not be opened');
    }
  };

  const openPostPreview = async (post: BlogPost) => {
    const requestId = previewRequestIdRef.current + 1;
    previewRequestIdRef.current = requestId;
    setPreviewPost(null);
    setPreviewError(null);
    setPreviewLoading(true);
    setPreviewOpen(true);
    try {
      const response = await fetchJson<ApiResponse<BlogPost>>(`/api/admin/blog/posts/${post.id}/preview`);
      if (previewRequestIdRef.current !== requestId) return;
      setPreviewPost(response.data);
    } catch (error) {
      if (previewRequestIdRef.current !== requestId) return;
      setPreviewError(error instanceof Error ? error.message : 'Editorial preview could not load');
    } finally {
      if (previewRequestIdRef.current === requestId) setPreviewLoading(false);
    }
  };

  const openDeletePost = (post: BlogPost) => {
    setDeleteTarget(post);
    setDeleteConfirmSlug('');
    setDeleteRedirectTargetPath(post.status === 'published' ? getBlogIndexPath(post.language) : '');
    setDeleteConfirmNoRedirect(false);
    setActionError(null);
  };

  const closeDeleteDialog = (open: boolean) => {
    if (open || deleteMutation.isPending) return;
    setDeleteTarget(null);
    setDeleteConfirmSlug('');
    setDeleteRedirectTargetPath('');
    setDeleteConfirmNoRedirect(false);
  };

  const confirmDeletePost = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate({
      post: deleteTarget,
      confirmSlug: deleteConfirmSlug,
      redirectTargetPath: deleteConfirmNoRedirect ? '' : deleteRedirectTargetPath,
      confirmNoRedirect: deleteConfirmNoRedirect,
    });
  };

  const openUnpublishDialog = (post: BlogPostUnpublishTarget) => {
    setUnpublishTarget(post);
    setUnpublishConfirmSlug('');
    setUnpublishRedirectTargetPath(getBlogIndexPath(post.language));
    setUnpublishConfirmNoRedirect(false);
    setActionError(null);
  };

  const closeUnpublishDialog = (open: boolean) => {
    if (open || statusMutation.isPending) return;
    setUnpublishTarget(null);
    setUnpublishConfirmSlug('');
    setUnpublishRedirectTargetPath('');
    setUnpublishConfirmNoRedirect(false);
  };

  const moveCurrentToDraft = () => {
    if (!form?.id) return;
    if (form.status === 'published') {
      openUnpublishDialog({
        id: form.id,
        title: form.title,
        slug: form.slug,
        language: form.language,
        status: form.status,
      });
      return;
    }
    statusMutation.mutate({ postId: form.id, status: 'draft' });
  };

  const confirmMoveToDraft = () => {
    if (!unpublishTarget) return;
    statusMutation.mutate({
      postId: unpublishTarget.id,
      status: 'draft',
      confirmUnpublish: true,
      confirmSlug: unpublishConfirmSlug,
      redirectTargetPath: unpublishConfirmNoRedirect ? '' : unpublishRedirectTargetPath,
      confirmNoRedirect: unpublishConfirmNoRedirect,
    });
  };

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(current => current ? { ...current, [key]: value } : current);
  };

  const updateGenerateForm = <K extends keyof GenerateDraftFormState>(key: K, value: GenerateDraftFormState[K]) => {
    setGenerateForm(current => current ? { ...current, [key]: value } : current);
  };

  const updateGeneratePlanningInput = (
    updates: Partial<Pick<
      GenerateDraftFormState,
      'topic' | 'targetKeyword' | 'additionalContext' | 'language' | 'categoryId' | 'tagIds'
    >>,
  ) => {
    setGenerateForm(current => current ? {
      ...current,
      ...updates,
      internalLinks: undefined,
      internalLinkTargetIds: undefined,
      sourceRecommendationIds: undefined,
      topicCandidateId: undefined,
      topicKey: undefined,
      expertiseAngle: undefined,
      plannedStrategy: undefined,
    } : current);
  };

  const updateAutoGenerateForm = <K extends keyof AutoGenerateFormState>(key: K, value: AutoGenerateFormState[K]) => {
    setAutoGenerateForm(current => current ? { ...current, [key]: value } : current);
  };

  const generateDraft = () => {
    if (!generateForm) return;
    generateDraftMutation.mutate(generateForm);
  };

  const planTopics = () => {
    if (!plannerForm) return;
    topicPlanMutation.mutate(plannerForm);
  };

  const autoGenerateDraft = () => {
    if (!autoGenerateForm) return;
    setAutoGenerateWorkflow(null);
    setAutoGeneratedPost(null);
    setAutoGenerateRunId(null);
    setAutoGenerateError(null);
    autoGenerateMutation.mutate(autoGenerateForm);
  };

  const openAutoGeneratedDraft = () => {
    if (!autoGeneratedPost) return;
    setForm(formFromPost(autoGeneratedPost));
    setAutoGenerateOpen(false);
    setEditorOpen(true);
  };

  const openLinkIntelligenceFromEditor = () => {
    setEditorOpen(false);
    setAdminView('links');
  };

  const useTopicCandidate = (candidate: BlogTopicPlanCandidate) => {
    setGenerateForm({
      topic: candidate.topic,
      targetKeyword: candidate.targetKeyword,
      additionalContext: candidate.angle,
      language: candidate.language,
      authorId: authors[0]?.id ? String(authors[0].id) : '',
      categoryId: String(candidate.categoryId),
      tagIds: candidate.tagIds,
      internalLinks: candidate.internalLinks,
      internalLinkTargetIds: candidate.internalLinkTargetIds,
      sourceRecommendationIds: candidate.sourceRecommendationIds,
      topicCandidateId: candidate.topicCandidateId,
      topicKey: candidate.topicKey,
      expertiseAngle: candidate.angle,
      plannedStrategy: {
        contentPillar: candidate.pillar,
        patientStage: candidate.patientStage,
        contentFormat: candidate.contentFormat,
        searchIntent: candidate.searchIntent,
        topicStrategyVersion: candidate.strategyVersion,
      },
    });
    setGenerateError(null);
    setPlannerOpen(false);
    setGenerateOpen(true);
  };

  const saveCurrentForm = () => {
    if (!form) return;
    saveMutation.mutate(form);
  };

  const submitForReview = () => {
    if (!form?.id) return;
    if (form.status === 'published') return;
    statusMutation.mutate({ postId: form.id, status: 'pending_review' });
  };

  const publishCurrent = () => {
    if (!form?.id || form.status !== 'pending_review') return;
    statusMutation.mutate({ postId: form.id, status: 'published' });
  };
  const canPublishCurrent = form?.status === 'pending_review';

  const logout = async () => {
    await apiRequest('POST', '/api/admin/logout');
    await queryClient.invalidateQueries({ queryKey: ['/api/admin/session'] });
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

  const displayedAutoGenerateSteps = autoGenerateWorkflow?.steps
    || (autoGenerateMutation.isPending || autoGenerateStreaming ? autoGeneratePendingSteps : []);
  const unpublishImpact = unpublishImpactQuery.data?.data;
  const unpublishPath = unpublishImpact?.publicPath || (unpublishTarget ? getPostPath(unpublishTarget) : '');
  const deleteRedirectDecisionReady =
    !deleteTarget
    || deleteTarget.status !== 'published'
    || deleteConfirmNoRedirect
    || deleteRedirectTargetPath.trim().length > 0;
  const unpublishRedirectDecisionReady =
    !unpublishTarget
    || unpublishConfirmNoRedirect
    || unpublishRedirectTargetPath.trim().length > 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Healing Minds Psychiatry</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Blog Editorial Admin</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                className={
                  runtime === 'live'
                    ? 'bg-red-100 text-red-800'
                    : runtime === 'dev'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                }
              >
                {runtime === 'live' ? 'LIVE DATABASE' : runtime === 'dev' ? 'DEV DATABASE' : 'DATABASE UNKNOWN'}
              </Badge>
              {runtime === 'live' && (
                <span className="text-xs text-red-700">Changes affect the public site.</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
            {adminView === 'posts' && (
              <>
                <Button variant="outline" onClick={openTopicPlanner} disabled={categories.length === 0}>
                  <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                  Plan Topics
                </Button>
                <Button variant="outline" onClick={openAutoGenerate} disabled={authors.length === 0 || categories.length === 0}>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Auto Generate
                </Button>
                <Button variant="outline" onClick={openGenerateDraft} disabled={authors.length === 0 || categories.length === 0}>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  AI Generate
                </Button>
                <Button onClick={openNewPost}>
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  New Post
                </Button>
              </>
            )}
          </div>
        </header>

        <nav className="flex gap-1 py-4" aria-label="Blog admin sections">
          <Button
            variant="ghost"
            size="sm"
            className={adminView === 'posts' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}
            aria-current={adminView === 'posts' ? 'page' : undefined}
            onClick={() => setAdminView('posts')}
          >
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            Posts
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={adminView === 'links' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600'}
            aria-current={adminView === 'links' ? 'page' : undefined}
            onClick={() => setAdminView('links')}
          >
            <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Link Intelligence
          </Button>
        </nav>

        {adminView === 'posts' ? (
          <>
            <section className="grid gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    <TableHead>Translation pair</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postsQuery.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7}>Loading posts...</TableCell>
                    </TableRow>
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>No posts found.</TableCell>
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
                      <TableCell>
                        <div className="flex min-w-36 flex-col items-start gap-1">
                          <Badge variant="outline">
                            {post.translationPair?.targetLanguage.toUpperCase() || (post.language === 'en' ? 'ES' : 'EN')}: {post.translationPair?.state || 'missing'}
                          </Badge>
                          {post.translationPair?.sibling ? (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => void openTranslationSibling(post.translationPair!.sibling!.id)}
                            >
                              Open and review sibling
                            </Button>
                          ) : post.translationPair?.run?.status === 'queued' || post.translationPair?.run?.status === 'running' ? (
                            <span className="text-xs text-slate-500">Translation in progress…</span>
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              disabled={translationMutation.isPending}
                              onClick={() => translationMutation.mutate({ postId: post.id })}
                            >
                              {post.translationPair?.run?.status === 'failed' || post.translationPair?.run?.status === 'interrupted'
                                ? 'Retry translation draft'
                                : 'Generate translation draft'}
                            </Button>
                          )}
                          {post.translationPair?.sibling?.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={translationMutation.isPending}
                              onClick={() => {
                                const target = post.translationPair!.targetLanguage.toUpperCase();
                                if (window.confirm(`Replace the current ${target} draft with a fresh translation of this post? Any manual edits in that sibling draft will be overwritten.`)) {
                                  translationMutation.mutate({ postId: post.id, refreshDraft: true });
                                }
                              }}
                            >
                              Refresh sibling from this post
                            </Button>
                          )}
                          {post.translationPair?.run?.error && (
                            <span className="max-w-52 text-xs text-red-700">{post.translationPair.run.error}</span>
                          )}
                        </div>
                      </TableCell>
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
                            onClick={() => void openPostPreview(post)}
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
                            disabled={deleteMutation.isPending}
                            onClick={() => openDeletePost(post)}
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
          </>
        ) : (
          <LinkIntelligencePanel className="pb-8" enabled={linkIntelligenceEnabled} />
        )}
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={closeDeleteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete blog post</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="space-y-4">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">{deleteTarget.title || 'Untitled post'}</p>
                <p className="mt-1 text-xs text-slate-500">/{deleteTarget.slug}</p>
                <Badge className={`mt-3 ${statusClasses[deleteTarget.status]}`}>
                  {statusLabels[deleteTarget.status]}
                </Badge>
              </div>

              {deleteTarget.status === 'published' ? (
                <div className="space-y-3">
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    This post is currently live. Deleting it removes it from the blog and sitemap; create a redirect unless you intentionally want the public URL to return 404.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delete-redirect-target">Redirect old URL to</Label>
                    <Input
                      id="delete-redirect-target"
                      value={deleteRedirectTargetPath}
                      onChange={event => setDeleteRedirectTargetPath(event.target.value)}
                      placeholder={getBlogIndexPath(deleteTarget.language)}
                      disabled={deleteConfirmNoRedirect}
                    />
                    <p className="text-xs text-slate-500">Use an internal public path such as {getBlogIndexPath(deleteTarget.language)}.</p>
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-700">
                    <Checkbox
                      checked={deleteConfirmNoRedirect}
                      onCheckedChange={value => setDeleteConfirmNoRedirect(value === true)}
                    />
                    <span>I understand this URL will return 404 without a redirect.</span>
                  </label>
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm-slug">Type the exact slug to confirm</Label>
                    <Input
                      id="delete-confirm-slug"
                      value={deleteConfirmSlug}
                      onChange={event => setDeleteConfirmSlug(event.target.value)}
                      placeholder={deleteTarget.slug}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  This post is not published, so it is not visible on the public site.
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => closeDeleteDialog(false)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePost}
              disabled={
                !deleteTarget
                || deleteMutation.isPending
                || (deleteTarget.status === 'published' && deleteConfirmSlug.trim() !== deleteTarget.slug)
                || !deleteRedirectDecisionReady
              }
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(unpublishTarget)} onOpenChange={closeUnpublishDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Move published post to draft</DialogTitle>
            <DialogDescription>
              This removes the post from the public blog and sitemap without deleting it.
            </DialogDescription>
          </DialogHeader>

          {unpublishTarget && (
            <div className="space-y-4">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="font-medium">{unpublishTarget.title}</div>
                <div className="mt-1 break-all text-xs text-slate-500">{unpublishPath}</div>
                <div className="mt-2">
                  <Badge className={statusClasses[unpublishTarget.status]}>
                    {statusLabels[unpublishTarget.status]}
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                The post will leave the public blog and sitemap. Create a redirect unless you intentionally want the old public URL to return 404 while it is a draft.
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800">Published posts linking here</p>
                {unpublishImpactQuery.isLoading ? (
                  <p className="text-sm text-slate-600">Checking internal links...</p>
                ) : unpublishImpact?.linkingPosts.length ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {unpublishImpact.linkingPosts.map(post => (
                      <li key={post.id} className="rounded-md border border-slate-200 bg-white p-2">
                        <div className="font-medium">{post.title}</div>
                        <div className="break-all text-xs text-slate-500">{post.path}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">No published posts currently link to this URL.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unpublish-redirect-target">Redirect old URL to</Label>
                <Input
                  id="unpublish-redirect-target"
                  value={unpublishRedirectTargetPath}
                  onChange={event => setUnpublishRedirectTargetPath(event.target.value)}
                  placeholder={getBlogIndexPath(unpublishTarget.language)}
                  disabled={unpublishConfirmNoRedirect}
                />
                <p className="text-xs text-slate-500">Use an internal public path such as {getBlogIndexPath(unpublishTarget.language)}.</p>
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-700">
                <Checkbox
                  checked={unpublishConfirmNoRedirect}
                  onCheckedChange={value => setUnpublishConfirmNoRedirect(value === true)}
                />
                <span>I understand this URL will return 404 without a redirect.</span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="unpublish-confirm-slug">Type the exact slug to confirm</Label>
                <Input
                  id="unpublish-confirm-slug"
                  value={unpublishConfirmSlug}
                  onChange={event => setUnpublishConfirmSlug(event.target.value)}
                  placeholder={unpublishTarget.slug}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => closeUnpublishDialog(false)} disabled={statusMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmMoveToDraft}
              disabled={
                !unpublishTarget
                || statusMutation.isPending
                || unpublishConfirmSlug.trim() !== unpublishTarget.slug
                || !unpublishRedirectDecisionReady
              }
            >
              {statusMutation.isPending ? 'Moving...' : 'Move to draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={plannerOpen} onOpenChange={setPlannerOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Auto Topic Planner</DialogTitle>
            <DialogDescription>Find draft topics with overlap checks before using AI Generate.</DialogDescription>
          </DialogHeader>

          {plannerForm && (
            <div className="space-y-4">
              <div className="max-w-sm space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="planner-language">Language</Label>
                  <Select
                    value={plannerForm.language}
                    onValueChange={value => {
                      const language = value as BlogLanguage;
                      setPlannerForm(current => current ? {
                        ...current,
                        language,
                      } : current);
                      setTopicPlan(null);
                    }}
                  >
                    <SelectTrigger id="planner-language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
                The planner explores the full Healing Minds strategy automatically. Category, pillar, patient stage, and format are outputs—not required inputs.
              </div>

              {plannerError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {plannerError}
                </div>
              )}

              {topicPlan && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    {topicPlan.runId ? <Badge className="bg-blue-100 text-blue-800">Plan run #{topicPlan.runId}</Badge> : null}
                    <Badge className="bg-slate-100 text-slate-700">{topicPlan.summary.returned} shown</Badge>
                    <Badge className="bg-emerald-100 text-emerald-800">{topicPlan.summary.recommended} recommended</Badge>
                    <Badge className="bg-amber-100 text-amber-800">{topicPlan.summary.changeAngle} change angle</Badge>
                    <Badge className="bg-red-100 text-red-800">{topicPlan.summary.updateExisting} update existing</Badge>
                  </div>

                  {topicPlan.candidates.map(candidate => (
                    <div key={candidate.id} className="rounded-md border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-950">{candidate.topic}</h3>
                            <Badge className={candidate.recommendation === 'recommended' ? 'bg-emerald-100 text-emerald-800' : candidate.recommendation === 'change_angle' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                              {candidate.recommendation.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{candidate.angle}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>Score {candidate.score}</span>
                            <span>Overlap {Math.round(candidate.overlapScore * 100)}%</span>
                            <span>Novelty {candidate.noveltyScore}%</span>
                            <span>{candidate.categoryName}</span>
                            <span>{candidate.pillar.replace(/_/g, ' ')}</span>
                            <span>{candidate.patientStage.replace(/_/g, ' ')}</span>
                            <span>{candidate.contentFormat.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          disabled={authors.length === 0 || candidate.recommendation !== 'recommended' || !candidate.topicCandidateId}
                          onClick={() => useTopicCandidate(candidate)}
                        >
                          Use for Draft
                        </Button>
                      </div>

                      <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
                        <div>
                          <p className="font-medium text-slate-800">Tags</p>
                          <p>{candidate.tagNames.length ? candidate.tagNames.join(', ') : 'Manual selection needed'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Internal links</p>
                          <p>{candidate.internalLinks.join(', ')}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Sources</p>
                          <p>{candidate.research.sources.map(source => source.domain).join(', ')}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">Memory</p>
                          <p>{candidate.semanticMemory.matches[0] ? `${candidate.semanticMemory.matches[0].title} (${candidate.semanticMemory.matches[0].score})` : 'No strong overlap'}</p>
                        </div>
                      </div>

                      {candidate.riskNotes.length > 0 && (
                        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-amber-800">
                          {candidate.riskNotes.slice(0, 3).map((note, index) => (
                            <li key={`${candidate.id}-risk-${index}`}>{note}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPlannerOpen(false)}>Close</Button>
            <Button onClick={planTopics} disabled={!plannerForm || topicPlanMutation.isPending}>
              {topicPlanMutation.isPending ? 'Planning...' : 'Plan Topics'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={autoGenerateOpen} onOpenChange={setAutoGenerateOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Auto Generate Draft</DialogTitle>
            <DialogDescription>
              Choose the source language. The strategy engine creates that private draft, then queues its private sibling in the other language.
            </DialogDescription>
          </DialogHeader>

          {autoGenerateForm && (
            <div className="space-y-4">
              <div className={authors.length > 1 ? 'grid gap-4 sm:grid-cols-2' : 'space-y-2'}>
                <div className="space-y-2">
                  <Label htmlFor="auto-language">Source language</Label>
                  <Select
                    value={autoGenerateForm.language}
                    onValueChange={value => {
                      const language = value as BlogLanguage;
                      setAutoGenerateForm(current => current ? {
                        ...current,
                        language,
                      } : current);
                      setAutoGenerateWorkflow(null);
                    }}
                  >
                    <SelectTrigger id="auto-language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {authors.length > 1 && (
                  <div className="space-y-2">
                    <Label htmlFor="auto-author">Author</Label>
                    <Select value={autoGenerateForm.authorId} onValueChange={value => updateAutoGenerateForm('authorId', value)}>
                      <SelectTrigger id="auto-author"><SelectValue placeholder="Select author" /></SelectTrigger>
                      <SelectContent>
                        {authors.map(author => (
                          <SelectItem key={author.id} value={String(author.id)}>{author.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
                <p className="font-medium">The topic, category, pillar, patient stage, and article format are selected automatically.</p>
                <p className="mt-1 text-xs text-blue-800">
                  Up to two batches are checked against every existing draft and published post. If no safe topic remains, no draft is created.
                </p>
                <p className="mt-1 text-xs text-blue-800">
                  English creates an English source plus a Spanish sibling; Spanish creates a Spanish source plus an English sibling. Both stay private and publish independently.
                </p>
              </div>

              {authors.length === 0 && (
                <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
                  Add a clinical blog author before starting Auto Generate.
                </div>
              )}

              {displayedAutoGenerateSteps.length > 0 && (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4" role="status" aria-live="polite">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-950">Workflow</h3>
                      {autoGenerateRunId && <p className="text-xs text-slate-500">Run {autoGenerateRunId}</p>}
                    </div>
                    {autoGenerateWorkflow?.selectedCandidate && (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {autoGenerateWorkflow.selectedCandidate.recommendation.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>

                  {autoGenerateWorkflow?.selectedCandidate && (
                    <div className="mt-3 rounded-md bg-white p-3 text-xs text-slate-700">
                      <p className="font-medium text-slate-900">{autoGenerateWorkflow.selectedCandidate.topic}</p>
                      <p className="mt-1">{autoGenerateWorkflow.selectedCandidate.angle}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-slate-500">
                        <span>Score {autoGenerateWorkflow.selectedCandidate.score}</span>
                        <span>Overlap {Math.round(autoGenerateWorkflow.selectedCandidate.overlapScore * 100)}%</span>
                        <span>{autoGenerateWorkflow.selectedCandidate.categoryName}</span>
                        <span>{autoGenerateWorkflow.selectedCandidate.pillar.replace(/_/g, ' ')}</span>
                        <span>{autoGenerateWorkflow.selectedCandidate.patientStage.replace(/_/g, ' ')}</span>
                        <span>{autoGenerateWorkflow.selectedCandidate.contentFormat.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="mt-2 text-slate-600">{autoGenerateWorkflow.selectedCandidate.rationale}</p>
                    </div>
                  )}

                  <div className="mt-3 space-y-2">
                    {displayedAutoGenerateSteps.map(step => (
                      <div key={step.id} className="flex items-start gap-2 text-sm">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden="true" />
                        ) : step.status === 'in_progress' ? (
                          <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
                        ) : step.status === 'failed' ? (
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" aria-hidden="true" />
                        ) : (
                          <div className="mt-1 h-3 w-3 rounded-full border border-slate-300" aria-hidden="true" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={step.status === 'completed' ? 'text-slate-800' : step.status === 'failed' ? 'text-red-700' : step.status === 'in_progress' ? 'text-blue-800' : 'text-slate-500'}>{step.label}</p>
                          {step.detail && <p className="break-words text-xs text-slate-500">{step.detail}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {autoGeneratedPost && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-950">Draft created</p>
                      <p className="mt-1 text-sm text-emerald-900">{autoGeneratedPost.title}</p>
                      <p className="mt-1 text-xs text-emerald-800">
                        Status: {autoGeneratedPost.status}; public URL stays private until human review and publish approval.
                      </p>
                    </div>
                    {verification && (
                      <Badge className={verification.isReady ? 'bg-white text-emerald-800' : 'bg-white text-amber-800'}>
                        Verification {verification.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {autoGenerateError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {autoGenerateError}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAutoGenerateOpen(false)}>Cancel</Button>
            {autoGeneratedPost && (
              <Button variant="outline" onClick={openAutoGeneratedDraft}>
                Open Draft
              </Button>
            )}
            <Button
              onClick={autoGenerateDraft}
              disabled={authors.length === 0 || (authors.length > 1 && !autoGenerateForm?.authorId) || autoGenerateMutation.isPending || autoGenerateStreaming}
            >
              {autoGenerateMutation.isPending || autoGenerateStreaming ? 'Auto generating...' : 'Auto Generate Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Article Generator</DialogTitle>
            <DialogDescription>Give the source topic and language. The full research and verification flow creates that private draft, then queues its private sibling in the other language.</DialogDescription>
          </DialogHeader>

          {generateForm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-topic">Topic</Label>
                <Input
                  id="ai-topic"
                  value={generateForm.topic}
                  placeholder="e.g., Anxiety treatment options in Naples"
                  onChange={event => updateGeneratePlanningInput({ topic: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-keyword">Target keyword</Label>
                <Input
                  id="ai-keyword"
                  value={generateForm.targetKeyword}
                  placeholder="Optional"
                  onChange={event => updateGeneratePlanningInput({ targetKeyword: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-context">Additional context</Label>
                <Textarea
                  id="ai-context"
                  value={generateForm.additionalContext}
                  rows={4}
                  placeholder="Angle, local focus, or points to include. Do not include patient-identifying information."
                  onChange={event => updateGeneratePlanningInput({ additionalContext: event.target.value })}
                />
                <p className="text-xs text-slate-500">Do not paste patient names, emails, phone numbers, dates of birth, or private clinical details. This free text is used locally for safe source and outline selection and is never sent verbatim to the AI provider.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ai-language">Source language</Label>
                  <Select
                    value={generateForm.language}
                    onValueChange={value => {
                      const language = value as BlogLanguage;
                      const category = categories.find(item => item.language === language);
                      updateGeneratePlanningInput({
                        language,
                        categoryId: category ? String(category.id) : '',
                        tagIds: [],
                      });
                    }}
                  >
                    <SelectTrigger id="ai-language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-author">Author</Label>
                  <Select value={generateForm.authorId} onValueChange={value => updateGenerateForm('authorId', value)}>
                    <SelectTrigger id="ai-author"><SelectValue placeholder="Select author" /></SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author.id} value={String(author.id)}>{author.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-category">Category</Label>
                <Select
                  value={generateForm.categoryId}
                  onValueChange={value => updateGeneratePlanningInput({ categoryId: value })}
                >
                  <SelectTrigger id="ai-category"><SelectValue placeholder="Select category" /></SelectTrigger>
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
                          const tagIds = checked
                            ? Array.from(new Set([...generateForm.tagIds, tag.id]))
                            : generateForm.tagIds.filter(id => id !== tag.id);
                          updateGeneratePlanningInput({ tagIds });
                        }}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
              {(generateForm.internalLinkTargetIds?.length || generateForm.sourceRecommendationIds?.length) ? (
                <p className="text-xs text-slate-500">
                  Planner link recommendations are revalidated by the server. Editing the topic,
                  language, category, context, keyword, or tags clears them so stale links are not reused.
                </p>
              ) : null}
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
          {pairNotice && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900" role="status">
              {pairNotice}
            </div>
          )}

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
                          metaTitle: current.metaTitle || truncateSeoText(title, 60),
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
                    <Input id="meta-title" value={form.metaTitle} maxLength={60} onChange={event => updateForm('metaTitle', event.target.value)} />
                    <p className="text-xs text-slate-500">{form.metaTitle.length}/60</p>
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
                    {form.featuredImage && (
                      <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        <img
                          src={form.featuredImage}
                          alt={form.featuredImageAlt || 'Featured image preview'}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featured-alt">Featured image alt text</Label>
                    <Input id="featured-alt" value={form.featuredImageAlt} onChange={event => updateForm('featuredImageAlt', event.target.value)} />
                  </div>
                </div>

                <section className="space-y-4 rounded-xl bg-slate-50/80 p-4 sm:p-5" aria-labelledby="blog-images-heading">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 id="blog-images-heading" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <ImageIcon className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        Reviewed image variants
                      </h3>
                      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                        The current curated hero stays selected until you explicitly choose a completed AI candidate.
                        Inline images are placed after their saved heading without changing article HTML. Approved images stay synchronized automatically with a sibling draft, without another AI generation request.
                      </p>
                    </div>
                    {form.id && form.status === 'draft' && (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!imageConfig?.enabled || imageJobQuery.isLoading || generateImagesMutation.isPending || imageJobActive}
                          onClick={() => generateImagesMutation.mutate({ postId: form.id!, role: 'hero' })}
                        >
                          Hero
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!imageConfig?.enabled || imageJobQuery.isLoading || generateImagesMutation.isPending || imageJobActive}
                          onClick={() => generateImagesMutation.mutate({ postId: form.id!, role: 'inline' })}
                        >
                          Inline
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!imageConfig?.enabled || imageJobQuery.isLoading || generateImagesMutation.isPending || imageJobActive}
                          onClick={() => generateImagesMutation.mutate({ postId: form.id!, role: 'all' })}
                        >
                          {generateImagesMutation.isPending || imageJobActive
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Sparkles className="mr-2 h-4 w-4" />}
                          {imageJobActive ? 'Generating safely' : 'Generate set'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {!form.id ? (
                    <p className="text-xs text-slate-600">Save the draft first to create image variants.</p>
                  ) : form.status !== 'draft' ? (
                    <p className="text-xs text-amber-800">Image variants are read-only after the draft leaves draft status.</p>
                  ) : !imageConfig?.enabled ? (
                    <p className="text-xs text-amber-800">
                      AI images are disabled. Set BLOG_IMAGE_ENABLED=true and connect Vercel Blob for a real smoke test.
                    </p>
                  ) : null}

                  {imageJobActive && (
                    <p className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-800" aria-live="polite">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Images are continuing safely in the background. Completed {imageJob?.result?.completed || 0} of {imageJob?.result?.total || 0}; this button will not launch a duplicate paid request.
                    </p>
                  )}

                  {imageJob && !imageJobActive && (imageJob.status === 'partial_failed' || imageJob.status === 'failed') && (
                    <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900" role="status">
                      {imageJob.status === 'partial_failed'
                        ? 'Some image candidates completed and are ready for review; at least one slot failed safely.'
                        : imageJob.result?.errorMessage || 'The image request finished without a completed candidate. No automatic duplicate request was sent.'}
                    </p>
                  )}

                  {form.id && imagesQuery.isLoading && (
                    <p className="flex items-center gap-2 text-xs text-slate-600">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading image variants...
                    </p>
                  )}

                  {form.id && !imagesQuery.isLoading && images.length === 0 && (
                    <p className="text-xs text-slate-600">No variants are registered yet. The existing featured image remains the fallback.</p>
                  )}

                  {images.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {images.map(image => {
                        const mutationBusy = generateImagesMutation.isPending
                          || imageJobQuery.isLoading
                          || imageJobActive
                          || regenerateImageMutation.isPending
                          || selectImageMutation.isPending
                          || deselectImageMutation.isPending
                          || deleteImageMutation.isPending
                          || reconcileSiblingImagesMutation.isPending;
                        return (
                          <article key={image.id} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70">
                            {image.publicUrl ? (
                              <img
                                src={image.publicUrl}
                                alt={image.alt || `${image.role} image candidate`}
                                className="aspect-[3/2] w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex aspect-[3/2] items-center justify-center bg-slate-100 text-slate-500">
                                {image.generationStatus === 'generating'
                                  ? <Loader2 className="h-5 w-5 animate-spin" />
                                  : <ImageIcon className="h-5 w-5" />}
                              </div>
                            )}
                            <div className="space-y-3 p-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">{image.slot}</Badge>
                                <Badge className={image.reviewStatus === 'selected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}>
                                  {image.reviewStatus}
                                </Badge>
                                <span className="text-[11px] text-slate-500">{image.source} - {image.generationStatus}</span>
                              </div>
                              {image.anchorHeading && (
                                <p className="text-xs leading-relaxed text-slate-600">After: {image.anchorHeading}</p>
                              )}
                              {image.errorMessage && (
                                <p className="text-xs leading-relaxed text-red-700">{image.errorMessage}</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {image.generationStatus === 'completed' && image.reviewStatus !== 'selected' && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={form.status !== 'draft' || mutationBusy}
                                    onClick={() => selectImageMutation.mutate({ postId: form.id!, imageId: image.id })}
                                  >
                                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Select
                                  </Button>
                                )}
                                {image.source === 'ai' && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={form.status !== 'draft' || !imageConfig?.enabled || mutationBusy}
                                    onClick={() => regenerateImageMutation.mutate({ postId: form.id!, imageId: image.id })}
                                  >
                                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
                                  </Button>
                                )}
                                {image.role === 'inline' && image.reviewStatus === 'selected' && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={form.status !== 'draft' || mutationBusy}
                                    onClick={() => deselectImageMutation.mutate({ postId: form.id!, imageId: image.id })}
                                  >
                                    Remove from article
                                  </Button>
                                )}
                                {image.source === 'ai'
                                  && image.generationStatus !== 'generating'
                                  && image.reviewStatus !== 'selected'
                                  && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                                    disabled={form.status !== 'draft' || mutationBusy}
                                    onClick={() => {
                                      if (window.confirm('Delete this image variant and its physical Vercel Blob object?')) {
                                        deleteImageMutation.mutate({ postId: form.id!, imageId: image.id });
                                      }
                                    }}
                                  >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
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
                        {linkReport && (
                          <PostLinkReportCard
                            report={linkReport}
                            onOpenLinkIntelligence={openLinkIntelligenceFromEditor}
                          />
                        )}
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
                {form.status !== 'published' && (
                  <Button variant="outline" onClick={submitForReview} disabled={statusMutation.isPending || imageJobActive}>
                    Submit review
                  </Button>
                )}
                <Button variant="outline" onClick={moveCurrentToDraft} disabled={statusMutation.isPending || imageJobActive}>
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
            {form?.id && form.status !== 'published' && (
              <Button
                onClick={publishCurrent}
                disabled={statusMutation.isPending || imageJobActive || !canPublishCurrent}
                title={imageJobActive ? 'Wait for image generation to finish' : canPublishCurrent ? undefined : 'Submit review before publishing'}
              >
                Publish
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={previewOpen}
        onOpenChange={open => {
          setPreviewOpen(open);
          if (!open) {
            previewRequestIdRef.current += 1;
            setPreviewPost(null);
            setPreviewError(null);
            setPreviewLoading(false);
          }
        }}
      >
        <DialogContent className="max-h-[92vh] max-w-5xl gap-0 overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Editorial article preview</DialogTitle>
            <DialogDescription>
              Preview of the saved draft using the same article renderer and selected images as the public blog.
            </DialogDescription>
          </DialogHeader>

          <div className="border-b border-emerald-100 bg-white px-5 py-3 pr-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-emerald-950">Editorial preview</span>
              {previewPost && (
                <Badge className={statusClasses[previewPost.status]}>{statusLabels[previewPost.status]}</Badge>
              )}
              <span className="text-xs text-slate-500">Nothing is published from this window.</span>
            </div>
          </div>

          <div className="max-h-[calc(92vh-3.25rem)] overflow-y-auto bg-white">
            {previewLoading && (
              <div className="flex min-h-80 items-center justify-center gap-3 text-sm text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading the complete article preview...
              </div>
            )}

            {previewError && (
              <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {previewError === '401' ? 'Your admin session expired. Sign in again to preview this post.' : previewError}
              </div>
            )}

            {previewPost && !previewLoading && (
              <article>
                <section className="border-b border-green-100 bg-green-50">
                  <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
                    <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                      <span className="font-semibold text-green-800">
                        {previewPost.category?.name || 'Mental Health'}
                      </span>
                      <span>{previewPost.readingTime || 5} min read</span>
                      <span>{previewPost.language.toUpperCase()}</span>
                    </div>
                    <h1 className="mb-5 font-body text-3xl font-bold leading-tight text-green-950 sm:text-5xl">
                      {previewPost.title}
                    </h1>
                    {previewPost.excerpt && (
                      <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
                        {previewPost.excerpt}
                      </p>
                    )}
                    {previewPost.author && (
                      <p className="mt-5 text-sm font-semibold text-green-900">
                        {previewPost.author.name}{previewPost.author.title ? `, ${previewPost.author.title}` : ''}
                      </p>
                    )}
                  </div>
                </section>

                <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
                  {previewPost.featuredImage && (
                    <img
                      src={previewPost.featuredImage}
                      alt={previewPost.featuredImageAlt || previewPost.title}
                      className="mb-10 aspect-[16/9] w-full rounded-lg object-cover"
                    />
                  )}
                  <div
                    className="blog-article"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                  {previewPost.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-2 border-t border-green-100 pt-7">
                      {previewPost.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
