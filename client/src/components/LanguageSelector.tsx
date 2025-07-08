import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  variant?: 'white' | 'blue';
}

export const LanguageSelector = ({ variant = 'white' }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const styles = {
    white: {
      button: "text-white hover:text-blue-300 text-sm sm:text-base",
      dropdown: "bg-white border-gray-200",
      item: "text-gray-700 hover:bg-gray-100 focus:bg-gray-100 text-sm sm:text-base"
    },
    blue: {
      button: "text-blue-500 hover:text-blue-600 text-sm sm:text-base",
      dropdown: "bg-white border-gray-200",
      item: "text-gray-700 hover:bg-gray-100 focus:bg-gray-100 text-sm sm:text-base"
    }
  };

  const currentStyle = styles[variant];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={currentStyle.button}>
          <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {language === 'en' ? 'English' : '中文'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${currentStyle.dropdown} z-50 min-w-[120px] sm:min-w-[150px]`}>
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={currentStyle.item}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('zh')}
          className={currentStyle.item}
        >
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};