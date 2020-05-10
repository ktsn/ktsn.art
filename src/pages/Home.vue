<template>
  <div>
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
        <VThumbnailGroup>
          <li v-for="(illust, index) in group" :key="index">
            <router-link class="block" :to="'/' + illust.key">
              <VThumbnail
                :src="illust.thumbnailUrl"
                :ratio="1 / 1"
                :appear-delay="50 * index"
              />
            </router-link>
          </li>
        </VThumbnailGroup>
      </ul>
    </section>
  </div>

  <transition duration="200">
    <router-view />
  </transition>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import VTextLink from '../components/VTextLink.vue'
import VThumbnail from '../components/VThumbnail.vue'
import VThumbnailGroup from '../components/VThumbnailGroup.vue'
import { useIllusts, Illust } from '../composables/illusts'

class Home extends Vue {
  illusts = setup(useIllusts)

  get illustLinks() {
    return Array.from(this.illustGroups.keys()).sort((a, b) => b - a)
  }

  get illustGroups() {
    const groups = new Map<number, Illust[]>()

    this.illusts.result
      .slice()
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .forEach((illust) => {
        const year = illust.createdAt.getFullYear()
        let yearGroup = groups.get(year)
        if (!yearGroup) {
          yearGroup = []
          groups.set(year, yearGroup)
        }

        yearGroup.push(illust)
      })

    return groups
  }
}

export default Options({
  name: 'Home',

  components: {
    VTextLink,
    VThumbnail,
    VThumbnailGroup,
  },
})(Home)
</script>
