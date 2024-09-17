<template>
  <DesignCard class="flex flex-col space-y-2 relative select-none" v-bind="$attrs">

    <div class="flex justify-between items-start space-x-2">
      <div class="flex-grow min-h-8">
        <slot name="top-left">
          <p class="text-lg font-semibold line-clamp-2">
            Title
          </p>
        </slot>
      </div>

      <div class="flex items-start space-x-2">
        <slot name="top-right">
          <Icon name="tdesign:letters-f" size="26" />
        </slot>
      </div>
    </div>

    <div>
      <slot>Card body</slot>
    </div>

  </DesignCard>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>