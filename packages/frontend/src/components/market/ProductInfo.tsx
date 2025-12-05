import type { MarketProduct } from "@/src/types/market";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProductInfoProps {
  product: MarketProduct;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-background to-card shadow-sm">
      <div className="border-b border-border/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Product Insight</p>
        <h2 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h2>
        {product.description && (
          <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
        )}
      </div>

      <article
        className="prose prose-slate max-w-none whitespace-pre-line dark:prose-invert
        prose-headings:font-bold prose-headings:text-foreground
        prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6
        prose-h2:text-xl prose-h2:text-primary prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-lg prose-h3:text-primary/90 prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-3
        prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:mb-1.5
        prose-ul:my-4 prose-ul:ml-6 prose-ul:space-y-1.5
        prose-ol:my-4 prose-ol:ml-6
        prose-strong:text-primary prose-strong:font-medium
        prose-hr:border-border/50 prose-hr:my-8
      px-6 pb-6"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {product.marketIntelligence}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default ProductInfo;
