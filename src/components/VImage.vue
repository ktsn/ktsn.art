<template>
  <picture>
    <source :srcset="src" type="image/webp" />
    <source :srcset="srcFallback" />
    <img ref="image" :src="srcFallback" v-bind="$attrs" @load="onLoad" />
  </picture>
</template>

<script lang="ts">
import { props, emits, mixins } from 'vue-class-component'

const Props = props({
  src: {
    type: String,
    required: true,
  },

  srcFallback: {
    type: String,
    required: true,
  },
})

const Emits = emits({
  isoload: () => true,
})

export default class VImage extends mixins(Props, Emits) {
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
</script>
