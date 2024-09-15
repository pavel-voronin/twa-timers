<template>
  <Icon @click="click" v-if="!selected" name="ic:outline-circle" size="26" class="text-gray-400"
    :class="[!selectMode && 'opacity-0']" />
  <Icon @click="click" v-else name="ic:outline-check-circle" size="26" class="text-blue-600 " />
  <div v-if="selectMode" @click.capture="click" class="z-50 absolute inset-0 cursor-pointer"></div>
</template>

<script lang="ts" setup>
const props = defineProps<{ item: Item }>()

const actionsStore = useActionsStore()

const selected = computed(() => { return actionsStore.selectedItems.findIndex(item => item === props.item) !== -1 })
const selectMode = storeToRefs(actionsStore).selectMode

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
</script>
