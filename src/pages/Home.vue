<template>
  <template v-if="!illusts.loading">
    <header class="flex px-5 lg:px-10 pt-2 mb-5 w-full">
      <ul>
        <li v-for="(link, i) in illustLinks" :key="link" class="inline-block">
          <VRouterLink
            :to="'#year_' + link"
            @click.prevent="onClickAnchor('#year_' + link)"
          >
            {{ link }}
          </VRouterLink>

          <span v-if="i < illustLinks.length - 1" class="px-1">/</span>
        </li>
      </ul>

      <ul class="ml-auto">
        <li class="inline-block">
          <VLink href="https://github.com/ktsn/illust.ktsn.dev" target="_blank">
            <!--
              FIXME: hide this as SSR build cannot handle it
              <img
                class="inline aline-middle mr-1"
                src="../assets/github.svg"
                width="20"
                height="20"
                alt="GitHub logo"
              />
            -->
            <span class="align-middle">Source</span>
          </VLink>

          <span class="px-2 align-middle">/</span>
        </li>

        <li class="inline-block">
          <VLink href="https://twitter.com/ktsn" target="_blank">
            <!--
              FIXME: hide this as SSR build cannot handle it
              <img
                class="inline aline-middle mr-1"
                src="../assets/twitter.svg"
                width="20"
                height="20"
                alt="Twitter logo"
              />
            -->
            <span class="align-middle">Author</span>
          </VLink>
        </li>
      </ul>
    </header>

    <section
      v-for="[year, group] in illustGroups.entries()"
      :id="'year_' + year"
      :key="year"
      class="mb-10"
    >
      <h2 class="px-5 lg:px-10 mb-1">
        {{ year }} ({{ group.length }} illusts)
      </h2>

      <ul
        class="grid gap-1 grid-flow-row xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2"
      >
        <VThumbnailGroup>
          <li v-for="(illust, index) in group" :key="index">
            <router-link class="block" :to="'/' + illust.key">
              <VThumbnail
                :src="illust.thumbnailUrl"
                :src-fallback="illust.thumbnailFallbackUrl"
                :ratio="1 / 1"
                :appear-delay="50 * index"
              />
            </router-link>
          </li>
        </VThumbnailGroup>
      </ul>
    </section>
  </template>

  <transition duration="200">
    <router-view />
  </transition>
</template>

<script lang="ts">
import { Vue, Options, setup } from 'vue-class-component'
import jump from 'jump.js'
import VRouterLink from '../components/VRouterLink.vue'
import VLink from '../components/VLink.vue'
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

  onClickAnchor(to: string) {
    jump(to)
  }
}

export default Options({
  name: 'Home',

  components: {
    VRouterLink,
    VLink,
    VThumbnail,
    VThumbnailGroup,
  },
})(Home)
</script>
