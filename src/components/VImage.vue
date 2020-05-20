<template>
  <picture>
    <source :srcset="src" type="image/webp" />
    <source :srcset="srcFallback" />
    <img v-load="onLoad" :src="srcFallback" v-bind="$attrs" />
  </picture>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Directive } from 'vue'

/**
 * FIXME: using directive because HTMLElement is not injected into $refs on hydration sometimes.
 */
const load: Directive<HTMLImageElement> = {
  mounted(el, { value }) {
    if (el.complete) {
      value()
    }

    el.addEventListener('load', value)
  },

  unmounted(el, { value }) {
    el.removeEventListener('load', value)
  },
}

class VImage extends Vue {
  onLoad() {
    this.$emit('isoload')
  }
}

export default Options({
  name: 'VImage',

  directives: {
    load,
  },

  props: {
    src: {
      type: String,
      required: true,
    },

    srcFallback: {
      type: String,
      required: true,
    },
  },
})(VImage)
</script>
