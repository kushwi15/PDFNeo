import { useTranslation } from "react-i18next";
import { Languages, Check, Search, Globe } from "lucide-react";
import { useState } from "react";
import { nativeLanguages } from "@/lib/languages";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = nativeLanguages.find(lang => lang.code === i18n.language) || nativeLanguages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
    // Force a reload if using a fallback method like Google Translate for non-native languages
    // But for now, we'll stick to our native list.
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border bg-background/50 hover:bg-background hover:border-primary/50 transition-all group"
        >
          <Languages className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-xs font-medium uppercase">{currentLanguage.code}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup heading="Official Translations">
              {nativeLanguages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`${lang.name} ${lang.nativeName}`}
                  onSelect={() => changeLanguage(lang.code)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <Check className={cn("h-4 w-4 text-primary")} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Automatic Translation">
              <CommandItem 
                className="flex items-center gap-2 cursor-pointer text-primary"
                onSelect={() => {
                  // This would trigger a Google Translate integration
                  window.open(`https://translate.google.com/translate?sl=auto&tl=auto&u=${window.location.href}`, '_blank');
                  setOpen(false);
                }}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">Translate with Google</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
