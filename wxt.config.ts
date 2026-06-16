import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

const lib = resolve(__dirname, './src/lib')

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-svelte'],
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    homepage_url: 'https://github.com/kurtnettle/bjobs-enhancer',
    default_locale: 'en',
    permissions: [
      'contextMenus',
      'alarms',
      'storage',
    ],
  },
  alias: {
    $lib: lib,
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $lib: lib,
      },
    },
  }),

  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      manifest.options_ui = {
        page: 'options.html',
        open_in_tab: true,
      }
    },
  },
})
