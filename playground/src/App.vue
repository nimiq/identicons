<script setup lang="ts">
import { createIdenticon } from '@nimiq/identicons'
import { useDark, useLocalStorage } from '@vueuse/core'
// @ts-expect-error no types available
import IdenticonsLegacy from 'identicons-legacy/dist/identicons.min.js'
import { computed, ref, watch } from 'vue'
import Builder from './components/Builder.vue'
import PillSelector from './components/PillSelector.vue'

const input = useLocalStorage('identicon', 'nimiq')

const identicon = ref<string>('')
const identiconLegacy = ref<string>('')
const identiconDuration = ref(0)
const identiconLegacyDuration = ref(0)

watch(input, async () => {
  if (!input.value)
    return
  const start = performance.now()
  identicon.value = await createIdenticon(input.value, { format: 'image/svg+xml' })
  const end = performance.now()
  identiconDuration.value = Number((end - start).toFixed(2))
}, { immediate: true })

watch(input, async () => {
  if (!input.value)
    return
  const start = performance.now()
  IdenticonsLegacy.svgPath = './node_modules/identicons-legacy/dist/identicons.min.svg'
  identiconLegacy.value = await IdenticonsLegacy.toDataUrl(input.value)
  const end = performance.now()
  identiconLegacyDuration.value = Number((end - start).toFixed(2))
}, { immediate: true })

function getStrSize(str: string): number {
  const bytes = new Blob([str]).size
  return Number((bytes / 1024).toFixed(2)) // Returns number instead of string
}

const identiconSize = computed(() => getStrSize(identicon.value))
const identiconLegacySize = computed(() => getStrSize(identiconLegacy.value))

const isDark = useDark()

const tabs = ['lib', 'vs-legacy', 'builder']
const tab = useLocalStorage('tab', tabs[0])
</script>

<template>
  <header flex="~ items-center justify-between" mx-auto max-w-1400 w-full px-32 py-20>
    <a href="/" flex="~ items-center gap-8">
      <div i-nimiq:logos-nimiq-horizontal dark:i-nimiq:logos-nimiq-white-horizontal text-21 />
      <span mt--1 text-lg>Identicons</span>
    </a>
    <div flex="~ items-center gap-24">
      <input v-model="isDark" type="checkbox" nq-switch style="--active-color: rgb(var(--nq-neutral-400))">
      <a href="https://github.com/onmax/nimiq-identicons" target="_blank" rel="noopener noreferrer" un-text="lg neutral-900 hocus:neutral">
        <div i-nimiq:logos-github-mono />
      </a>
    </div>
  </header>
  <main flex="~ col justify-center items-center" mx-auto max-w-1400 px-32>
    <h1 lh-none text-xl nq-mt-32>
      Nimiq Identicons Playground
    </h1>

    <PillSelector v-model="tab" :options="tabs" mx-auto nq-mt-32 />

    <form v-if="tab !== 'builder'" nq-mt-32 @submit.prevent>
      <input v-model="input" type="text" placeholder="Enter something..." rounded-full text-lg nq-input-box>
    </form>

    <div v-if="tab !== 'builder'" flex="~ gap-8 col md:row justify-around" w-full nq-mt-32>
      <div flex="~ items-center col">
        <h2 v-if="tab === 'vs-legacy'" text="xs blue" ring="1.5 blue/60" w-max rounded-full px-16 py-4 font-semibold nq-label>
          New
        </h2>
        <img :src="identicon" alt="" size-180 nq-mt-16>
        <div v-if="tab === 'vs-legacy'" flex="~ items-center" text-xs nq-label>
          <p title="size of the svg as data URI">
            {{ identiconSize }}kb
          </p>
          <div mx-16 w-px self-stretch bg-neutral-800 />
          <p lowercase title="time to compute">
            {{ identiconDuration }}ms
          </p>
        </div>
      </div>

      <div v-if="tab === 'vs-legacy'" flex="~ col items-center">
        <h2 text="xs neutral-700" ring="1.5 neutral-500" w-max rounded-full px-16 py-4 font-semibold nq-label>
          Legacy
        </h2>
        <img :src="identiconLegacy" alt="" nq-mt-16>
        <div id="container" />
        <div flex="~ items-center" text-xs nq-label>
          <p title="size of the svg as data URI">
            {{ identiconLegacySize }}kb
          </p>
          <div mx-16 w-px self-stretch bg-neutral-800 />
          <p lowercase title="time to compute">
            {{ identiconLegacyDuration }}ms
          </p>
        </div>
        <p text-xs>
          Not sure how to fix this in production :/
        </p>
      </div>
    </div>
    <Suspense v-else-if="tab === 'builder'">
      <Builder :input />
    </Suspense>
  </main>
</template>
