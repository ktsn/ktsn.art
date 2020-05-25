import { ref, Ref, computed, watchEffect } from 'vue'
import { useStore, Illust } from '../store'

export function useIllusts() {
  const store = useStore()

  const loading = ref(!store.state.listLoaded)
  if (!store.state.listLoaded) {
    store.fetchIllusts().then(() => {
      loading.value = false
    })
  }

  return {
    result: store.illusts,
    loading,
  }
}

export function useIllust(key: Ref<string>) {
  const store = useStore()
  const illust = computed(
    () => store.state.illusts[key.value] as Illust | undefined
  )

  watchEffect(() => {
    store.fetchIllust(key.value)
  })

  return {
    result: illust,
  }
}
