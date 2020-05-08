<template>
  <slot />
</template>

<script lang="ts">
import { Vue, setup } from 'vue-class-component'
import { useLoadingGroup } from '../composables/loading-group'

/**
 * Manager of VThumbnail component which triggers appear transition
 * when all managed VThumbnail component has been loaded.
 */
export default class VThumbnailGroup extends Vue {
  manager = setup(() => useLoadingGroup())
}
</script>
