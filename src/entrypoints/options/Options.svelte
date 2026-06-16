<script lang='ts'>
  import * as Tabs from '$lib/components/ui/tabs/index.js'
  import {
    AboutSection,
    HidelistSection,
    SettingsSection,
  } from '@/entrypoints/options/components'
</script>

<div class='h-[400px] w-2xl mx-auto bg-background p-4 text-foreground'>
  <Tabs.Root value='settings'>
    <Tabs.List>
      <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
      <Tabs.Trigger value='filters'>Filters</Tabs.Trigger>
      <Tabs.Trigger value='about'>About</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value='settings'>
      <SettingsSection />
    </Tabs.Content>
    <Tabs.Content value='filters'>
      <HidelistSection />
    </Tabs.Content>
    <Tabs.Content value='about'>
      <AboutSection />
    </Tabs.Content>
  </Tabs.Root>
</div>
