import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import type { LucideIcon } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
  hideTrustBadges?: boolean;
}

const ToolLayout = ({ title, description, icon: Icon, children, hideTrustBadges = false }: ToolLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO title={title} description={description} />
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

          {!hideTrustBadges && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-green-100 bg-green-50/50 p-3 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <Shield className="h-4 w-4 shrink-0" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Secure & Private</span>
              </div>
              <p className="text-green-600 font-medium text-xs">
                Processed Locally 
                <span className="mx-2 opacity-50">|</span> 
                <Link to="/security" className="hover:underline">Technical Proof &rarr;</Link>
              </p>
            </div>
          )}

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

          {!hideTrustBadges && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Privacy Verdict: Zero Risk</p>
                <p>This tool uses WebAssembly to modify your PDF directly in your browser's RAM. <strong>No data is sent to our servers.</strong> You can even disconnect your internet once the tool is loaded to verify its offline capabilities.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolLayout;
