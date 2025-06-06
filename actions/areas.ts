'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { areas } from '@/db/schema'

// Schema para validación
const createAreaSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de área es requerido')
    .max(100, 'El nombre de área no puede exceder los 100 caracteres')
})

const updateAreaSchema = z.object({
  id: z.string().uuid('ID de área inválido'),
  name: z
    .string()
    .min(1, 'El nombre de área es requerido')
    .max(100, 'El nombre de área no puede exceder los 100 caracteres')
})

// Tipo para el resultado de las acciones
type ActionResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function createArea(formData: FormData): Promise<ActionResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'Usuario no autenticado'
      }
    }

    const rawData = {
      name: formData.get('name') as string
    }

    const validatedData = createAreaSchema.parse(rawData)

    const existingArea = await db.query.areas.findFirst({
      where: eq(areas.name, validatedData.name)
    })

    if (existingArea) {
      return {
        success: false,
        message: 'Ya existe un área con ese nombre',
        errors: {
          name: ['Ya existe un área con ese nombre']
        }
      }
    }

    await db
      .insert(areas)
      .values({
        name: validatedData.name
      })
      .returning()

    revalidatePath('/rrhh/areas')
    revalidatePath('/rrhh')

    return {
      success: true,
      message: 'Área creada exitosamente'
    }
  } catch (error) {
    console.error('Error creating area:', error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      Object.entries(error.flatten().fieldErrors).forEach(([key, value]) => {
        if (value) {
          fieldErrors[key] = value
        }
      })

      return {
        success: false,
        message: 'Datos inválidos',
        errors: fieldErrors
      }
    }

    return {
      success: false,
      message: 'Error interno del servidor'
    }
  }
}

export async function updateArea(formData: FormData): Promise<ActionResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'Usuario no autenticado'
      }
    }

    const rawData = {
      id: formData.get('id') as string,
      name: formData.get('name') as string
    }

    const validatedData = updateAreaSchema.parse(rawData)

    const existingArea = await db.query.areas.findFirst({
      where: eq(areas.id, validatedData.id)
    })

    if (!existingArea) {
      return {
        success: false,
        message: 'Área no encontrada'
      }
    }

    const duplicateArea = await db.query.areas.findFirst({
      where: eq(areas.name, validatedData.name)
    })

    if (duplicateArea && duplicateArea.id !== validatedData.id) {
      return {
        success: false,
        message: 'Ya existe un área con ese nombre',
        errors: {
          name: ['Ya existe un área con ese nombre']
        }
      }
    }

    await db
      .update(areas)
      .set({
        name: validatedData.name,
        updatedAt: new Date()
      })
      .where(eq(areas.id, validatedData.id))

    revalidatePath('/rrhh/areas')
    revalidatePath('/rrhh')
    revalidatePath(`/rrhh/areas/${validatedData.id}`)

    return {
      success: true,
      message: 'Área actualizada exitosamente'
    }
  } catch (error) {
    console.error('Error updating area:', error)

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      Object.entries(error.flatten().fieldErrors).forEach(([key, value]) => {
        if (value) {
          fieldErrors[key] = value
        }
      })

      return {
        success: false,
        message: 'Datos inválidos',
        errors: fieldErrors
      }
    }

    return {
      success: false,
      message: 'Error interno del servidor'
    }
  }
}

export async function deleteArea(areaId: string): Promise<ActionResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        message: 'Usuario no autenticado'
      }
    }

    const idSchema = z.string().uuid('ID de área inválido')
    const validatedId = idSchema.parse(areaId)

    const existingArea = await db.query.areas.findFirst({
      where: eq(areas.id, validatedId)
    })

    if (!existingArea) {
      return {
        success: false,
        message: 'Área no encontrada'
      }
    }

    const relatedJobOffers = await db.query.jobOffers.findMany({
      where: (jobOffers, { eq }) => eq(jobOffers.areaId, validatedId)
    })

    if (relatedJobOffers.length > 0) {
      return {
        success: false,
        message:
          'No se puede eliminar el área porque tiene ofertas laborales asociadas'
      }
    }

    await db.delete(areas).where(eq(areas.id, validatedId))

    revalidatePath('/rrhh/areas')
    revalidatePath('/rrhh')

    return {
      success: true,
      message: 'Área eliminada exitosamente'
    }
  } catch (error) {
    console.error('Error deleting area:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'ID de área inválido'
      }
    }

    return {
      success: false,
      message: 'Error interno del servidor'
    }
  }
}
