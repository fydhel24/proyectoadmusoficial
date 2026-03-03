import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Search,
    Building2,
    User,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce'; // Asegúrate de que este hook exista, o quitamos el debounce por una búsqueda manual

interface Asistencia {
    id: number;
    user_id: number;
    company_id: number | null;
    fecha_marcacion: string;
    latitud: string;
    longitud: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    company: {
        id: number;
        name: string;
    } | null;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    data: Asistencia[];
}

interface Props {
    asistencias: PaginationData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Personal',
        href: '#',
    },
    {
        title: 'Historial de Asistencias',
        href: '/admin/asistencias',
    },
];

export default function AdminHistory({ asistencias }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Búsqueda real por backend (sin debounce para simplificar o usando router.get)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        router.get('/admin/asistencias', { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setLoading(true);
        router.get('/admin/asistencias', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        setLoading(true);
        router.get(url, { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de Asistencias" />

            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        Historial Global de Asistencias
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monitorea las entradas y salidas de todo el personal (Influencers y Camarógrafos) registrados por biometría.
                    </p>
                </div>

                <Card className="border-sidebar-border/40 bg-background/50 backdrop-blur-sm shadow-sm">
                    <CardHeader className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sidebar-border/30">
                        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md flex items-center">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por usuario o empresa..."
                                className="w-full bg-background pl-8 pr-24"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-16 h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                                    onClick={handleClearSearch}
                                >
                                    Limpiar
                                </Button>
                            )}
                            <Button type="submit" size="sm" className="absolute right-1 leading-none h-7 px-3 bg-brand/10 text-brand hover:bg-brand hover:text-white" disabled={loading}>
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Buscar"}
                            </Button>
                        </form>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-sidebar-border/40 bg-muted/20">
                                    <TableHead className="font-bold w-[250px]">Usuario</TableHead>
                                    <TableHead className="font-bold">Empresa Asignada</TableHead>
                                    <TableHead className="font-bold">Fecha y Hora</TableHead>
                                    <TableHead className="font-bold">Ubicación GPS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && asistencias.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                            Cargando historial...
                                        </TableCell>
                                    </TableRow>
                                ) : asistencias.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            No se encontraron registros de asistencia.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    asistencias.data.map((registro) => (
                                        <TableRow key={registro.id} className="border-sidebar-border/20 group hover:bg-brand/5 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="font-semibold truncate">{registro.user.name}</span>
                                                        <span className="text-xs text-muted-foreground truncate">{registro.user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {registro.company ? (
                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex w-fit items-center gap-1.5 font-medium">
                                                        <Building2 className="w-3 h-3" />
                                                        {registro.company.name}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-normal">
                                                        Oficina General
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <span className="font-medium">
                                                        {new Date(registro.fecha_marcacion).toLocaleString('es-ES', {
                                                            year: 'numeric', month: 'short', day: '2-digit',
                                                            hour: '2-digit', minute: '2-digit',
                                                            hour12: true
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`https://www.google.com/maps?q=${registro.latitud},${registro.longitud}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-mono bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-2 py-1 rounded-md transition-colors"
                                                    title="Ver en Google Maps"
                                                >
                                                    <MapPin className="w-3 h-3 text-red-500" />
                                                    {Number(registro.latitud).toFixed(5)}, {Number(registro.longitud).toFixed(5)}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground truncate max-w-[150px] block" title={registro.dispositivo_info}>
                                                    {registro.dispositivo_info || 'WebAuthn Device'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Paginación */}
                    {asistencias.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-sidebar-border/40 p-4 bg-muted/10">
                            <p className="text-xs text-muted-foreground">
                                Mostrando página <span className="font-bold text-foreground">{asistencias.current_page}</span> de <span className="font-bold text-foreground">{asistencias.last_page}</span>
                                <span className="hidden sm:inline"> (Total: {asistencias.total} registros)</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(`?page=${asistencias.current_page - 1}`)}
                                    disabled={asistencias.current_page === 1 || loading}
                                    className="h-8 px-2 bg-background hover:bg-muted"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    <span className="hidden sm:inline">Anterior</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(`?page=${asistencias.current_page + 1}`)}
                                    disabled={asistencias.current_page === asistencias.last_page || loading}
                                    className="h-8 px-2 bg-background hover:bg-muted"
                                >
                                    <span className="hidden sm:inline">Siguiente</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
