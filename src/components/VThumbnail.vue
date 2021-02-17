<template>
  <div
    class="relative w-full bg-gray-300"
    :class="{ loading: !manager.allLoaded }"
    :style="{ paddingTop }"
  >
    <transition
      enter-active-class="transition duration-700"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div
        v-show="manager.allLoaded"
        class="absolute inset-0"
        :style="{ transitionDelay: appearDelay + 'ms' }"
      >
        <VImage
          v-bind="$attrs"
          class="absolute inset-0 w-full h-full object-cover"
          :src="src"
          :src-fallback="srcFallback"
          @isoload="manager.loaded()"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Options, Vue, prop, setup } from 'vue-class-component'
import VImage from './VImage.vue'
import { useLoadingItem } from '../composables/loading-group'

class Props {
  ratio = prop({
    type: Number,
    default: 1,
  })

  appearDelay = prop({
    type: Number,
    default: 0,
  })

  src = prop({
    type: String,
    required: true,
  })

  srcFallback = prop({
    type: String,
    required: true,
  })
}

class VThumbnail extends Vue.with(Props) {
  manager = setup(() => useLoadingItem())

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

  components: {
    VImage,
  },
})(VThumbnail)
</script>

<style scoped>
.loading {
  overflow: hidden;
}

.loading::after {
  content: '';
  opacity: 0.3;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 75%;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    #fff 40%,
    #fff 60%,
    rgba(255, 255, 255, 0)
  );
  animation: 1000ms cubic-bezier(0.4, 0, 0.6, 1) infinite loading;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  70% {
    transform: translateX(133%);
  }

  100% {
    transform: translateX(133%);
  }
}
</style>
