import { BarChart3, Library, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { InternalLinkOpportunities } from "./InternalLinkOpportunities";
import { LinkLibraryView } from "./LinkLibraryView";
import { LinkOverview } from "./LinkOverview";

type LinkIntelligencePanelProps = {
  enabled?: boolean;
  className?: string;
};

export function LinkIntelligencePanel({ enabled = true, className }: LinkIntelligencePanelProps) {
  return (
    <section className={cn("space-y-6", className)} aria-labelledby="link-intelligence-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <h1 id="link-intelligence-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
            Link Intelligence
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review approved sources, inspect the links actually present in saved articles, and find internal
            opportunities without changing published copy automatically.
          </p>
        </div>
        <Badge
          variant="outline"
          className={enabled
            ? "w-fit border-emerald-200 bg-emerald-50 text-emerald-800"
            : "w-fit border-slate-200 bg-slate-50 text-slate-700"}
        >
          {enabled ? "Link Intelligence enabled" : "Feature flag off"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-1 bg-slate-100 p-1 sm:grid-cols-3 lg:w-fit lg:min-w-[560px]">
          <TabsTrigger value="overview" className="justify-start sm:justify-center">
            <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="library" className="justify-start sm:justify-center">
            <Library className="mr-2 h-4 w-4" aria-hidden="true" />
            Library
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="justify-start sm:justify-center">
            <Network className="mr-2 h-4 w-4" aria-hidden="true" />
            Internal opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <LinkOverview enabled={enabled} />
        </TabsContent>
        <TabsContent value="library">
          <LinkLibraryView enabled={enabled} />
        </TabsContent>
        <TabsContent value="opportunities">
          <InternalLinkOpportunities enabled={enabled} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
