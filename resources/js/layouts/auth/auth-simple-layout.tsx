import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#FDF5E6]"> {/* Fondo general del layout con el beige claro */}

            {/* Fondo con Video */}
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                >
                    <source src="/assets/auth/fondologinadmus.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" /> {/* Overlay para legibilidad */}
            </div>

            {/* Logo de la aplicación con animación */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-8 relative z-20" // Ajusta el z-index para que esté por encima del fondo
            >
                <Link href="/">
                    {/* Ajusta el color del logo si es un SVG o usa un color que combine con la paleta */}
                    <AppLogoIcon className="w-24 h-24 text-[#D2B48C]" /> {/* Color de acento para el logo */}
                </Link>
            </motion.div>

            {/* Contenedor del formulario */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="relative z-10 w-full max-w-5xl bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
            >
                {/* Contenido (Login.tsx manejará el grid interno) */}
                <div className="w-full h-full">{children}</div>
            </motion.div>
        </div>
    );
}