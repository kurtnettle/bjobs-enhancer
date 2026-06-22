import { STORAGE_CONFIG } from '@/config/constants'
import { initContextMenuBackground } from '@/features/context-menu/background'
import { cleanObsoleteJobIds } from '@/services/storage'

export default defineBackground({
  main() {
    initContextMenuBackground()
    initCleanUpAlarm()
  },
})

async function initCleanUpAlarm() {
  browser.runtime.onInstalled.addListener(async () => {
    const existingAlarm = await browser.alarms.get(STORAGE_CONFIG.CLEAN_ALARM_NAME)

    if (!existingAlarm) {
      browser.alarms.create(STORAGE_CONFIG.CLEAN_ALARM_NAME, {
        periodInMinutes: STORAGE_CONFIG.CLEAN_ALARM_MINUTES,
      })
    }
  })

  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'bjobs_daily_cleanup_alarm') {
      await cleanObsoleteJobIds()
    }
  })
}
