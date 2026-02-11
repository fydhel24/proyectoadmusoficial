'use client';

import Header from '@/components/header';
import { Head, Link } from '@inertiajs/react';
import { ArrowBack, PlayCircleOutline } from '@mui/icons-material';
import { Box, Card, Container, Grid, IconButton, Typography, Fade } from '@mui/material';
import Footer from '../home/footer';
import { motion } from 'framer-motion';

// Define las interfaces para los datos que llegan de Laravel
interface LinkData {
    id: number;
    link: string;
    detalle: string;
}

interface CompanyLinkComprobante {
    id: number;
    link: LinkData | null;
}

interface CompanyProps {
    id: number;
    name: string;
    logo: string;
    description: string;
    link_comprobantes: CompanyLinkComprobante[];
}

interface CompanyVideosProps {
    company: CompanyProps;
}

// 🐛 Función auxiliar mejorada para obtener la URL de incrustación de TikTok
const getEmbedUrl = (tiktokUrl: string): string => {
    try {
        const url = new URL(tiktokUrl);
        // La incrustación de TikTok funciona mejor con la URL completa
        // Extraemos el ID del video de la URL resuelta por Laravel
        const pathParts = url.pathname.split('/');
        const videoId = pathParts.pop() || pathParts.pop(); // Manejar el caso de slash final

        if (videoId) {
            return `https://www.tiktok.com/embed/v2/${videoId}`;
        }
    } catch (e) {
        console.error('URL de TikTok inválida:', tiktokUrl);
    }
    return ''; // Retorna una cadena vacía si no se puede generar la URL de incrustación
};

export default function CompanyVideos({ company }: CompanyVideosProps) {
    const { name, link_comprobantes } = company;

    return (
        <>
            <Header />
            <Box sx={{ height: '64px', bgcolor: 'background', zIndex: 75 }} />

            <Head title={`Videos de ${name} | Portafolio`} />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background',
                    color: 'text.primary',
                    py: { xs: 4, md: 6 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>


                    {/* Header Section Mejorado */}
                    <Fade in timeout={800}>
                        <Box sx={{
                            textAlign: 'center',
                            mb: { xs: 4, md: 6 },
                            px: { xs: 2, sm: 0 }
                        }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                <Typography
                                    variant="h2"
                                    fontWeight="bold"
                                    sx={{
                                        color: 'text.primary',
                                        mb: { xs: 1, md: 2 },
                                        fontFamily: 'Orbitron, sans-serif',
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                                        background: 'linear-gradient(135deg, var(--brand) 0%, #ff6f61 50%, #7877c6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradientShift 6s ease-in-out infinite',
                                        textShadow: '0 0 30px rgba(217, 26, 26, 0.3)',
                                    }}
                                >
                                    Videos para {name}
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        fontFamily: 'Inter, sans-serif',
                                        maxWidth: 600,
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Aquí puedes ver todos los videos de TikTok realizados para esta empresa.
                                </Typography>
                            </motion.div>

                            {/* Decorative Elements */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 3,
                                    gap: 2
                                }}>
                                    <Box sx={{
                                        width: { xs: 30, md: 50 },
                                        height: 2,
                                        background: 'linear-gradient(90deg, transparent, var(--brand), transparent)'
                                    }} />
                                    <PlayCircleOutline sx={{
                                        color: 'var(--brand)',
                                        fontSize: { xs: '2rem', md: '2.5rem' },
                                        filter: 'drop-shadow(0 0 10px rgba(217, 26, 26, 0.5))'
                                    }} />
                                    <Box sx={{
                                        width: { xs: 30, md: 50 },
                                        height: 2,
                                        background: 'linear-gradient(90deg, transparent, var(--brand), transparent)'
                                    }} />
                                </Box>
                            </motion.div>
                        </Box>
                    </Fade>

                    {/* Videos Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ px: { xs: 1, sm: 0 } }}>
                            {link_comprobantes.length > 0 ? (
                                link_comprobantes.map(
                                    (companyLink, index) =>
                                        companyLink.link && (
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={companyLink.link.id}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{
                                                        duration: 0.6,
                                                        delay: 0.9 + (index * 0.1),
                                                        ease: "easeOut"
                                                    }}
                                                    whileHover={{
                                                        y: -8,
                                                        scale: 1.02,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                >
                                                    <Card
                                                        sx={{
                                                            height: { xs: 400, sm: 450, md: 480 },
                                                            borderRadius: { xs: 2, md: 3 },
                                                            overflow: 'hidden',
                                                            background: 'background.paper',
                                                            border: '1px solid var(--brand)',
                                                            position: 'relative',
                                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            backdropFilter: 'blur(10px)',
                                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                background: 'linear-gradient(135deg, transparent 30%, rgba(255,0,127,0.05) 70%)',
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s ease',
                                                                zIndex: 1,
                                                                pointerEvents: 'none',
                                                            },
                                                            '&:hover': {
                                                                boxShadow: '0 20px 40px rgba(217, 26, 26, 0.15)',
                                                                border: '1px solid var(--brand)',
                                                                '&::before': {
                                                                    opacity: 1,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {/* Top gradient border */}
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: '3px',
                                                            background: 'linear-gradient(90deg, transparent, var(--brand), #ff6f61, transparent)',
                                                            zIndex: 10,
                                                        }} />

                                                        {/* Video Container */}
                                                        <Box
                                                            sx={{
                                                                p: { xs: 1, md: 1.5 },
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                position: 'relative',
                                                                zIndex: 5,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    borderRadius: { xs: 1, md: 2 },
                                                                    overflow: 'hidden',
                                                                    position: 'relative',
                                                                    background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                                                                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
                                                                }}
                                                            >
                                                                <iframe
                                                                    src={getEmbedUrl(companyLink.link.link)}
                                                                    title={`Video de TikTok para ${name}`}
                                                                    width="100%"
                                                                    height="100%"
                                                                    style={{
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                    }}
                                                                    allowFullScreen
                                                                />
                                                            </Box>
                                                        </Box>

                                                        {/* Subtle shine effect */}
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s ease',
                                                                pointerEvents: 'none',
                                                                zIndex: 2,
                                                            }}
                                                        />
                                                    </Card>
                                                </motion.div>
                                            </Grid>
                                        ),
                                )
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 1 }}
                                    >
                                        <Box sx={{
                                            textAlign: 'center',
                                            py: { xs: 6, md: 8 },
                                            px: { xs: 2, sm: 0 }
                                        }}>
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.7, 1, 0.7]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <PlayCircleOutline sx={{
                                                    fontSize: { xs: '3rem', md: '4rem' },
                                                    color: 'rgba(255,0,127,0.6)',
                                                    mb: 2,
                                                    filter: 'drop-shadow(0 0 20px rgba(255,0,127,0.3))'
                                                }} />
                                            </motion.div>

                                            <Typography
                                                variant="h6"
                                                align="center"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                                                    fontWeight: 300,
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                                    background: 'background.paper',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid var(--brand)',
                                                    borderRadius: 2,
                                                    p: { xs: 3, md: 4 },
                                                    maxWidth: 500,
                                                    mx: 'auto'
                                                }}
                                            >
                                                No hay videos de TikTok disponibles para esta empresa.
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            )}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            <Box className="bg-black" sx={{ mt: { xs: 4, md: 8 } }}>
                <Footer />
            </Box>
        </>
    );
}