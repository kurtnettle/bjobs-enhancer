<script lang='ts'>
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card/index.js'
  import { Input } from '$lib/components/ui/input/index.js'
  import * as Select from '$lib/components/ui/select/index.js'

  import {
    hiddenJobCardOpacity,
    JobCardHideMode,
    jobCardHideModeSetting,
    setHiddenJobCardOpacity,
  } from '@/services/storage.ts'

  const modes = Object.values(JobCardHideMode) as JobCardHideMode[]

  let hideMode = $state<JobCardHideMode>(JobCardHideMode.hide)
  let opacity = $state<number>(0.2)

  async function saveSettings() {
    await jobCardHideModeSetting.setValue(hideMode)
    await setHiddenJobCardOpacity(opacity)
  }

  onMount(async () => {
    hideMode = await jobCardHideModeSetting.getValue()
    opacity = await hiddenJobCardOpacity.getValue()
  })
</script>

<main>
  <Card.Root>
    <Card.Header>
      <Card.Title>Job Card Display Mode</Card.Title>
      <Card.Description
      >Choose how hidden job cards look on the list.
        <span class='text-foreground/80 font-medium'>Hide</span>
        removes them, while
        <span class='text-foreground/80 font-medium'>Opacity</span> dims them.</Card.Description
      >
    </Card.Header>
    <Card.Content>
      <div class='flex items-center p-3 gap-4'>

        <span class='font-medium text-foreground/90'>Visibility Mode</span>
        <Select.Root type='single' bind:value={hideMode}>
          <Select.Trigger class='min-w-26'>{hideMode}</Select.Trigger>
          <Select.Content>
            {#each modes as mode (mode)}
              <Select.Item value={mode}>{mode}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>

        <div class='flex items-center p-3 gap-4 bg-accent/20'>
          <label for='opacity-input' class='font-medium'> Dim Level </label>

          <div class='flex items-center gap-2'>
            <Input
              id='opacity-input'
              type='number'
              min='0'
              max='1'
              step='0.05'
              class='text-center bg-background'
              disabled={hideMode === JobCardHideMode.hide}
              bind:value={opacity}
            />
            <span
              class='font-mono font-medium text-muted-foreground text-right'
            >
              {Math.round(opacity * 100)}%
            </span>
          </div>
        </div>
      </div>
    </Card.Content>
    <Card.Footer>
      <div class='mx-auto'>
        <Button onclick={saveSettings} class='px-8'>Save</Button>
      </div>
    </Card.Footer>
  </Card.Root>
</main>
