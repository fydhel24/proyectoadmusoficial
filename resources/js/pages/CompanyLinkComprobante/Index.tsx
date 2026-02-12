'use client';

import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FileText,
    Filter,
    LinkIcon,
    Plus,
    Save,
    Search,
    Trash2,
    VideoIcon,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Types
interface Company {
    id: number;
    name: string;
}

interface Link {
    id: number;
    link: string;
}

interface CompanyLinkRecord {
    id: number;
    company: Company;
    link: Link;
    mes: string;
    fecha: string;
    comprobante?: {
        id: number;
    };
}

interface InlineDataItem {
    company_id: number;
    link: string;
    mes: string;
    fecha: string;
    comprobante_id: string;
}

interface Props {
    empresas: Company[];
    registros: CompanyLinkRecord[];
}

// Constants
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ITEMS_PER_PAGE = 10;

export default function Index({ empresas, registros }: Props) {
    const today = new Date();
    const defaultMes = MESES[today.getMonth()];
    const defaultFecha = today.toISOString().split('T')[0];

    // Form state
    const { data, setData, post, reset, processing } = useForm({
        company_id: '',
        link: '',
        mes: defaultMes,
        fecha: defaultFecha,
    });

    // Component state
    const [empresaNombre, setEmpresaNombre] = useState('');
    const [allRegistros, setAllRegistros] = useState(registros);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMes, setFilterMes] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Inline editing state
    const [inlineData, setInlineData] = useState<Record<number, InlineDataItem>>(() => {
        const mapa: Record<number, InlineDataItem> = {};
        registros.forEach((r) => {
            mapa[r.id] = {
                company_id: r.company.id,
                link: r.link.link,
                mes: r.mes,
                fecha: r.fecha?.slice(0, 10) || '',
                comprobante_id: r.comprobante?.id?.toString() || '',
            };
        });
        return mapa;
    });

    // Computed values
    const filteredRegistros = useMemo(() => {
        return allRegistros.filter((record) => {
            const matchesSearch =
                record.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.link.link.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMes = !filterMes || record.mes === filterMes;
            const matchesEmpresa = !filterEmpresa || record.company.id.toString() === filterEmpresa;

            return matchesSearch && matchesMes && matchesEmpresa;
        });
    }, [allRegistros, searchTerm, filterMes, filterEmpresa]);

    const paginatedRegistros = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRegistros.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRegistros, currentPage]);

    const totalPages = Math.ceil(filteredRegistros.length / ITEMS_PER_PAGE);

    // Helper functions
    const getEmpresaIdByName = (nombre: string): string => {
        const empresa = empresas.find((e) => e.name === nombre);
        return empresa ? empresa.id.toString() : '';
    };

    const showNotification = (message: string) => {
        if (message.includes('✅')) {
            toast.success(message.replace('✅', '').trim());
        } else if (message.includes('❌')) {
            toast.error(message.replace('❌', '').trim());
        } else if (message.includes('🗑')) {
            toast.info(message.replace('🗑', '').trim());
        } else {
            toast(message);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterMes('');
        setFilterEmpresa('');
        setCurrentPage(1);
    };

    // Event handlers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company-links.store'), {
            onSuccess: (response: any) => {
                reset();
                setEmpresaNombre('');
                showNotification('✅ Registro creado correctamente');

                const nuevo = response.props.flash.nuevoRegistro;
                if (nuevo) {
                    setAllRegistros((prev) => [nuevo, ...prev]);
                    setInlineData((prev) => ({
                        ...prev,
                        [nuevo.id]: {
                            company_id: nuevo.company_id,
                            link: nuevo.link.link,
                            mes: nuevo.mes,
                            fecha: nuevo.fecha,
                            comprobante_id: nuevo.comprobante_id || '',
                        },
                    }));
                }
            },
            onError: () => {
                showNotification('❌ Error al crear el registro');
            },
        });
        window.location.reload();
    };

    const handleInlineChange = (id: number, campo: keyof InlineDataItem, valor: string) => {
        setInlineData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [campo]: valor,
            },
        }));
    };

    const handleInlineSave = async (id: number) => {
        const campos = inlineData[id];

        // Validar que haya cambios antes de enviar
        if (!campos) return;

        try {
            const response = await fetch(route('company-links.update', id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    company_id: campos.company_id,
                    mes: campos.mes,
                    fecha: campos.fecha,
                    link: campos.link,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error HTTP ${response.status}:`, errorText);
                showNotification('❌ Error al guardar');
                return;
            }

            const json = await response.json();
            showNotification(json.message || '✅ Guardado correctamente');

            // Actualizar el registro en el estado local
            setAllRegistros((prev) =>
                prev.map((record) =>
                    record.id === id
                        ? {
                              ...record,
                              company_id: campos.company_id,
                              mes: campos.mes,
                              fecha: campos.fecha,
                              link: {
                                  ...record.link,
                                  link: campos.link,
                              },
                          }
                        : record,
                ),
            );
        } catch (error: any) {
            console.error('Error al guardar inline:', error);
            showNotification('❌ Error al guardar: ' + error.message);
        }
    };

    const eliminarRegistro = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

        try {
            const response = await fetch(route('company-links.destroy', id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ _method: 'DELETE' }),
            });

            if (response.ok) {
                setAllRegistros((prev) => prev.filter((r) => r.id !== id));
                const newData = { ...inlineData };
                delete newData[id];
                setInlineData(newData);
                showNotification('🗑 Registro eliminado correctamente');
            } else {
                throw new Error('Error en la respuesta');
            }
        } catch (error) {
            showNotification('❌ Error al eliminar');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <Head title="Links por Empresa" />

            {/* Header Moderno */}
            <div className="bg-background relative overflow-hidden border-b px-6 py-8">
                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary ring-primary/20 rounded-xl p-3 ring-1">
                            <LinkIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-3xl font-bold tracking-tight">Gestión de Links</h1>
                            <p className="text-muted-foreground">Administra los enlaces y comprobantes de cada empresa de forma profesional</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-muted/30 min-h-screen space-y-8 p-6">
                {/* Estadísticas Modernas */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Total Empresas</p>
                                    <p className="text-2xl font-bold">{empresas.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-green-500/10 p-3 text-green-600">
                                    <LinkIcon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Total Links</p>
                                    <p className="text-2xl font-bold">{allRegistros.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-md sm:col-span-2 md:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-purple-500/10 p-3 text-purple-600">
                                    <VideoIcon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Resultados Filtrados</p>
                                    <p className="text-2xl font-bold text-purple-600">{filteredRegistros.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Formulario Moderno */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="bg-muted/20 border-b pb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground rounded-lg p-2">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Agregar Nuevo Link</CardTitle>
                                <CardDescription>Completa la información para registrar un nuevo enlace de empresa</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Empresa */}
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="flex items-center gap-2">
                                        <Building2 className="text-muted-foreground h-4 w-4" />
                                        Empresa <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="company"
                                        list="empresa-list"
                                        value={empresaNombre}
                                        onChange={(e) => {
                                            const nombre = e.target.value;
                                            setEmpresaNombre(nombre);
                                            const idEncontrado = getEmpresaIdByName(nombre);
                                            setData('company_id', idEncontrado);
                                        }}
                                        required
                                        placeholder="Selecciona o busca una empresa..."
                                        className="h-11"
                                    />
                                    <datalist id="empresa-list">
                                        {empresas.map((e) => (
                                            <option key={e.id} value={e.name} />
                                        ))}
                                    </datalist>
                                </div>

                                {/* Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="link" className="flex items-center gap-2">
                                        <LinkIcon className="text-muted-foreground h-4 w-4" />
                                        Link del Video <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="link"
                                        type="url"
                                        value={data.link}
                                        onChange={(e) => setData('link', e.target.value)}
                                        required
                                        placeholder="https://www.tiktok.com/..."
                                        className="h-11"
                                    />
                                </div>

                                {/* Mes */}
                                <div className="space-y-2">
                                    <Label htmlFor="mes" className="flex items-center gap-2">
                                        <Calendar className="text-muted-foreground h-4 w-4" />
                                        Mes de Referencia <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.mes} onValueChange={(val) => setData('mes', val)}>
                                        <SelectTrigger id="mes" className="h-11">
                                            <SelectValue placeholder="Seleccione mes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MESES.map((m) => (
                                                <SelectItem key={m} value={m}>
                                                    {m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={processing} size="lg" className="gap-2 px-8">
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Guardar Información'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Listado Moderno */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="bg-muted/20 flex flex-col gap-4 space-y-0 border-b pb-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary rounded-lg p-2">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Empresas y Links</CardTitle>
                                <CardDescription>
                                    Mostrando {paginatedRegistros.length} de {filteredRegistros.length} registros encontrados
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Buscar empresa o link..."
                                    className="h-10 w-full pl-9 sm:w-[300px]"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <Button variant="outline" className="h-10 gap-2" onClick={() => setShowFilters(!showFilters)}>
                                <Filter className="h-4 w-4" />
                                {showFilters ? 'Ocultar Filtros' : 'Filtros'}
                            </Button>
                        </div>
                    </CardHeader>

                    {showFilters && (
                        <div className="bg-muted/10 animate-in fade-in slide-in-from-top-2 border-b p-6 duration-300">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                                        Filtrar por empresa
                                    </Label>
                                    <Select
                                        value={filterEmpresa}
                                        onValueChange={(val) => {
                                            setFilterEmpresa(val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Todas las empresas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las empresas</SelectItem>
                                            {empresas.map((e) => (
                                                <SelectItem key={e.id} value={e.id.toString()}>
                                                    {e.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Filtrar por mes</Label>
                                    <Select
                                        value={filterMes}
                                        onValueChange={(val) => {
                                            setFilterMes(val === 'all' ? '' : val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Todos los meses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los meses</SelectItem>
                                            {MESES.map((mes) => (
                                                <SelectItem key={mes} value={mes}>
                                                    {mes}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground h-10 gap-2" onClick={clearFilters}>
                                        <X className="h-4 w-4" />
                                        Limpiar filtros
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-[200px] font-semibold">Empresa</TableHead>
                                        <TableHead className="font-semibold">Enlace del Video</TableHead>
                                        <TableHead className="w-[150px] text-center font-semibold">Mes</TableHead>
                                        <TableHead className="w-[150px] text-center font-semibold">Fecha</TableHead>
                                        <TableHead className="w-[100px] text-right font-semibold">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRegistros.length > 0 ? (
                                        paginatedRegistros.map((r) => (
                                            <TableRow key={r.id} className="group hover:bg-muted/50 transition-colors">
                                                <TableCell>
                                                    <Select
                                                        value={inlineData[r.id]?.company_id?.toString()}
                                                        onValueChange={(val) => {
                                                            handleInlineChange(r.id, 'company_id', val);
                                                            setTimeout(() => handleInlineSave(r.id), 100);
                                                        }}
                                                    >
                                                        <SelectTrigger className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent shadow-none focus:ring-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {empresas.map((e) => (
                                                                <SelectItem key={e.id} value={e.id.toString()}>
                                                                    {e.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={inlineData[r.id]?.link || ''}
                                                            onChange={(e) => handleInlineChange(r.id, 'link', e.target.value)}
                                                            onBlur={() => handleInlineSave(r.id)}
                                                            className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent shadow-none focus:ring-1"
                                                        />
                                                        {inlineData[r.id]?.link && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                className="text-primary hover:text-primary hover:bg-primary/10 h-8 w-8"
                                                            >
                                                                <a href={inlineData[r.id]?.link} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={inlineData[r.id]?.mes}
                                                        onValueChange={(val) => {
                                                            handleInlineChange(r.id, 'mes', val);
                                                            setTimeout(() => handleInlineSave(r.id), 100);
                                                        }}
                                                    >
                                                        <SelectTrigger className="hover:bg-background group-hover:bg-background h-9 justify-center border-none bg-transparent text-center shadow-none focus:ring-1">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {MESES.map((mes) => (
                                                                <SelectItem key={mes} value={mes}>
                                                                    {mes}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="date"
                                                        value={inlineData[r.id]?.fecha || ''}
                                                        onChange={(e) => handleInlineChange(r.id, 'fecha', e.target.value)}
                                                        onBlur={() => handleInlineSave(r.id)}
                                                        className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent text-center shadow-none focus:ring-1"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => eliminarRegistro(r.id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                                                No se encontraron registros que coincidan con los criterios.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    {/* Footer con Paginación Shadcn */}
                    {totalPages > 1 && (
                        <div className="bg-muted/10 flex items-center justify-between border-t p-6">
                            <p className="text-muted-foreground text-sm">
                                Página <span className="text-foreground font-medium">{currentPage}</span> de{' '}
                                <span className="text-foreground font-medium">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-9 w-9 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        // Simple logic to show pages around current
                                        let pageNum = i + 1;
                                        if (totalPages > 5 && currentPage > 3) {
                                            pageNum = currentPage - 3 + i + 1;
                                            if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum)}
                                                className="h-9 w-9 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-9 w-9 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
