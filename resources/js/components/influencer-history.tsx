import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Type definitions
type Influencer = {
    id: number;
    name: string;
};

type HistoryItem = {
    id: number;
    company_name: string;
    company_logo: string | null;
    date: string;
    status: string;
};

export function InfluencerHistorySidebarItem() {
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);

    // Fetch influencers on mount
    useEffect(() => {
        axios.get('/api/influencers/list')
            .then(response => setInfluencers(response.data))
            .catch(error => console.error("Error fetching influencers:", error));
    }, []);

    // Fetch history when influencer is selected or dates change
    useEffect(() => {
        if (!selectedInfluencer) return;
        
        setLoading(true);
        const params: any = {};
        if (dateFilter.start) params.start_date = dateFilter.start;
        if (dateFilter.end) params.end_date = dateFilter.end;

        axios.get(`/api/influencers/${selectedInfluencer.id}/history`, { params })
            .then(response => {
                setHistory(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching history:", error);
                setLoading(false);
            });
    }, [selectedInfluencer, dateFilter]);

    // Filter influencers for the dropdown
    const filteredInfluencers = useMemo(() => {
        return influencers.filter(inf => 
            inf.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [influencers, searchQuery]);

    const handleSelectInfluencer = (influencer: Influencer) => {
        setSelectedInfluencer(influencer);
        setIsDialogOpen(true);
        setSearchQuery(""); // clear search
    };

    return (
        <>
            <div className="px-2 w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-white"
                        >
                            <SearchIcon className="mr-2 h-4 w-4" />
                            {selectedInfluencer ? selectedInfluencer.name : "Buscar historial influencer..."}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200" align="start">
                        <div className="p-2">
                            <Input 
                                placeholder="Buscar..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 bg-gray-900 border-gray-600 text-white focus-visible:ring-red-500"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredInfluencers.length > 0 ? (
                                filteredInfluencers.map((inf) => (
                                    <DropdownMenuItem 
                                        key={inf.id} 
                                        onSelect={() => handleSelectInfluencer(inf)}
                                        className="focus:bg-red-600 focus:text-white cursor-pointer"
                                    >
                                        {inf.name}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-gray-500 text-center">No encontrado.</div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl bg-gray-900 text-white border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                             <CalendarMonthIcon /> 
                             Historial de Visitas: <span className="text-red-500">{selectedInfluencer?.name}</span>
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex gap-4 my-4 items-end">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="start_date">Fecha Inicio</Label>
                            <Input 
                                type="date" 
                                id="start_date"
                                className="bg-gray-800 border-gray-700 text-white"
                                value={dateFilter.start}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="end_date">Fecha Fin</Label>
                            <Input 
                                type="date" 
                                id="end_date"
                                className="bg-gray-800 border-gray-700 text-white"
                                value={dateFilter.end}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>
                        {/* <Button 
                            variant="secondary" 
                            onClick={() => setDateFilter({ start: "", end: "" })}
                        >
                            Limpiar
                        </Button> */}
                    </div>

                    <div className="rounded-md border border-gray-800 bg-gray-950/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-gray-900">
                                    <TableHead className="text-gray-400">Empresa</TableHead>
                                    <TableHead className="text-gray-400">Fecha y Hora</TableHead>
                                    <TableHead className="text-gray-400">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            Cargando historial...
                                        </TableCell>
                                    </TableRow>
                                ) : history.length > 0 ? (
                                    history.map((item) => (
                                        <TableRow key={item.id} className="border-gray-800 hover:bg-gray-900">
                                            <TableCell className="font-medium flex items-center gap-3">
                                                {item.company_logo && (
                                                    <img src={'/storage/' + item.company_logo} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                )}
                                                {item.company_name}
                                            </TableCell>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                    item.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            No se encontraron visitas en este rango de fechas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
