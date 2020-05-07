import { db, storage } from '../firebase'
import { ref, computed, watch } from 'vue'

export interface Illust {
  key: string
  imageUrl: string
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
          storage.ref(data.image).getDownloadURL(),
          storage.ref(data.thumbnail).getDownloadURL(),
        ]).then(([imageUrl, thumbnailUrl]) => {
          temp.value.push({
            key: illustRef.key ?? '',
            imageUrl,
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
