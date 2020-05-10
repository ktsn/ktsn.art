<template>
  <component
    :is="$attrs.to ? 'router-link' : 'a'"
    class="text-gray-600 hover:text-gray-900 transition duration-200 ease-out"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VTextLink extends Vue {}

export default Options({
  name: 'VTextLink',
  inheritAttrs: false,
})(VTextLink)
</script>
