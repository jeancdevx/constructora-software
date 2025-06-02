import Link from 'next/link'

import { Edit } from 'lucide-react'

import { getAreas } from '@/db/queries'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default async function AreasPage() {
  const areas = await getAreas()

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold md:text-5xl'>Áreas</h1>

        <Button asChild>
          <Link href='/rrhh/areas/create'>Crear Área</Link>
        </Button>
      </div>

      {areas.length === 0 ? (
        <div className='py-8 text-center'>
          <p className='mb-4 text-muted-foreground'>No hay áreas registradas</p>
          <Button asChild>
            <Link href='/rrhh/areas/create'>Crear primera área</Link>
          </Button>
        </div>
      ) : (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Última actualización</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map(area => (
                <TableRow key={area.id}>
                  <TableCell className='font-medium'>{area.name}</TableCell>
                  <TableCell>
                    {new Date(area.createdAt).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    {new Date(area.updatedAt).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button asChild variant='ghost' size='sm'>
                      <Link href={`/rrhh/areas/${area.id}`}>
                        <Edit className='h-4 w-4' />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
