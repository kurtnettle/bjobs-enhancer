<script lang='ts'>
  import type { Job } from '@/services/storage.ts'
  import { Button } from '$lib/components/ui/button/index.js'
  import * as Card from '$lib/components/ui/card/index.js'
  import { Textarea } from '$lib/components/ui/textarea/index.js'
  import { hiddenJobsStore } from '@/services/storage.ts'

  let rawText = $state('')
  let savedText = $state('')
  let isSaving = $state(false)
  const isDirty = $derived(rawText !== savedText)
  const totalIds = $derived(
    savedText
      .split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0).length,
  )

  onMount(async () => {
    try {
      const storedMap = (await hiddenJobsStore.getValue()) || {}

      const idsArray = Object.keys(storedMap)

      rawText = idsArray.join('\n')
      savedText = rawText
    }
    catch (err) {
      console.error(
        '[Filters UI] Failed to load initial hidden jobs data',
        err,
      )
    }
  })

  async function handleSave() {
    isSaving = true

    try {
      const parsedIds = rawText
        .split('\n')
        .map(id => id.trim())
        .filter(id => id.length > 0)

      const uniqueIdsArray = Array.from(new Set(parsedIds))
      rawText = uniqueIdsArray.join('\n')

      const currentMap = (await hiddenJobsStore.getValue()) || {}
      const newMap: Record<string, Job> = {}

      uniqueIdsArray.forEach((id) => {
        if (currentMap[id]) {
          newMap[id] = currentMap[id]
        }
        else {
          newMap[id] = { hiddenAt: Date.now() }
        }
      })

      await hiddenJobsStore.setValue(newMap)
      savedText = rawText
    }
    catch (err) {
      console.error('[Filters UI] Failed to save hidden jobs map updates', err)
    }
    finally {
      isSaving = false
    }
  }
</script>

<main>
  <Card.Root>
    <Card.Header>
      <Card.Title class='flex items-center gap-1'>
        Filters
        {#if isDirty}
          <span
            class='h-2 w-2 rounded-full bg-orange-500 animate-pulse'
            title='Unsaved changes'
          ></span>
        {/if}
        <span
          class='text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full'
        >
          {totalIds}
          {totalIds === 1 ? 'ID' : 'IDs'}
        </span>
      </Card.Title>

      <Card.Description>Enter the job IDs you want to hide.</Card.Description>
    </Card.Header>
    <Card.Content class='grid gap-6'>
      <Textarea
        bind:value={rawText}
        placeholder='e.g.&#10;123456&#10;789101'
        rows={10}
      />
    </Card.Content>
    <Card.Footer>
      <div class='mx-auto'>
        <Button class='px-8' onclick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Card.Footer>
  </Card.Root>
</main>
