import { Suspense } from "react";

import { MarketAnalysisContent } from "./MarketAnalysisContent";

const MarketAnalysisPage = () => {
  return (
    <Suspense
      fallback={
        <section className="bg-gradient-to-b from-background to-muted/20 py-12">
          <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-6 w-44 animate-pulse rounded-full bg-muted" />
              <div className="mx-auto h-10 w-72 animate-pulse rounded-full bg-muted" />
              <div className="mx-auto h-4 w-64 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[260px] rounded-3xl border border-border/60 bg-card/90" />
              <div className="h-[260px] rounded-3xl border border-border/60 bg-card/90" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[360px] rounded-3xl border border-border/60 bg-card/90" />
              <div className="h-[360px] rounded-3xl border border-border/60 bg-card/90" />
            </div>
          </div>
        </section>
      }
    >
      <MarketAnalysisContent />
    </Suspense>
  );
};

export default MarketAnalysisPage;
