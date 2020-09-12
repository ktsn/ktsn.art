<template>
  <a
    class="text-gray-600 hover:text-gray-900 transition duration-200 ease-out"
    :href="href"
    :target="isExternal ? '_blank' : null"
    :rel="isExternal ? 'noopener' : null"
    v-bind="$attrs"
  >
    <slot />
  </a>
</template>

<script lang="ts">
import { Options, props } from 'vue-class-component'

const Props = props({
  href: {
    type: String,
    required: true,
  },
})

class VLink extends Props {
  get isExternal(): boolean {
    return /^(?:https?:)?\/\//.test(this.href)
  }
}

export default Options({
  name: 'VLink',
  inheritAttrs: false,
})(VLink)
</script>
