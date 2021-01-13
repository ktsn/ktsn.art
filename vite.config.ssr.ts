import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config = defineConfig({
  alias: {
    'firebase/analytics': require.resolve('./dummy.js'),
  },

  plugins: [
    vue({
      ssr: true,
      template: {
        compilerOptions: {
          directiveTransforms: {
            load: () => {
              return {
                props: [],
              }
            },
          },
        },
      },
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        app: './src/main.ts',
      },
      output: {
        format: 'cjs',
      },
      preserveEntrySignatures: 'allow-extension',
      external: ['vue', 'firebase/app', 'firebase/database'],
      treeshake: {
        moduleSideEffects: true,
      },
    },
  },
})

export default config
