import { useParams, Link } from "react-router-dom";
import { pdfTools } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

const ToolPlaceholder = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = pdfTools.find((t) => t.route === `/tools/${toolId}`);

  if (!tool) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Tool not found.</p>
      </div>
    );
  }

  return (
    <ToolLayout title={tool.name} description={tool.description} icon={tool.icon}>
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-12 text-center card-shadow">
        <Construction className="h-12 w-12 text-muted-foreground" />
        <h2 className="font-display text-xl font-semibold">
          {tool.comingSoon ? "Coming Soon" : "Under Development"}
        </h2>
        <p className="text-muted-foreground">
          This tool is being built. Check back soon or contribute on GitHub!
        </p>
        <Button variant="outline" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </ToolLayout>
  );
};

export default ToolPlaceholder;
