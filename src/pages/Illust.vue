<template>
  <div @mousemove="onHover" @touchstart="onHover">
    <div class="absolute inset-0 bg-gray-900" />

    <img
      v-if="illust.result"
      class="absolute inset-0 w-full h-full object-contain"
      :src="illust.result.displayUrl"
      alt=""
    />

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="showMenu"
        class="absolute inset-x-0 top-0 bg-black bg-opacity-75 px-5 py-3"
      >
        <VButtonIcon to="/">
          <svg
            title="Close"
            fill="#ffffff"
            height="32"
            viewBox="0 0 24 24"
            width="32"
          >
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </VButtonIcon>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import { toRef } from 'vue'
import VButtonIcon from '../components/VButtonIcon.vue'
import { useIllust } from '../composables/illusts'

class Illust extends Vue {
  illustKey!: string

  illust = setup(() => useIllust(toRef(this, 'illustKey')))

  showMenuTimer: any = undefined
  showMenu: boolean = false

  onHover() {
    clearTimeout(this.showMenuTimer)
    this.showMenu = true

    this.showMenuTimer = setTimeout(() => {
      this.showMenu = false
    }, 3000)
  }
}

export default Options({
  name: 'Illust',

  components: {
    VButtonIcon,
  },

  props: {
    illustKey: {
      type: String,
      required: true,
    },
  },
})(Illust)
</script>
