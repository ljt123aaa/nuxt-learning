// plugins/toastify.client.ts
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

// 定义类型（可选，提升 TypeScript 体验）
type ToastType = 'success' | 'error' | 'info' | 'warning'
interface ToastOptions extends Omit<Parameters<typeof Toastify>[0], 'text'> {
  message: string
  type?: ToastType
}

export default defineNuxtPlugin(() => {
  // 封装通用的 toast 方法
  const toast = (options: ToastOptions) => {
    const { message, type = 'info', ...rest } = options
    
    // 预设不同类型的样式
    const typeConfig = {
      success: { backgroundColor: '#10b981' },
      error: { backgroundColor: '#ef4444' },
      info: { backgroundColor: '#3b82f6' },
      warning: { backgroundColor: '#f59e0b' }
    }

    Toastify({
      text: `${message}`,
      duration: 3000, // 默认显示 3 秒
      gravity: 'top', // 顶部显示
      position: 'center', // 居中显示
      stopOnFocus: true, // 鼠标悬浮时不自动消失
      style: {
        borderRadius: '8px',
        padding: '8px 12px',
        ...typeConfig[type]
      },
      ...rest // 允许覆盖默认配置
    }).showToast()
  }

  // 简化常用方法
  return {
    provide: {
      toast: {
        success: (message: string, options = {}) => toast({ message, type: 'success', ...options }),
        error: (message: string, options = {}) => toast({ message, type: 'error', ...options }),
        info: (message: string, options = {}) => toast({ message, type: 'info', ...options }),
        warning: (message: string, options = {}) => toast({ message, type: 'warning', ...options }),
        custom: (options: ToastOptions) => toast(options)
      }
    }
  }
})