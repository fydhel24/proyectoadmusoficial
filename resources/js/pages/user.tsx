import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    UserIcon,
    Search,
    UserPlus,
    MoreHorizontal,
    Trash2,
    Edit,
    KeyRound,
    Power,
    Shield,
    Mail,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce'; // I'll check if this exists or implement a simple one

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios y Roles',
        href: '/users-roles',
    },
];

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
}

interface PaginationData {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export default function UsersPermissions() {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [userIsActive, setUserIsActive] = useState(true);

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        axios
            .get('/api/users', {
                params: {
                    page,
                    search: debouncedSearch,
                    per_page: 10
                }
            })
            .then((response) => {
                setUsers(response.data.data);
                setPagination({
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    total: response.data.total,
                    per_page: response.data.per_page
                });
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                toast.error('Error al cargar usuarios');
            })
            .finally(() => setLoading(false));
    }, [page, debouncedSearch]);

    const fetchRoles = () => {
        axios
            .get('/api/roles')
            .then((response) => setRoles(response.data))
            .catch((error) => console.error('Error fetching roles:', error));
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditUserId(null);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setSelectedRole('');
        setUserIsActive(true);
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setIsEditMode(true);
        setEditUserId(user.id);
        setNewUserName(user.name);
        setNewUserEmail(user.email);
        setSelectedRole(user.roles[0]?.name || '');
        setUserIsActive(user.is_active);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim() || (!isEditMode && !newUserPassword.trim()) || !selectedRole) {
            return toast.error('Todos los campos son obligatorios');
        }

        setLoading(true);
        const payload = {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            role: selectedRole,
            is_active: userIsActive
        };

        const request = isEditMode
            ? axios.put(`/users/${editUserId}`, payload)
            : axios.post('/users', payload);

        request
            .then(() => {
                toast.success(isEditMode ? 'Usuario actualizado' : 'Usuario creado');
                setShowModal(false);
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error saving user:', error);
                toast.error(error.response?.data?.message || 'Error al guardar el usuario');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteUser = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        axios
            .delete(`/users/${id}`)
            .then(() => {
                toast.success('Usuario eliminado');
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                toast.error('Error al eliminar el usuario');
            });
    };

    const toggleUserStatus = (user: User) => {
        axios
            .patch(`/users/${user.id}/toggle-status`)
            .then((response) => {
                const newStatus = response.data.is_active;
                toast.success(`Usuario ${newStatus ? 'activado' : 'desactivado'}`);
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
            })
            .catch((error) => {
                console.error('Error toggling status:', error);
                toast.error('Error al cambiar el estado');
            });
    };

    const handleResetPassword = (user: User) => {
        if (!confirm(`¿Seguro que deseas restablecer la contraseña de ${user.name}? Se pondrá igual al email.`)) {
            return;
        }

        axios
            .put(`/users/${user.id}/reset-password`)
            .then(() => {
                toast.success('Contraseña restablecida correctamente');
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
                toast.error('Error al restablecer la contraseña');
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios y Roles" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Usuarios</h1>
                        <p className="text-sm text-muted-foreground">Administra los accesos, roles y estados de los usuarios del sistema.</p>
                    </div>
                    <Button onClick={openCreateModal} className="w-full md:w-auto bg-brand hover:bg-brand/90 text-white font-bold">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                <Card className="border-sidebar-border/40 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por nombre o email..."
                                className="w-full bg-background pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-sidebar-border/40">
                                    <TableHead className="w-[250px] font-bold">Usuario</TableHead>
                                    <TableHead className="font-bold">Email</TableHead>
                                    <TableHead className="font-bold">Rol</TableHead>
                                    <TableHead className="font-bold">Estado</TableHead>
                                    <TableHead className="text-right font-bold w-[100px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-brand" />
                                                <span>Cargando...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No se encontraron usuarios.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id} className="border-sidebar-border/20 group hover:bg-brand/5">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                                                        <UserIcon className="h-4 w-4" />
                                                    </div>
                                                    <span>{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map(role => (
                                                            <Badge key={role.id} variant="secondary" className="bg-sidebar-accent/50 text-[10px] font-bold uppercase tracking-wider">
                                                                <Shield className="mr-1 h-3 w-3" />
                                                                {role.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs italic text-muted-foreground">Sin rol</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleUserStatus(user)}
                                                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${user.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                                    >
                                                        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${user.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                                    </button>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.is_active ? 'text-green-600' : 'text-slate-500'}`}>
                                                        {user.is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 transition-all hover:bg-brand/10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Abrir menú</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[180px] border-sidebar-border/40 bg-background/95 backdrop-blur-md">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openEditModal(user)} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar Info
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleResetPassword(user)} className="cursor-pointer">
                                                            <KeyRound className="mr-2 h-4 w-4" />
                                                            Reiniciar Pass
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-sidebar-border/40 p-4">
                            <p className="text-xs text-muted-foreground">
                                Mostrando <span className="font-bold text-foreground">{users.length}</span> de <span className="font-bold text-foreground">{pagination.total}</span> usuarios
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                    disabled={page === 1 || loading}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex h-8 items-center gap-1 px-2 text-sm font-bold">
                                    {page} <span className="text-muted-foreground">/</span> {pagination.last_page}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(prev => Math.min(prev + 1, pagination.last_page))}
                                    disabled={page === pagination.last_page || loading}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px] border-sidebar-border/40">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? 'Modifica los datos del usuario aquí. Haz clic en guardar cuando termines.'
                                : 'Completa los datos para el nuevo usuario del sistema.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="juan@ejemplo.com"
                                required
                            />
                        </div>
                        {!isEditMode && (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol del Sistema</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border-sidebar-border/40">
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setUserIsActive(!userIsActive)}
                                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${userIsActive ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${userIsActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <Label className="cursor-pointer" onClick={() => setUserIsActive(!userIsActive)}>
                                Cuenta Activa
                            </Label>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-brand text-white hover:bg-brand/90 font-bold">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? 'Actualizar' : 'Crear Usuario'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
