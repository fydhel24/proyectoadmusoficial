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
                {/* Estadísticas con Colores */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-50/50 shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-300">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-3 text-white shadow-lg">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-blue-700 text-sm font-semibold">Total Empresas</p>
                                    <p className="text-3xl font-bold text-blue-900">{empresas.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-50/50 shadow-md transition-all duration-300 hover:shadow-lg hover:border-green-300">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 p-3 text-white shadow-lg">
                                    <LinkIcon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-green-700 text-sm font-semibold">Total Links</p>
                                    <p className="text-3xl font-bold text-green-900">{allRegistros.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-50/50 shadow-md transition-all duration-300 hover:shadow-lg hover:border-purple-300 sm:col-span-2 md:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 p-3 text-white shadow-lg">
                                    <VideoIcon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-purple-700 text-sm font-semibold">Resultados Filtrados</p>
                                    <p className="text-3xl font-bold text-purple-900">{filteredRegistros.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Formulario Moderno */}
                <Card className="border-l-4 border-l-blue-600 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/40 border-b-2 border-blue-200 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-2 text-white shadow-lg">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-blue-900">Agregar Nuevo Link</CardTitle>
                                <CardDescription className="text-blue-700">Completa la información para registrar un nuevo enlace de empresa</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Empresa */}
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="flex items-center gap-2 text-blue-900 font-semibold">
                                        <Building2 className="text-blue-600 h-4 w-4" />
                                        Empresa <span className="text-red-500">*</span>
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
                                        className="h-11 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <datalist id="empresa-list">
                                        {empresas.map((e) => (
                                            <option key={e.id} value={e.name} />
                                        ))}
                                    </datalist>
                                </div>

                                {/* Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="link" className="flex items-center gap-2 text-blue-900 font-semibold">
                                        <LinkIcon className="text-green-600 h-4 w-4" />
                                        Link del Video <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="link"
                                        type="url"
                                        value={data.link}
                                        onChange={(e) => setData('link', e.target.value)}
                                        required
                                        placeholder="https://www.tiktok.com/..."
                                        className="h-11 border-2 border-green-200 focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                {/* Mes */}
                                <div className="space-y-2">
                                    <Label htmlFor="mes" className="flex items-center gap-2 text-blue-900 font-semibold">
                                        <Calendar className="text-purple-600 h-4 w-4" />
                                        Mes de Referencia <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.mes} onValueChange={(val) => setData('mes', val)}>
                                        <SelectTrigger id="mes" className="h-11 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
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

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing} size="lg" className="gap-2 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg font-semibold">
                                    <Save className="h-5 w-5" />
                                    {processing ? 'Guardando...' : 'Guardar Información'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Listado Moderno */}
                <Card className="border-l-4 border-l-green-600 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/40 flex flex-col gap-4 space-y-0 border-b-2 border-green-200 pb-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 p-2 text-white shadow-lg">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-green-900">Empresas y Links</CardTitle>
                                <CardDescription className="text-green-700">
                                    Mostrando {paginatedRegistros.length} de {filteredRegistros.length} registros encontrados
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search className="text-gray-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Buscar empresa o link..."
                                    className="h-10 w-full pl-9 sm:w-[300px] border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <Button className="h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg font-semibold" onClick={() => setShowFilters(!showFilters)}>
                                <Filter className="h-4 w-4" />
                                {showFilters ? 'Ocultar Filtros' : 'Filtros'}
                            </Button>
                        </div>
                    </CardHeader>

                    {showFilters && (
                        <div className="bg-purple-50 animate-in fade-in slide-in-from-top-2 border-b-2 border-purple-200 p-6 duration-300">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label className="text-purple-900 text-xs font-semibold tracking-wider uppercase">
                                        Filtrar por empresa
                                    </Label>
                                    <Select
                                        value={filterEmpresa}
                                        onValueChange={(val) => {
                                            setFilterEmpresa(val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
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
                                    <Label className="text-purple-900 text-xs font-semibold tracking-wider uppercase">Filtrar por mes</Label>
                                    <Select
                                        value={filterMes}
                                        onValueChange={(val) => {
                                            setFilterMes(val === 'all' ? '' : val);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
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
                                    <Button className="h-10 gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md font-semibold" onClick={clearFilters}>
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
                                <TableHeader className="bg-gradient-to-r from-green-100 to-green-50 border-b-2 border-green-200">
                                    <TableRow className="hover:bg-green-100">
                                        <TableHead className="w-[200px] font-bold text-green-900">Empresa</TableHead>
                                        <TableHead className="font-bold text-green-900">Enlace del Video</TableHead>
                                        <TableHead className="w-[150px] text-center font-bold text-green-900">Mes</TableHead>
                                        <TableHead className="w-[150px] text-center font-bold text-green-900">Fecha</TableHead>
                                        <TableHead className="w-[100px] text-right font-bold text-green-900">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedRegistros.length > 0 ? (
                                        paginatedRegistros.map((r) => (
                                            <TableRow key={r.id} className="group border-b border-green-100 hover:bg-green-50/80 transition-colors duration-200">
                                                <TableCell>
                                                    <Select
                                                        value={inlineData[r.id]?.company_id?.toString()}
                                                        onValueChange={(val) => {
                                                            handleInlineChange(r.id, 'company_id', val);
                                                            setTimeout(() => handleInlineSave(r.id), 100);
                                                        }}
                                                    >
                                                        <SelectTrigger className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent shadow-none focus:ring-1 focus:ring-green-500">
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
                                                            className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent shadow-none focus:ring-1 focus:ring-green-500"
                                                        />
                                                        {inlineData[r.id]?.link && (
                                                            <Button
                                                                size="icon"
                                                                asChild
                                                                className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
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
                                                        <SelectTrigger className="hover:bg-background group-hover:bg-background h-9 justify-center border-none bg-transparent text-center shadow-none focus:ring-1 focus:ring-green-500">
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
                                                        className="hover:bg-background group-hover:bg-background h-9 border-none bg-transparent text-center shadow-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="icon"
                                                        onClick={() => eliminarRegistro(r.id)}
                                                        className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:scale-110"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-muted-foreground h-24 text-center text-gray-500">
                                                No se encontraron registros que coincidan con los criterios.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                    {/* Footer con Paginación */}
                    {totalPages > 1 && (
                        <div className="bg-gradient-to-r from-green-50 to-green-50/40 flex items-center justify-between border-t-2 border-green-200 p-6">
                            <p className="text-gray-600 text-sm">
                                Página <span className="text-green-900 font-bold">{currentPage}</span> de{' '}
                                <span className="text-green-900 font-bold">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
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
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`h-9 w-9 p-0 shadow-md transition-all ${
                                                    currentPage === pageNum
                                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                                        : 'bg-white border-2 border-green-300 text-green-700 hover:bg-green-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
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
