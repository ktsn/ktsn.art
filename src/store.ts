import { db } from './firebase'
import { computed, reactive, InjectionKey, inject, App } from 'vue'
import { inBrowser } from './env'

export interface RawIllust {
  key: string
  originalUrl: string
  displayUrl: string
  displayFallbackUrl: string
  thumbnailUrl: string
  thumbnailFallbackUrl: string
  createdAt: number
}

export interface Illust extends Omit<RawIllust, 'createdAt'> {
  createdAt: Date
}

export interface StoreState {
  illusts: Record<string, RawIllust>
  listLoaded: boolean
}

export type Store = ReturnType<typeof createStore>

export const storeKey = Symbol() as InjectionKey<Store>

export function useStore(): Store {
  return inject(storeKey)!
}

export function createStore() {
  const state = reactive<StoreState>(
    (inBrowser && window.__INITIAL_STATE__) || {
      illusts: {},
      listLoaded: false,
    }
  )

  const illustMap = computed(() => {
    return new Map<string, Illust>(
      Object.keys(state.illusts).map((key) => {
        const raw = state.illusts[key]
        return [
          key,
          {
            ...raw,
            createdAt: new Date(raw.createdAt),
          },
        ]
      })
    )
  })

  const illusts = computed(() => {
    return Array.from(illustMap.value.values()).sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  })

  async function fetchIllusts() {
    if (state.listLoaded) {
      return
    }

    return new Promise((resolve) => {
      db.ref('illusts')
        .orderByChild('createdAt')
        .once('value', (snapshot) => {
          snapshot.forEach((illustRef) => {
            const illust = snapshotToRawIllust(illustRef)
            state.illusts[illust.key] = illust
          })
          state.listLoaded = true
          resolve()
        })
    })
  }

  const illust = computed(() => (key: string) => {
    return illustMap.value.get(key)
  })

  async function fetchIllust(key: string) {
    const illust = state.illusts[key] as RawIllust | undefined

    if (illust) {
      return
    }

    return new Promise((resolve) => {
      db.ref(`illusts/${key}`).once('value', (snapshot) => {
        const data = snapshotToRawIllust(snapshot)
        state.illusts[data.key] = data
        resolve()
      })
    })
  }

  const store = {
    state,
    illusts,
    illust,
    fetchIllusts,
    fetchIllust,

    install(app: App) {
      app.provide(storeKey, store)
      app.config.globalProperties.$store = store
    },
  }

  return store
}

function snapshotToRawIllust(
  snapshot: firebase.database.DataSnapshot
): RawIllust {
  const data = snapshot.val()

  return {
    key: snapshot.key || '',
    originalUrl: data.originalImageUrl,
    displayUrl: data.displayImageUrl,
    displayFallbackUrl: data.displayImageFallbackUrl,
    thumbnailUrl: data.thumbnailImageUrl,
    thumbnailFallbackUrl: data.thumbnailImageFallbackUrl,
    createdAt: data.createdAt,
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}
