import { useEffect, useState, useMemo } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Contact } from '@/types/contact';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2, CheckCircle, Clock, Mail } from 'lucide-react';
import { ContactCreateDialog } from './components/ContactCreateDialog';
import { ContactFilters } from './components/ContactFilters';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Contactos', href: route('contacts.index') },
];

import { type PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
  contacts: Contact[];
  flash: {
    success?: string;
  };
}

export default function Index() {
  const { contacts, flash = {} } = usePage<PageProps>().props;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Show flash message
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['contacts'] });
    }, 10000); // dynamic polling to reduce server load

    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (contactToDelete) {
      router.delete(route('contacts.destroy', contactToDelete.id), {
        onSuccess: () => {
          toast.success('Contacto eliminado exitosamente');
          setDeleteDialogOpen(false);
          setContactToDelete(null);
        },
        onError: () => {
          toast.error('Error al eliminar el contacto');
        },
      });
    }
  };

  const handleToggleEstado = (contact: Contact) => {
    setLoadingStates((prev) => ({ ...prev, [contact.id]: true }));

    router.patch(route('contacts.toggle-estado', contact.id), {}, {
      preserveScroll: true,
      onFinish: () => {
        setLoadingStates((prev) => ({ ...prev, [contact.id]: false }));
      }
    });
  };

  // Memoized filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.nombrecompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.correoelectronico.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.empresa.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'reviewed' && contact.estado) ||
        (statusFilter === 'pending' && !contact.estado);

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contactos" />

      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 bg-background">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Gestión de <span className="text-brand">Contactos</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Seguimiento de leads y presupuestos en tiempo real
            </p>
          </div>
          <ContactCreateDialog />
        </div>

        <div className="grid gap-6">
          <Card className="rounded-xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <CardTitle className="text-xl font-bold">Leads Registrados</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Mostrando {filteredContacts.length} de {contacts.length} registros
                  </CardDescription>
                </div>
              </div>
              <ContactFilters
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto min-h-[400px]">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="font-bold py-4 text-foreground">Nombre / Empresa</TableHead>
                      <TableHead className="font-bold py-4 text-foreground">Contacto</TableHead>
                      <TableHead className="font-bold py-4 text-foreground">Presupuesto</TableHead>
                      <TableHead className="font-bold py-4 text-center text-foreground">Estado</TableHead>
                      <TableHead className="font-bold py-4 text-right pr-6 text-foreground">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center bg-card">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-brand/10 p-4">
                              <Mail className="h-8 w-8 text-brand" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-semibold text-foreground">Sin resultados</p>
                              <p className="text-sm text-muted-foreground">
                                No se encontraron registros que coincidan con los filtros.
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContacts.map((contact) => (
                        <TableRow key={contact.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0">
                          <TableCell className="py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground text-base leading-tight group-hover:text-brand transition-colors">
                                {contact.nombrecompleto}
                              </span>
                              <span className="text-sm text-muted-foreground font-medium">
                                {contact.empresa}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                                <Mail className="h-3.5 w-3.5 text-brand" />
                                {contact.correoelectronico}
                              </div>
                              <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                {contact.celular}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge variant="secondary" className="font-bold px-3 py-1 bg-brand/10 text-brand border-brand/20 hover:bg-brand/20 transition-colors text-base">
                              {contact.presupuesto}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-4">
                                <Switch
                                  checked={contact.estado}
                                  onCheckedChange={() => handleToggleEstado(contact)}
                                  disabled={loadingStates[contact.id]}
                                  className="data-[state=checked]:bg-green-500"
                                />
                                <Badge
                                  variant={contact.estado ? "outline" : "secondary"}
                                  className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2",
                                    contact.estado ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                                  )}
                                >
                                  {contact.estado ? 'Revisado' : 'Pendiente'}
                                </Badge>
                              </div>
                              {loadingStates[contact.id] && (
                                <div className="flex items-center gap-1 text-[10px] text-brand animate-pulse font-bold">
                                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                  SINCRONIZANDO...
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 px-3 border-brand/20 text-brand hover:bg-brand hover:text-white transition-all shadow-sm"
                              >
                                <Link href={route('contacts.edit', contact.id)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(contact)}
                                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-destructive/20 gap-6 bg-card text-card-foreground shadow-2xl">
          <DialogHeader>
            <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-destructive">
              ¿Confirmar eliminación?
            </DialogTitle>
            <DialogDescription className="text-base pt-2 text-muted-foreground">
              Esta acción eliminará permanentemente la información de <strong className="text-foreground font-bold">{contactToDelete?.nombrecompleto}</strong>. <span className="block mt-1 font-medium text-destructive/80 italic">Esta acción no se puede deshacer.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="px-6 font-semibold border-border hover:bg-muted/50">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="px-8 font-bold shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-95">
              Eliminar Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// Utility to handle conditional classes if not available globally
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
