const EXTENSION_LINKS = {
  GITHUB_REPO: 'https://github.com/kurtnettle/bjobs-enhancer',
  SUPPORT_ISSUES: 'https://github.com/kurtnettle/bjobs-enhancer/issues',
} as const

const STORAGE_CONFIG = {
  BLACKLIST_PURGE_AGE_MS: 2 * 30 * 24 * 3600 * 1000, // 2 months
  CLEAN_ALARM_MINUTES: 24 * 60, // 24 hours
} as const

const CONTEXT_MENU_IDS = {
  JOB_ACTION: 'bjobs-job-action',
} as const

const MenuMessageType = {
  ContextRegionChanged: 'BJOBS_CONTEXT_REGION_CHANGED',
  GetContextMenuState: 'BJOBS_GET_CONTEXT_MENU_STATE',
} as const

const DOM_SELECTORS = {
  JOB_CARD: 'app-job-card',
  JOB_LIST_CONTAINER: 'app-job-list',
  JOB_CARD_LINK: 'app-job-card > a',
  JOB_CARD_TITLE: 'p[data-testid="job-title"]',
  JOB_CARD_COMPANY: 'p+p[apphighlight]',
  JOB_CARD_DEADLINE: 'p:has(.icon-calendar) > span+span',
} as const

const ROUTES = {
  JOBS_PAGE: '/h/jobs',
} as const

export {
  CONTEXT_MENU_IDS,
  DOM_SELECTORS,
  EXTENSION_LINKS,
  MenuMessageType,
  ROUTES,
  STORAGE_CONFIG,
}
