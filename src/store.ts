import { db } from './firebase'
import { computed, reactive, InjectionKey, inject, App } from 'vue'
import { inBrowser } from './env'

export interface Illust {
  key: string
  originalUrl: string
  displayUrl: string
  displayFallbackUrl: string
  thumbnailUrl: string
  thumbnailFallbackUrl: string
  createdAt: Date
}

export interface StoreState {
  illusts: Record<string, Illust>
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

  const illusts = computed(() => {
    return Object.keys(state.illusts)
      .map((key) => state.illusts[key])
      .sort((a, b) => {
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
            const illust = snapshotToIllust(illustRef)
            state.illusts[illust.key] = illust
          })
          state.listLoaded = true
          resolve()
        })
    })
  }

  async function fetchIllust(key: string) {
    const illust = state.illusts[key] as Illust | undefined

    if (illust) {
      return
    }

    return new Promise((resolve) => {
      db.ref(`illusts/${key}`).once('value', (snapshot) => {
        const data = snapshotToIllust(snapshot)
        state.illusts[data.key] = data
        resolve()
      })
    })
  }

  const store = {
    state,
    illusts,
    fetchIllusts,
    fetchIllust,

    install(app: App) {
      app.provide(storeKey, store)
      app.config.globalProperties.$store = store
    },
  }

  return store
}

function snapshotToIllust(snapshot: firebase.database.DataSnapshot): Illust {
  const data = snapshot.val()

  return {
    key: snapshot.key || '',
    originalUrl: data.originalImageUrl,
    displayUrl: data.displayImageUrl,
    displayFallbackUrl: data.displayImageFallbackUrl,
    thumbnailUrl: data.thumbnailImageUrl,
    thumbnailFallbackUrl: data.thumbnailImageFallbackUrl,
    createdAt: new Date(data.createdAt),
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}
