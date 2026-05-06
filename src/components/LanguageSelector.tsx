import { useEffect } from "react";
import { Languages } from "lucide-react";

const LanguageSelector = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute("src", "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");
    document.body.appendChild(addScript);
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border bg-background/50 hover:bg-background transition-colors cursor-pointer group min-w-[120px]">
      <Languages className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <div id="google_translate_element" className="google-translate-container"></div>
    </div>
  );
};

export default LanguageSelector;
