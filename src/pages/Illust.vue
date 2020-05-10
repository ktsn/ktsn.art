<template>
  <div class="fixed inset-0">
    <transition
      appear
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition ease-out duration-200"
      leave-to-class="opacity-0"
    >
      <div v-if="!leaving">
        <div
          class="absolute inset-0 bg-gray-900"
          :class="dialog.backgroundClass"
          :style="{ opacity: dialog.backgroundOpacity }"
        />
      </div>
    </transition>

    <transition
      appear
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 transform scale-75"
      leave-active-class="transition duration-200 ease-out"
      leave-to-class="opacity-0 transform scale-75"
    >
      <router-link
        v-if="illust.result && !leaving"
        class="absolute inset-0"
        to="/"
        @click.prevent
        @pointerdown.prevent="dialog.startDrag"
        @pointermove.prevent="dialog.continueDrag"
        @pointerup.prevent="dialog.endDrag"
        @pointercancel.prevent="dialog.endDrag"
      >
        <div
          class="absolute inset-0"
          :class="dialog.imageClass"
          :style="dialog.imageStyle"
        >
          <transition
            leave-active-class="transition-all duration-500"
            leave-to-class="blur-0"
          >
            <div
              v-if="!displayImageLoaded"
              v-show="thumbnailImageLoaded"
              class="absolute inset-0 w-full h-full blur"
            >
              <VImage
                class="absolute inset-0 w-full h-full object-contain"
                :src="illust.result.thumbnailUrl"
                :src-fallback="illust.result.thumbnailFallbackUrl"
                alt=""
                @load="thumbnailImageLoaded = true"
              />
            </div>
          </transition>

          <transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0"
          >
            <VImage
              v-show="displayImageLoaded"
              class="absolute inset-0 w-full h-full object-contain"
              :src="illust.result.displayUrl"
              :src-fallback="illust.result.displayFallbackUrl"
              alt=""
              @load="displayImageLoaded = true"
            />
          </transition>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import VButtonIcon from '../components/VButtonIcon.vue'
import VImage from '../components/VImage.vue'
import { useIllust } from '../composables/illusts'
import { useImageDialog } from '../composables/image-dialog'

class Illust extends Vue {
  illustKey!: string

  illust = setup(() => useIllust(toRef(this, 'illustKey')))

  dialog = setup(() => {
    const router = useRouter()
    return useImageDialog(() => router.push('/'))
  })
  thumbnailImageLoaded: boolean = false
  displayImageLoaded: boolean = false
  leaving: boolean = false

  beforeRouteLeave(_to: unknown, _from: unknown, next: () => void) {
    this.leaving = true
    next()
  }
}

export default Options({
  name: 'Illust',

  components: {
    VButtonIcon,
    VImage,
  },

  props: {
    illustKey: {
      type: String,
      required: true,
    },
  },
})(Illust)
</script>

<style scoped>
.blur {
  filter: blur(4px);
}

.blur-0 {
  filter: blur(0);
}
</style>
