import type { ExtensionBackup } from '@/services/schemas/backup'
import { toast } from 'svelte-sonner'
import { error } from '@/services/logging'
import { ExtensionBackupSchema } from '@/services/schemas/backup'
import { cleanedJobIdsCount, hiddenJobCardOpacity, hiddenJobIdsCount, hiddenJobsStore, jobCardHideModeSetting } from '@/services/storage'

async function exportBackup() {
  try {
    const [hideMode, cardOpacity, hiddenIdsCount, cleanedIdsCount, jobIdsMap] = await Promise.all([
      jobCardHideModeSetting.getValue(),
      hiddenJobCardOpacity.getValue(),
      hiddenJobIdsCount.getValue(),
      cleanedJobIdsCount.getValue(),
      hiddenJobsStore.getValue(),
    ])

    const backupPayload: ExtensionBackup = {
      version: browser.runtime.getManifest().version,
      exportDate: Date.now(),
      data: {
        jobCardHideMode: hideMode,
        jobCardOpacityValue: cardOpacity,
        jobsHiddenCount: hiddenIdsCount,
        jobsCleanedCount: cleanedIdsCount,
        hiddenJobsMap: jobIdsMap,
      },
    }

    const blob = new Blob([JSON.stringify(backupPayload, null)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bjobs-enhancer-backup-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  catch (e) {
    error('Export failed:', e)
    toast.error('Failed to generate export file.')
  }
}

async function importBackup(): Promise<ExtensionBackup['data'] | null> {
  return new Promise((resolve) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'

    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        error('File not found')
        toast.error('Failed to find the file')
        resolve(null)
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonText = e.target?.result as string
          const rawData = JSON.parse(jsonText)

          const result = ExtensionBackupSchema.safeParse(rawData)
          if (!result.success) {
            error('Validation failed:', result.error.format())
            toast.error('Invalid backup file structure.')
            resolve(null)
            return
          }

          const backupData = result.data.data

          await Promise.all([
            jobCardHideModeSetting.setValue(backupData.jobCardHideMode),
            hiddenJobCardOpacity.setValue(backupData.jobCardOpacityValue),
            hiddenJobIdsCount.setValue(backupData.jobsHiddenCount),
            cleanedJobIdsCount.setValue(backupData.jobsCleanedCount),
            hiddenJobsStore.setValue(backupData.hiddenJobsMap),
          ])

          toast.success('Backup restored successfully!')
          resolve(backupData)
        }
        catch (err) {
          error('Backup file parsing failed:', err)
          toast.error('Please upload a valid configuration backup.')
          resolve(null)
        }
        finally {
          fileInput.onchange = null
        }
      }
      reader.readAsText(file)
    }

    fileInput.click()
  })
}

export {
  exportBackup,
  importBackup,
}
