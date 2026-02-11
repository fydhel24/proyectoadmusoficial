'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { gsap } from 'gsap';
import AppearanceToggle from './appearance-toggle';
import {
    Menu,
    X,
    ChevronDown,
    Monitor,
    Palette,
    Video,
    Camera,
    BarChart,
    Presentation,
    Users,
    Mail,
    Briefcase,
    Layout
} from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        gsap.fromTo(headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
        );

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
                "fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out px-4 py-3",
                scrolled
                    ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div ref={logoRef} className="relative w-12 h-12 overflow-hidden rounded-full border border-red-500/20 group-hover:border-red-500 transition-colors duration-300">
                        <img
                            src="/Gflores/logo.png"
                            alt="Admus Logo"
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground group-hover:text-brand transition-colors duration-300 font-orbitron">
                        AdmusProductions
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-brand focus:text-brand focus:bg-transparent data-[state=open]:bg-transparent">
                                    Servicios
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover border border-border">
                                        {services.map((service) => (
                                            <ListItem
                                                key={service.title}
                                                title={service.title}
                                                href={service.href}
                                                onClick={(e) => scrollToSection(e, service.href)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <service.icon className="w-4 h-4 text-red-500" />
                                                    {service.description}
                                                </div>
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="#quienes-somos" onClick={(e) => scrollToSection(e as any, '#quienes-somos')}>
                                    <span className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer")}>
                                        Quiénes Somos
                                    </span>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-brand focus:text-brand focus:bg-transparent data-[state=open]:bg-transparent">
                                    Portafolios
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2 p-2 bg-popover border border-border">
                                        <ListItem href="/influencersts" title="Influencers" icon={Users} />
                                        <ListItem href="/videosportafolio" title="Videos" icon={Video} />
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="#como-trabajamos" onClick={(e) => scrollToSection(e as any, '#como-trabajamos')}>
                                    <span className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer")}>
                                        Metodología
                                    </span>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="#contactanos" onClick={(e) => scrollToSection(e as any, '#contactanos')}>
                                    <span className={cn(navigationMenuTriggerStyle(), "bg-transparent text-foreground hover:text-brand hover:bg-brand/10 cursor-pointer")}>
                                        Contacto
                                    </span>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <AppearanceToggle />
                    <Link href="/trabaja-con-nosotros">
                        <Button variant="ghost" className="text-foreground hover:text-brand hover:bg-brand/10 gap-2">
                            <Briefcase className="w-4 h-4" />
                            Trabaja con nosotros
                        </Button>
                    </Link>

                    {auth.user ? (
                        <Link href="/dashboard">
                            <Button className="bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105">
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
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] bg-background border-border p-0 overflow-y-auto">
                            <SheetHeader className="p-6 border-b border-border">
                                <SheetTitle className="text-left text-foreground flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full border border-red-500/20 overflow-hidden">
                                            <img src="/Gflores/logo.png" alt="Admus" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-orbitron font-black text-sm tracking-tighter">ADMUSPRODUCTIONS</span>
                                    </div>
                                    <AppearanceToggle className="w-8 h-8 text-foreground" />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 p-4">
                                <MobileLink href="#quienes-somos" title="Quiénes Somos" onClick={(e) => scrollToSection(e, '#quienes-somos')} />

                                <div className="py-2">
                                    <p className="text-xs font-semibold text-brand uppercase tracking-widest px-4 mb-2">Servicios</p>
                                    {services.map((s) => (
                                        <MobileLink key={s.title} href={s.href} title={s.title} icon={s.icon} />
                                    ))}
                                </div>

                                <div className="py-2">
                                    <p className="text-xs font-semibold text-brand uppercase tracking-widest px-4 mb-2">Portafolios</p>
                                    <MobileLink href="/influencersts" title="Influencers" icon={Users} />
                                    <MobileLink href="/videosportafolio" title="Videos" icon={Video} />
                                </div>

                                <MobileLink href="#como-trabajamos" title="Metodología" onClick={(e) => scrollToSection(e, '#como-trabajamos')} />
                                <MobileLink href="#contactanos" title="Contacto" onClick={(e) => scrollToSection(e, '#contactanos')} />
                                <MobileLink href="/trabaja-con-nosotros" title="Trabaja con nosotros" icon={Briefcase} />

                                <div className="mt-4 pt-4 border-t border-red-900/20 flex flex-col gap-3">
                                    {auth.user ? (
                                        <Link href="/dashboard" className="w-full">
                                            <Button className="w-full bg-red-600 hover:bg-red-700">Dashboard</Button>
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="w-full">
                                            <Button className="w-full bg-red-600 hover:bg-red-700">Login</Button>
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

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 group",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

function MobileLink({ href, title, icon: Icon, onClick }: { href: string; title: string; icon?: React.ElementType; onClick?: (e: any) => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-brand/10 rounded-lg transition-colors group"
        >
            {Icon && <Icon className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium">{title}</span>
        </Link>
    );
}
