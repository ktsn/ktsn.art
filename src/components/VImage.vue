<template>
  <picture>
    <source :srcset="src" type="image/webp" />
    <source :srcset="srcFallback" />
    <img ref="image" :src="srcFallback" v-bind="$attrs" @load="onLoad" />
  </picture>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VImage extends Vue {
  $refs!: {
    image?: HTMLImageElement
  }

  onLoad() {
    this.$emit('isoload')
  }

  mounted() {
    const img = this.$refs.image
    if (img && img.complete) {
      this.onLoad()
    }
  }
}

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
