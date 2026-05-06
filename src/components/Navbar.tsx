import logo from "@/assets/pdfneo-logo.png";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="PDFNeo" className="h-9 w-9 rounded-lg" />
          <span className="font-display text-xl font-bold tracking-tight">
            PDF<span className="text-gradient">Neo</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink 
            to="/" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-primary font-bold"
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-primary font-bold"
          >
            About
          </NavLink>
          <NavLink 
            to="/security" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-green-600 font-bold"
          >
            Security
          </NavLink>
          <Link to="/#tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Tools
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/kushwi15/PDFNeo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button asChild>
            <Link to="/#tools">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
