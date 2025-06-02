import { drizzle } from 'drizzle-orm/neon-http'

import 'dotenv/config'

import * as schema from '@/db/schema'

const db = drizzle(process.env.DATABASE_URL!, { schema })

const main = async () => {
  try {
    console.log('Seeding database')

    await db.delete(schema.areas)
    await db.delete(schema.jobOffers)
    await db.delete(schema.jobRequirements)
    await db.delete(schema.jobBenefits)
    await db.delete(schema.cvs)
    await db.delete(schema.jobApplications)
    await db.delete(schema.interviews)
    await db.delete(schema.jobEvaluations)
    await db.delete(schema.evaluationResults)

    // seed areas
    await db
      .insert(schema.areas)
      .values([
        { name: 'ingenieria' },
        { name: 'marketing' },
        { name: 'ventas' },
        { name: 'rrhh' },
        { name: 'finanzas' }
      ])

    console.log('Seeding finished ')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw new Error('Database seeding failed')
  }
}

main()
