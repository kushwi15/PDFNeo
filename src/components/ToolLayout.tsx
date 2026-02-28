import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

const ToolLayout = ({ title, description, icon: Icon, children }: ToolLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all tools
          </Link>

          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{title}</h1>
              <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
          </div>

          {children}

          <div className="mt-8 flex items-center gap-2 rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0 text-primary" />
            <p>Your files are processed entirely in your browser and never uploaded to any server.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolLayout;
