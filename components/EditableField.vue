<template>
  <div>
    <p v-if="!isEditing || locked" @click="startEditing"
      class="text-lg font-semibold px-2 py-1 cursor-pointer hover:bg-gray-100 rounded whitespace-pre-wrap"
      :class="{ 'cursor-default hover:bg-transparent': locked }">{{ modelValue }}</p>
    <textarea v-else v-model="value" @blur="finishEditing" @keydown.enter.prevent="finishEditing"
      class="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none overflow-hidden"
      ref="textarea" rows="1"></textarea>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string; locked: boolean }>()
const emit = defineEmits<{ "update:modelValue": [string] }>();

const textarea = useTemplateRef("textarea")
const value = ref(props.modelValue)
let isEditing = ref(false)

const startEditing = () => {
  if (!props.locked) {
    isEditing.value = true
    nextTick(() => {
      if (textarea.value) {
        textarea.value.focus()
        textarea.value.style.height = 'auto'
        textarea.value.style.height = textarea.value.scrollHeight + 'px'
      }
    })
  }
}

const finishEditing = () => {
  isEditing.value = false

  if (props.modelValue !== value.value) {
    emit('update:modelValue', value.value)
  }
}
</script>

<style scoped>
textarea {
  min-height: 1.5em;
  line-height: 1.5;
}

.deleting-animation {
  transition: background-color 1.1s linear;
}
</style>