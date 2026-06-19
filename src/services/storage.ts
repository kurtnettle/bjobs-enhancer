import { error, info, warn } from './logging'

const TAG = '[Storage]'

interface Job {
  expiresAt: number
}

enum JobCardHideMode {
  hide = 'hide',
  opacity = 'opacity',
}

const jobCardHideModeSetting = storage.defineItem<JobCardHideMode>(
  'local:job_card_hide_mode',
  {
    fallback: JobCardHideMode.opacity,
  },
)

const hiddenJobCardOpacity = storage.defineItem<number>(
  'local:job_card_opacity_value',
  {
    fallback: 0.2,
  },
)

export const hiddenJobsStore = storage.defineItem<Record<string, Job>>(
  'local:hidden_jobs_map',
  {
    fallback: {},
  },
)

async function hideJobById(id: string, deadline: Date): Promise<void> {
  const cleanId = id.trim()
  if (!cleanId)
    return

  const currentMap = await hiddenJobsStore.getValue()

  currentMap[cleanId] = { expiresAt: deadline.getTime() }

  await hiddenJobsStore.setValue(currentMap)
}

async function unhideJobById(id: string): Promise<void> {
  const cleanId = id.trim()
  if (!cleanId) {
    warn(TAG, ' Got empty job id while unhiding job')
    return
  }

  const currentMap = await hiddenJobsStore.getValue()

  if (!currentMap[cleanId]) {
    warn(TAG, ` JobId ${cleanId} was not found in the hidden list.`)
    return
  }

  warn(TAG, `Removing JobId from hide: ${cleanId}`)

  delete currentMap[cleanId]

  await hiddenJobsStore.setValue(currentMap)
}

async function setHiddenJobCardOpacity(value: string | number) {
  const num = Number(value)

  if (Number.isNaN(num))
    return

  const opacity = Math.min(1, Math.max(0, num))
  await hiddenJobCardOpacity.setValue(opacity)
}

async function cleanObsoleteJobIds(): Promise<void> {
  const cutoffTime = Date.now() - 24 * 60 * 60 * 1000

  try {
    const currentMap = await hiddenJobsStore.getValue()
    let itemsRemoved = 0

    for (const id in currentMap) {
      if (currentMap[id].expiresAt < cutoffTime) {
        delete currentMap[id]
        itemsRemoved++
      }
    }

    if (itemsRemoved > 0) {
      await hiddenJobsStore.setValue(currentMap)
    }
    info(TAG, ` Cleanup complete. Purged ${itemsRemoved} obsolete IDs.`)
  }
  catch (e) {
    error(TAG, ' Failed to purge obsolete IDs:', e)
  }
}
export {
  cleanObsoleteJobIds,
  hiddenJobCardOpacity,
  hideJobById,
  Job,
  JobCardHideMode,
  jobCardHideModeSetting,
  setHiddenJobCardOpacity,
  unhideJobById,
}
