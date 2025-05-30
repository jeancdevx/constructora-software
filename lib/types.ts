// Tipos inferidos del schema de la base de datos
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'

import {
  areas,
  cvs,
  estadoEntrevistaEnum,
  estadoOfertaEnum,
  estadoPostulacionEnum,
  evaluationResults,
  interviews,
  jobApplications,
  jobBenefits,
  jobEvaluations,
  jobOffers,
  jobRequirements,
  tipoEvaluacionEnum,
  tipoTrabajoEnum
} from '@/db/schema'

// === TIPOS BASE (SELECT - datos que lees de la DB) ===
export type Area = InferSelectModel<typeof areas>
export type JobOffer = InferSelectModel<typeof jobOffers>
export type JobRequirement = InferSelectModel<typeof jobRequirements>
export type JobBenefit = InferSelectModel<typeof jobBenefits>
export type JobEvaluation = InferSelectModel<typeof jobEvaluations>
export type CV = InferSelectModel<typeof cvs>
export type JobApplication = InferSelectModel<typeof jobApplications>
export type Interview = InferSelectModel<typeof interviews>
export type EvaluationResult = InferSelectModel<typeof evaluationResults>

// === TIPOS PARA INSERTAR (INSERT - datos que insertas en la DB) ===
export type NewArea = InferInsertModel<typeof areas>
export type NewJobOffer = InferInsertModel<typeof jobOffers>
export type NewJobRequirement = InferInsertModel<typeof jobRequirements>
export type NewJobBenefit = InferInsertModel<typeof jobBenefits>
export type NewJobEvaluation = InferInsertModel<typeof jobEvaluations>
export type NewCV = InferInsertModel<typeof cvs>
export type NewJobApplication = InferInsertModel<typeof jobApplications>
export type NewInterview = InferInsertModel<typeof interviews>
export type NewEvaluationResult = InferInsertModel<typeof evaluationResults>

// === TIPOS DE ENUMS ===
export type JobStatus = (typeof estadoOfertaEnum.enumValues)[number] // 'activa' | 'vencida' | 'renovada' | 'cerrada'
export type InterviewStatus = (typeof estadoEntrevistaEnum.enumValues)[number] // 'revision_pendiente' | 'cv_aprobado' | etc.
export type ApplicationStatus =
  (typeof estadoPostulacionEnum.enumValues)[number] // 'enviada' | 'en_revision' | etc.
export type EvaluationType = (typeof tipoEvaluacionEnum.enumValues)[number] // 'fisica' | 'psicologica' | 'aptitud'
export type WorkType = (typeof tipoTrabajoEnum.enumValues)[number] // 'tiempo_completo' | 'medio_tiempo' | 'contrato'

// === TIPOS COMPUESTOS (con relaciones) ===
export type JobOfferWithRelations = JobOffer & {
  area?: Area
  requirements?: JobRequirement[]
  benefits?: JobBenefit[]
  evaluations?: JobEvaluation[]
  applications?: JobApplicationWithRelations[]
}

export type JobApplicationWithRelations = JobApplication & {
  jobOffer?: JobOffer
  cv?: CV
  interview?: InterviewWithRelations
}

export type InterviewWithRelations = Interview & {
  application?: JobApplication
  evaluationResults?: EvaluationResultWithRelations[]
}

export type EvaluationResultWithRelations = EvaluationResult & {
  interview?: Interview
  jobEvaluation?: JobEvaluation
}

// === TIPOS PARA FORMULARIOS ===
export type JobOfferFormData = {
  // Datos básicos de la oferta
  title: string
  description: string
  salary?: string
  location: string
  workType: WorkType
  maxCandidates: number
  expiresAt: Date
  areaId: string

  // Arrays para requisitos y beneficios
  requirements: string[]
  benefits: string[]

  // Evaluaciones opcionales
  evaluations?: {
    type: EvaluationType
    isRequired: boolean
    weight: number
    description?: string
  }[]
}

export type JobApplicationFormData = {
  jobOfferId: string
  coverLetter?: string
  // cvId se asignará después de subir el archivo
}

// === TIPOS PARA RESPUESTAS DE API ===
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// === TIPOS PARA FILTROS Y BÚSQUEDAS ===
export type JobOfferFilters = {
  search?: string
  areaId?: string
  workType?: WorkType
  status?: JobStatus
  salaryMin?: number
  salaryMax?: number
  location?: string
}

export type JobApplicationFilters = {
  jobOfferId?: string
  status?: ApplicationStatus
  userId?: string
  startDate?: Date
  endDate?: Date
}
