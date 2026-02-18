import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppearanceToggle({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
            className={cn("w-10 h-10 rounded-full text-foreground hover:bg-brand/10", className)}
            title={appearance === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
