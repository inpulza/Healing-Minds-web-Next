import { type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import type { ManagedBlogLink } from "./link-intelligence-types";

export type EditLinkScoresForm = {
  title: string;
  label: string;
  sourceCategory: string;
  topicTerms: string;
  summary: string;
  evidenceType: string;
  evidenceScope: string;
  evidenceScore: number;
  freshnessScore: number;
};

export function createLinkScoresForm(link: ManagedBlogLink): EditLinkScoresForm {
  const topicTerms = Array.from(new Set([
    ...(link.topicTags || []),
    ...(link.keywords || []),
  ]));
  return {
    title: link.title,
    label: link.label || link.title,
    sourceCategory: link.sourceCategory || "",
    topicTerms: topicTerms.join(", "),
    summary: link.summary || "",
    evidenceType: link.evidenceType || "",
    evidenceScope: link.evidenceScope || "",
    evidenceScore: link.evidenceScore ?? 0,
    freshnessScore: link.freshnessScore ?? 0,
  };
}

type EditLinkScoresDialogProps = {
  open: boolean;
  link: ManagedBlogLink | null;
  form: EditLinkScoresForm | null;
  isPending: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: EditLinkScoresForm) => void;
  onSubmit: (form: EditLinkScoresForm) => void;
};

function normalizeScore(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.trunc(parsed))) : 0;
}

export function EditLinkScoresDialog({
  open,
  link,
  form,
  isPending,
  error,
  onOpenChange,
  onFormChange,
  onSubmit,
}: EditLinkScoresDialogProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form) onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={nextOpen => {
      if (!nextOpen && isPending) return;
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {link && form ? (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>Edit the exact page</DialogTitle>
              <DialogDescription>
                Record what this exact page covers and how the planner should match it. Publisher quality and
                technical health remain separate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-5">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="font-medium text-slate-950">{link.title}</p>
                <p className="mt-1 break-all text-xs text-slate-500">
                  {link.displayHref || link.normalizedHref}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="link-page-title">Page title</Label>
                  <Input
                    id="link-page-title"
                    value={form.title}
                    onChange={event => onFormChange({ ...form, title: event.target.value })}
                    minLength={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-page-label">Preferred anchor label</Label>
                  <Input
                    id="link-page-label"
                    value={form.label}
                    onChange={event => onFormChange({ ...form, label: event.target.value })}
                    minLength={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-page-category">Source category</Label>
                  <Input
                    id="link-page-category"
                    value={form.sourceCategory}
                    onChange={event => onFormChange({ ...form, sourceCategory: event.target.value })}
                    placeholder="institutional, clinical or crisis"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-page-evidence-type">Evidence type</Label>
                  <Input
                    id="link-page-evidence-type"
                    value={form.evidenceType}
                    onChange={event => onFormChange({ ...form, evidenceType: event.target.value })}
                    placeholder="patient_education or clinical_guidance"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-page-topic-terms">Topic terms</Label>
                <Input
                  id="link-page-topic-terms"
                  value={form.topicTerms}
                  onChange={event => onFormChange({ ...form, topicTerms: event.target.value })}
                  placeholder="anxiety, panic attacks, treatment options"
                />
                <p className="text-xs leading-5 text-slate-500">
                  Comma-separated terms are matched deterministically; they are not free-form URLs.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-page-summary">Page summary</Label>
                <Textarea
                  id="link-page-summary"
                  value={form.summary}
                  onChange={event => onFormChange({ ...form, summary: event.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-page-evidence-scope">Evidence scope</Label>
                <Textarea
                  id="link-page-evidence-scope"
                  value={form.evidenceScope}
                  onChange={event => onFormChange({ ...form, evidenceScope: event.target.value })}
                  placeholder="Claims this exact page can directly support."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="link-evidence-score">Exact-page evidence</Label>
                  <span className="text-xs text-slate-500">0–100</span>
                </div>
                <Input
                  id="link-evidence-score"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  inputMode="numeric"
                  value={form.evidenceScore}
                  onChange={event => onFormChange({
                    ...form,
                    evidenceScore: normalizeScore(event.target.value),
                  })}
                />
                <p className="text-xs leading-5 text-slate-500">
                  How directly this exact page supports its recorded evidence scope.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="link-freshness-score">Freshness</Label>
                  <span className="text-xs text-slate-500">0–100</span>
                </div>
                <Input
                  id="link-freshness-score"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  inputMode="numeric"
                  value={form.freshnessScore}
                  onChange={event => onFormChange({
                    ...form,
                    freshnessScore: normalizeScore(event.target.value),
                  })}
                />
                <p className="text-xs leading-5 text-slate-500">
                  Whether the page and its cited guidance are current enough for the intended medical use.
                </p>
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
                disabled={isPending || form.title.trim().length < 2 || form.label.trim().length < 2}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Save exact page
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
