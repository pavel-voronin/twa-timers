<template>
  <component v-if="resolvedComponent" :is="resolvedComponent" :item="item" />
</template>

<script lang="ts" setup>
import { capitalize } from 'vue';

const props = defineProps<{ item: Item, subitem: string | null, asRoot: boolean }>()
const itemsStore = useItemsStore()

const resolvedComponent = computed(() => {
  if (props.asRoot) {
    return useComponentResolver(capitalize(props.item.type) + (props.subitem ? capitalize(props.subitem) : ''))
  } else {
    const componentName = capitalize(props.item.type)
    const parentComponent = capitalize(itemsStore.parent(props.item)!.type)

    return useComponentResolver(`${componentName}In${parentComponent}`)
  }
})
</script>
