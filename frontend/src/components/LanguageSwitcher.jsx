import { useLanguage } from '../i18n/LanguageProvider';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

const languages = [
  // Europe
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  // Americas
  { code: 'es-mx', name: 'Español (MX)', flag: '🇲🇽' },
  { code: 'pt-br', name: 'Português (BR)', flag: '🇧🇷' },
  // Gulf & Middle East
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  // Asia
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-slate-500 hover:text-white px-2"
          data-testid="language-switcher"
        >
          <Globe className="w-4 h-4 mr-1" />
          {currentLang.flag} {currentLang.code.toUpperCase().split('-')[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200 max-h-[400px] overflow-y-auto">
        <div className="px-2 py-1 text-xs text-slate-400 font-semibold">Europe</div>
        {languages.slice(0, 9).map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-purple-500/20' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1 text-xs text-slate-400 font-semibold mt-2">Americas</div>
        {languages.slice(9, 11).map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-purple-500/20' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1 text-xs text-slate-400 font-semibold mt-2">Middle East</div>
        {languages.slice(11, 12).map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-purple-500/20' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1 text-xs text-slate-400 font-semibold mt-2">Asia</div>
        {languages.slice(12).map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-purple-500/20' : ''}`}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
