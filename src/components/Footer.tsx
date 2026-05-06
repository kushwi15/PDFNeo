import logo from "@/assets/pdfneo-logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-secondary/20 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PDFNeo" className="h-8 w-8 rounded-lg" />
            <span className="font-display text-lg font-bold">PDFNeo</span>
          </Link>
          <p className="max-w-md text-sm text-muted-foreground">
            Free, open-source, and privacy-first PDF tools. Built with ❤️.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/security" className="hover:text-foreground transition-colors text-green-600 font-semibold">
              Security
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <a href="https://github.com/kushwi15" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PDFNeo. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
