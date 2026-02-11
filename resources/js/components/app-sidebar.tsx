'use client';

// resources/js/Layouts/AppSidebar.tsx

// 1. Imports de React e Inertia.js
import { Link, router, usePage } from '@inertiajs/react';
import type React from 'react';
import { useEffect, useState } from 'react';

// 2. Componentes de UI del Sidebar
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

// 3. Componentes personalizados
import { NavUser } from '@/components/nav-user';
import AppLogo from './app-logo';

// 4. Tipos
import type { NavItem } from '@/types';

// 5. Iconos Lucide
import {
    LayoutDashboard,
    Gift,
    History,
    Users,
    ShieldCheck,
    Settings,
    Briefcase,
    Building2,
    Tags,
    Link2,
    Banknote,
    CalendarCheck,
    Video,
    FileText,
    UserCheck,
    User,
    CalendarRange,
    CalendarDays,
    CheckSquare,
    ClipboardList,
    ClipboardCheck,
    ListTodo,
    Flame,
    ChevronDown,
    ChevronUp,
    Store,
    Clock,
    UserCircle
} from 'lucide-react';

// 6. Props que trae Inertia
type PageProps = {
    auth: {
        user: {
            roles: Array<{ id: number; name: string }>;
        } | null;
    };
};

// 7. Definición de una sección de menú
type MenuSection = {
    title: string;
    icon: React.ComponentType<any>;
    items: NavItem[];
    isCollapsible?: boolean;
};

