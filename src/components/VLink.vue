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
import { Vue, Options } from 'vue-class-component'

class VLink extends Vue {
  href!: string

  get isExternal(): boolean {
    return /^(?:https?:)?\/\//.test(this.href)
  }
}

export default Options({
  name: 'VLink',
  inheritAttrs: false,

  props: {
    href: {
      type: String,
      required: true,
    },
  },
})(VLink)
</script>
