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
      class="grid grid-flow-row xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2"
    >
      <transition
        v-for="{ index, illust } in group"
        :key="index"
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <li
          v-show="startTransition"
          :style="{ transitionDelay: 50 * index + 'ms' }"
        >
          <VThumbnail :src="illust.thumbnail" :ratio="1 / 1" />
        </li>
      </transition>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import VTextLink from '../components/VTextLink.vue'
import VThumbnail from '../components/VThumbnail.vue'

interface Illust {
  thumbnail: string
  createdAt: Date
}

class Home extends Vue {
  startTransition = false

  illustLinks = ['2020', '2019', '2018']

  illusts = [
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2020-01-01'),
    },

    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2019-01-01'),
    },

    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
    {
      thumbnail: 'https://via.placeholder.com/300x300',
      createdAt: new Date('2018-01-01'),
    },
  ]

  get illustGroups() {
    const groups = new Map<number, { index: number; illust: Illust }[]>()

    this.illusts
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

  mounted() {
    // FIXME: To make initial transition work.
    setTimeout(() => {
      this.startTransition = true
    }, 10)
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
