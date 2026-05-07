import logo from "@/assets/pdfneo-logo.png";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

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
            <NavLink
              to="/about"
              className="hover:text-foreground transition-colors"
              activeClassName="text-foreground font-bold"
            >
              {t('nav.about')}
            </NavLink>
            <NavLink
              to="/security"
              className="hover:text-foreground transition-colors"
              activeClassName="text-green-600 font-bold"
            >
              {t('nav.security')}
            </NavLink>
            <NavLink
              to="/privacy"
              className="hover:text-foreground transition-colors"
              activeClassName="text-foreground font-bold"
            >
              {t('footer.privacy')}
            </NavLink>
            <NavLink
              to="/terms"
              className="hover:text-foreground transition-colors"
              activeClassName="text-foreground font-bold"
            >
              {t('footer.terms')}
            </NavLink>
            <Link to="/about" className="hover:text-foreground transition-colors">
              {t('footer.contact')}
            </Link>
            <a href="https://github.com/kushwi15/PDFNeo" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              {t('footer.github')}
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
