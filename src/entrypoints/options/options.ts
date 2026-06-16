import { mount } from 'svelte'
import Options from '@/entrypoints/options/Options.svelte'
import '@/assets/style.css'

mount(Options, {
  target: document.getElementById('app')!,
})
