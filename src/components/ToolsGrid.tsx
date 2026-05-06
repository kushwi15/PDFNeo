import { pdfTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import { useTranslation } from "react-i18next";

const ToolsGrid = () => {
  const { t } = useTranslation();
  const conversion = pdfTools.filter(t => t.category === "convert");
  const editing = pdfTools.filter(t => t.category === "edit");
  const security = pdfTools.filter(t => t.category === "security");

  return (
    <section id="tools" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t('toolsGrid.title')}</h2>
          <p className="mt-3 text-muted-foreground">{t('toolsGrid.subtitle')}</p>
        </div>

        <div className="space-y-12">
          <ToolSection title={t('toolsGrid.categories.conversion')} tools={conversion} startIndex={0} />
          <ToolSection title={t('toolsGrid.categories.editing')} tools={editing} startIndex={conversion.length} />
          <ToolSection title={t('toolsGrid.categories.security')} tools={security} startIndex={conversion.length + editing.length} />
        </div>
      </div>
    </section>
  );
};

const ToolSection = ({ title, tools, startIndex }: { title: string; tools: typeof pdfTools; startIndex: number }) => (
  <div>
    <h3 className="mb-4 font-display text-lg font-semibold text-muted-foreground">{title}</h3>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tools.map((tool, i) => (
        <ToolCard key={tool.id} tool={tool} index={startIndex + i} />
      ))}
    </div>
  </div>
);

export default ToolsGrid;
