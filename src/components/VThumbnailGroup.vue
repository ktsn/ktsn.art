<template>
  <slot />
</template>

<script lang="ts">
import { provide, reactive, computed } from 'vue'
import { Vue, Options, setup } from 'vue-class-component'

/**
 * Manager of VThumbnail component which triggers appear transition
 * when all managed VThumbnail component has been loaded.
 */
class VThumbnailGroup extends Vue {
  manager = setup(() => {
    const state = reactive<Record<string, boolean>>({})

    provide('thumbnailGroup', {
      register(id: number) {
        state[id] = false
      },

      loaded(id: number) {
        state[id] = true
      },

      unregister(id: number) {
        delete state[id]
      },

      allLoaded: computed(() => Object.keys(state).every((key) => state[key])),
    })

    return { state }
  })
}

export default Options({
  name: 'VThumbnailGroup',
})(VThumbnailGroup)
</script>
