<template>
  <a
    class="text-gray-600 hover:text-gray-900 transition duration-200 ease-out"
    v-bind="$attrs"
  >
    <slot />
  </a>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VLink extends Vue {}

export default Options({
  name: 'VLink',
  inheritAttrs: false,
})(VLink)
</script>
