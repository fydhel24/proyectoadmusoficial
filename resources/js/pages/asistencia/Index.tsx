import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { RegisterDevice } from './RegisterDevice';
import { MainPanel } from './MainPanel';
import { BreadcrumbItem } from '@/types';

interface AsistenciaProps {
    hasDevice: boolean;
    asistencias: any[];
    empresas: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Asistencia', href: '/asistencia' }
];

export default function Index({ hasDevice, asistencias, empresas }: AsistenciaProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Control de Asistencia" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6 shadow-none">
                {hasDevice ? (
                    <MainPanel asistencias={asistencias} empresas={empresas} />
                ) : (
                    <RegisterDevice />
                )}
            </div>
        </AppLayout>
    );
}
