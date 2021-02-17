<template>
  <picture>
    <source :srcset="src" type="image/webp" />
    <source :srcset="srcFallback" />
    <img ref="image" :src="srcFallback" v-bind="$attrs" @load="onLoad" />
  </picture>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component'

class Props {
  src = prop({
    type: String,
    required: true,
  })

  srcFallback = prop({
    type: String,
    required: true,
  })
}

export default class VImage extends Vue.with(Props) {
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
