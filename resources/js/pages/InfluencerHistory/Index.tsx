
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, CalendarIcon, Search } from "lucide-react"

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Type definitions
type Influencer = {
    id: number;
    name: string;
};

type HistoryItem = {
    id: number;
    company_name: string;
    company_logo: string | null;
    count: number;
    dates: string[];
    latest_date: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Historial Influencers',
        href: '/admin/influencer-history',
    },
];

export default function InfluencerHistoryIndex() {
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch influencers on mount
    useEffect(() => {
        axios.get('/api/influencers/list')
            .then(response => setInfluencers(response.data))
            .catch(error => console.error("Error fetching influencers:", error));
    }, []);

    // Fetch history manually
    const handleSearch = () => {
        if (!selectedInfluencer) return;

        setLoading(true);
        setHasSearched(true);
        const params: any = {};
        if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd');

        axios.get(`/api/influencers/${selectedInfluencer.id}/history`, { params })
            .then(response => {
                setHistory(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching history:", error);
                setLoading(false);
            });
    };

    // Filter influencers for the dropdown
    const filteredInfluencers = useMemo(() => {
        return influencers.filter(inf =>
            inf.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [influencers, searchQuery]);

    const handleSelectInfluencer = (influencer: Influencer) => {
        setSelectedInfluencer(influencer);
        setSearchQuery(""); // clear search
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial Influencer" />
            <div className="p-6 text-white min-h-screen">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CalendarMonthIcon className="text-red-500 !text-4xl" />
                        Historial de Visitas
                    </h1>
                    <p className="text-gray-400 mt-2">Consulta las empresas visitadas por tus influencers en un rango de fechas.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Panel */}
                    <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-fit space-y-6">

                        <div className="space-y-2">
                            <Label className="text-gray-300 font-semibold">Influencer</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between bg-gray-900 text-white border-gray-600 hover:bg-gray-700 hover:text-white"
                                    >
                                        {selectedInfluencer
                                            ? selectedInfluencer.name
                                            : "Seleccionar influencer..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-gray-800 border-gray-700 text-white">
                                    <Command>
                                        <CommandInput placeholder="Buscar..." className="text-white placeholder:text-gray-400" />
                                        <CommandList>
                                            <CommandEmpty>No encontrado.</CommandEmpty>
                                            <CommandGroup>
                                                {influencers.map((inf) => (
                                                    <CommandItem
                                                        key={inf.id}
                                                        value={inf.name}
                                                        onSelect={() => {
                                                            handleSelectInfluencer(inf)
                                                            setOpen(false)
                                                        }}
                                                        className="data-[selected='true']:bg-red-600 data-[selected='true']:text-white cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedInfluencer?.id === inf.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {inf.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300 font-semibold">Fecha Inicio</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-gray-900 border-gray-600 text-white hover:bg-gray-700 hover:text-white",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "P", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700 text-white" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                        className="bg-gray-800 text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300 font-semibold">Fecha Fin</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal bg-gray-900 border-gray-600 text-white hover:bg-gray-700 hover:text-white",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "P", { locale: es }) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700 text-white" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                        className="bg-gray-800 text-white"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2"
                            onClick={handleSearch}
                            disabled={loading || !selectedInfluencer}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Buscando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    Buscar
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Summary Card */}
                        {hasSearched && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
                                    <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Empresas Distintas</h3>
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-white">{history.length}</span>
                                        <span className="text-sm text-gray-500">empresas</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col justify-between">
                                    <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Visitas</h3>
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold text-white">
                                            {history.reduce((acc, curr) => acc + curr.count, 0)}
                                        </span>
                                        <span className="text-sm text-gray-500">visitas</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-900/50">
                                    <TableRow className="border-gray-700 hover:bg-gray-900/50">
                                        <TableHead className="text-gray-300 font-bold py-4 pl-6">Empresa</TableHead>
                                        <TableHead className="text-gray-300 font-bold py-4">Fecha y Hora</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-20 text-gray-400">
                                                Cargando...
                                            </TableCell>
                                        </TableRow>
                                    ) : !hasSearched ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-20 text-gray-500">
                                                Selecciona un influencer y fechas, luego presiona "Buscar".
                                            </TableCell>
                                        </TableRow>
                                    ) : history.length > 0 ? (
                                        history.map((item) => (
                                            <TableRow key={item.id} className="border-gray-700 hover:bg-gray-750 transition-colors">
                                                <TableCell className="font-medium pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        {item.company_logo ? (
                                                            <img src={'/storage/' + item.company_logo} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-600" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-mono">N/A</div>
                                                        )}
                                                        <div>
                                                            <div className="text-white text-lg font-medium">{item.company_name}</div>
                                                            <div className="text-sm text-gray-400 mt-1">
                                                                {item.count} {item.count === 1 ? 'visita' : 'visitas'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-300 py-4 text-base align-top">
                                                    <div className="flex flex-col gap-1">
                                                        {item.dates.map((date, index) => (
                                                            <span key={index} className="text-gray-300">
                                                                {date}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center py-20 text-gray-500">
                                                No se encontraron visitas para este rango.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
