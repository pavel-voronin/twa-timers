<template>
  <Icon @click="$items.go(item)" name="rivet-icons:gears" size="26" class="text-blue-600 cursor-pointer" />
</template>

<script lang="ts" setup>
defineProps<{ item: Item }>()
</script>
