import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background/50 hover:bg-background hover:border-primary/50 transition-all cursor-pointer group"
      >
        <Languages className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium uppercase">{currentLanguage.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-card p-1 shadow-xl animate-in fade-in zoom-in duration-200 z-[100]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                i18n.language === lang.code
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{lang.name}</span>
              {i18n.language === lang.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
