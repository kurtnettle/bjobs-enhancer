import type { Job } from '@/services/storage'
import { DOM_SELECTORS } from '@/config/constants'
import { debug, error, warn } from '@/services/logging'
import {
  hiddenJobCardOpacity,
  hiddenJobsStore,
  JobCardHideMode,
  jobCardHideModeSetting,
} from '@/services/storage'
import { extractJobIdFromUrl } from '@/utils/misc'

const logTag = `[UI Injector]`

async function initOpacityWatcher(): Promise<void> {
  const applyOpacity = (value: number | string) => {
    document.documentElement.style.setProperty('--jobs-bd-user-card-opacity', value.toString())
  }

  try {
    const initialValue = await hiddenJobCardOpacity.getValue()
    applyOpacity(initialValue)

    hiddenJobCardOpacity.watch((newValue) => {
      debug(`${logTag} User changed opacity live to: ${newValue}`)
      applyOpacity(newValue)
    })
  }
  catch (err) {
    error(`${logTag} Failed to initialize opacity watcher safely`, err)
  }
}

function initUiInjectorContent() {
  const unwatchHidden = hiddenJobsStore.watch(refreshUi)
  const unwatchMode = jobCardHideModeSetting.watch(refreshUi)

  return {
    refreshUi,
    cleanup: () => {
      unwatchHidden()
      unwatchMode()
    },
  }
}

async function refreshUi() {
  try {
    debug(`${logTag} Scanning page for jobs to process...`)
    const [blockedJobsRecord, cardHideMode] = await Promise.all([
      hiddenJobsStore.getValue(),
      jobCardHideModeSetting.getValue(),
    ])
    updateJobCards(blockedJobsRecord, cardHideMode)
  }
  catch (err) {
    error(`${logTag} Error processing page UI updates`, err)
  }
}

function updateJobCards(blockedIds: Record<string, Job>, cardHideMode: JobCardHideMode) {
  const jobCards = document.querySelectorAll<HTMLElement>(DOM_SELECTORS.JOB_CARD)
  debug(`${logTag} Found cards ${jobCards.length}`)

  if (jobCards.length === 0)
    return

  jobCards.forEach((card) => {
    const linkElement = card.querySelector(DOM_SELECTORS.JOB_CARD_LINK)
    const urlString = linkElement?.getAttribute('href') || ''
    if (!urlString)
      return

    try {
      const jobId = extractJobIdFromUrl(urlString)
      if (!jobId) {
        warn(`${logTag} Failed to extract id from url ${urlString}`)
        return
      }

      const isBlocked = !!blockedIds[jobId]
      card.classList.remove(
        'job-card-hidden',
        'job-card-faded',
      )

      if (!isBlocked)
        return
      debug(`${logTag} Hiding job card matching ID: ${jobId}`)

      if (cardHideMode === JobCardHideMode.hide) {
        card.classList.add('job-card-hidden')
      }
      else {
        card.classList.add('job-card-faded')
      }
    }
    catch (e) {
      error('Error occured while updating job cards.', e)
    }
  })
}

export {
  initOpacityWatcher,
  initUiInjectorContent,
}
