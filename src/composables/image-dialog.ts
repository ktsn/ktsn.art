import { ref, computed } from 'vue'

export function useImageDialog(exitDialog: () => void) {
  const dragThreshold = 170

  const dragging = ref(false)
  const dragStartY = ref(0)
  const dragY = ref(0)
  const cancelling = ref(false)

  const deltaY = computed(() => dragY.value - dragStartY.value)

  const backgroundOpacity = computed(() => {
    const progress = Math.min(Math.abs(deltaY.value) / dragThreshold)
    return (1 - progress) * 0.9 + 0.1 // Map the value from 0.1 to 1
  })

  const backgroundClass = computed(() => {
    if (!cancelling.value) {
      return
    }
    return 'transition duration-200 ease-out'
  })

  const imageClass = computed(() => {
    if (!cancelling.value) {
      return
    }
    return 'transition duration-200 ease-out'
  })

  const imageStyle = computed(() => {
    return {
      transform: `translateY(${deltaY.value}px)`,
    }
  })

  function startDrag(event: PointerEvent) {
    dragging.value = true
    dragStartY.value = dragY.value = event.pageY
  }

  function continueDrag(event: PointerEvent) {
    if (dragging.value) {
      dragY.value = event.pageY
    }
  }

  function endDrag() {
    if (!dragging.value) {
      return
    }

    // Clicking or dragging beyond threshold will exit dialog
    if (deltaY.value === 0 || Math.abs(deltaY.value) > dragThreshold) {
      exitDialog()
    } else {
      cancelDrag()
    }

    dragging.value = false
  }

  function cancelDrag() {
    if (dragging.value) {
      dragging.value = false
      cancelling.value = true
      dragY.value = dragStartY.value = 0
    }
  }

  return {
    backgroundOpacity,
    backgroundClass,
    imageClass,
    imageStyle,
    startDrag,
    continueDrag,
    endDrag,
  }
}
