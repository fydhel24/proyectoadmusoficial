'use client';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { gsap } from 'gsap';
import { BarChart, Briefcase, Camera, Layout, Mail, Menu, Monitor, Palette, Presentation, Users, Video } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AppearanceToggle from './appearance-toggle';

interface Service {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
}

const services: Service[] = [
    { title: 'Marketing Digital', description: 'Estrategias digitales de alto impacto.', icon: Monitor, href: '/marketing' },
    { title: 'Diseño Gráfico', description: 'Branding y diseño profesional para tu marca.', icon: Palette, href: '/diseño' },
    { title: 'Producción Audiovisual', description: 'Videos profesionales que cautivan.', icon: Video, href: '/servicios/produccion-audiovisual' },
    { title: 'Fotografía', description: 'Capturamos la esencia de tu proyecto.', icon: Camera, href: '/fotografias' },
    { title: 'Consultorías', description: 'Asesoramiento estratégico personalizado.', icon: BarChart, href: '/consultorias' },
    { title: 'Eventos Digitales', description: 'Organización de experiencias virtuales.', icon: Presentation, href: '/eventos-digitales' },
];

export default function Header() {
    const { auth } = usePage().props as any;
    const [scrolled, setScrolled] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Entrance animation
        gsap.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<any>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.getElementById(href.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header
            ref={headerRef}
            className={cn(
                'fixed top-0 left-0 z-50 w-full px-4 py-3 transition-all duration-300 ease-in-out',
                scrolled ? 'bg-background/90 border-border border-b shadow-lg backdrop-blur-md' : 'bg-transparent',
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="group flex items-center gap-3">
                    <div
                        ref={logoRef}
                        className="relative h-12 w-12 overflow-hidden rounded-full border border-red-500/20 transition-colors duration-300 group-hover:border-red-500"
                    >
                        <img
                            src="/Gflores/logo.png"
                            alt="Admus Logo"
                            className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <span className="text-foreground group-hover:text-brand font-orbitron text-xl font-black tracking-tighter transition-colors duration-300">
                        AdmusProductions
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 lg:flex">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/">
                                    <span
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer bg-transparent',
                                        )}
                                    >
                                        Inicio
                                    </span>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>

                                <NavigationMenuTrigger className="text-foreground hover:text-brand focus:text-brand bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                                    Servicios
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="bg-popover border-border grid w-[400px] gap-3 border p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {services.map((service) => (
                                            <ListItem
                                                key={service.title}
                                                title={service.title}
                                                href={service.href}
                                                onClick={(e) => scrollToSection(e, service.href)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <service.icon className="h-4 w-4 text-red-500" />
                                                    {service.description}
                                                </div>
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/influencersts">
                                    <span
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer bg-transparent',
                                        )}
                                    >
                                        Influencers
                                    </span>
                                </Link>
                            </NavigationMenuItem>
                            <Link href="/trabaja-con-nosotros">
                                <Button variant="ghost" className="text-foreground hover:text-brand hover:bg-brand/10 gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Trabaja con nosotros
                                </Button>
                            </Link>

                            <NavigationMenuItem>
                                <Link href={route('public.contact')}>
                                    <span className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer")}>
                                        Contáctanos
                                    </span>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href={route('public.location')}>
                                    <span className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer")}>
                                        Ubicación
                                    </span>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden items-center gap-4 lg:flex">
                    <AppearanceToggle />

                    {auth.user ? (
                        <Link href="/dashboard">
                            <Button className="border-none bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105 hover:bg-red-700">
                                Panel Principal
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button className="border-none bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105 hover:bg-red-700">
                                Iniciar Sesion
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground hover:bg-brand/10">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background border-border w-[300px] overflow-y-auto p-0">
                            <SheetHeader className="border-border border-b p-6">
                                <SheetTitle className="text-foreground flex items-center justify-between text-left">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 overflow-hidden rounded-full border border-red-500/20">
                                            <img src="/Gflores/logo.png" alt="Admus" className="h-full w-full object-cover" />
                                        </div>
                                        <span className="font-orbitron text-sm font-black tracking-tighter">ADMUSPRODUCTIONS</span>
                                    </div>
                                    <AppearanceToggle className="text-foreground h-8 w-8" />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 p-4">
                                <div className="py-2">
                                    <p className="text-brand mb-2 px-4 text-xs font-semibold tracking-widest uppercase">Inicio</p>
                                    <MobileLink href="/" title="Inicio" icon={Users} />
                                </div>
                                <div className="py-2">
                                    <p className="text-brand mb-2 px-4 text-xs font-semibold tracking-widest uppercase">Servicios</p>
                                    {services.map((s) => (
                                        <MobileLink key={s.title} href={s.href} title={s.title} icon={s.icon} />
                                    ))}
                                </div>

                                <div className="py-2">
                                    <p className="text-brand mb-2 px-4 text-xs font-semibold tracking-widest uppercase">Portafolios</p>
                                    <MobileLink href="/influencersts" title="Influencers" icon={Users} />
                                </div>

                                <MobileLink href="#como-trabajamos" title="Metodología" onClick={(e) => scrollToSection(e, '#como-trabajamos')} />
                                <MobileLink href={route('public.contact')} title="Contáctanos" icon={Mail} />
                                <MobileLink href={route('public.location')} title="Ubicación" icon={Layout} />
                                <MobileLink href="/trabaja-con-nosotros" title="Trabaja con nosotros" icon={Briefcase} />

                                <div className="mt-4 flex flex-col gap-3 border-t border-red-900/20 pt-4">
                                    {auth.user ? (
                                        <Link href="/dashboard" className="w-full">
                                            <Button className="w-full bg-red-600 hover:bg-red-700">Panel principal</Button>
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="w-full">
                                            <Button className="w-full bg-red-600 hover:bg-red-700">Iniciar Sesion</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType }>(
    ({ className, title, children, icon: Icon, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'group block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400',
                            className,
                        )}
                        {...props}
                    >
                        <div className="flex items-center gap-2 text-sm leading-none font-medium">
                            {Icon && <Icon className="text-brand h-4 w-4 transition-transform group-hover:scale-110" />}
                            {title}
                        </div>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-snug">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);
ListItem.displayName = 'ListItem';

function MobileLink({
    href,
    title,
    icon: Icon,
    onClick,
}: {
    href: string;
    title: string;
    icon?: React.ElementType;
    onClick?: (e: React.MouseEvent<any>) => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-muted-foreground hover:text-foreground hover:bg-brand/10 group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors"
        >
            {Icon && <Icon className="text-brand h-5 w-5 transition-transform group-hover:scale-110" />}
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
}
