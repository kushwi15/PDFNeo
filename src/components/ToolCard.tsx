import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { PdfTool } from "@/lib/tools";

interface ToolCardProps {
  tool: PdfTool;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const Icon = tool.icon;

  return (
    <Link to={tool.route} className="block">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        className="group relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center card-shadow transition-all duration-300 cursor-pointer hover:card-shadow-hover hover:border-primary/30 hover:-translate-y-1"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-sm font-semibold">{tool.name}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
      </motion.div>
    </Link>
  );
};

export default ToolCard;
