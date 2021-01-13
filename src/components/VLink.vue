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
import { Options, Vue, prop } from 'vue-class-component'

class Props {
  href = prop({
    type: String,
    required: true,
  })
}

class VLink extends Vue.props(Props) {
  get isExternal(): boolean {
    return /^(?:https?:)?\/\//.test(this.href)
  }
}

export default Options({
  name: 'VLink',
  inheritAttrs: false,
})(VLink)
</script>
