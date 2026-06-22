import { z } from 'zod'
import { JobCardHideMode } from '../storage'

const JobSchema = z.object({
  expiresAt: z.number(),
})

const JobCardHideModeSchema = z.enum(JobCardHideMode)

const ExtensionBackupSchema = z.object({
  version: z.string(),
  exportDate: z.number(),

  data: z.object({
    jobCardHideMode: JobCardHideModeSchema,
    jobCardOpacityValue: z.number().min(0).max(1),
    jobsHiddenCount: z.number().nonnegative(),
    jobsCleanedCount: z.number().nonnegative(),
    hiddenJobsMap: z.record(z.string(), JobSchema),
  }),
})

type ExtensionBackup = z.infer<typeof ExtensionBackupSchema>

export {
  ExtensionBackup,
  ExtensionBackupSchema,
}
