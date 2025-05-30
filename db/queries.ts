import { cache } from 'react'

import { eq } from 'drizzle-orm'

import { db } from '.'
import { areas } from './schema'

export const getAreas = cache(async () => {
  const data = await db.query.areas.findMany({
    orderBy: (areas, { asc }) => [asc(areas.name)]
  })

  return data
})

export const getAreaById = cache(async (id: string) => {
  const data = await db.query.areas.findFirst({
    where: eq(areas.id, id)
  })

  return data
})
