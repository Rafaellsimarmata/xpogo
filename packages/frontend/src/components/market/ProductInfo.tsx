import type { MarketProduct } from "@/src/types/market";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProductInfoProps {
  product: MarketProduct;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-sm">
      {/* Product Header */}
      <div className="mb-8 pb-6 border-b-2 border-border/50">
        <h2 className="text-3xl font-bold text-foreground mb-3">{product.name}</h2>
        
        {product.hsCode && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">HS Code:</span>
            <span className="font-mono font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg">
              {product.hsCode}
            </span>
          </div>
        )}
      </div>
      
      {/* Market Intelligence Content */}
      <article className="prose prose-slate max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:text-foreground
        prose-h1:text-2xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b-2 prose-h1:border-border/50 prose-h1:pb-3
        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-primary
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-semibold
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-3
        prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:mb-1.5
        prose-ul:my-4 prose-ul:ml-6 prose-ul:space-y-1.5
        prose-ol:my-4 prose-ol:ml-6
        prose-strong:text-primary prose-strong:font-bold
        prose-hr:border-border/50 prose-hr:my-8
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {product.marketIntelligence}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default ProductInfo;