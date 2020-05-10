<template>
  <picture>
    <source :srcset="src" type="image/webp" />
    <source :srcset="srcFallback" />
    <img :src="srcFallback" v-bind="$attrs" />
  </picture>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VImage extends Vue {}

export default Options({
  name: 'VImage',

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
