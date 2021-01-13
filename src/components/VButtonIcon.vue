<template>
  <router-link
    class="inline-block rounded-full p-1 align-middle transition duration-200 ease-out hover:bg-gray-100 hover:bg-opacity-25"
    v-bind="$attrs"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VButtonIcon extends Vue {}

export default Options({
  name: 'VButtonIcon',
  inheritAttrs: false,
})(VButtonIcon)
</script>
