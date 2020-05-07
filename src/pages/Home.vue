<template>
  <header class="px-10 pt-2 mb-5">
    <ul>
      <li v-for="(link, i) in illustLinks" :key="link" class="inline-block">
        <VTextLink :to="'#year_' + link">
          {{ link }}
        </VTextLink>

        <span v-if="i < illustLinks.length - 1" class="px-1">/</span>
      </li>
    </ul>
  </header>

  <section
    v-for="[year, group] in illustGroups.entries()"
    :id="'year_' + year"
    :key="year"
    class="mb-10"
  >
    <h2 class="px-10 mb-1">{{ year }} ({{ group.length }} illusts)</h2>

    <ul
      class="grid gap-1 grid-flow-row xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2"
    >
      <transition
        v-for="{ index, illust } in group"
        :key="index"
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        appear
      >
        <li :style="{ transitionDelay: 50 * index + 'ms' }">
          <VThumbnail :src="illust.thumbnailUrl" :ratio="1 / 1" />
        </li>
      </transition>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import VTextLink from '../components/VTextLink.vue'
import VThumbnail from '../components/VThumbnail.vue'
import { useIllusts, Illust } from '../composables/illusts'

class Home extends Vue {
  illusts = setup(useIllusts)

  get illustLinks() {
    return Array.from(this.illustGroups.keys()).sort((a, b) => b - a)
  }

  get illustGroups() {
    const groups = new Map<number, { index: number; illust: Illust }[]>()

    this.illusts.result
      .slice()
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .forEach((illust, index) => {
        const year = illust.createdAt.getFullYear()
        let yearGroup = groups.get(year)
        if (!yearGroup) {
          yearGroup = []
          groups.set(year, yearGroup)
        }

        yearGroup.push({
          index,
          illust,
        })
      })

    return groups
  }
}

export default Options({
  name: 'Home',

  components: {
    VTextLink,
    VThumbnail,
  },
})(Home)
</script>
