import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function RRHHEmpleosPage() {
  return (
    <>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col justify-center gap-y-2'>
          <h1 className='text-3xl font-semibold md:text-5xl'>
            Lista de empleos
          </h1>
          <p className='text-muted-foreground'>
            Empleos disponibles en la empresa
          </p>
        </div>

        <Button>
          <Link href='/rrhh/empleos/new'>Crear empleo</Link>
        </Button>
      </div>

      {/* tabla empleos */}
    </>
  )
}
