'use client'

import { useState, useTransition } from 'react'

import { Trash2 } from 'lucide-react'

import { toast } from 'sonner'

import { deleteArea } from '@/actions/areas'

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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteAreaButtonProps {
  areaId: string
  areaName: string
}

export default function DeleteAreaButton({
  areaId,
  areaName
}: DeleteAreaButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteArea(areaId)

        if (result.success) {
          toast.success(result.message)
          setOpen(false)
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>{' '}
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            área <strong>&ldquo;{areaName}&rdquo;</strong> del sistema.
            {'\n\n'}
            No podrás eliminar el área si tiene ofertas laborales asociadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
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
  )
}
