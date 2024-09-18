<template>

  <div class="flex items-center space-x-2 select-none">

    <div @click="$items.go(null)"
      class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6 cursor-pointer">
      <Icon name="ph:house"></Icon>
    </div>

    <div v-if="$items.parent($items.currentItem)" @click="$items.go($items.parent($items.currentItem))"
      class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6 cursor-pointer">
      ..
    </div>

    <div class="cursor-default">
      / {{ $items.currentItem.name }}
    </div>

  </div>

</template>
