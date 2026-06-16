import { DOM_SELECTORS, ROUTES } from '@/config/constants'
import { initContextMenuContent } from '@/features/context-menu/content'
import { initOpacityWatcher, initUiInjectorContent } from '@/features/ui-injector/content'

import { error } from '@/services/logging'
import { waitForElement } from '@/utils/misc'
import '@/assets/app.css'

export default defineContentScript({
  matches: ['https://*.bdjobs.com/*'],

  async main(ctx) {
    const jobListSelector = `${DOM_SELECTORS.JOB_LIST_CONTAINER} ${DOM_SELECTORS.JOB_CARD}`

    initContextMenuContent()
    await initOpacityWatcher()

    const { refreshUi, cleanup } = initUiInjectorContent()
    ctx.onInvalidated(cleanup)

    async function processJobPage() {
      try {
        await waitForElement(jobListSelector)
        await refreshUi()
      }
      catch (err) {
        error(`[ContentScript] Failed processing page`, err)
      }
    }

    if (window.location.pathname.includes(ROUTES.JOBS_PAGE)) {
      await processJobPage()
    }

    ctx.addEventListener(window, 'wxt:locationchange', async ({ newUrl }) => {
      if (newUrl.pathname.includes(ROUTES.JOBS_PAGE)) {
        await processJobPage()
      }
    })
  },
})
