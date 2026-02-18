import { useState } from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import type { BreadcrumbItem } from '@/types'
import type { Contact, ContactForm } from '@/types/contact'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'

interface PageProps {
  contact: Contact
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Contactos', href: '/contacts' },
  { title: 'Editar Contacto', href: '' },
]

export default function Edit() {
  const { contact } = usePage<PageProps>().props
  const { data, setData, put, processing, errors } = useForm<ContactForm>({
    nombrecompleto: contact.nombrecompleto,
    correoelectronico: contact.correoelectronico,
    presupuesto: parseFloat(contact.presupuesto.replace('Bs. ', '').replace(',', '.')),
    celular: contact.celular,
    descripcion: contact.descripcion,
    empresa: contact.empresa,
    estado: contact.estado,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('contacts.update', contact.id), {
      onSuccess: () => {
        toast.success('Contacto actualizado exitosamente')
      },
      onError: () => {
        toast.error('Error al actualizar el contacto')
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Contacto" />

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={route('contacts.index')}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Contacto</h1>
            <p className="text-muted-foreground">
              Actualiza la información del contacto
            </p>
          </div>
        </div>

        <Card className="rounded-lg border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Información del Contacto</CardTitle>
            <CardDescription>
              Modifica los campos necesarios y guarda los cambios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombrecompleto">
                    Nombre Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombrecompleto"
                    value={data.nombrecompleto}
                    onChange={(e) => setData('nombrecompleto', e.target.value)}
                    placeholder="Juan Pérez"
                    required
                  />
                  {errors.nombrecompleto && (
                    <p className="text-sm text-destructive">{errors.nombrecompleto}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correoelectronico">
                    Correo Electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="correoelectronico"
                    type="email"
                    value={data.correoelectronico}
                    onChange={(e) => setData('correoelectronico', e.target.value)}
                    placeholder="juan@example.com"
                    required
                  />
                  {errors.correoelectronico && (
                    <p className="text-sm text-destructive">{errors.correoelectronico}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="empresa"
                    value={data.empresa}
                    onChange={(e) => setData('empresa', e.target.value)}
                    placeholder="Empresa S.A."
                    required
                  />
                  {errors.empresa && (
                    <p className="text-sm text-destructive">{errors.empresa}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">
                    Celular <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="celular"
                    value={data.celular}
                    onChange={(e) => setData('celular', e.target.value)}
                    placeholder="+591 71234567"
                    required
                  />
                  {errors.celular && (
                    <p className="text-sm text-destructive">{errors.celular}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presupuesto">
                    Presupuesto (Bs.) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      Bs.
                    </span>
                    <Input
                      id="presupuesto"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.presupuesto}
                      onChange={(e) => setData('presupuesto', e.target.value)}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.presupuesto && (
                    <p className="text-sm text-destructive">{errors.presupuesto}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <div className="flex items-center space-x-4">
                    <Switch
                      id="estado"
                      checked={data.estado || false}
                      onCheckedChange={(checked) => setData('estado', checked)}
                    />
                    <Badge
                      variant={data.estado ? 'default' : 'secondary'}
                      className="flex items-center space-x-1 py-1"
                    >
                      {data.estado ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      <span>{data.estado ? 'Revisado' : 'Pendiente'}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="descripcion"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Describe el proyecto o necesidad del contacto..."
                  rows={4}
                  required
                />
                {errors.descripcion && (
                  <p className="text-sm text-destructive">{errors.descripcion}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" asChild disabled={processing}>
                  <Link href={route('contacts.index')}>Cancelar</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Contacto'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
