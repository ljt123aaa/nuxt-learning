<template>
  <div class="flex justify-end items-center w-fit">
    <div class="avatar-container relative" @click="handleUploadAvatar">
      <img v-if="!user?.avatar" class="w-16 h-16 rounded-full bg-[#cccccc] object-cover"
           src="~assets/svg/user.svg" alt="默认头像">
      <img v-else class="w-16 h-16 rounded-full object-cover"
           :src="user?.avatar" alt="用户头像">
      <div class="avatar-overlay absolute inset-0 rounded-full bg-black/50 opacity-0 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
        <span class="upload-text text-white text-xs font-medium transform translate-y-2 opacity-0 transition-all duration-300">
          上传图像
        </span>
      </div>
    </div>
    <div class="ml-2">
      当前用户：<input v-model="user.name" placeholder="请输入昵称" type="text"
           class="w-24 h-8 rounded-md px-2 border border-[#cccccc]" @blur="handleUpdateName">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

interface User {
  id?: string | number
  avatar?: string
  name?: string
  [key: string]: any
}

const props = defineProps<{
  userData?: User
}>()

const emit = defineEmits<{
  (e: 'update:userData', user: User): void
}>()

const user = ref<User>({
  avatar: '',
  name: '无'
})

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl, config.public.supabasePublishableKey)
const { $toast } = useNuxtApp()

watch(() => props.userData, (newUserData) => {
  if (newUserData) {
    user.value = {
      ...user.value,
      ...newUserData
    }
  }
}, { immediate: true, deep: true })

async function getUser() {
  try {
    const { data, error } = await supabase.from('user').select('*').eq('id', '1').single()

    if (error) {
      console.error('获取用户信息失败:', error)
      return
    }

    const updatedUser = {
      ...user.value,
      ...data
    }

    if (!updatedUser.name) {
      updatedUser.name = '无'
    }

    user.value = updatedUser
    emit('update:userData', updatedUser)
  } catch (err) {
    console.error('获取用户信息出错:', err)
  }
}

async function handleUploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.click()
  input.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        const fileName = `avatar-${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('上传失败:', uploadError)
          $toast.error('头像上传失败，请重试')
          return
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName)

        const { data: updatedUser, error: updateError } = await supabase
          .from('user')
          .update({ avatar: publicUrl })
          .eq('id', '1')
          .select('id, avatar, name')
          .single();

        if (updateError) {
          console.error('更新用户信息失败:', updateError)
          $toast.error('更新头像失败，请重试')
          return
        }

        const newUserData = {
          ...user.value,
          avatar: updatedUser?.avatar || '',
          name: updatedUser?.name || '无'
        }

        user.value = newUserData
        emit('update:userData', newUserData)
        $toast.success('头像上传成功！')
      } catch (err) {
        console.error('处理过程出错:', err)
        $toast.error('上传头像过程中出错')
      }
    }
  })
}

async function handleUpdateName() {
  try {
    const { data: updatedUser, error: updateError } = await supabase
      .from('user')
      .update({ name: user.value.name })
      .eq('id', '1')
      .select('id, avatar, name')
      .single();

    if (updateError) {
      console.error('更新用户信息失败:', updateError)
      $toast.error('更新用户名失败，请重试')
      return
    }

    const newUserData = {
      ...user.value,
      name: updatedUser?.name || '无'
    }

    user.value = newUserData
    emit('update:userData', newUserData)
    $toast.success('用户名更新成功！')
  } catch (err) {
    console.error('更新用户名出错:', err)
  }
}

onMounted(() => {
  if (!props.userData) {
    getUser()
  }
})
</script>

<style scoped>
.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-container:hover .upload-text {
  transform: translateY(0);
  opacity: 1;
}
</style>
