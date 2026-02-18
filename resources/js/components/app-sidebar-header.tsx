import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { NavUser } from '@/components/nav-user';
import AppearanceToggle from '@/components/appearance-toggle';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/30 bg-background/80 backdrop-blur-md px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 h-9 w-9 text-muted-foreground hover:text-foreground transition-colors" />
                <div className="h-4 w-[1px] bg-sidebar-border/50 mx-1 hidden md:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <AppearanceToggle className="h-9 w-9 text-muted-foreground hover:text-foreground" />
                <div className="h-4 w-[1px] bg-sidebar-border/50 mx-1 hidden md:block" />
                <NavUser />
            </div>
        </header>
    );
}
