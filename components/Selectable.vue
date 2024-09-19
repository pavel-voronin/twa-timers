<template>
  <div v-if="selectMode" class="flex space-x-2">
    <Icon @click="move" v-if="$widgets.widgets[item.type].canContain && !selected && selectedItems.length"
      name="majesticons:inbox-in-line" size="26" class="text-blue-600 z-50 cursor-pointer flex space-x-2" />
    <Icon @click="click" v-if="!selected" name="ic:outline-circle" size="26" class="text-gray-400" />
    <Icon @click="click" v-else name="ic:outline-check-circle" size="26" class="text-blue-600 " />
    <div @click.capture="click" class="z-40 absolute inset-0 cursor-pointer"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ item: Item }>()

const actionsStore = useActionsStore()
const itemsStore = useItemsStore()

const selected = computed(() => { return actionsStore.selectedItems.findIndex(item => item === props.item) !== -1 })
const selectMode = storeToRefs(actionsStore).selectMode
const selectedItems = storeToRefs(actionsStore).selectedItems

const click = (event: Event) => {
  if (selectMode.value) {
    if (selected.value) {
      actionsStore.removeItem(props.item)
    } else {
      actionsStore.addItem(props.item)
    }

    event.stopPropagation()
  }
}

const move = (event: Event) => {
  if (selectedItems.value.length && selectedItems.value.findIndex(item => item.id === props.item.id) === -1) {
    itemsStore.moveItems(selectedItems.value, props.item)
    actionsStore.clear()

    event.stopPropagation()
  }
}
</script>
