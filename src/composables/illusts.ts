import { db, storage } from '../firebase'
import { ref, computed, watch } from 'vue'

export interface Illust {
  key: string
  originalUrl: string
  displayUrl: string
  thumbnailUrl: string
  createdAt: Date
}

export function useIllusts() {
  const result = ref<Illust[]>([])
  const loading = ref(true)

  db.ref('illusts')
    .orderByChild('createdAt')
    .once('value', (snapshot) => {
      const length = snapshot.numChildren()
      const temp = ref<Illust[]>([])

      snapshot.forEach((illustRef) => {
        const data = illustRef.val()

        Promise.all([
          storage.ref(data.originalImage).getDownloadURL(),
          storage.ref(data.displayImage).getDownloadURL(),
          storage.ref(data.thumbnailImage).getDownloadURL(),
        ]).then(([originalUrl, displayUrl, thumbnailUrl]) => {
          temp.value.push({
            key: illustRef.key || '',
            originalUrl,
            displayUrl,
            thumbnailUrl,
            createdAt: new Date(data.createdAt),
          })
        })
      })

      const unwatch = watch(
        () => temp.value.length,
        (resLength) => {
          if (resLength === length) {
            loading.value = false
            result.value = temp.value
            unwatch()
          }
        }
      )
    })

  return {
    result: computed(() => result.value.slice().reverse()),
    loading,
  }
}
