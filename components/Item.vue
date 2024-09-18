<template>
  <component v-if="resolvedComponent" :is="resolvedComponent" :item="item" />
</template>

<script lang="ts" setup>
const props = defineProps<{ item: Item, asRoot: boolean }>()
const itemsStore = useItemsStore()

const resolvedComponent = computed(() => {
  if (props.asRoot) {
    return itemsStore.widgets[props.item.type].widget
  } else {
    const parentComponent = itemsStore.parent(props.item)!.type

    return itemsStore.widgets[props.item.type].in[parentComponent]
  }
})
</script>
