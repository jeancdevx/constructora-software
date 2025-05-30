import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default async function RRHHPage() {
  return (
    <div className='flex items-center gap-x-4'>
      <Button asChild>
        <Link href='/rrhh/areas'>Ir a Áreas</Link>
      </Button>
      <Button asChild>
        <Link href='/rrhh/job-offers'>Ir a Ofertas de Empleo</Link>
      </Button>
    </div>
  )
}