// 8. NavMain: modern collapsible section with Lucide and refined styles
function NavMain({ sections, currentPath }: { sections: MenuSection[]; currentPath: string }) {
    return (
        <SidebarMenu>
            {sections.map((section) => {
                const key = section.title.toLowerCase().replace(/\s+/g, '');
                const hasActiveItem = section.items?.some((item) => item.href === currentPath);

                if (!section.isCollapsible) {
                    return (
                        <SidebarGroup key={key} className="py-0">
                            <SidebarGroupLabel className="text-gray-400 px-2 py-4">
                                {section.title}
                            </SidebarGroupLabel>
                            <SidebarMenu>
                                {section.items.map((item) => {
                                    const Icon = item.icon as React.ElementType;
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.href === currentPath}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.href} className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                }

                return (
                    <Collapsible
                        key={key}
                        asChild
                        defaultOpen={hasActiveItem}
                        className="group/collapsible"
                    >
                        <SidebarGroup className="py-0">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={section.title}>
                                        <section.icon className="h-4 w-4" />
                                        <span className="font-medium">{section.title}</span>
                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="mr-0 border-l border-sidebar-border ml-4">
                                        {section.items.map((item) => {
                                            const Icon = item.icon as React.ElementType;
                                            return (
                                                <SidebarMenuSubItem key={item.href}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={item.href === currentPath}
                                                    >
                                                        <Link href={item.href} className="flex items-center gap-2">
                                                            <Icon className="h-4 w-4" />
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </SidebarGroup>
                    </Collapsible>
                );
            })}
        </SidebarMenu>
    );
}

// Helper to keep SidebarMenuSub working
import { SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';

// 9. Componente principal AppSidebar
export function AppSidebar() {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const currentPath = page.url;

    const roles = auth?.user?.roles.map((r) => r.name) || [];
    const isAdmin = roles.includes('admin');
    const isInfluencer = roles.includes('influencer');
    const isPasante = roles.includes('pasante');
    const isCamarografo = roles.includes('camarografo');
    const isEditor = roles.includes('editor');
    const isVendedor = roles.includes('Ejecutivo de Ventas');
    const isMarketing = roles.includes('marketing');
    const isEmpresa = roles.includes('empresa');
    const isjefeventas = roles.includes('Jefe de Ventas');
    const IsInvitado = roles.includes('Invitado');

    useEffect(() => {
        console.log('🔍 auth.user.roles =', roles);
    }, [roles]);

    useEffect(() => {
        if (IsInvitado && currentPath !== '/regaloview') {
            router.visit('/regaloview');
        }
    }, [IsInvitado, currentPath]);

    // Construir secciones sin Dashboard
    const menuSections: MenuSection[] = [];

    if (isAdmin) {
        menuSections.push(
            {
                title: 'Gestion de Personal',
                icon: Users,
                items: [
                    { title: 'Usuarios', href: '/users', icon: User },
                    { title: 'Roles', href: '/roles', icon: ShieldCheck },
                    { title: 'Gestion de tipos', href: '/tipos', icon: Settings },
                    { title: 'Postulaciones de Trabajo', href: '/admin/job-applications', icon: Briefcase },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Empresas',
                icon: Building2,
                items: [
                    { title: 'Empresas', href: '/companies', icon: Store },
                    { title: 'Categorias', href: '/categories', icon: Tags },
                    { title: 'Link de Empresas', href: '/company-links', icon: Link2 },
                    { title: 'Pagos del MES', href: '/pagos-del-mes', icon: Banknote },
                    { title: 'Pagos del ANUALES', href: '/reportes/pagos-por-anio', icon: CalendarDays },
                    { title: 'Videos Empresas', href: '/videos', icon: Video },
                    { title: 'Videos MES Empresas', href: '/videosmes', icon: Video },
                    { title: 'Informes', href: '/informes', icon: FileText },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Influencers',
                icon: UserCheck,
                items: [
                    { title: 'Semana Influencer', href: '/semanainfluencer', icon: Clock },
                    { title: 'Semana Pasante', href: '/semana-pasantes', icon: Clock },
                    { title: 'Administrar Influencers', href: '/infuencersdatos', icon: UserCheck },
                    { title: 'Influencers', href: '/influencers', icon: Users },
                    { title: 'Historial de Semanas', href: '/weeks', icon: CalendarRange },
                    { title: 'Ver Calendario', href: '/bookings', icon: CalendarCheck },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Pasantes',
                icon: Briefcase,
                items: [
                    { title: 'Tareas de Hoy', href: '/tareas/hoy', icon: CalendarCheck },
                    { title: 'Tareas en revicion', href: '/tareas/revicion', icon: ClipboardCheck },
                    { title: 'Semana Tareas', href: '/semana', icon: CalendarRange },
                    { title: 'Reporte de tareas', href: '/reportetareas', icon: FileText },
                    { title: 'Agenda Mensual', href: '/mes', icon: CalendarRange },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestión de Marketing',
                icon: Flame,
                items: [
                    { title: 'Lista de Empresas', href: '/planes-empresas', icon: Building2 },
                    { title: 'Todas las Tareas', href: '/seguimiento-tareas-todos', icon: ListTodo },
                    { title: 'Pendientes Mes', href: '/seguimiento-tareas-pendientes', icon: CalendarRange },
                    { title: 'Pendientes de Hoy', href: '/seguimiento-tareas-pendienteshoy', icon: CalendarCheck },
                    { title: 'Pendientes Producción Hoy', href: '/seguimiento-tareas-pendienteshoyproduccion', icon: Video },
                    { title: 'Pendientes Edición Hoy', href: '/seguimiento-tareas-pendienteshoyedicion', icon: Settings },
                    { title: 'En Revisión', href: '/seguimiento-tareas-pendienteshoyrevision', icon: ClipboardCheck },
                    { title: 'Publicados', href: '/seguimiento-tareas-publicados', icon: FileText },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Vendedores',
                icon: Briefcase,
                items: [
                    { title: 'Reportes Empresas general', href: '/reportesgeneral', icon: Building2 },
                    { title: 'Seguimiento Empresas', href: '/seguimiento-empresa', icon: Building2 },
                    { title: 'Seguimiento Historial', href: '/seguimiento-historial', icon: History },
                    { title: 'Reportes Empresas', href: '/reporte-empresa-vendedor', icon: FileText },
                    { title: 'Canjes Pendientes', href: '/canjes/pendientes', icon: CalendarCheck },
                    { title: 'Premios', href: '/premios', icon: Gift },
                    { title: 'Paquetes', href: '/paquetes', icon: Tags },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion regalos',
                icon: Gift,
                items: [
                    { title: 'Administrar regalos', href: '/regalo', icon: Settings },
                    { title: 'Navidad Admus', href: '/regaloview', icon: Flame },
                ],
                isCollapsible: true,
            },
        );
    } else {
        if (isInfluencer) {
            menuSections.push({
                title: 'Influencer',
                icon: UserCheck,
                items: [
                    { title: 'Influencers', href: '/influencers', icon: Users },
                    { title: 'Ver Calendario', href: '/bookings', icon: CalendarCheck },
                    { title: 'Mi perfil', href: '/perfil-influencer', icon: UserCircle },
                ],
                isCollapsible: false,
            });
        }
        if (isPasante) {
            menuSections.push({
                title: 'Pasante',
                icon: Briefcase,
                items: [
                    { title: 'Mis Tareas de HOY', href: '/tareas-personales', icon: CalendarDays },
                    { title: 'Tareas Pendientes', href: '/pasante/mistareas/pendientes', icon: Clock },
                    { title: 'Tareas Para Corregir', href: '/pasante/mistareas/encorregir', icon: ClipboardList },
                    { title: 'Todas mis tareas', href: '/pasante/mistareas/todos', icon: ListTodo },
                    { title: 'Tareas Realizadas', href: '/pasante/mistareas/enrevicion', icon: ClipboardCheck },
                ],
                isCollapsible: true,
            });
        }
        if (isCamarografo) {
            menuSections.push({
                title: 'Camarografo',
                icon: Video,
                items: [
                    { title: 'Grabaciones de HOY', href: '/camarografo/tareas-hoy', icon: CalendarCheck },
                    { title: 'Grabaciones Semana ', href: '/tareas-camarografo', icon: CalendarRange },
                ],
                isCollapsible: true,
            });
        }
        if (isEditor) {
            menuSections.push({
                title: 'Panel Editor',
                icon: Video,
                items: [
                    { title: 'Edicion de Hoy', href: '/editor/tareas-hoy', icon: CalendarCheck },
                    { title: 'Edicion de Semana ', href: '/tareas-editor', icon: CalendarRange },
                ],
                isCollapsible: true,
            });
        }
        if (isVendedor) {
            menuSections.push({
                title: 'Ejecutivo de Ventas',
                icon: Briefcase,
                items: [
                    { title: 'Seguimiento Empresas', href: '/seguimiento-empresa-vendedor', icon: Building2 },
                    { title: 'Canjes Pendientes', href: '/canjes', icon: Clock },
                ],
                isCollapsible: false,
            });
        }

        if (isMarketing) {
            menuSections.push(
                {
                    title: 'Encargado de marketing',
                    icon: Flame,
                    items: [
                        { title: 'Crear Empresas', href: '/companiasmark', icon: Store },
                        { title: 'Lista de Empresas', href: '/planes-empresas', icon: Building2 },
                        { title: 'Todas las Tareas', href: '/seguimiento-tareas-todos', icon: ListTodo },
                        { title: 'Pendientes Mes', href: '/seguimiento-tareas-pendientes', icon: CalendarRange },
                        { title: 'Pendientes de Hoy', href: '/seguimiento-tareas-pendienteshoy', icon: CalendarCheck },
                        { title: 'Pendientes Producción Hoy', href: '/seguimiento-tareas-pendienteshoyproduccion', icon: Video },
                        { title: 'Pendientes Edición Hoy', href: '/seguimiento-tareas-pendienteshoyedicion', icon: Settings },
                        { title: 'En Revisión', href: '/seguimiento-tareas-pendienteshoyrevision', icon: ClipboardCheck },
                        { title: 'Publicados', href: '/seguimiento-tareas-publicados', icon: FileText },
                        { title: 'Informes', href: '/informes', icon: FileText },
                    ],
                    isCollapsible: true,
                },
            );
        }

        if (isEmpresa) {
            menuSections.push({
                title: 'Empresa',
                icon: Building2,
                items: [
                    { title: 'Videos Empresas', href: '/videos', icon: Video },
                    { title: 'Videos MES Empresas', href: '/videosmes', icon: Video },
                    { title: 'Realizar Pagos', href: '/pagos', icon: Banknote },
                ],
                isCollapsible: false,
            });
        }
        if (isjefeventas) {
            menuSections.push({
                title: 'Gestion de Vendedores',
                icon: Briefcase,
                items: [
                    { title: 'Reportes Empresas', href: '/reportes', icon: FileText },
                    { title: 'Seguimiento Empresas', href: '/seguimiento-empresa', icon: UserCheck },
                    { title: 'Seguimiento Historial', href: '/seguimiento-historial', icon: History },
                    { title: 'Canjes Pendientes', href: '/canjes/pendientes', icon: Clock },
                ],
                isCollapsible: true,
            });
        }
        if (IsInvitado) {
            menuSections.push({
                title: 'Invitado',
                icon: Users,
                items: [
                    { title: 'Regalo secreto', href: '/regaloview', icon: Gift },
                ],
                isCollapsible: false,
            });
        }
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={currentPath === '/dashboard'}
                                tooltip="Panel Principal"
                            >
                                <Link href="/dashboard" prefetch>
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>Panel Principal</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={currentPath === '/regaloview'}
                                tooltip="Navidad Admus"
                            >
                                <Link href="/regaloview" prefetch>
                                    <Flame className="h-5 w-5" />
                                    <span>Navidad Admus</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator className="mx-0" />

                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-gray-400">Consultas Rápidas</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Historial Influencers">
                                    <Link href="/admin/influencer-history">
                                        <History className="h-4 w-4" />
                                        <span>Historial Influencers</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                <NavMain sections={menuSections} currentPath={currentPath} />
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    );
}
