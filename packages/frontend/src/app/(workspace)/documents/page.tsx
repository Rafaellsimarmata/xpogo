import { Suspense } from "react";

import { DocumentCenterContent } from "./DocumentCenterContent";

const DocumentCenterPage = () => {
  return (
    <Suspense
      fallback={
        <section className="bg-background py-12">
          <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
            <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
              <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
              <div className="mt-4 h-10 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-muted" />
            </div>
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="h-[400px] rounded-3xl border border-border/60 bg-card/90" />
              </div>
              <div className="lg:col-span-4">
                <div className="h-[400px] rounded-3xl border border-border/60 bg-card/90" />
              </div>
            </div>
          </div>
        </section>
      }
    >
      <DocumentCenterContent />
    </Suspense>
  );
};

export default DocumentCenterPage;
