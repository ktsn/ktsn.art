import { db } from '../firebase'
import { ref, computed, watch, Ref, watchEffect } from 'vue'

export interface Illust {
  key: string
  originalUrl: string
  displayUrl: string
  thumbnailUrl: string
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
  const illust = ref<Illust>()

  watch(key, (key) => {
    illust.value = illusts.value.get(key)
  })

  watchEffect(() => {
    if (illust.value) {
      return
    }

    db.ref(`illusts/${key.value}`).once('value', (snapshot) => {
      illust.value = snapshotToIllust(snapshot)
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
    thumbnailUrl: data.thumbnailImageUrl,
    createdAt: new Date(data.createdAt),
  }
}
