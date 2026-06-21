import { DOM_SELECTORS, ROUTES } from '@/config/constants'
import { initContextMenuContent } from '@/features/context-menu/content'
import { initOpacityWatcher, initUiInjectorContent } from '@/features/ui-injector/content'

import { debug, error } from '@/services/logging'
import { waitForElement } from '@/utils/misc'
import '@/assets/app.css'

const TAG = '[ContentScript]'

export default defineContentScript({
  matches: ['https://*.bdjobs.com/*'],

  async main(ctx) {
    const jobListSelector = `${DOM_SELECTORS.JOB_LIST_CONTAINER} ${DOM_SELECTORS.JOB_CARD}`

    initContextMenuContent()
    await initOpacityWatcher()

    const { refreshUi, cleanup } = initUiInjectorContent()

    let activeClassObserver: MutationObserver | null = null
    function cleanupPageObservers() {
      if (activeClassObserver) {
        debug(TAG, 'cleaning page observers')
        activeClassObserver.disconnect()
        activeClassObserver = null
      }
    }

    async function processJobPage() {
      try {
        await waitForElement(jobListSelector)
        cleanupPageObservers()

        activeClassObserver = new MutationObserver(async (mutations) => {
          for (const mutation of mutations) {
            if (
              mutation.target instanceof HTMLElement
              && mutation.attributeName === 'hidden'
              && !mutation.target.hasAttribute('hidden')
            ) {
              debug(TAG, 'class changed on job card list, triggering UI refresh.')
              await refreshUi()
            }
          }
        })

        const elem = document.querySelector(DOM_SELECTORS.JOB_LIST_CONTAINER)
        if (elem) {
          debug(TAG, 'adding page observers')
          activeClassObserver.observe(elem, {
            attributes: true,
            attributeFilter: ['hidden'],
          })
        }

        await refreshUi()
      }
      catch (err) {
        error(TAG, 'failed processing page', err)
      }
    }

    if (window.location.pathname.includes(ROUTES.JOBS_PAGE)) {
      await processJobPage()
    }

    ctx.addEventListener(window, 'wxt:locationchange', async ({ newUrl }) => {
      if (newUrl.pathname.includes(ROUTES.JOBS_PAGE)) {
        await processJobPage()
      }
      else {
        cleanupPageObservers()
      }
    })

    ctx.onInvalidated(() => {
      debug(TAG, 'onInvalidated')
      cleanup()
      cleanupPageObservers()
    })
  },
})
