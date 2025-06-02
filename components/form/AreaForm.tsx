'use client'

import { useEffect, useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { Trash2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { Area } from '@/lib/types'
import { createArea, deleteArea, updateArea } from '@/actions/areas'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog'

interface AreaFormProps {
  initialData?: Area | null
  isCreating?: boolean
}

const formAreaSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de área es requerido')
    .max(100, 'El nombre de área no puede exceder los 100 caracteres')
})

const AreaForm = ({ initialData, isCreating }: AreaFormProps) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isEditing = !!initialData

  const form = useForm<z.infer<typeof formAreaSchema>>({
    resolver: zodResolver(formAreaSchema),
    defaultValues: {
      name: initialData?.name || ''
    }
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name
      })
    }
  }, [initialData, form])

  const onSubmit = async (values: z.infer<typeof formAreaSchema>) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('name', values.name)

        if (isEditing && initialData) {
          formData.append('id', initialData.id)
        }

        const result = isEditing
          ? await updateArea(formData)
          : await createArea(formData)

        if (result.success) {
          toast.success(result.message)

          if (!isEditing) {
            // Reset form after creating
            form.reset()
          }

          router.push('/rrhh/areas')
        } else {
          toast.error(result.message)
          // Handle field-specific errors
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              if (field === 'name') {
                form.setError('name', {
                  type: 'manual',
                  message: messages[0]
                })
              }
            })
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        toast.error('Error al procesar la solicitud')
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteArea(initialData?.id || '')

        if (result.success) {
          toast.success(result.message)
          setOpen(false)
          router.push('/rrhh/areas')
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error deleting area:', error)
        toast.error('Error al eliminar el área')
      }
    })
  }

  return (
    <>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {isCreating ? 'Crear Nueva Área' : 'Editar Área'}
          </h1>
          <p className='mt-2 text-muted-foreground'>
            {isCreating
              ? 'Complete el formulario para crear una nueva área de trabajo.'
              : 'Modifique los datos del área según sea necesario.'}
          </p>
        </div>

        {!isCreating && initialData && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='text-destructive hover:text-destructive'
                disabled={isPending}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente
                  el área <strong>&ldquo;{initialData.name}&rdquo;</strong> del
                  sistema.
                  {'\n\n'}
                  No podrás eliminar el área si tiene ofertas laborales
                  asociadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isPending}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  {isPending ? 'Eliminando...' : 'Eliminar área'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Área</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder='Ej: Recursos Humanos, Ingeniería, Marketing...'
                    disabled={isPending}
                    className='h-11'
                  />
                </FormControl>

                <FormDescription>
                  Ingresa el nombre del área de la empresa. Este campo es
                  obligatorio y debe tener un máximo de 100 caracteres.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-wrap items-center justify-center gap-x-4'>
            <Button type='submit' className='h-11' disabled={isPending}>
              {isPending
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                  ? 'Actualizar'
                  : 'Crear área'}
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-11'
              onClick={() => router.push('/rrhh/areas')}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default AreaForm
