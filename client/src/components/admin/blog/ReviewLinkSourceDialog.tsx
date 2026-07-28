import { type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type BlogLinkReviewStatus,
  type BlogLinkSource,
  type BlogLinkSourceQualityBreakdown,
} from "./link-intelligence-types";

type SourceReviewDecision = Exclude<BlogLinkReviewStatus, "pending">;

export type ReviewLinkSourceForm = {
  reviewStatus: SourceReviewDecision;
  reviewNotes: string;
  languages: Array<"en" | "es">;
  qualityBreakdown: BlogLinkSourceQualityBreakdown;
};

type QualityField = {
  key: keyof BlogLinkSourceQualityBreakdown;
  label: string;
  description: string;
  max: number;
};

const QUALITY_FIELDS: readonly QualityField[] = [
  {
    key: "accountablePublisher",
    label: "Accountable publisher",
    description: "Ownership, contact details and editorial accountability are clear.",
    max: 25,
  },
  {
    key: "expertReview",
    label: "Expert review",
    description: "Relevant clinical or subject-matter review is identifiable.",
    max: 25,
  },
  {
    key: "traceableEvidence",
    label: "Traceable evidence",
    description: "Claims point to primary evidence, guidance or transparent references.",
    max: 20,
  },
  {
    key: "currency",
    label: "Currency",
    description: "Publication and review dates support current use.",
    max: 15,
  },
  {
    key: "fundingTransparency",
    label: "Funding transparency",
    description: "Funding, sponsorship and conflicts are disclosed.",
    max: 10,
  },
  {
    key: "stableIdentifier",
    label: "Stable identifier",
    description: "The publisher provides a durable URL, DOI or equivalent identifier.",
    max: 5,
  },
] as const;

export function createSourceReviewForm(source: BlogLinkSource): ReviewLinkSourceForm {
  const current = source.qualityBreakdown || {};
  const status = source.reviewStatus;
  return {
    reviewStatus: status === "approved" || status === "blocked" || status === "retired"
      ? status
      : "approved",
    reviewNotes: source.reviewNotes || "",
    languages: source.languages || [],
    qualityBreakdown: {
      accountablePublisher: current.accountablePublisher ?? 0,
      expertReview: current.expertReview ?? 0,
      traceableEvidence: current.traceableEvidence ?? 0,
      currency: current.currency ?? 0,
      fundingTransparency: current.fundingTransparency ?? 0,
      stableIdentifier: current.stableIdentifier ?? 0,
    },
  };
}

type ReviewLinkSourceDialogProps = {
  open: boolean;
  source: BlogLinkSource | null;
  form: ReviewLinkSourceForm | null;
  isPending: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: ReviewLinkSourceForm) => void;
  onSubmit: (form: ReviewLinkSourceForm) => void;
};

export function ReviewLinkSourceDialog({
  open,
  source,
  form,
  isPending,
  error,
  onOpenChange,
  onFormChange,
  onSubmit,
}: ReviewLinkSourceDialogProps) {
  const total = form
    ? Object.values(form.qualityBreakdown).reduce((sum, value) => sum + value, 0)
    : 0;
  const requiresNotes = form?.reviewStatus === "blocked" || form?.reviewStatus === "retired";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || form.languages.length === 0 || (requiresNotes && !form.reviewNotes.trim())) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={nextOpen => {
      if (!nextOpen && isPending) return;
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {source && form ? (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>Review external publisher</DialogTitle>
              <DialogDescription>
                Score the publisher separately from the exact page. Approval alone does not make its links
                eligible for AI use.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-5">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-medium text-slate-950">{source.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {source.canonicalDomain || "Canonical domain not recorded"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="source-review-status">Editorial decision</Label>
                  <Select
                    value={form.reviewStatus}
                    onValueChange={value => onFormChange({
                      ...form,
                      reviewStatus: value as SourceReviewDecision,
                    })}
                  >
                    <SelectTrigger id="source-review-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve publisher</SelectItem>
                      <SelectItem value="blocked">Block publisher</SelectItem>
                      <SelectItem value="retired">Retire publisher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md bg-slate-950 px-4 py-2 text-white">
                  <p className="text-xs text-slate-300">Quality score</p>
                  <p className="text-xl font-semibold tabular-nums">{total}/100</p>
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-slate-950">Reviewed publishing languages</legend>
                <p className="text-xs text-slate-500">
                  Select only languages for which this publisher has an exact reviewed page in the library.
                </p>
                <div className="flex flex-wrap gap-4">
                  {(["en", "es"] as const).map(language => (
                    <label key={language} className="flex items-center gap-2 text-sm text-slate-700">
                      <Checkbox
                        checked={form.languages.includes(language)}
                        onCheckedChange={checked => onFormChange({
                          ...form,
                          languages: checked
                            ? Array.from(new Set([...form.languages, language]))
                            : form.languages.filter(value => value !== language),
                        })}
                      />
                      {language === "en" ? "English" : "Spanish"}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-slate-950">Explainable quality breakdown</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {QUALITY_FIELDS.map(field => (
                    <div key={field.key} className="space-y-2 rounded-md bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor={`source-quality-${field.key}`}>{field.label}</Label>
                        <span className="text-xs text-slate-500">max {field.max}</span>
                      </div>
                      <Input
                        id={`source-quality-${field.key}`}
                        type="number"
                        min={0}
                        max={field.max}
                        step={1}
                        inputMode="numeric"
                        value={form.qualityBreakdown[field.key]}
                        onChange={event => {
                          const nextValue = Number(event.target.value);
                          onFormChange({
                            ...form,
                            qualityBreakdown: {
                              ...form.qualityBreakdown,
                              [field.key]: Number.isFinite(nextValue)
                                ? Math.min(field.max, Math.max(0, Math.trunc(nextValue)))
                                : 0,
                            },
                          });
                        }}
                      />
                      <p className="text-xs leading-5 text-slate-500">{field.description}</p>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="source-review-notes">
                  Review notes {requiresNotes ? "(required)" : "(recommended)"}
                </Label>
                <Textarea
                  id="source-review-notes"
                  value={form.reviewNotes}
                  onChange={event => onFormChange({ ...form, reviewNotes: event.target.value })}
                  placeholder="Record the evidence behind this publisher decision."
                  rows={3}
                />
              </div>

              {error && (
                <p className="text-sm text-rose-700" role="alert">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || form.languages.length === 0 || (requiresNotes && !form.reviewNotes.trim())}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Save publisher review
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
