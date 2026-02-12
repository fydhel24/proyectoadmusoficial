'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Company {
    id: number;
    name: string;
    logo: string | null;
}

interface CompanyCarouselProps {
    companies: Company[];
    className?: string;
}

export default function CompanyCarousel({ companies, className }: CompanyCarouselProps) {
    if (!companies || companies.length === 0) return null;

    // Duplicate the companies to create a seamless loop
    const displayCompanies = [...companies, ...companies];

    return (
        <div className={cn('relative w-full overflow-hidden py-12', className)}>
            {/* Gradient Mask for fading edges */}
            <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-40 bg-gradient-to-r to-transparent" />
            <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-40 bg-gradient-to-l to-transparent" />

            <motion.div
                className="flex items-center gap-16 whitespace-nowrap"
                animate={{
                    x: ['0%', '-50%'],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 40,
                        ease: 'linear',
                    },
                }}
                style={{ width: 'fit-content' }}
            >
                {displayCompanies.map((company, index) => (
                    <div
                        key={`${company.id}-${index}`}
                        className="group flex flex-col items-center gap-6 transition-all duration-500 hover:scale-105"
                    >
                        <div className="group-hover:from-brand relative rounded-full p-[2px] transition-all duration-500 group-hover:bg-gradient-to-tr group-hover:to-red-500">
                            <div className="bg-background relative rounded-full p-1 shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                                <Avatar className="border-border/50 bg-muted h-28 w-28 border-2 transition-all duration-500 group-hover:border-transparent md:h-36 md:w-36">
                                    <AvatarImage
                                        src={company.logo || ''}
                                        alt={company.name}
                                        className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                                    />
                                    <AvatarFallback className="bg-brand/5 text-brand font-orbitron text-xl font-black">
                                        {company.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-muted-foreground group-hover:text-foreground font-orbitron text-xs font-bold tracking-[0.2em] uppercase transition-colors">
                                {company.name}
                            </span>
                            <div className="bg-brand h-0.5 w-0 transition-all duration-500 group-hover:w-full" />
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
