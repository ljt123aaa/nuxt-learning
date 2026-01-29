<template>
        <slot></slot>
</template>

<script setup lang="ts">
defineProps({
    message: {
        type: String,
        default: '默认消息',
    },
})
</script>