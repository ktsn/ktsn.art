import { UserConfig } from 'vite'

const config: UserConfig = {
  alias: {
    'firebase/analytics': require.resolve('./dummy.js'),
  },

  vueCompilerOptions: {
    directiveTransforms: {
      load: () => {
        return {
          props: [],
        }
      },
    },
  },

  rollupInputOptions: {
    input: {
      app: './src/main.ts',
    },
    preserveEntrySignatures: 'allow-extension',
    external: ['firebase/app', 'firebase/database'],
    treeshake: {
      moduleSideEffects: true,
    },
  },
}

export default config
