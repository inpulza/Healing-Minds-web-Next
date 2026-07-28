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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  BlogLinkKind,
  BlogLinkLanguage,
  BlogLinkSourceType,
} from "./link-intelligence-types";

export type AddManagedLinkForm = {
  kind: BlogLinkKind;
  href: string;
  title: string;
  label: string;
  language: BlogLinkLanguage;
  sourceName: string;
  sourceType: BlogLinkSourceType;
  sourceCategory: string;
  topicTerms: string;
  summary: string;
};

export const EMPTY_MANAGED_LINK_FORM: AddManagedLinkForm = {
  kind: "external",
  href: "",
  title: "",
  label: "",
  language: "en",
  sourceName: "",
  sourceType: "other",
  sourceCategory: "institutional",
  topicTerms: "",
  summary: "",
};

type AddManagedLinkDialogProps = {
  open: boolean;
  form: AddManagedLinkForm;
  isPending: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: AddManagedLinkForm) => void;
  onSubmit: (form: AddManagedLinkForm) => void;
};

export function AddManagedLinkDialog({
  open,
  form,
  isPending,
  error,
  onOpenChange,
  onFormChange,
  onSubmit,
}: AddManagedLinkDialogProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.href.trim() || !form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={nextOpen => {
      if (!nextOpen && isPending) return;
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add a managed link</DialogTitle>
            <DialogDescription>
              New external links remain pending and unavailable to AI until a human approves them.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-link-kind">Kind</Label>
              <Select
                value={form.kind}
                onValueChange={value => onFormChange({ ...form, kind: value as BlogLinkKind })}
              >
                <SelectTrigger id="new-link-kind"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External medical source</SelectItem>
                  <SelectItem value="internal">Internal destination</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-link-language">Language</Label>
              <Select
                value={form.language}
                onValueChange={value => onFormChange({ ...form, language: value as BlogLinkLanguage })}
              >
                <SelectTrigger id="new-link-language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="all">All languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-link-href">{form.kind === "internal" ? "Public path" : "Exact HTTPS URL"}</Label>
              <Input
                id="new-link-href"
                value={form.href}
                onChange={event => onFormChange({ ...form, href: event.target.value })}
                placeholder={form.kind === "internal" ? "/services" : "https://www.nimh.nih.gov/health/topics/..."}
                autoComplete="off"
                required
              />
              <p className="text-xs text-slate-500">
                Tracking parameters and fragments are normalized by the server. Private and admin targets are rejected.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-link-title">Title</Label>
              <Input
                id="new-link-title"
                value={form.title}
                onChange={event => onFormChange({ ...form, title: event.target.value })}
                placeholder="Human-readable page title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-link-label">Preferred label</Label>
              <Input
                id="new-link-label"
                value={form.label}
                onChange={event => onFormChange({ ...form, label: event.target.value })}
                placeholder="Optional anchor guidance"
              />
            </div>
            {form.kind === "external" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-link-source-name">Publisher name</Label>
                  <Input
                    id="new-link-source-name"
                    value={form.sourceName}
                    onChange={event => onFormChange({ ...form, sourceName: event.target.value })}
                    placeholder="National Institute of Mental Health"
                  />
                  <p className="text-xs text-slate-500">
                    Used when this domain is first added to the publisher library.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-link-source-type">Publisher type</Label>
                  <Select
                    value={form.sourceType}
                    onValueChange={value => onFormChange({
                      ...form,
                      sourceType: value as BlogLinkSourceType,
                    })}
                  >
                    <SelectTrigger id="new-link-source-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="professional_guideline">Professional guideline</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="health_system">Health system</SelectItem>
                      <SelectItem value="crisis">Crisis resource</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-link-category">Source category</Label>
              <Input
                id="new-link-category"
                value={form.sourceCategory}
                onChange={event => onFormChange({ ...form, sourceCategory: event.target.value })}
                placeholder="institutional"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-link-topic-terms">Topic terms</Label>
              <Input
                id="new-link-topic-terms"
                value={form.topicTerms}
                onChange={event => onFormChange({ ...form, topicTerms: event.target.value })}
                placeholder="anxiety, panic attacks, treatment options"
              />
              <p className="text-xs text-slate-500">
                Comma-separated terms let the planner match this reviewed page to the right article.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="new-link-summary">Evidence scope</Label>
              <Textarea
                id="new-link-summary"
                value={form.summary}
                onChange={event => onFormChange({ ...form, summary: event.target.value })}
                placeholder="What this exact page can support. Do not paste patient information."
                rows={3}
              />
            </div>
          </div>
          {error && (
            <p className="mb-4 text-sm text-rose-700" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !form.href.trim() || !form.title.trim()}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Save as pending
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
