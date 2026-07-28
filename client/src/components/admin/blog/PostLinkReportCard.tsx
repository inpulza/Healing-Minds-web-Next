import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPostLinkReport } from "./link-intelligence-types";

type PostLinkReportCardProps = {
  report: BlogPostLinkReport;
  onOpenLinkIntelligence: () => void;
};

export function PostLinkReportCard({
  report,
  onOpenLinkIntelligence,
}: PostLinkReportCardProps) {
  if (!report.enabled) return null;

  const hasBlockers = report.blockers.length > 0;
  const hasWarnings = report.warnings.length > 0;
  const visibleChecks = report.checks.slice(0, 6);
  const hiddenCheckCount = Math.max(0, report.checks.length - visibleChecks.length);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-slate-900">Managed link review</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {report.usages.length} active link{report.usages.length === 1 ? "" : "s"} found in the saved article.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hasBlockers && (
            <Badge className="bg-red-100 text-red-800">
              {report.blockers.length} blocker{report.blockers.length === 1 ? "" : "s"}
            </Badge>
          )}
          {hasWarnings && (
            <Badge className="bg-amber-100 text-amber-800">
              {report.warnings.length} warning{report.warnings.length === 1 ? "" : "s"}
            </Badge>
          )}
          {!hasBlockers && !hasWarnings && (
            <Badge className="bg-emerald-100 text-emerald-800">
              {report.usages.length > 0 ? "Links ready" : "No managed links"}
            </Badge>
          )}
        </div>
      </div>

      {visibleChecks.length > 0 ? (
        <div className="mt-3 space-y-2">
          {visibleChecks.map(check => (
            <div key={check.id} className="flex items-start gap-2 text-xs">
              <AlertTriangle
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                  check.severity === "blocking" ? "text-red-600" : "text-amber-600"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className={check.severity === "blocking" ? "font-medium text-red-800" : "font-medium text-amber-800"}>
                  {check.label}
                </p>
                <p className="break-words text-slate-600">{check.detail}</p>
                <p className="break-all text-slate-500">{check.href}</p>
              </div>
            </div>
          ))}
          {hiddenCheckCount > 0 && (
            <p className="text-xs text-slate-500">
              {hiddenCheckCount} more issue{hiddenCheckCount === 1 ? "" : "s"} available in Link Intelligence.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 flex items-start gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <p>
            {report.usages.length > 0
              ? "Every saved link passed the current approval, health, language, and source checks."
              : "No managed links are present yet. Use Link Intelligence to review opportunities before publication."}
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 h-8 text-xs"
        onClick={onOpenLinkIntelligence}
      >
        Open Link Intelligence
      </Button>
    </div>
  );
}
