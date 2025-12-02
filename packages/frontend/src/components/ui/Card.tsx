import { cn } from "@/src/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

const Card = ({ children, className, as: Component = "div" }: CardProps) => (
  <Component
    className={cn(
      "glass-panel rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg shadow-blue-500/5 transition-all duration-300 hover:shadow-blue-500/20",
      className,
    )}
  >
    {children}
  </Component>
);

export default Card;
