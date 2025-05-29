import { relations } from 'drizzle-orm'
import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

// Enums
export const estadoOfertaEnum = pgEnum('estado_oferta', [
  'activa',
  'vencida',
  'renovada',
  'cerrada'
])
export const estadoEntrevistaEnum = pgEnum('estado_entrevista', [
  'revision_pendiente',
  'cv_aprobado',
  'cv_rechazado',
  'programada',
  'completada',
  'cancelada'
])
export const estadoPostulacionEnum = pgEnum('estado_postulacion', [
  'enviada',
  'en_revision',
  'aprobada',
  'rechazada',
  'entrevistada',
  'seleccionada',
  'no_seleccionada'
])
export const tipoEvaluacionEnum = pgEnum('tipo_evaluacion', [
  'fisica',
  'psicologica',
  'aptitud'
])
export const tipoTrabajoEnum = pgEnum('tipo_trabajo', [
  'tiempo_completo',
  'medio_tiempo',
  'contrato'
])

// Tabla de áreas
export const areas = pgTable('areas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Tabla de ofertas laborales
export const jobOffers = pgTable('job_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  location: text('location').notNull(),
  workType: tipoTrabajoEnum('work_type').notNull(),
  maxCandidates: integer('max_candidates').default(1).notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  status: estadoOfertaEnum('status').default('activa').notNull(),
  areaId: uuid('area_id')
    .references(() => areas.id)
    .notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Tabla de requisitos de trabajo
export const jobRequirements = pgTable('job_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobOfferId: uuid('job_offer_id')
    .references(() => jobOffers.id, { onDelete: 'cascade' })
    .notNull(),
  requirement: text('requirement').notNull(),
  isRequired: boolean('is_required').default(true).notNull(),
  category: text('category'), // ej: 'educacion', 'experiencia', 'habilidades', 'certificaciones'
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Tabla de beneficios del trabajo
export const jobBenefits = pgTable('job_benefits', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobOfferId: uuid('job_offer_id')
    .references(() => jobOffers.id, { onDelete: 'cascade' })
    .notNull(),
  benefit: text('benefit').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Tabla de CVs de los postulantes
export const cvs = pgTable('cvs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // ID del usuario postulante de Clerk
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(), // URL del archivo PDF
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull()
})

// Tabla de postulaciones laborales
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobOfferId: uuid('job_offer_id')
    .references(() => jobOffers.id)
    .notNull(),
  userId: text('user_id').notNull(),
  cvId: uuid('cv_id')
    .references(() => cvs.id)
    .notNull(),
  status: estadoPostulacionEnum('status').default('enviada').notNull(),
  cvReviewedAt: timestamp('cv_reviewed_at'),
  cvMeetsRequirements: boolean('cv_meets_requirements'),
  isSelected: boolean('is_selected').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Tabla de entrevistas
export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicationId: uuid('application_id')
    .references(() => jobApplications.id, { onDelete: 'cascade' })
    .notNull(),
  scheduledAt: timestamp('scheduled_at'),
  location: text('location'), // Ubicación de la empresa para entrevista presencial
  status: estadoEntrevistaEnum('status')
    .default('revision_pendiente')
    .notNull(),
  interviewScore: decimal('interview_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Tabla de tipos de evaluación para ofertas laborales
export const jobEvaluations = pgTable('job_evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobOfferId: uuid('job_offer_id')
    .references(() => jobOffers.id, { onDelete: 'cascade' })
    .notNull(),
  evaluationType: tipoEvaluacionEnum('evaluation_type').notNull(),
  isRequired: boolean('is_required').default(true).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(), // Peso en el cálculo de puntuación final
  rubric: jsonb('rubric'), // Objeto JSON con criterios de evaluación
  maxScore: decimal('max_score', { precision: 5, scale: 2 })
    .default('100')
    .notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Tabla de resultados de evaluaciones individuales
export const evaluationResults = pgTable('evaluation_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  interviewId: uuid('interview_id')
    .references(() => interviews.id, { onDelete: 'cascade' })
    .notNull(),
  jobEvaluationId: uuid('job_evaluation_id')
    .references(() => jobEvaluations.id)
    .notNull(),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Relaciones
export const areasRelations = relations(areas, ({ many }) => ({
  jobOffers: many(jobOffers)
}))

export const jobOffersRelations = relations(jobOffers, ({ one, many }) => ({
  area: one(areas, {
    fields: [jobOffers.areaId],
    references: [areas.id]
  }),
  requirements: many(jobRequirements),
  benefits: many(jobBenefits),
  evaluations: many(jobEvaluations),
  applications: many(jobApplications)
}))

export const jobRequirementsRelations = relations(
  jobRequirements,
  ({ one }) => ({
    jobOffer: one(jobOffers, {
      fields: [jobRequirements.jobOfferId],
      references: [jobOffers.id]
    })
  })
)

export const jobBenefitsRelations = relations(jobBenefits, ({ one }) => ({
  jobOffer: one(jobOffers, {
    fields: [jobBenefits.jobOfferId],
    references: [jobOffers.id]
  })
}))

export const cvsRelations = relations(cvs, ({ many }) => ({
  applications: many(jobApplications)
}))

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    jobOffer: one(jobOffers, {
      fields: [jobApplications.jobOfferId],
      references: [jobOffers.id]
    }),
    cv: one(cvs, {
      fields: [jobApplications.cvId],
      references: [cvs.id]
    }),
    interview: one(interviews)
  })
)

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  application: one(jobApplications, {
    fields: [interviews.applicationId],
    references: [jobApplications.id]
  }),
  evaluationResults: many(evaluationResults)
}))

export const jobEvaluationsRelations = relations(
  jobEvaluations,
  ({ one, many }) => ({
    jobOffer: one(jobOffers, {
      fields: [jobEvaluations.jobOfferId],
      references: [jobOffers.id]
    }),
    results: many(evaluationResults)
  })
)

export const evaluationResultsRelations = relations(
  evaluationResults,
  ({ one }) => ({
    interview: one(interviews, {
      fields: [evaluationResults.interviewId],
      references: [interviews.id]
    }),
    jobEvaluation: one(jobEvaluations, {
      fields: [evaluationResults.jobEvaluationId],
      references: [jobEvaluations.id]
    })
  })
)
