import { DOM_SELECTORS, MenuMessageType } from '@/config/constants'
import { debug } from '@/services/logging'
import { extractJobDeadLine, extractJobIdFromUrl } from '@/utils/misc'

let lastActiveJobCard: Element | null = null

function isCardHidden(el: Element | null) {
  return el?.classList.contains('job-card-hidden')
    || el?.classList.contains('job-card-faded')
}

export function initContextMenuContent() {
  document.addEventListener('contextmenu', (e) => {
    const el = e.target as Element
    const card = el.closest(DOM_SELECTORS.JOB_CARD)
    lastActiveJobCard = card

    const isOverJobCard = !!lastActiveJobCard
    debug('[ContextMenu] isOverJobCard', isOverJobCard)

    const isHidden = isCardHidden(lastActiveJobCard)
    const deadLine = extractJobDeadLine(lastActiveJobCard)

    browser.runtime.sendMessage({
      type: MenuMessageType.ContextRegionChanged,
      isOverJobCard,
      isHidden,
      deadLine,
    })
  })

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === MenuMessageType.GetContextMenuState) {
      debug('[ContextMenu] Background script requested menu state')

      if (!lastActiveJobCard) {
        return Promise.resolve({ jobId: null, isHidden: false, deadLine: null })
      }

      const isHidden = isCardHidden(lastActiveJobCard)
      const deadLine = extractJobDeadLine(lastActiveJobCard)
      const cardUrl = lastActiveJobCard.querySelector(DOM_SELECTORS.JOB_CARD_LINK)?.getAttribute('href') ?? ''
      const jobId = extractJobIdFromUrl(cardUrl)

      return Promise.resolve({
        jobId,
        isHidden,
        deadLine,
      })
    }
  })
}
