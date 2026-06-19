<script lang='ts'>
  import { buttonVariants } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card/index.js'
  import Bug from '@lucide/svelte/icons/bug'
  import CodeXml from '@lucide/svelte/icons/code-xml'
  import { onMount } from 'svelte'
  import { EXTENSION_LINKS } from '@/config/constants'
  import { hiddenJobsStore } from '@/services/storage'

  const version = browser.runtime.getManifest().version

  let hiddenCount = 0

  onMount(async () => {
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
          <p class='text-sm font-medium'>Hidden Jobs</p>
          <p class='text-xs text-muted-foreground'>
            Auto-cleans job IDs after their deadline
          </p>
        </div>
        <span class='text-2xl font-bold tracking-tight text-primary'
        >{hiddenCount}</span
        >
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
