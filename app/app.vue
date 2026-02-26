<template>
  <div>
    <header class="p-6 flex justify-between items-center text-[#007bff] font-bold">
      <h1 class="text-3xl">吕金涛的博客(Nuxt4 + Supabase + TailwindCSS)</h1>
      <Info v-model:userData="user" />
    </header>

    <!-- <ul>
      <li class="text-lg" v-for="instrument in instruments" :key="instrument.id">{{ instrument.name }}</li>
    </ul> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

interface User {
  id?: string | number
  avatar?: string
  name?: string
  [key: string]: any
}

const user = ref<User>({
  avatar: '',
  name: '无'
})

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabasePublishableKey)

async function getUser() {
  try {
    const { data, error } = await supabase.from('user').select('*').eq('id', '1').single()

    if (error) {
      console.error('获取用户信息失败:', error)
      return
    }

    user.value = {
      ...user.value,
      ...data
    }

    if (!user.value.name) {
      user.value.name = '无'
    }
  } catch (err) {
    console.error('获取用户信息出错:', err)
  }
}

onMounted(() => {
  getUser()
})
</script>

<style scoped>
/* 全局样式 */
</style>
