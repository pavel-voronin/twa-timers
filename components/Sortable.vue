<template>
  <div v-if="sortMode">
    <Icon @click="moveUp" v-if="canMoveUp" name="hugeicons:move-top" size="26" class="text-blue-600 cursor-pointer" />
    <Icon v-else name="hugeicons:move-top" size="26" class="text-gray-400" />

    <Icon @click="moveDown" v-if="canMoveDown" name="hugeicons:move-bottom" size="26"
      class="text-blue-600 cursor-pointer" />
    <Icon v-else name="hugeicons:move-bottom" size="26" class="text-gray-400" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ item: Item }>()

const actionsStore = useActionsStore()
const itemsStore = useItemsStore()

const sortMode = storeToRefs(actionsStore).sortMode
const currentIndex = computed(() => itemsStore.items.findIndex(item => item.id === props.item.id))

const canMoveUp = computed(() =>
  currentIndex.value > 0
)
const canMoveDown = computed(() =>
  currentIndex.value < itemsStore.items.length - 1
)

const moveUp = () => {
  itemsStore.moveItem(currentIndex.value, currentIndex.value - 1)
}

const moveDown = () => {
  itemsStore.moveItem(currentIndex.value, currentIndex.value + 1)
}
</script>
