<template>
  <router-link
    class="text-gray-600 hover:text-gray-900 transition duration-200 ease-out"
    v-bind="$attrs"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VRouterLink extends Vue {}

export default Options({
  name: 'VRouterLink',
  inheritAttrs: false,
})(VRouterLink)
</script>
