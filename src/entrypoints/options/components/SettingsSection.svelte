<script lang='ts'>
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card/index.js'
  import { Input } from '$lib/components/ui/input/index.js'
  import * as Select from '$lib/components/ui/select/index.js'
  import { Toaster } from '$lib/components/ui/sonner'
  import Download from '@lucide/svelte/icons/download'
  import Upload from '@lucide/svelte/icons/upload'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import { error } from '@/services/logging'
  import {
    hiddenJobCardOpacity,
    JobCardHideMode,
    jobCardHideModeSetting,
    setHiddenJobCardOpacity,
  } from '@/services/storage'
  import { exportBackup, importBackup } from './utils'

  const modes = Object.values(JobCardHideMode) as JobCardHideMode[]

  let hideMode = $state<JobCardHideMode>(JobCardHideMode.hide)
  let opacity = $state<number>(0.2)

  async function saveSettings() {
    await jobCardHideModeSetting.setValue(hideMode)
    await setHiddenJobCardOpacity(opacity)
  }

  async function handleRestore() {
    const restoredData = await importBackup()
    if (restoredData) {
      hideMode = restoredData.jobCardHideMode
      opacity = restoredData.jobCardOpacityValue
    }
  }

  onMount(async () => {
    try {
      const [savedHideMode, savedOpacity] = await Promise.all([
        jobCardHideModeSetting.getValue(),
        hiddenJobCardOpacity.getValue(),
      ])

      hideMode = savedHideMode
      opacity = savedOpacity
    }
    catch (err) {
      error('Failed to load settings from storage:', err)
      toast.error('Failed to load settings from storage.')
    }
  })
</script>

<main>
  <Toaster richColors duration={5000} position='top-right' expand={true} />
  <Card.Root>
    <Card.Header>
      <Card.Title>General Settings</Card.Title>
      <Card.Description>
        Configure extension preferences and manage data backups.
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <div class='p-3'>
        <div class='mb-2'>
          <h4 class='text-sm font-medium text-foreground/90 mb-1'>
            Job Card Display
          </h4>
          <p class='text-xs text-muted-foreground leading-relaxed mb-4'>
            Choose how hidden job cards look on the list.
            <span class='font-medium text-foreground/80'>Hide</span> removes
            them, while
            <span class='font-medium text-foreground/80'>Opacity</span> dims them.
          </p>
        </div>

        <div
          class='flex flex-row items-center gap-4 bg-muted/30 p-3.5 rounded-lg border border-border/40'
        >
          <div class='flex flex-col gap-1.5 flex-1'>
            <span
              class='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'
            >
              Visibility Mode
            </span>
            <Select.Root type='single' bind:value={hideMode}>
              <Select.Trigger class='w-full'>{hideMode}</Select.Trigger>
              <Select.Content>
                {#each modes as mode (mode)}
                  <Select.Item value={mode}>{mode}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div
            class='flex flex-col gap-1.5 flex-1 transition-all duration-200'
            class:opacity-40={hideMode === JobCardHideMode.hide}
          >
            <label
              for='opacity-input'
              class='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'
            >
              Dim Level
            </label>

            <div class='flex items-center gap-2'>
              <Input
                id='opacity-input'
                type='number'
                min='0'
                max='1'
                step='0.05'
                class='text-center'
                disabled={hideMode === JobCardHideMode.hide}
                bind:value={opacity}
              />
              <span class='font-mono font-medium text-muted-foreground'>
                {Math.round(opacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class='p-3'>
        <h4 class='text-sm font-medium text-foreground/90 mb-1'>
          Backup & Restore
        </h4>
        <p class='text-xs text-muted-foreground mb-4'>
          Export extension data or restore them from a previous backup file.
        </p>

        <div class='flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            onclick={exportBackup}
            class='gap-2'
          >
            <Download class='size-3.5' />
            Export Backup
          </Button>

          <Button
            variant='outline'
            size='sm'
            onclick={handleRestore}
            class='gap-2'
          >
            <Upload class='size-3.5' />
            Restore Backup
          </Button>
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
