import { CONTEXT_MENU_IDS, MenuMessageType } from '@/config/constants'
import { debug, error, warn } from '@/services/logging'
import { hideJobById, unhideJobById } from '@/services/storage'

const TAG = '[ContextMenu]'

async function createContextMenus(): Promise<void> {
  try {
    await browser.contextMenus.removeAll()

    await browser.contextMenus.create({
      id: CONTEXT_MENU_IDS.JOB_ACTION,
      title: 'Toggle Visibility',
      contexts: ['page', 'link', 'frame'],
      visible: false,
    })
    debug(TAG, ' created successfully')
  }
  catch (err) {
    error(TAG, ' Failed to create', err)
    throw err
  }
}

async function onContextMenuClick(
  info: Browser.contextMenus.OnClickData,
  tab?: Browser.tabs.Tab,
): Promise<void> {
  if (!tab?.id || info.menuItemId !== CONTEXT_MENU_IDS.JOB_ACTION) {
    return
  }

  try {
    const context = await browser.tabs.sendMessage(tab.id, {
      type: MenuMessageType.GetContextMenuState,
    }).catch((err) => {
      warn(TAG, ' Content script failed to respond to state request', err)
      return null
    })

    if (!context?.jobId) {
      warn(TAG, ' No job ID available for menu action')
      return
    }

    const { jobId, isHidden, deadLine } = context

    if (!isHidden) {
      debug(TAG, ' Hiding job:', jobId, deadLine)
      await hideJobById(jobId)
    }
    else {
      debug(TAG, ' Unhiding job:', jobId, deadLine, deadLine)
      await unhideJobById(jobId)
    }
  }
  catch (err) {
    error(TAG, ' Error handling menu click', err)
  }
}

export async function initContextMenuBackground() {
  await createContextMenus()

  browser.contextMenus.onClicked.addListener(onContextMenuClick)

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === MenuMessageType.ContextRegionChanged && sender.tab?.id) {
      browser.contextMenus.update(CONTEXT_MENU_IDS.JOB_ACTION, { visible: message.isOverJobCard },
      )
      debug(TAG, ' Context region updated, visible state:', message.isOverJobCard)
    }
    return false
  })

  debug(TAG, ' Background context menu initialized')
}
