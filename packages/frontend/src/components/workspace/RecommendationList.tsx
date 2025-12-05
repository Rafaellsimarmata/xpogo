"use client";

type RecommendationItem = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
};

type RecommendationListProps = {
  title: string;
  items: RecommendationItem[];
  selectedId?: string | null;
  onSelect?: (item: RecommendationItem) => void;
  emptyMessage?: string;
  ctaLabel?: string;
};

export const RecommendationList = ({
  title,
  items,
  selectedId,
  onSelect,
  emptyMessage,
  ctaLabel = "Pilih",
}: RecommendationListProps) => (
  <div className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {selectedId && (
        <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
          Pilihan: {items.find((item) => item.id === selectedId)?.title}
        </span>
      )}
    </div>
    {items.length === 0 ? (
      <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
    ) : (
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const isActive = selectedId === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect?.(item)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-background/70 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-primary">{ctaLabel}</span>
              </div>
              {item.description && (
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              )}
              {item.badge && (
                <span className="mt-2 inline-block rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    )}
  </div>
);
