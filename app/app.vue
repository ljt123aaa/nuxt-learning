<template>
  <div>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <header>
      <nav>
        <ul>
          <li>
            <NuxtLink to="/about">About</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/posts/1">Post 1</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/posts/2">Post 2</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <AppAlert>
      This is an auto-imported component.
    </AppAlert>

    <ul>
      <li v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabasePublishableKey)

interface Instrument {
  id: string | number
  name: string
  [key: string]: any
}

const instruments = ref<Instrument[]>([])
async function getInstruments() {
  const { data } = await supabase.from('instruments').select()
  instruments.value = data || []
}

onMounted(() => {
  getInstruments()
})
</script>
