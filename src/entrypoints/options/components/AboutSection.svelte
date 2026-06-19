<script lang='ts'>
  import { buttonVariants } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card/index.js'
  import * as Tooltip from '$lib/components/ui/tooltip/index.js'
  import Bug from '@lucide/svelte/icons/bug'
  import CodeXml from '@lucide/svelte/icons/code-xml'
  import { onMount } from 'svelte'
  import { EXTENSION_LINKS } from '@/config/constants'
  import { cleanedJobIdsCount, hiddenJobIdsCount, hiddenJobsStore } from '@/services/storage'

  const version = browser.runtime.getManifest().version

  let hiddenCount = 0
  let hiddenJobsCount = 0
  let cleanedCount = 0

  hiddenJobIdsCount.watch((value) => {
    hiddenJobsCount = value
  })

  cleanedJobIdsCount.watch((value) => {
    cleanedCount = value
  })

  onMount(async () => {
    hiddenJobsCount = await hiddenJobIdsCount.getValue()
    cleanedCount = await cleanedJobIdsCount.getValue()
    const currentMap = await hiddenJobsStore.getValue()
    hiddenCount = Object.keys(currentMap).length
  })
</script>

<main>
  <Card.Root>
    <Card.Header>
      <Card.Title class='flex items-center gap-1'
      >BJobs Enhancer v{version}</Card.Title
      >
      <Card.Description
      >Improve your BDJobs browsing experience.</Card.Description
      >
    </Card.Header>

    <Card.Content class='grid gap-6'>
      <div
        class='flex items-center justify-between rounded-lg border p-3 bg-muted/30'
      >
        <div class='space-y-0.5'>
          <p class='text-sm font-medium'>Currently Hidden</p>
          <p class='text-xs text-muted-foreground'>
            Auto-cleans job IDs after their deadline
          </p>
        </div>
        <span class='text-2xl font-bold tracking-tight text-primary'
        >{hiddenCount}</span
        >
      </div>

      <div class='rounded-lg border p-3 bg-muted/30'>
        <div>
          <p class='text-sm font-medium'>Summary</p>
          <p class='text-xs text-muted-foreground'>
            How I helped you keep your job list clean by hiding irrelevant posts
          </p>
        </div>

        <div class='grid grid-cols-2 gap-3 pt-4'>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger class='text-left'>
                <div class='rounded-md border bg-background p-3'>
                  <p class='text-xs text-muted-foreground'>Jobs Hidden</p>
                  <p class='text-xl font-bold'>{hiddenJobsCount}</p>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>
                  You've hidden {hiddenJobsCount} jobs using this extension so far.
                </p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger class='text-left'>
                <div class='rounded-md border bg-background p-3'>
                  <p class='text-xs text-muted-foreground'>
                    Expired IDs Removed
                  </p>
                  <p class='text-xl font-bold'>{cleanedCount}</p>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>
                  {cleanedCount} expired jobs were automatically cleared from storage.
                </p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </Card.Content>

    <Card.Footer>
      <div class='grid grid-cols-2 gap-2 w-full text-center'>
        <a
          href={EXTENSION_LINKS.GITHUB_REPO}
          target='_blank'
          class={`${buttonVariants({ variant: 'outline' })
          } flex items-center justify-center`}
        >
          <CodeXml size={14} />
          GitHub
        </a>

        <a
          href={EXTENSION_LINKS.SUPPORT_ISSUES}
          target='_blank'
          class={`${buttonVariants({ variant: 'outline' })
          } flex items-center justify-center`}
        >
          <Bug size={14} />
          Report Issues
        </a>
      </div>
    </Card.Footer>
  </Card.Root>
</main>
