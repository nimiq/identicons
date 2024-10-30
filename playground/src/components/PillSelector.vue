<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

defineProps<{
  options: string[]
}>()

const model = defineModel()
const randomName = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 10)

const loaded = ref(false)

onMounted(() => {
  setPill()
  setTimeout(() => loaded.value = true, 300)
})
watch(model, setPill, { immediate: true })

const pillStyles = ref({ left: '0px', width: '0px' })
function setPill() {
  const selectedLabel = globalThis.document?.querySelector(`#${randomName}-${model.value}`)?.parentElement as HTMLLabelElement
  if (!selectedLabel)
    return
  globalThis.window?.requestAnimationFrame(() => {
    pillStyles.value = { left: `${selectedLabel.offsetLeft}px`, width: `${selectedLabel.offsetWidth}px` }
  })
}
</script>

<template>
  <div
    flex="~ align-center" border-subtle-sm relative h-32 w-max rounded-full bg-neutral-200 p-4
  >
    <label
      v-for="[key, option] of Object.entries(options)" :key="`${key}-input`" tabindex="1"

      :class="{
        'text-darkblue': model === option,
        'text-neutral-800': model !== option,
        'cursor-pointer z-1 hover:text-neutral-900': model !== option,
      }"
      relative z-2 select-none rounded-full px-12 text-12 transition-colors nq-label flex="~ items-center"
    >
      <input
        :id="`${randomName}-${option}`" v-model="model" type="radio" :value="option"
        sr-only
        :name="randomName" @mousedown.prevent
      >
      {{ option }}
    </label>
    <div absolute top-2 z-1 h-27 rounded-full bg-white :style="{ ...pillStyles, transition: loaded ? 'left 300ms, width 200ms' : '' }" />
  </div>
</template>

<style scoped>
label:has(input:focus-visible) {
  --at-apply: ring-2 ring-blue ring-offset-3;
}
</style>
