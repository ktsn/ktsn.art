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
      <img
        v-show="manager.allLoaded"
        class="absolute inset-0 w-full h-full object-cover"
        :style="{ transitionDelay: appearDelay + 'ms' }"
        v-bind="$attrs"
        @load="manager.loaded()"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import { useLoadingItem } from '../composables/loading-group'

class VThumbnail extends Vue {
  ratio!: number
  appearDelay!: number

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

  props: {
    ratio: {
      type: Number,
      default: 1,
    },

    appearDelay: {
      type: Number,
      default: 0,
    },
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
    transparent 0,
    #fff 40%,
    #fff 60%,
    transparent
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
