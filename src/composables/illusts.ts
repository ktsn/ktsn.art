import { db } from '../firebase'
import { ref, computed, Ref, watchEffect } from 'vue'

export interface Illust {
  key: string
  originalUrl: string
  displayUrl: string
  displayFallbackUrl: string
  thumbnailUrl: string
  thumbnailFallbackUrl: string
  createdAt: Date
}

const illusts = /*#__PURE__*/ ref(new Map<string, Illust>())
const listLoaded = /*#__PURE__*/ ref(false)

export function useIllusts() {
  const loading = ref(!listLoaded.value)

  if (!listLoaded.value) {
    db.ref('illusts')
      .orderByChild('createdAt')
      .once('value', (snapshot) => {
        snapshot.forEach((illustRef) => {
          const illust = snapshotToIllust(illustRef)
          illusts.value.set(illust.key, illust)
        })
        loading.value = false
        listLoaded.value = true
      })
  }

  return {
    result: computed(() => {
      return Array.from(illusts.value.values()).sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
    }),
    loading,
  }
}

export function useIllust(key: Ref<string>) {
  const illust = computed(() => illusts.value.get(key.value))

  watchEffect(() => {
    if (illust.value) {
      return
    }

    db.ref(`illusts/${key.value}`).once('value', (snapshot) => {
      const data = snapshotToIllust(snapshot)
      illusts.value.set(data.key, data)
    })
  })

  return {
    result: illust,
  }
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
