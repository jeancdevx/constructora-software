import { notFound } from 'next/navigation'

import { getAreaById } from '@/db/queries'

import AreaForm from '@/components/form/AreaForm'
import FormLayout from '@/components/layout/FormLayout'

interface RRHHAreaIdPageProps {
  params: Promise<{
    areaId: string
  }>
}

const RRHHAreaIdPage = async ({ params }: RRHHAreaIdPageProps) => {
  const { areaId } = await params
  const isCreating = areaId === 'create'

  let area = null

  if (!isCreating) {
    area = await getAreaById(areaId)

    if (!area) {
      notFound()
    }
  }

  const breadcrumbs = [
    { label: 'Áreas', href: '/rrhh/areas' },
    {
      label: isCreating ? 'Crear Área' : `Editar`
    }
  ]

  return (
    <FormLayout breadcrumbs={breadcrumbs}>
      <div className='space-y-6'>
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

        <AreaForm initialData={area} />
      </div>
    </FormLayout>
  )
}

export default RRHHAreaIdPage
