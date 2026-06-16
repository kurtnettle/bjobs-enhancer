import { DOM_SELECTORS } from '@/config/constants'
import { warn } from '@/services/logging'

function extractJobIdFromUrl(url: string): string | null {
  const match = url.match(/\/h\/details\/(\d+)(?:\?|$)/)
  return match?.[1] ?? null
}

function extractJobDetails(el: Element | null) {
  if (!el) {
    return { isHidden: false, title: '', company: '', deadline: '' }
  }

  const title = el.querySelector(DOM_SELECTORS.JOB_CARD_TITLE)?.textContent?.trim() || ''
  const company = el.querySelector(DOM_SELECTORS.JOB_CARD_COMPANY)?.textContent?.trim() || ''
  const deadline = el.querySelector(DOM_SELECTORS.JOB_CARD_DEADLINE)?.textContent?.trim() || ''
  const isHidden = el.classList.contains('job-card-hidden') || el.classList.contains('job-card-faded')

  return {
    isHidden,
    title,
    company,
    deadline,
  }
}

function extractJobDeadLine(el: Element | null) {
  return el?.querySelector(DOM_SELECTORS.JOB_CARD_DEADLINE)?.textContent?.trim() || ''
}

function waitForElement(selector: string, timeoutMs: number = 10000): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector)
    if (element)
      return resolve(element)

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) {
        clearTimeout(timeoutId)
        observer.disconnect()
        resolve(el)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    const timeoutId = setTimeout(() => {
      warn(`[waitForElement] Timed out waiting for "${selector}" after ${timeoutMs}ms.`)
      observer.disconnect()
      resolve(null)
    }, timeoutMs)
  })
}

export {
  extractJobDeadLine,
  extractJobDetails,
  extractJobIdFromUrl,
  waitForElement,
}
