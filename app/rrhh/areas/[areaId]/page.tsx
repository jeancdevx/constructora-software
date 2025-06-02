import { notFound } from 'next/navigation'

import { getAreaById } from '@/db/queries'

import AreaForm from '@/components/form/AreaForm'
import FormLayout from '@/components/layout/FormLayout'

interface RRHHAreaIdPageProps {
  params: {
    areaId: string
  }
}

const RRHHAreaIdPage = async ({ params: { areaId } }: RRHHAreaIdPageProps) => {
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
        <AreaForm initialData={area} isCreating={isCreating} />
      </div>
    </FormLayout>
  )
}

export default RRHHAreaIdPage
