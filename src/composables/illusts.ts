import { ref, Ref, computed, watchEffect } from 'vue'
import { useStore } from '../store'

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
  const illust = computed(() => store.illust.value(key.value))

  watchEffect(() => {
    store.fetchIllust(key.value)
  })

  return {
    result: illust,
  }
}
