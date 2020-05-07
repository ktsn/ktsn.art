<template>
  <div class="relative w-full bg-gray-200" :style="{ paddingTop }">
    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <img
        v-show="loaded"
        class="absolute inset-0 w-full h-full"
        v-bind="$attrs"
        @load="loaded = true"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'

class VThumbnail extends Vue {
  ratio!: number
  loaded: boolean = false

  $refs!: {
    image: HTMLImageElement
  }

  get paddingTop() {
    return 100 / this.ratio + '%'
  }
}

export default Options({
  name: 'VThumbnail',
  inheritAttrs: false,

  props: {
    ratio: {
      type: Number,
      default: 1,
    },
  },
})(VThumbnail)
</script>
