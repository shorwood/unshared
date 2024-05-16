<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: string[]
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <!-- Input -->
  <BaseInputToggle
    as="div"
    :id="id"
    v-slot="{ isActive }"
    v-model="model"
    type="checkbox"
    :value="value"
    class="
      flex items-center space-x-2 px-2
      hover:bg-primary-600/10
      ring-1 ring-primary-900/10 hover:ring-primary-600/100
      transition-all duration-200 ease-in-out
      px-4 py-2 rounded-md
    "
    class-active="bg-primary-600/20">

    <!-- Circle when active -->
    <div
      class="rounded-sm w-4 h-4 relative p-.5 flex items-center justify-center transition-all duration-200 ease-in-out"
      :class="{
        'ring-1 ring-primary-600/20': isActive === false,
        'bg-primary-600/80': isActive === true,
      }">
      <i class="i-carbon:checkmark text-white" v-if="isActive === true" />
      <i class="i-carbon:close text-white" v-if="isActive === 'mixed'" />
    </div>

    <!-- Label -->
    <label :for="id" v-if="label" class="text-sm select-none">
      {{ label }}
    </label>
  </BaseInputToggle>
</template>
