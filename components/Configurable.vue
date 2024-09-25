<template>
  <Icon v-if="!selectMode && !sortMode" @click="$items.go(item, 'settings')" name="rivet-icons:gears" size="26"
    class="text-blue-600 cursor-pointer" />
</template>

<script lang="ts" setup>
defineProps<{ item: Item }>()

const actionsStore = useActionsStore()

const selectMode = storeToRefs(actionsStore).selectMode
const sortMode = storeToRefs(actionsStore).sortMode
</script>
