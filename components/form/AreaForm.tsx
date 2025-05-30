'use client'

import { useEffect, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { Area } from '@/lib/types'
import { createArea, updateArea } from '@/actions/areas'

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

interface AreaFormProps {
  initialData?: Area | null
}

const formAreaSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de área es requerido')
    .max(100, 'El nombre de área no puede exceder los 100 caracteres')
})

const AreaForm = ({ initialData }: AreaFormProps) => {
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

  return (
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
                ? 'Actualizar área'
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
  )
}

export default AreaForm
