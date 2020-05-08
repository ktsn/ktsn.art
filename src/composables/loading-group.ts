import {
  inject,
  onBeforeUnmount,
  InjectionKey,
  Ref,
  reactive,
  provide,
  computed,
} from 'vue'

interface LoadingManager {
  register(id: number): void
  unregister(id: number): void
  loaded(id: number): void
  readonly allLoaded: Ref<boolean>
}

const loadingGroupKey = Symbol() as InjectionKey<LoadingManager>

let uid = 0

export function useLoadingGroup() {
  const state = reactive<Record<string, boolean>>({})

  const manager = {
    register(id: number) {
      state[id] = false
    },

    loaded(id: number) {
      state[id] = true
    },

    unregister(id: number) {
      delete state[id]
    },

    allLoaded: computed(() => Object.keys(state).every((key) => state[key])),
  }

  provide(loadingGroupKey, manager)

  return {
    allLoaded: manager.allLoaded,
  }
}

export function useLoadingItem() {
  const id = ++uid
  const manager = inject(loadingGroupKey)!

  manager.register(id)

  onBeforeUnmount(() => {
    manager.unregister(id)
  })

  return {
    loaded: () => manager.loaded(id),
    allLoaded: manager.allLoaded,
  }
}
